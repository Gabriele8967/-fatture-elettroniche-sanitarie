// ========================================
// BUILD SCRIPT PER PRODUZIONE
// Genera config.js per deploy Netlify
// ========================================

const fs = require('fs');

// Template di configurazione con variabili d'ambiente
const configTemplate = `// ========================================
// CONFIGURAZIONE API FATTURE IN CLOUD - PRODUZIONE
// Auto-generato da environment variables
// ========================================

const FATTURE_IN_CLOUD_CONFIG = {
    CLIENT_ID: '${process.env.FATTURE_CLIENT_ID || ''}',
    CLIENT_SECRET: '${process.env.FATTURE_CLIENT_SECRET || ''}',
    APP_ID: '${process.env.FATTURE_APP_ID || ''}',
    
    API_BASE_URL: '${process.env.FATTURE_API_BASE_URL || 'https://api-v2.fattureincloud.it'}',
    AUTH_URL: '${process.env.FATTURE_AUTH_URL || 'https://api-v2.fattureincloud.it/oauth/authorize'}',
    TOKEN_URL: '${process.env.FATTURE_TOKEN_URL || 'https://api-v2.fattureincloud.it/oauth/token'}',
    
    REDIRECT_URI: '${process.env.FATTURE_REDIRECT_URI || 'https://fatture-elettroniche.netlify.app/auth-callback.html'}',
    SCOPES: '${process.env.FATTURE_SCOPES || 'entity.clients:r entity.clients:a issued_documents.invoices:r issued_documents.invoices:a'}',
    ADMIN_EMAIL: '${process.env.FATTURE_ADMIN_EMAIL || 'centrimanna2@gmail.com'}'
};

function getAuthorizationUrl() {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: FATTURE_IN_CLOUD_CONFIG.CLIENT_ID,
        redirect_uri: FATTURE_IN_CLOUD_CONFIG.REDIRECT_URI,
        scope: FATTURE_IN_CLOUD_CONFIG.SCOPES,
        state: generateRandomState()
    });
    return \`\${FATTURE_IN_CLOUD_CONFIG.AUTH_URL}?\${params.toString()}\`;
}

function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function saveState(state) {
    sessionStorage.setItem('oauth_state', state);
    localStorage.setItem('oauth_state_backup', state);
    document.cookie = \`oauth_state=\${state}; path=/; max-age=300\`;
}

function verifyState(state) {
    let savedState = sessionStorage.getItem('oauth_state');
    if (!savedState) savedState = localStorage.getItem('oauth_state_backup');
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
}`;

// Verifica che le environment variables siano configurate
const requiredVars = ['FATTURE_CLIENT_ID', 'FATTURE_CLIENT_SECRET', 'FATTURE_APP_ID'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Environment variables mancanti:', missingVars.join(', '));
    console.error('🔧 Configura le variabili su Netlify Dashboard → Environment Variables');
    process.exit(1);
}

// Scrive il file config.js
try {
    fs.writeFileSync('config.js', configTemplate);
    console.log('✅ config.js generato per produzione con environment variables');
    console.log('🔧 CLIENT_ID configurato:', process.env.FATTURE_CLIENT_ID ? 'SÌ' : 'NO');
} catch (error) {
    console.error('❌ Errore generazione config.js:', error);
    process.exit(1);
}