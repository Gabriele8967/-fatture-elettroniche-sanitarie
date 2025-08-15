# 🔧 Utilizzo File .env

## 📁 FILE CREATI

### `.env` 
Contiene le **credenziali REALI** per il tuo ambiente:
```bash
FATTURE_CLIENT_ID=R3eiTNDpkjm9nqimrVF8GfWrpuUSp5dX
FATTURE_CLIENT_SECRET=sc7apon7UwMj89wg6eL9PqaUgqcpTEnBSFSAwLqpVGvBLgc0Q4GHM6D2gAV12V8n
FATTURE_APP_ID=13354
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
Valore: R3eiTNDpkjm9nqimrVF8GfWrpuUSp5dX

Nome: FATTURE_CLIENT_SECRET  
Valore: sc7apon7UwMj89wg6eL9PqaUgqcpTEnBSFSAwLqpVGvBLgc0Q4GHM6D2gAV12V8n

Nome: FATTURE_APP_ID
Valore: 13354

Nome: FATTURE_ADMIN_EMAIL
Valore: centrimanna2@gmail.com

Nome: FATTURE_REDIRECT_URI
Valore: https://fatture-elettroniche.netlify.app/auth-callback.html
```

### **Trigger Redeploy**
Dopo aver aggiunto le variabili:
- **Deploys** → **Trigger deploy**

## 🔄 ALTERNATIVE DI CONFIGURAZIONE

### **Opzione 1: File config.js diretto (ATTUALE)**
```javascript
// File config.js con credenziali hardcoded
const FATTURE_IN_CLOUD_CONFIG = {
    CLIENT_ID: 'R3eiTNDpkjm9nqimrVF8GfWrpuUSp5dX',
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