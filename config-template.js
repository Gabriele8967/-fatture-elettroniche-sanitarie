// ========================================
// CONFIGURAZIONE API FATTURE IN CLOUD - TEMPLATE
// IMPORTANTE: Copiare questo file come config.js e inserire le credenziali reali
// ========================================

const FATTURE_IN_CLOUD_CONFIG = {
    // Credenziali OAuth2 - INSERIRE I VALORI REALI
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
    CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE', 
    APP_ID: 'YOUR_APP_ID_HERE',
    
    // URL API
    API_BASE_URL: 'https://api-v2.fattureincloud.it',
    AUTH_URL: 'https://api-v2.fattureincloud.it/oauth/authorize',
    TOKEN_URL: 'https://api-v2.fattureincloud.it/oauth/token',
    
    // Redirect URI (deve essere configurato su Fatture in Cloud)
    REDIRECT_URI: 'https://fatture-elettroniche.netlify.app/auth-callback.html',
    
    // Scopes richiesti
    SCOPES: 'entity.clients:r entity.clients:a issued_documents.invoices:r issued_documents.invoices:a',
    
    // Email amministratore
    ADMIN_EMAIL: 'centrimanna2@gmail.com'
};

// Funzione per ottenere l'URL di autorizzazione
function getAuthorizationUrl() {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: FATTURE_IN_CLOUD_CONFIG.CLIENT_ID,
        redirect_uri: FATTURE_IN_CLOUD_CONFIG.REDIRECT_URI,
        scope: FATTURE_IN_CLOUD_CONFIG.SCOPES,
        state: generateRandomState()
    });
    
    return `${FATTURE_IN_CLOUD_CONFIG.AUTH_URL}?${params.toString()}`;
}

// Genera stato casuale per sicurezza OAuth2
function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Salva stato per verifica (con fallback localStorage)
function saveState(state) {
    sessionStorage.setItem('oauth_state', state);
    localStorage.setItem('oauth_state_backup', state);
    // Salva anche nel cookie per compatibilità cross-window
    document.cookie = `oauth_state=${state}; path=/; max-age=300`; // 5 minuti
}

// Verifica stato OAuth2 (con múltiple fallback)
function verifyState(state) {
    // Prova sessionStorage
    let savedState = sessionStorage.getItem('oauth_state');
    
    // Fallback: localStorage
    if (!savedState) {
        savedState = localStorage.getItem('oauth_state_backup');
    }
    
    // Fallback: cookie
    if (!savedState) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'oauth_state') {
                savedState = value;
                break;
            }
        }
    }
    
    // Pulisci tutti i salvataggi
    sessionStorage.removeItem('oauth_state');
    localStorage.removeItem('oauth_state_backup');
    document.cookie = 'oauth_state=; path=/; max-age=0';
    
    console.log('State verification:', { received: state, saved: savedState });
    
    return savedState === state;
}