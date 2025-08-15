// ========================================
// CONFIGURAZIONE DA VARIABILI D'AMBIENTE
// Sistema alternativo che legge da .env per sviluppo locale
// ========================================

// Funzione per caricare variabili d'ambiente (solo per sviluppo locale)
function loadEnvConfig() {
    // Per sviluppo locale, le variabili possono essere definite qui
    // In produzione, vengono caricate dal sistema Netlify
    
    const env = {
        CLIENT_ID: process?.env?.FATTURE_CLIENT_ID || '',
        CLIENT_SECRET: process?.env?.FATTURE_CLIENT_SECRET || '',
        APP_ID: process?.env?.FATTURE_APP_ID || '',
        ADMIN_EMAIL: process?.env?.FATTURE_ADMIN_EMAIL || '',
        REDIRECT_URI: process?.env?.FATTURE_REDIRECT_URI || ''
    };
    
    return env;
}

// Configurazione principale
const envConfig = loadEnvConfig();

const FATTURE_IN_CLOUD_CONFIG = {
    // Credenziali da environment
    CLIENT_ID: envConfig.CLIENT_ID,
    CLIENT_SECRET: envConfig.CLIENT_SECRET,
    APP_ID: envConfig.APP_ID,
    
    // URL API (da environment variables)
    API_BASE_URL: process?.env?.FATTURE_API_BASE_URL || '',
    AUTH_URL: process?.env?.FATTURE_AUTH_URL || '',
    TOKEN_URL: process?.env?.FATTURE_TOKEN_URL || '',
    
    // Configurazione
    REDIRECT_URI: envConfig.REDIRECT_URI,
    SCOPES: process?.env?.FATTURE_SCOPES || '',
    ADMIN_EMAIL: envConfig.ADMIN_EMAIL
};

// Verifica che le credenziali siano caricate
if (!FATTURE_IN_CLOUD_CONFIG.CLIENT_ID || !FATTURE_IN_CLOUD_CONFIG.CLIENT_SECRET) {
    console.error('⚠️ ATTENZIONE: Credenziali API non configurate!');
    console.log('📋 Per configurare:');
    console.log('1. Crea file .env dalla copia di .env.example');
    console.log('2. Oppure usa il file config.js diretto');
    console.log('3. Oppure configura variabili d\'ambiente su Netlify');
}

// Funzioni helper (identiche a config.js)
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

function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function saveState(state) {
    sessionStorage.setItem('oauth_state', state);
    localStorage.setItem('oauth_state_backup', state);
    document.cookie = `oauth_state=${state}; path=/; max-age=300`;
}

function verifyState(state) {
    let savedState = sessionStorage.getItem('oauth_state');
    
    if (!savedState) {
        savedState = localStorage.getItem('oauth_state_backup');
    }
    
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
    
    sessionStorage.removeItem('oauth_state');
    localStorage.removeItem('oauth_state_backup');
    document.cookie = 'oauth_state=; path=/; max-age=0';
    
    console.log('State verification:', { received: state, saved: savedState });
    
    return savedState === state;
}