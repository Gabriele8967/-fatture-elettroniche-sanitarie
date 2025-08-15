# 🔧 Utilizzo File .env

## 📁 FILE CREATI

### `.env` 
Contiene le **credenziali REALI** per il tuo ambiente:
```bash
FATTURE_CLIENT_ID=your_client_id_here
FATTURE_CLIENT_SECRET=your_client_secret_here
FATTURE_APP_ID=your_app_id_here
```

### `.env.example`
Template pubblico per altri sviluppatori (senza credenziali reali)

## 🚀 CONFIGURAZIONE NETLIFY

### **Copia le variabili da .env a Netlify:**

1. **Apri il file `.env`** 
2. **Dashboard Netlify** → **Site Settings** → **Environment Variables**
3. **Aggiungi ciascuna variabile:**

```
Nome: FATTURE_CLIENT_ID
Valore: [inserire il tuo Client ID]

Nome: FATTURE_CLIENT_SECRET  
Valore: [inserire il tuo Client Secret]

Nome: FATTURE_APP_ID
Valore: [inserire il tuo App ID]

Nome: FATTURE_ADMIN_EMAIL
Valore: [inserire la tua email admin]

Nome: FATTURE_REDIRECT_URI
Valore: [inserire il tuo redirect URI]
```

### **Trigger Redeploy**
Dopo aver aggiunto le variabili:
- **Deploys** → **Trigger deploy**

## 🔄 ALTERNATIVE DI CONFIGURAZIONE

### **Opzione 1: File config.js diretto (ATTUALE)**
```javascript
// File config.js con credenziali hardcoded
const FATTURE_IN_CLOUD_CONFIG = {
    CLIENT_ID: 'your_client_id_here',
    // ...
};
```

### **Opzione 2: File .env + config-env.js**
```html
<!-- In index.html sostituire -->
<script src="config.js"></script>
<!-- Con -->
<script src="config-env.js"></script>
```

### **Opzione 3: Netlify Functions (già implementato)**
Le variabili d'ambiente vengono lette automaticamente dalla function.

## 🛡️ SICUREZZA

### ✅ **File Protetti**
- `.env` → in .gitignore (NON committato)
- `config.js` → in .gitignore (NON committato)
- `.env.example` → template pubblico (OK per commit)

### ✅ **Deploy Sicuro**
- **Locale**: Usa `.env` o `config.js`
- **Netlify**: Usa Environment Variables
- **GitHub**: Solo template pubblici

## 🧪 TEST

### **Test che .env funzioni:**
```bash
# Rinomina temporaneamente config.js
mv config.js config.js.backup

# Modifica index.html per usare config-env.js
# Testa il sito locale

# Ripristina se necessario
mv config.js.backup config.js
```

## 📋 CHECKLIST DEPLOY

- [ ] File `.env` creato localmente
- [ ] Variabili copiate su Netlify
- [ ] Deploy triggherato
- [ ] Test OAuth2 funzionante
- [ ] Fatture generate correttamente

**Il file .env ti permette di gestire le credenziali in modo più organizzato! 🎯**