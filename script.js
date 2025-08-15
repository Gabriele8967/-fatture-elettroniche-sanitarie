// ========================================
// FATTURE IN CLOUD INTEGRATION
// ========================================

class FattureInCloudService {
    constructor() {
        this.apiBaseUrl = FATTURE_IN_CLOUD_CONFIG.API_BASE_URL;
        this.companyId = null; // Sarà ottenuto dalle API
        this.accessToken = this.getStoredToken();
        this.adminEmail = FATTURE_IN_CLOUD_CONFIG.ADMIN_EMAIL;
    }

    // Ottiene il token salvato nel localStorage
    getStoredToken() {
        const token = localStorage.getItem('fatture_access_token');
        const expires = localStorage.getItem('fatture_token_expires');
        
        if (token && expires && Date.now() < parseInt(expires)) {
            return token;
        }
        
        return null;
    }

    // Verifica se l'utente è autenticato
    isAuthenticated() {
        return this.accessToken !== null;
    }

    // Avvia il processo di autenticazione OAuth2
    authenticate() {
        const state = generateRandomState();
        saveState(state);
        
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: FATTURE_IN_CLOUD_CONFIG.CLIENT_ID,
            redirect_uri: FATTURE_IN_CLOUD_CONFIG.REDIRECT_URI,
            scope: FATTURE_IN_CLOUD_CONFIG.SCOPES,
            state: state
        });
        
        const authUrl = `${FATTURE_IN_CLOUD_CONFIG.AUTH_URL}?${params.toString()}`;
        
        // Apre una finestra popup per l'autenticazione
        const popup = window.open(
            authUrl,
            'auth',
            'width=600,height=700,scrollbars=yes,resizable=yes'
        );
        
        return new Promise((resolve, reject) => {
            // Ascolta messaggi dalla finestra di auth
            const messageHandler = (event) => {
                if (event.data.type === 'auth_success') {
                    this.accessToken = event.data.access_token;
                    window.removeEventListener('message', messageHandler);
                    popup.close();
                    resolve(true);
                }
            };
            
            window.addEventListener('message', messageHandler);
            
            // Controlla se la finestra è stata chiusa manualmente
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);
                    if (!this.accessToken) {
                        reject(new Error('Autenticazione annullata'));
                    }
                }
            }, 1000);
        });
    }

    // Ottiene l'ID dell'azienda tramite proxy API
    async getCompanyId() {
        if (this.companyId) return this.companyId;
        
        try {
            const response = await fetch('/.netlify/functions/api-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path: '/user/info',
                    method: 'GET',
                    token: this.accessToken
                })
            });
            
            if (!response.ok) {
                throw new Error('Impossibile ottenere informazioni azienda');
            }
            
            const data = await response.json();
            this.companyId = data.data.default_company.id;
            return this.companyId;
        } catch (error) {
            console.error('Errore ottenimento Company ID:', error);
            throw error;
        }
    }

    // Genera la fattura utilizzando le API di Fatture in Cloud
    async generateInvoice(invoiceData) {
        if (!this.accessToken) {
            throw new Error('Autenticazione richiesta. Effettuare il login alle API.');
        }
        
        // Ottieni Company ID se non presente
        if (!this.companyId) {
            await this.getCompanyId();
        }

        const invoice = this.prepareInvoiceData(invoiceData);

        try {
            const response = await fetch('/.netlify/functions/api-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path: `/c/${this.companyId}/issued_documents`,
                    method: 'POST',
                    token: this.accessToken,
                    body: { data: invoice }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Errore API: ${error.error?.validation_result || response.statusText}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Errore generazione fattura:', error);
            throw error;
        }
    }

    // Prepara i dati della fattura nel formato richiesto da Fatture in Cloud
    prepareInvoiceData(formData) {
        const services = this.extractServices(formData);
        const totals = this.calculateTotals(services);

        return {
            type: 'invoice',
            numeration: 'default',
            date: new Date().toISOString().split('T')[0],
            currency: {
                id: 'EUR'
            },
            language: {
                code: 'it'
            },
            entity: {
                name: formData.patientName,
                code: formData.patientCF,
                tax_code: formData.patientCF,
                address_street: formData.patientAddress,
                address_postal_code: formData.patientCAP,
                address_city: formData.patientCity,
                address_province: formData.patientProvince,
                country: 'Italia',
                email: formData.patientEmail,
                phone: formData.patientPhone || ''
            },
            items_list: services.map((service, index) => ({
                product_id: null,
                code: `SERV-${index + 1}`,
                name: service.description,
                measure: 'nr',
                net_price: service.unitPrice,
                gross_price: service.unitPrice * (1 + service.vatRate / 100),
                qty: service.quantity,
                vat: {
                    id: this.getVatId(service.vatRate)
                },
                not_taxable: service.vatRate === 0
            })),
            payments_list: [{
                amount: totals.total,
                due_date: new Date().toISOString().split('T')[0],
                payment_terms: {
                    days: 0,
                    type: 'standard'
                }
            }],
            template: {
                id: 'default'
            },
            delivery_note: false,
            accompanying_invoice: false,
            notes: formData.invoiceNotes || '',
            rivalsa: 0,
            cassa: 0,
            withholding_tax: 0,
            withholding_tax_taxable: 0,
            other_withholding_tax: 0,
            stamp_duty: 0,
            use_split_payment: false,
            e_invoice: true,
            ei_data: {
                vat_kind: 'I', // Operazione Imponibile
                original_document_type: 'invoice',
                transmission_format: 'FPR12',
                destination_code: formData.patientCF.substring(0, 7).toUpperCase()
            }
        };
    }

    // Estrae i servizi dai dati del form
    extractServices(formData) {
        const services = [];
        let index = 1;

        while (formData[`serviceDescription${index}`]) {
            services.push({
                description: formData[`serviceDescription${index}`],
                quantity: parseInt(formData[`serviceQuantity${index}`]) || 1,
                unitPrice: parseFloat(formData[`servicePrice${index}`]) || 0,
                vatRate: parseFloat(formData[`serviceIVA${index}`]) || 0
            });
            index++;
        }

        return services;
    }

    // Calcola i totali
    calculateTotals(services) {
        let subtotal = 0;
        let totalVat = 0;

        services.forEach(service => {
            const lineTotal = service.quantity * service.unitPrice;
            const lineVat = lineTotal * (service.vatRate / 100);
            
            subtotal += lineTotal;
            totalVat += lineVat;
        });

        return {
            subtotal: Math.round(subtotal * 100) / 100,
            vat: Math.round(totalVat * 100) / 100,
            total: Math.round((subtotal + totalVat) * 100) / 100
        };
    }

    // Ottiene l'ID IVA corrispondente
    getVatId(vatRate) {
        const vatMap = {
            0: 0,   // Esente
            4: 1,   // 4%
            10: 2,  // 10%
            22: 3   // 22%
        };
        return vatMap[vatRate] || 0;
    }

    // Invia la fattura via email
    async sendInvoiceByEmail(invoiceId, emailData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/c/${this.companyId}/issued_documents/${invoiceId}/email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        recipient_email: emailData.patientEmail,
                        default_sender_email: this.adminEmail,
                        cc_email: this.adminEmail,
                        subject: `Fattura Elettronica - Servizi Sanitari`,
                        body: `Gentile ${emailData.patientName},\n\nIn allegato trova la sua fattura elettronica per i servizi sanitari ricevuti.\n\nGrazie per aver scelto i nostri servizi.\n\nCordiali saluti`,
                        document_exists: true,
                        delivery_note_exists: false,
                        attachment_exists: true,
                        accompanying_invoice_exists: false
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Errore invio email');
            }

            return await response.json();
        } catch (error) {
            console.error('Errore invio email:', error);
            throw error;
        }
    }
}

// ========================================
// FORM MANAGEMENT
// ========================================

class InvoiceFormManager {
    constructor() {
        this.serviceCounter = 1;
        this.fattureService = new FattureInCloudService();
        this.initializeForm();
        this.bindEvents();
    }

    initializeForm() {
        // Controlla se l'utente è già autenticato
        if (!this.fattureService.isAuthenticated()) {
            this.showAuthenticationStatus();
        } else {
            this.showAlert('success', '✅ API Fatture in Cloud configurate e pronte all\'uso!');
        }
    }

    showAuthenticationStatus() {
        const authDiv = document.createElement('div');
        authDiv.className = 'auth-section';
        authDiv.innerHTML = `
            <div class="alert alert-warning">
                <h3>🔐 Autenticazione API Richiesta</h3>
                <p>Per utilizzare il sistema di fatturazione, è necessario autenticarsi con Fatture in Cloud.</p>
                <button id="authBtn" class="btn btn-primary">🔑 Connetti API Fatture in Cloud</button>
            </div>
        `;
        
        document.querySelector('.main-content').insertBefore(authDiv, document.querySelector('.invoice-form'));
        
        document.getElementById('authBtn').addEventListener('click', async () => {
            try {
                document.getElementById('authBtn').innerHTML = '⏳ Autenticazione in corso...';
                document.getElementById('authBtn').disabled = true;
                
                await this.fattureService.authenticate();
                
                authDiv.remove();
                this.showAlert('success', '✅ Autenticazione completata! API pronte all\'uso.');
            } catch (error) {
                document.getElementById('authBtn').innerHTML = '🔑 Connetti API Fatture in Cloud';
                document.getElementById('authBtn').disabled = false;
                this.showAlert('error', `❌ Errore autenticazione: ${error.message}`);
            }
        });
        
        // Disabilita il form fino all'autenticazione
        document.getElementById('generateBtn').disabled = true;
        document.getElementById('previewBtn').disabled = true;
    }

    bindEvents() {
        // Event listeners per i pulsanti
        document.getElementById('addServiceBtn').addEventListener('click', () => this.addService());
        document.getElementById('previewBtn').addEventListener('click', () => this.showPreview());
        document.getElementById('generateBtn').addEventListener('click', (e) => this.handleSubmit(e));
        document.getElementById('closePreview').addEventListener('click', () => this.closePreview());
        document.getElementById('confirmGenerate').addEventListener('click', () => this.generateFromPreview());

        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closePreview());
        document.getElementById('previewModal').addEventListener('click', (e) => {
            if (e.target.id === 'previewModal') this.closePreview();
        });

        // Auto-calcolo totali
        document.addEventListener('input', (e) => {
            if (e.target.name && (e.target.name.includes('servicePrice') || e.target.name.includes('serviceQuantity') || e.target.name.includes('serviceIVA'))) {
                this.updateTotals();
            }
        });

        // Validazione codice fiscale
        document.getElementById('patientCF').addEventListener('input', (e) => {
            this.validateCodiceFiscale(e.target);
        });
    }

    addService() {
        this.serviceCounter++;
        const container = document.getElementById('servicesContainer');
        
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-item';
        serviceDiv.innerHTML = `
            <button type="button" class="remove-service-btn" onclick="this.parentElement.remove(); invoiceForm.updateTotals();">×</button>
            
            <div class="form-group">
                <label for="serviceDescription${this.serviceCounter}">Descrizione Servizio *</label>
                <input type="text" id="serviceDescription${this.serviceCounter}" name="serviceDescription${this.serviceCounter}" placeholder="es. Visita specialistica dermatologica" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="serviceQuantity${this.serviceCounter}">Quantità</label>
                    <input type="number" id="serviceQuantity${this.serviceCounter}" name="serviceQuantity${this.serviceCounter}" value="1" min="1" required>
                </div>
                <div class="form-group">
                    <label for="servicePrice${this.serviceCounter}">Prezzo Unitario (€) *</label>
                    <input type="number" id="servicePrice${this.serviceCounter}" name="servicePrice${this.serviceCounter}" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label for="serviceIVA${this.serviceCounter}">IVA (%)</label>
                    <select id="serviceIVA${this.serviceCounter}" name="serviceIVA${this.serviceCounter}" required>
                        <option value="0">Esente IVA (Art. 10)</option>
                        <option value="4">4%</option>
                        <option value="10">10%</option>
                        <option value="22">22%</option>
                    </select>
                </div>
            </div>
        `;
        
        container.appendChild(serviceDiv);
        this.updateTotals();
    }

    updateTotals() {
        let subtotal = 0;
        let totalVat = 0;

        for (let i = 1; i <= this.serviceCounter; i++) {
            const quantityEl = document.getElementById(`serviceQuantity${i}`);
            const priceEl = document.getElementById(`servicePrice${i}`);
            const vatEl = document.getElementById(`serviceIVA${i}`);

            if (quantityEl && priceEl && vatEl) {
                const quantity = parseFloat(quantityEl.value) || 0;
                const price = parseFloat(priceEl.value) || 0;
                const vatRate = parseFloat(vatEl.value) || 0;

                const lineTotal = quantity * price;
                const lineVat = lineTotal * (vatRate / 100);

                subtotal += lineTotal;
                totalVat += lineVat;
            }
        }

        document.getElementById('totalImponibile').textContent = `€ ${subtotal.toFixed(2)}`;
        document.getElementById('totalIVA').textContent = `€ ${totalVat.toFixed(2)}`;
        document.getElementById('totalFattura').textContent = `€ ${(subtotal + totalVat).toFixed(2)}`;
    }

    validateCodiceFiscale(input) {
        const cf = input.value.toUpperCase();
        const regex = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/;
        
        if (cf.length === 16 && regex.test(cf)) {
            input.setCustomValidity('');
            input.style.borderColor = 'var(--success-color)';
        } else if (cf.length > 0) {
            input.setCustomValidity('Codice fiscale non valido');
            input.style.borderColor = 'var(--error-color)';
        } else {
            input.setCustomValidity('');
            input.style.borderColor = '';
        }
    }

    showPreview() {
        if (!this.validateForm()) {
            this.showAlert('error', 'Compila tutti i campi obbligatori prima di visualizzare l\'anteprima.');
            return;
        }

        const formData = this.getFormData();
        const services = this.fattureService.extractServices(formData);
        const totals = this.fattureService.calculateTotals(services);

        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = `
            <div class="preview-section">
                <h4>👤 Dati Paziente</h4>
                <div class="preview-item"><span>Nome:</span><span>${formData.patientName}</span></div>
                <div class="preview-item"><span>Email:</span><span>${formData.patientEmail}</span></div>
                <div class="preview-item"><span>Codice Fiscale:</span><span>${formData.patientCF}</span></div>
                <div class="preview-item"><span>Indirizzo:</span><span>${formData.patientAddress}, ${formData.patientCAP} ${formData.patientCity} (${formData.patientProvince})</span></div>
            </div>

            <div class="preview-section">
                <h4>🩺 Servizi</h4>
                ${services.map((service, index) => `
                    <div class="preview-item">
                        <span>${service.description} (${service.quantity}x)</span>
                        <span>€ ${(service.quantity * service.unitPrice).toFixed(2)} + IVA ${service.vatRate}%</span>
                    </div>
                `).join('')}
            </div>

            <div class="preview-section">
                <h4>💰 Totali</h4>
                <div class="preview-item"><span>Imponibile:</span><span>€ ${totals.subtotal.toFixed(2)}</span></div>
                <div class="preview-item"><span>IVA:</span><span>€ ${totals.vat.toFixed(2)}</span></div>
                <div class="preview-item"><span><strong>Totale:</strong></span><span><strong>€ ${totals.total.toFixed(2)}</strong></span></div>
            </div>

            ${formData.invoiceNotes ? `
                <div class="preview-section">
                    <h4>📝 Note</h4>
                    <p>${formData.invoiceNotes}</p>
                </div>
            ` : ''}
        `;

        document.getElementById('previewModal').style.display = 'block';
    }

    closePreview() {
        document.getElementById('previewModal').style.display = 'none';
    }

    async generateFromPreview() {
        this.closePreview();
        await this.generateInvoice();
    }

    async handleSubmit(e) {
        e.preventDefault();
        await this.generateInvoice();
    }

    async generateInvoice() {
        if (!this.validateForm()) {
            this.showAlert('error', 'Compila tutti i campi obbligatori.');
            return;
        }

        this.showLoading(true);

        try {
            // Verifica autenticazione
            if (!this.fattureService.isAuthenticated()) {
                throw new Error('Autenticazione API richiesta. Cliccare su "Connetti API".');
            }
            
            // PRODUZIONE - Genera fattura reale
            const formData = this.getFormData();
            const invoice = await this.fattureService.generateInvoice(formData);
            await this.fattureService.sendInvoiceByEmail(invoice.id, formData);

            this.showAlert('success', '✅ Fattura generata e inviata con successo! Una copia è stata inviata anche all\'amministratore');
            this.resetForm();

        } catch (error) {
            console.error('Errore:', error);
            this.showAlert('error', `❌ Errore durante la generazione: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    // Simula la generazione per demo
    async simulateInvoiceGeneration() {
        // Simula chiamata API con delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const formData = this.getFormData();
        console.log('DEMO: Dati fattura generata:', formData);
        console.log('DEMO: Email inviata a:', formData.patientEmail, 'e', this.fattureService.adminEmail);
    }

    validateForm() {
        const form = document.getElementById('invoiceForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--error-color)';
            } else {
                field.style.borderColor = '';
            }
        });

        return isValid;
    }

    getFormData() {
        const form = document.getElementById('invoiceForm');
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    resetForm() {
        document.getElementById('invoiceForm').reset();
        this.serviceCounter = 1;
        
        // Rimuovi servizi extra
        const container = document.getElementById('servicesContainer');
        const serviceItems = container.querySelectorAll('.service-item');
        for (let i = 1; i < serviceItems.length; i++) {
            serviceItems[i].remove();
        }
        
        this.updateTotals();
    }

    showLoading(show) {
        document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
        document.getElementById('generateBtn').disabled = show;
        document.getElementById('previewBtn').disabled = show;
    }

    showAlert(type, message) {
        // Rimuovi alert precedenti
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = message;

        document.querySelector('.main-content').insertBefore(alert, document.querySelector('.invoice-form'));

        // Auto-rimozione dopo 10 secondi
        setTimeout(() => {
            alert.remove();
        }, 10000);
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Inizializza l'applicazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
    window.invoiceForm = new InvoiceFormManager();
    
    // Messaggio di benvenuto
    console.log('🧾 Sistema Fatturazione Elettronica Sanitaria Inizializzato');
    console.log('📋 IMPORTANTE: Configurare le credenziali API di Fatture in Cloud in produzione');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Formatta numeri come valuta
function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Valida email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Genera codice fattura univoco
function generateInvoiceCode() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = String(date.getTime()).slice(-4);
    
    return `FAT-${year}${month}${day}-${time}`;
}