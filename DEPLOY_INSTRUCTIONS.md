# 🚀 Istruzioni per Deploy GitHub + Netlify

## 📋 Step 1: Creare Repository GitHub

1. **Vai su GitHub.com** e accedi al tuo account
2. **Clicca "New Repository"** (pulsante verde)
3. **Configura il repository**:
   - **Nome**: `fatture-elettroniche-sanitarie`
   - **Descrizione**: `Sistema web per generazione automatica di fatture elettroniche per servizi sanitari con API Fatture in Cloud`
   - **Visibilità**: Public (per Netlify gratuito)
   - **NON** inizializzare con README, .gitignore o licenza
4. **Clicca "Create repository"**

## 📤 Step 2: Push del Codice su GitHub

Copia e incolla questi comandi nel terminale (dalla cartella del progetto):

```bash
# Naviga nella cartella del progetto
cd /mnt/c/Users/cucin/Desktop/fatture-elettroniche-sanitarie

# Aggiungi il remote GitHub (sostituisci USERNAME con il tuo username GitHub)
git remote add origin https://github.com/USERNAME/fatture-elettroniche-sanitarie.git

# Push del codice
git push -u origin main
```

**IMPORTANTE**: Sostituisci `USERNAME` con il tuo vero username GitHub!

## 🌐 Step 3: Deploy su Netlify

### Opzione A: Deploy Automatico (Raccomandato)

1. **Vai su [netlify.com](https://netlify.com)** e accedi
2. **Clicca "Import from Git"**
3. **Seleziona GitHub** e autorizza Netlify
4. **Scegli il repository** `fatture-elettroniche-sanitarie`
5. **Configurazioni build**:
   - **Branch**: `main`
   - **Build command**: *(lascia vuoto)*
   - **Publish directory**: *(lascia vuoto o metti `.`)*
6. **Clicca "Deploy"**

### Opzione B: Deploy Manuale

1. **Vai su [netlify.com](https://netlify.com)**
2. **Trascina la cartella** `fatture-elettroniche-sanitarie` nel box "Deploy"
3. **Il sito sarà online** immediatamente

## ⚙️ Step 4: Configurazione Post-Deploy

Dopo il deploy, Netlify ti darà un URL tipo: `https://nome-casuale.netlify.app`

### Aggiorna Fatture in Cloud

1. **Accedi a Fatture in Cloud**
2. **Vai su API > Le tue applicazioni**
3. **Modifica l'app ID 13354**
4. **Aggiungi Redirect URI**:
   ```
   https://il-tuo-url-netlify.netlify.app/auth-callback.html
   ```

### Personalizza URL Netlify (Opzionale)

1. **Nel dashboard Netlify**
2. **Site settings > Domain management**
3. **Change site name** → `fatture-sanitarie` (o nome preferito)
4. **L'URL diventerà**: `https://fatture-sanitarie.netlify.app`

## 🔧 Step 5: Test Finale

1. **Visita il sito** live
2. **Clicca "Connetti API Fatture in Cloud"**
3. **Autorizza l'applicazione**
4. **Testa con una fattura di prova**

## 📁 Struttura File Deployati

```
fatture-elettroniche-sanitarie/
├── index.html              # Pagina principale
├── styles.css              # Stili CSS
├── script.js               # Logica JavaScript
├── config.js               # Configurazione API
├── auth-callback.html      # Callback OAuth2
├── netlify.toml           # Configurazione Netlify
├── README.md              # Documentazione
├── .gitignore             # File da ignorare
└── DEPLOY_INSTRUCTIONS.md # Queste istruzioni
```

## 🛡️ Sicurezza

Le credenziali API sono nel file `config.js` lato client. Per maggiore sicurezza in produzione, considera:

- Implementare un backend proxy
- Usare variabili d'ambiente
- Implementare rate limiting

## 📞 Supporto

Se hai problemi:
1. Controlla la console browser per errori
2. Verifica la configurazione Redirect URI
3. Controlla i log di Netlify

---

**🎉 Una volta completato, avrai un sistema completo per fatture elettroniche sanitarie online!**