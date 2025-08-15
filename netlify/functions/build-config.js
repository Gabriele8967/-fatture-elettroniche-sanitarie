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
    // Cookie con domain principale per condivisione tra finestre
    document.cookie = \`oauth_state=\${state}; path=/; max-age=300; SameSite=Lax\`;
    // Salva anche in una chiave globale per debug
    window.oauth_state_debug = state;
    console.log('State salvato:', state);
}

function verifyState(state) {
    console.log('Verifica state ricevuto:', state);
    
    // Prova tutti i meccanismi di storage
    let savedState = sessionStorage.getItem('oauth_state');
    console.log('SessionStorage:', savedState);
    
    if (!savedState) {
        savedState = localStorage.getItem('oauth_state_backup');
        console.log('LocalStorage:', savedState);
    }
    
    if (!savedState) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'oauth_state') {
                savedState = value;
                console.log('Cookie:', savedState);
                break;
            }
        }
    }
    
    if (!savedState && window.opener && window.opener.oauth_state_debug) {
        savedState = window.opener.oauth_state_debug;
        console.log('Window opener:', savedState);
    }
    
    if (!savedState && window.parent && window.parent.oauth_state_debug) {
        savedState = window.parent.oauth_state_debug;
        console.log('Window parent:', savedState);
    }
    
    console.log('State confronto:', { ricevuto: state, salvato: savedState, match: savedState === state });
    
    // Pulisci solo se il confronto ha successo
    if (savedState === state) {
        sessionStorage.removeItem('oauth_state');
        localStorage.removeItem('oauth_state_backup');
        document.cookie = 'oauth_state=; path=/; max-age=0';
        if (window.opener) delete window.opener.oauth_state_debug;
        if (window.parent) delete window.parent.oauth_state_debug;
    }
    
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