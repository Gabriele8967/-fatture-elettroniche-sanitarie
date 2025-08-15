// Netlify Function - Genera config.js da environment variables
exports.handler = async (event, context) => {
    // Legge le variabili d'ambiente di Netlify
    const configContent = `// ========================================
// CONFIGURAZIONE API FATTURE IN CLOUD - DA ENV
// ========================================

const FATTURE_IN_CLOUD_CONFIG = {
    CLIENT_ID: '${process.env.FATTURE_CLIENT_ID || ''}',
    CLIENT_SECRET: '${process.env.FATTURE_CLIENT_SECRET || ''}',
    APP_ID: '${process.env.FATTURE_APP_ID || ''}',
    
    API_BASE_URL: '${process.env.FATTURE_API_BASE_URL || ''}',
    AUTH_URL: '${process.env.FATTURE_AUTH_URL || ''}',
    TOKEN_URL: '${process.env.FATTURE_TOKEN_URL || ''}',
    
    REDIRECT_URI: '${process.env.FATTURE_REDIRECT_URI || ''}',
    SCOPES: '${process.env.FATTURE_SCOPES || ''}',
    ADMIN_EMAIL: '${process.env.FATTURE_ADMIN_EMAIL || ''}'
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
    return savedState === state;
}`;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache'
        },
        body: configContent
    };
};