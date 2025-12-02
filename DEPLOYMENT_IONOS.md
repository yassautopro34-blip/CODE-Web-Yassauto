# Guide de Déploiement YassAuto Backend sur IONOS

Ce guide explique comment déployer le backend YassAuto (Node.js + Stripe) sur un serveur IONOS en production.

---

## Table des matières
1. [Prérequis](#prérequis)
2. [Configuration .env Production](#configuration-env-production)
3. [Installation du serveur](#installation-du-serveur)
4. [PM2 - Gestion du processus](#pm2---gestion-du-processus)
5. [Nginx - Reverse Proxy & HTTPS](#nginx---reverse-proxy--https)
6. [Configuration Webhook Stripe](#configuration-webhook-stripe)
7. [Tests de production](#tests-de-production)
8. [Gestion quotidienne](#gestion-quotidienne)

---

## Prérequis

### Sur votre serveur IONOS

- **Accès SSH** à votre serveur IONOS
- **Node.js 18+** et **npm** installés
- **Nginx** ou **Apache** installé (pour reverse proxy + HTTPS)
- **Certificat SSL/TLS** (Let's Encrypt gratuit recommandé)
- **Domaine** configuré (ex: `api.yassauto.fr` ou `yassauto.fr`)
- **Clés Stripe en production** (pas les clés test)

### Informations à préparer

- Clé Stripe secrète **production** : `sk_live_xxx`
- Clé Stripe publique **production** : `pk_live_xxx`
- Webhook Secret Stripe (généré après création du webhook)
- URL front en production : `https://www.yassauto.fr`
- URL backend en production : `https://api.yassauto.fr` (ou même domaine avec `/api`)
- Port Node interne (ex: `4000` – non exposé publiquement)
- Identifiants Gmail :
  - Email : `votre-email@gmail.com`
  - Mot de passe d'application (créer dans Google Account Settings)

---

## Configuration .env Production

### 1. Créer le fichier `.env` en production

Sur votre serveur IONOS, accédez au dossier du projet et créez `.env` :

```bash
cd /home/yassauto-app
nano .env
```

### 2. Contenu du `.env` production

```dotenv
# ===== NODE ENVIRONMENT =====
NODE_ENV=production
PORT=4000

# ===== STRIPE (Clés PRODUCTION) =====
# ⚠️ Utiliser les clés LIVE, pas les clés test
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
# (le webhook secret sera généré après création du endpoint dans Stripe Dashboard)

# ===== URLs =====
# URL du site front public
FRONTEND_URL=https://www.yassauto.fr

# URL du backend (doit être accessible en HTTPS)
# Exemples:
# - https://api.yassauto.fr (sous-domaine dédié)
# - https://www.yassauto.fr/api (même domaine)
# Utiliser celui configuré en production
SERVER_URL=https://api.yassauto.fr

# ===== EMAIL (Gmail SMTP) =====
# Email qui envoie les confirmations
GMAIL_USER=votre-email@gmail.com
# Mot de passe d'application (pas le mot de passe Google normal)
# Générer ici: https://myaccount.google.com/apppasswords
GMAIL_PASSWORD=xxxx_xxxx_xxxx_xxxx

# Email admin qui reçoit les notifications
ADMIN_EMAIL=admin@yassauto.fr

# ===== LOGS =====
# En production, garder les logs dans un fichier
LOG_FILE=/var/log/yassauto-api/app.log

# ===== SECURITE =====
# Ne PAS mettre SKIP_STRIPE_SIGNATURE en production
# (la vérification de signature est OBLIGATOIRE)
# Ne PAS mettre FORCE_ETHEREAL en production
```

### 3. Sécuriser le fichier `.env`

```bash
chmod 600 .env
```

---

## Installation du serveur

### 1. Cloner/déployer le projet

```bash
# Via Git (si vous avez un repo)
cd /home
git clone https://github.com/your-repo/yassauto-backend.git yassauto-app
cd yassauto-app

# Ou copier les fichiers via FTP/SFTP
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Vérifier le fonctionnement local

```bash
# Tester sans PM2 d'abord
node server/index.js

# Vous devriez voir:
# ✅ Transporter initialized successfully
# Email booking server running on http://localhost:4000
```

Arrêter avec `Ctrl+C` une fois testé.

---

## PM2 - Gestion du processus

PM2 permet de garder le serveur Node actif 24/7 et de le redémarrer automatiquement en cas d'erreur.

### 1. Installer PM2 globalement

```bash
npm install -g pm2
```

### 2. Lancer l'app avec PM2

```bash
cd /home/yassauto-app
pm2 start server/index.js --name yassauto-api
```

Résultat attendu :
```
[PM2] Starting /home/yassauto-app/server/index.js in fork_mode (1 instance)
[PM2] Done.
┌─────────────────────┬─────┬─────────┬──────────┬────────┬──────────┐
│ App name            │ id  │ version │ mode    │ pid    │ status   │
├─────────────────────┼─────┼─────────┼──────────┼────────┼──────────┤
│ yassauto-api        │ 0   │ 0.0.0   │ fork    │ 12345  │ online   │
└─────────────────────┴─────┴─────────┴──────────┴────────┴──────────┘
```

### 3. Configurer le redémarrage automatique au boot

```bash
# Générer le script de démarrage
pm2 startup

# Sauvegarder la config PM2
pm2 save
```

### 4. Commandes PM2 utiles

```bash
# Voir l'état
pm2 status

# Voir les logs en temps réel
pm2 logs yassauto-api

# Redémarrer l'app
pm2 restart yassauto-api

# Arrêter l'app
pm2 stop yassauto-api

# Supprimer de PM2
pm2 delete yassauto-api
```

---

## Nginx - Reverse Proxy & HTTPS

Nginx fait office de reverse proxy : il reçoit les requêtes HTTPS publiques et les transmet au serveur Node sur le port 4000 (interne).

### 1. Installer Nginx (si pas encore fait)

```bash
sudo apt-get update
sudo apt-get install nginx
```

### 2. Créer un fichier de configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/yassauto-api
```

### 3. Configuration Nginx (exemple pour sous-domaine `api.yassauto.fr`)

```nginx
# /etc/nginx/sites-available/yassauto-api

upstream yassauto_backend {
    server localhost:4000;
}

server {
    listen 80;
    server_name api.yassauto.fr;

    # Redirection HTTP → HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yassauto.fr;

    # Certificat SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.yassauto.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yassauto.fr/privkey.pem;

    # Sécurité SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/yassauto-api-access.log;
    error_log /var/log/nginx/yassauto-api-error.log;

    # Reverse proxy vers Node
    location / {
        proxy_pass http://yassauto_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route spéciale pour webhook Stripe (raw body)
    location /webhook/stripe {
        proxy_pass http://yassauto_backend;
        client_max_body_size 0;
        proxy_request_buffering off;
    }
}
```

### 4. Activer la configuration

```bash
# Créer un lien symb
sudo ln -s /etc/nginx/sites-available/yassauto-api /etc/nginx/sites-enabled/

# Tester la config
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 5. Installer le certificat Let's Encrypt

```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-nginx

# Générer le certificat
sudo certbot certonly --nginx -d api.yassauto.fr

# Le certificat est maintenant disponible à :
# /etc/letsencrypt/live/api.yassauto.fr/fullchain.pem
# /etc/letsencrypt/live/api.yassauto.fr/privkey.pem
```

### 6. Renouvellement automatique du certificat

```bash
# Créer une tâche cron
sudo crontab -e

# Ajouter cette ligne :
0 0 1 * * certbot renew --quiet && systemctl reload nginx
```

---

## Configuration Webhook Stripe

Le webhook permet à Stripe de notifier votre serveur quand un paiement est complété.

### 1. Aller au Dashboard Stripe

1. Connectez-vous à https://dashboard.stripe.com
2. Allez dans **Developers** > **Webhooks**
3. Cliquez sur **Add endpoint**

### 2. Configurer l'endpoint

- **URL de l'endpoint** : `https://api.yassauto.fr/webhook/stripe`
  (adapter selon votre domaine/URL)

- **Événements à écouter** :
  - `checkout.session.completed`
  - `payment_intent.succeeded`

### 3. Récupérer le Signing Secret

Une fois l'endpoint créé :
1. Cliquez sur l'endpoint pour le voir
2. Cliquez sur **Reveal** à côté de "Signing secret"
3. Copiez la clé (commence par `whsec_`)
4. Mettez-la dans `.env` : `STRIPE_WEBHOOK_SECRET=whsec_xxx`

### 4. Tester le webhook

```bash
# Dans le Dashboard Stripe, allez sur l'endpoint et testez :
# Send test event → checkout.session.completed

# Vérifiez les logs :
pm2 logs yassauto-api
```

---

## Tests de production

### 1. Test du paiement

Faire un paiement de test en montant réel (minimum 0.50 €) :

1. Accédez à votre site front : `https://www.yassauto.fr`
2. Remplissez le formulaire de réservation
3. Cliquez sur "Payer"
4. Utilisez une **carte de test Stripe LIVE** (si vous êtes en mode test live)
   - Numéro : `4242 4242 4242 4242`
   - Exp : n'importe quelle date future
   - CVC : `123`

### 2. Vérifier que tout fonctionne

Après le paiement, vérifier :

**Logs du serveur :**
```bash
pm2 logs yassauto-api

# Vous devriez voir :
# ✅ Webhook received for checkout.session.completed
# Admin notified for reservation [ID]
# Client notified: [email]
```

**Fichier reservations.json :**
```bash
cat server/reservations.json

# La réservation doit avoir status: "confirmed" et confirmedAt
```

**Emails reçus :**
- Email admin : `ADMIN_EMAIL` doit recevoir la notification
- Email client : l'adresse du formulaire doit recevoir la confirmation

### 3. Vérifier le webhook Stripe

Dans le Dashboard Stripe > Webhooks > votre endpoint :
- L'événement doit être listé avec **Status: Succeeded**
- Response code : `200`

---

## Gestion quotidienne

### Redémarrer le serveur

```bash
pm2 restart yassauto-api
```

### Consulter les logs

```bash
# En temps réel
pm2 logs yassauto-api

# Dernières 100 lignes
pm2 logs yassauto-api --lines 100

# Sauvegarder les logs dans un fichier
pm2 logs yassauto-api > logs-$(date +%Y-%m-%d).txt
```

### Modifier les emails

Les templates d'email sont dans `server/index.js`, fonctions `clientMailOptions` et `adminMailOptions`.

Pour modifier :
1. Éditez `server/index.js`
2. Redémarrez : `pm2 restart yassauto-api`

### Mettre à jour le code

```bash
cd /home/yassauto-app
git pull origin main  # ou copier les fichiers
npm install           # si dépendances changées
pm2 restart yassauto-api
```

### Arrêter/relancer l'app

```bash
# Arrêter temporairement
pm2 stop yassauto-api

# Relancer
pm2 start yassauto-api

# Redémarrer complètement
pm2 restart yassauto-api

# Voir l'état
pm2 status
```

---

## Checklist finale

- [ ] Fichier `.env` en place sur le serveur avec clés LIVE Stripe
- [ ] `npm install` exécuté
- [ ] PM2 installé et app lancée (`pm2 start server/index.js --name yassauto-api`)
- [ ] `pm2 startup` et `pm2 save` configurés
- [ ] Nginx configuré et `systemctl reload nginx` exécuté
- [ ] Certificat SSL Let's Encrypt installé
- [ ] Webhook Stripe créé et `STRIPE_WEBHOOK_SECRET` mis à jour dans `.env`
- [ ] Test de paiement réussi
- [ ] Emails reçus (client + admin)
- [ ] Logs vérifiés avec `pm2 logs yassauto-api`

---

## Troubleshooting

### App ne démarre pas

```bash
pm2 logs yassauto-api
# Vérifier le message d'erreur
```

### Webhook ne se déclenche pas

1. Vérifier que le serveur écoute sur le port 4000 :
   ```bash
   netstat -tulpn | grep 4000
   ```

2. Vérifier que Nginx reverse-proxie correctement :
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. Vérifier le certificat SSL :
   ```bash
   curl -I https://api.yassauto.fr/health
   ```

4. Vérifier le webhook dans Stripe Dashboard

### Emails ne sont pas reçus

1. Vérifier `GMAIL_USER` et `GMAIL_PASSWORD` dans `.env`
2. Créer un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Vérifier les logs : `pm2 logs yassauto-api`

### Certificat SSL expire

```bash
# Renouveler manuellement
sudo certbot renew --force-renewal

# Vérifier la date d'expiration
sudo certbot certificates
```

---

## Support

Pour toute question ou problème, consultez :
- Docs Stripe : https://stripe.com/docs
- Docs Node.js : https://nodejs.org/docs/
- Docs Nginx : https://nginx.org/en/docs/
- PM2 : https://pm2.keymetrics.io/docs/

---

Bon déploiement ! 🚀
