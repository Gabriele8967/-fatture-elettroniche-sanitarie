# 🔒 Deploy Sicuro su Netlify

## 📋 CONFIGURAZIONE VARIABILI D'AMBIENTE

### **Step 1: Accedi al Dashboard Netlify**
1. Vai su https://netlify.com
2. Accedi al tuo account
3. Seleziona il sito `fatture-elettroniche`

### **Step 2: Configura Environment Variables**
1. **Site settings** → **Environment variables**
2. **Clicca "Add variable"** per ciascuna:

```
FATTURE_CLIENT_ID = [your_client_id]
FATTURE_CLIENT_SECRET = [your_client_secret]
FATTURE_APP_ID = [your_app_id]
```

### **Step 3: Redeploy**
1. **Deploys** → **Trigger deploy**
2. Il sistema genererà automaticamente `config.js` dalle variabili d'ambiente

## 🛡️ SICUREZZA IMPLEMENTATA

### ✅ **Protezioni Attive**
- **config.js locale**: NON committato (in .gitignore)
- **Credenziali GitHub**: Template pubblico senza dati sensibili  
- **Netlify Build**: Genera config.js da variabili d'ambiente
- **Function redirect**: `/config.js` → dinamico da env vars

### ✅ **Verifica Configurazione**
1. **Locale**: File `config.js` con credenziali reali
2. **GitHub**: Solo `config-template.js` pubblico
3. **Netlify**: Variabili d'ambiente configurate
4. **Deploy**: Auto-generazione sicura

## 🚀 UTILIZZO

### **Sviluppo Locale**
```bash
# File config.js già presente con credenziali
# Sistema pronto per sviluppo
```

### **Produzione Netlify**  
```bash
# Variabili d'ambiente → auto-genera config.js
# Credenziali mai esposte nel codice
```

## 🔍 VERIFICA FUNZIONAMENTO

### **Test Locale**
1. Apri `index.html` con server locale
2. Clicca "Connetti API"
3. Dovrebbe aprire popup Fatture in Cloud

### **Test Produzione**
1. Vai sul tuo sito Netlify
2. Clicca "Connetti API" 
3. Autorizza applicazione
4. Sistema pronto per fatture reali

## ⚠️ IMPORTANTE

### **Redirect URI Configurato**
Assicurati che in Fatture in Cloud sia configurato:
```
https://your-site.netlify.app/auth-callback.html
```

### **Permissions Required**
L'app deve avere i permessi:
- Lettura clienti
- Scrittura clienti
- Lettura fatture
- Scrittura fatture

## 🎯 RISULTATO

Sistema completamente sicuro:
- 🟢 **Sviluppo**: Credenziali locali protette
- 🟢 **Repository**: Nessuna informazione sensibile
- 🟢 **Produzione**: Variabili d'ambiente sicure
- 🟢 **Funzionalità**: Generate fatture elettroniche reali

**Il sistema è ora PRODUCTION-READY e sicuro! 🔒**