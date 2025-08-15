// ========================================
// CONFIGURAZIONE API FATTURE IN CLOUD
// IMPORTANTE: Questo file contiene credenziali sensibili
// ========================================

const FATTURE_IN_CLOUD_CONFIG = {
    // Credenziali OAuth2
    CLIENT_ID: 'R3eiTNDpkjm9nqimrVF8GfWrpuUSp5dX',
    CLIENT_SECRET: 'sc7apon7UwMj89wg6eL9PqaUgqcpTEnBSFSAwLqpVGvBLgc0Q4GHM6D2gAV12V8n',
    APP_ID: '13354',
    
    // URL API
    API_BASE_URL: 'https://api-v2.fattureincloud.it',
    AUTH_URL: 'https://api-v2.fattureincloud.it/oauth/authorize',
    TOKEN_URL: 'https://api-v2.fattureincloud.it/oauth/token',
    
    // Redirect URI (deve essere configurato su Fatture in Cloud)
    REDIRECT_URI: window.location.origin + '/auth-callback.html',
    
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

// Salva stato per verifica
function saveState(state) {
    sessionStorage.setItem('oauth_state', state);
}

// Verifica stato OAuth2
function verifyState(state) {
    const savedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return savedState === state;
}