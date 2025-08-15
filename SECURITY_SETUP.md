# 🛡️ CONFIGURAZIONE SICUREZZA

## ⚠️ IMPORTANTE: Credenziali Rimosse per Sicurezza

Le credenziali API sono state rimosse dal repository pubblico per motivi di sicurezza.

## 🔧 CONFIGURAZIONE LOCALE

### Step 1: Crea il file di configurazione
```bash
cp config-template.js config.js
```

### Step 2: Inserisci le tue credenziali in config.js
```javascript
const FATTURE_IN_CLOUD_CONFIG = {
    CLIENT_ID: 'R3eiTNDpkjm9nqimrVF8GfWrpuUSp5dX',
    CLIENT_SECRET: 'sc7apon7UwMj89wg6eL9PqaUgqcpTEnBSFSAwLqpVGvBLgc0Q4GHM6D2gAV12V8n',
    APP_ID: '13354',
    // ... resto della configurazione
};
```

### Step 3: Il file config.js è già nel .gitignore
Il file non verrà mai committato per sicurezza.

## 🌐 DEPLOY SU NETLIFY

### Opzione 1: Variabili d'ambiente Netlify
1. Dashboard Netlify → Site settings → Environment variables
2. Aggiungi:
   - `FATTURE_CLIENT_ID`: R3eiTNDpkjm9nqimrVF8GfWrpuUSp5dX
   - `FATTURE_CLIENT_SECRET`: sc7apon7UwMj89wg6eL9PqaUgqcpTEnBSFSAwLqpVGvBLgc0Q4GHM6D2gAV12V8n
   - `FATTURE_APP_ID`: 13354

### Opzione 2: Build Script
Crea uno script che genera config.js durante il deploy usando le variabili d'ambiente.

## 🚨 REVOCA TOKEN ESISTENTI

**IMPORTANTE**: Se il token era già in uso:

1. **Accedi a Fatture in Cloud**
2. **API → Applicazioni → ID 13354**
3. **Rigenera Client Secret**
4. **Aggiorna la configurazione**

## ✅ VERIFICA SICUREZZA

- [ ] config.js non è nel repository
- [ ] .gitignore contiene config.js
- [ ] Template pubblico non contiene credenziali
- [ ] Credenziali configurate localmente
- [ ] Deploy configurato con variabili d'ambiente

## 📞 SUPPORTO

Per problemi di configurazione, consultare:
- OAUTH_SETUP.md
- README.md
- Documentazione Fatture in Cloud