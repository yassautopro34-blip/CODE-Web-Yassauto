# ⚡ Quick Start - 5 Minutes

Vous êtes pressé? Voici le résumé exécutif pour lancer le backend YassAuto en production.

---

## ⏱️ Les 5 étapes essentielles

### 1️⃣ Préparer le serveur (2 min)
```bash
# Connecter SSH
ssh user@api.yassauto.fr

# Copier le code
git clone [votre-repo] /home/yassauto-app

# Aller dans le dossier
cd /home/yassauto-app

# Copier le .env template
cp .env.production.template .env
nano .env
# ⚠️ Remplir les valeurs xxx_HERE avec vos vraies clés
```

### 2️⃣ Installer & lancer (2 min)
```bash
# Installation npm
npm install --production

# Lancer avec PM2
pm2 start server/index.js --name yassauto-api
pm2 save
```

### 3️⃣ Configurer Stripe webhook (30 sec)
- Aller dans **Stripe Dashboard > Developers > Webhooks**
- Ajouter endpoint: `https://api.yassauto.fr/webhook/stripe`
- Copier le **Signing secret** (whsec_xxx)
- Mettre à jour `.env` : `STRIPE_WEBHOOK_SECRET=whsec_xxx`
- Redémarrer: `pm2 restart yassauto-api`

### 4️⃣ Test rapide (1 min)
```bash
# Vérifier que ça marche
curl -I https://api.yassauto.fr/health

# Voir les logs
pm2 logs yassauto-api
```

### 5️⃣ Test paiement (∞)
- Aller sur votre site front
- Remplir le formulaire
- Payer 20€ avec `4242 4242 4242 4242`
- ✅ Réservation créée + 2 emails reçus = SUCCESS

---

## 🔑 Variables critiques dans `.env`

```dotenv
# Ces 3 variables OBLIGATOIRES:
STRIPE_SECRET_KEY=sk_live_xxx          # Clé Stripe LIVE
STRIPE_WEBHOOK_SECRET=whsec_xxx        # Sera généré dans Stripe Dashboard
GMAIL_PASSWORD=xxxx_xxxx_xxxx_xxxx     # Mot de passe app Gmail
```

---

## ⚠️ Les 3 pièges à éviter

❌ **NE PAS** utiliser les clés test Stripe (sk_test_xxx)  
❌ **NE PAS** laisser .env en version control  
❌ **NE PAS** oublier le webhook Stripe  

---

## 🆘 Si ça ne fonctionne pas

```bash
# Vérifier les logs
pm2 logs yassauto-api

# Vérifier que Node écoute
netstat -tulpn | grep 4000

# Redémarrer
pm2 restart yassauto-api

# Pour plus d'aide
# → Consulter TROUBLESHOOTING.md
```

---

## 📚 Pour plus de détails

- **Déploiement complet** → Lire `DEPLOYMENT_IONOS.md`
- **Vérifier avant go-live** → Cocher `DEPLOYMENT_CHECKLIST.md`
- **Problèmes** → Consulter `TROUBLESHOOTING.md`

---

**Status: ✅ Prêt en 5 minutes!**

Bonne chance! 🚀
