# Sistema Fatturazione Elettronica Sanitaria

Sistema web per la generazione automatica di fatture elettroniche per servizi sanitari utilizzando le API di **Fatture in Cloud**.

## 🩺 Caratteristiche

- **Form completo** per raccolta dati paziente e servizi
- **Validazione automatica** codici fiscali e dati
- **Calcolo automatico** di imponibili, IVA e totali
- **Anteprima fattura** prima della generazione
- **Integrazione API** Fatture in Cloud
- **Invio automatico** via email al paziente e amministratore
- **Design responsive** per tutti i dispositivi
- **Deploy su Netlify** ready

## 📋 Funzionalità

### Raccolta Dati
- Informazioni complete del paziente
- Indirizzo di fatturazione
- Codice fiscale con validazione
- Email e telefono

### Servizi Sanitari
- Descrizione dettagliata dei servizi
- Quantità e prezzi unitari
- Gestione IVA (esente, 4%, 10%, 22%)
- Supporto per servizi multipli

### Generazione Fatture
- Formato XML elettronico valido
- Numerazione automatica
- Invio simultaneo a paziente e `centrimanna2@gmail.com`
- Note personalizzabili

## 🚀 Installazione e Configurazione

### 1. Credenziali API Fatture in Cloud

**IMPORTANTE**: Prima dell'uso in produzione, configurare le credenziali API nel file `script.js`:

```javascript
// In FattureInCloudService constructor
this.accessToken = 'YOUR_ACCESS_TOKEN';  // Token di accesso
this.companyId = 'YOUR_COMPANY_ID';      // ID dell'azienda
```

### 2. Ottenere le Credenziali

1. Registrarsi su [Fatture in Cloud](https://www.fattureincloud.it)
2. Accedere al pannello API
3. Creare una nuova applicazione
4. Ottenere:
   - **Access Token**
   - **Company ID**

### 3. Deploy su Netlify

1. **Via Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Su Netlify**:
   - Collegare il repository
   - Il sito si deplorerà automaticamente
   - Il file `netlify.toml` è già configurato

3. **Deploy manuale**:
   - Trascinare la cartella su Netlify
   - Il sito sarà immediatamente online

## 🔧 Configurazione Avanzata

### Personalizzazione Email
Nel file `script.js`, modificare il template email:

```javascript
async sendInvoiceByEmail(invoiceId, emailData) {
    // Personalizzare oggetto e corpo dell'email
    subject: `Fattura Elettronica - Servizi Sanitari`,
    body: `Testo personalizzato...`
}
```

### Aggiungere Servizi Predefiniti
Modificare le opzioni nel form HTML per servizi comuni.

### Campi Aggiuntivi
Estendere il form aggiungendo nuovi campi per esigenze specifiche.

## 🛡️ Sicurezza

### Protezione Credenziali
- **MAI** commitare credenziali API nel codice
- Usare variabili d'ambiente per produzione
- Considerare un backend proxy per API calls

### Validazioni
- Controllo formato codice fiscale
- Validazione email
- Sanitizzazione input utente

## 📱 Responsive Design

Il sistema è ottimizzato per:
- **Desktop**: Layout completo
- **Tablet**: Layout adattato
- **Mobile**: Form stack verticale
- **Print**: Versione stampabile

## 🧪 Modalità Demo

Attualmente il sistema funziona in **modalità demo**:
- Simula la generazione delle fatture
- Non effettua chiamate API reali
- Mostra messaggi di conferma

Per attivare la modalità produzione:
1. Configurare le credenziali API
2. Decommentare il codice di produzione in `script.js`
3. Testare con fatture di prova

## 📞 Supporto

Per problemi o personalizzazioni:
- Controllare la console browser per errori
- Verificare le credenziali API
- Consultare la documentazione [Fatture in Cloud API](https://developers.fattureincloud.it)

## 📄 Licenza

Questo sistema è fornito come strumento di esempio. Verificare la conformità normativa per l'uso in ambito sanitario e la gestione dei dati sensibili secondo GDPR.

---

**⚠️ IMPORTANTE**: Prima dell'uso in produzione, configurare le credenziali API e testare accuratamente il sistema.