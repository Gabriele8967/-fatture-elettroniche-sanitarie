# 🔐 Configurazione OAuth2 Fatture in Cloud

## ⚠️ PROBLEMA CORRENTE
L'errore "Stato OAuth2 non valido" indica che il **Redirect URI** non è configurato correttamente nell'applicazione Fatture in Cloud.

## 🔧 SOLUZIONE: Configurare Redirect URI

### **Step 1: Accedi a Fatture in Cloud**
1. Vai su [Fatture in Cloud](https://secure.fattureincloud.it)
2. Accedi con le tue credenziali
3. Vai su **Impostazioni → API → Le tue applicazioni**

### **Step 2: Modifica l'Applicazione**
1. Trova l'applicazione con **ID 13354**
2. Clicca su **"Modifica"** o **"Configura"**
3. Cerca la sezione **"Redirect URI"** o **"URL di reindirizzamento"**

### **Step 3: Aggiungi il Redirect URI**

**Se stai testando in locale:**
```
http://localhost:8080/auth-callback.html
```

**Se hai deployato su Netlify:**
```
https://il-tuo-dominio.netlify.app/auth-callback.html
```

**Esempio con URL Netlify:**
```
https://amazing-site-123456.netlify.app/auth-callback.html
```

### **Step 4: Salva le Modifiche**
1. Clicca **"Salva"** o **"Aggiorna"**
2. Attendi che le modifiche vengano applicate (può richiedere qualche minuto)

## 🧪 TEST DOPO CONFIGURAZIONE

### **Opzione 1: Test Locale**
1. Apri il file `index.html` con un server locale:
   ```bash
   # Con Python
   python -m http.server 8080
   
   # Con Node.js
   npx serve -p 8080
   ```
2. Vai su `http://localhost:8080`
3. Clicca "Connetti API Fatture in Cloud"

### **Opzione 2: Test su Netlify**
1. Vai al tuo sito Netlify
2. Clicca "Connetti API Fatture in Cloud"

## 🔍 DEBUG AVANZATO

Se l'errore persiste, usa la pagina di test:
```
https://il-tuo-sito.netlify.app/test-auth.html
```

Questa pagina mostra informazioni di debug dettagliate.

## 📋 CHECKLIST VERIFICA

- [ ] Redirect URI configurato in Fatture in Cloud
- [ ] URL esatto (incluso `/auth-callback.html`)
- [ ] Protocollo corretto (http per locale, https per produzione)
- [ ] Nessun trailing slash extra
- [ ] Modifiche salvate su Fatture in Cloud

## 🆘 SE CONTINUA A NON FUNZIONARE

1. **Verifica URL esatto**: Copia l'URL dal browser e incollalo esattamente
2. **Contatta Fatture in Cloud**: Il supporto può verificare la configurazione
3. **Usa Device Flow**: Alternative flow per applicazioni senza browser

## 📞 CONTATTI FATTURE IN CLOUD
- **Email**: support@fattureincloud.it
- **Documentazione**: https://developers.fattureincloud.it

---

**Il problema OAuth2 è quasi sempre legato alla configurazione del Redirect URI nell'applicazione.**