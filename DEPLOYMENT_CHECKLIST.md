# Checklist Pré-Déploiement - YassAuto Backend

Avant de déployer en production sur IONOS, vérifier tous les points de cette checklist.

---

## 📋 Phase 1: Préparation (en local avant déploiement)

### Code & Configuration
- [ ] Vérifier que `server/index.js` n'a pas d'erreurs de syntaxe
- [ ] Vérifier que `npm install` s'exécute sans erreur
- [ ] Vérifier que `node server/index.js` démarre sans erreur
- [ ] Vérifier que le serveur écoute sur `http://localhost:4000`
- [ ] Vérifier l'endpoint `/health` retourne `{"status":"ok"}`
- [ ] Vérifier que `.env.production.template` est documenté correctement

### Paiements & Stripe
- [ ] Avoir une compte Stripe **actif et validé**
- [ ] Avoir les clés Stripe **LIVE** (sk_live_xxx et pk_live_xxx)
- [ ] Avoir les clés Stripe **test** (sk_test_xxx et pk_test_xxx) pour testing
- [ ] Vérifier que le formulaire de réservation collecte tous les champs nécessaires:
  - [ ] Nom du client
  - [ ] Email du client
  - [ ] Téléphone du client
  - [ ] Date de réservation
  - [ ] Heure de réservation
  - [ ] Type de service
  - [ ] Description/notes
- [ ] Vérifier que le formulaire envoie la requête POST à `/create-checkout-session`
- [ ] Tester en local: réservation passe de pending → confirmed après webhook

### Emails
- [ ] Avoir un compte Gmail ou un serveur SMTP en production
- [ ] Avoir créé un **mot de passe d'application** (pas le mot de passe Google)
- [ ] Tester l'envoi d'email en local avec Ethereal pour voir le template
- [ ] Vérifier que le template email contient:
  - [ ] Logo/header YassAuto
  - [ ] Informations du client
  - [ ] Détails de la réservation
  - [ ] Prix et conditions
  - [ ] Contacts et coordonnées
  - [ ] Footer avec info de l'entreprise
- [ ] Vérifier que le template email s'affiche correctement dans Ethereal
- [ ] Vérifier que deux emails sont envoyés: client + admin

### Données
- [ ] Vérifier que `server/reservations.json` peut être créé/modifié
- [ ] Vérifier que les réservations sont bien persistées après redémarrage
- [ ] Vérifier le format JSON des réservations stockées

### Documentation
- [ ] Vérifier que `DEPLOYMENT_IONOS.md` est clair et à jour
- [ ] Vérifier que `.env.production.template` a toutes les variables nécessaires
- [ ] Vérifier que `TROUBLESHOOTING.md` couvre les cas courants

---

## 🚀 Phase 2: Préparation du serveur IONOS

### Infrastructure
- [ ] Se connecter au serveur IONOS via SSH
- [ ] Vérifier que Node.js 18+ est installé: `node --version`
- [ ] Vérifier que npm est installé: `npm --version`
- [ ] Vérifier que Git est installé: `git --version` (optionnel mais recommandé)
- [ ] Vérifier que Nginx est installé: `nginx -v`
- [ ] Vérifier que sudo fonctionne

### Dossiers & Permissions
- [ ] Créer le dossier de l'app: `/home/yassauto-app`
- [ ] Copier le code du backend dans `/home/yassauto-app`
- [ ] Vérifier les permissions: `ls -la /home/yassauto-app`
- [ ] Donner les permissions au dossier: `chmod 755 /home/yassauto-app`

### Dépendances
- [ ] Aller dans `/home/yassauto-app`
- [ ] Exécuter `npm install --production`
- [ ] Vérifier qu'aucune erreur n'apparaît

### Configuration .env
- [ ] Créer `/home/yassauto-app/.env` sur le serveur
- [ ] Copier le contenu de `.env.production.template`
- [ ] Remplacer les valeurs xxx_HERE par les vraies:
  - [ ] `STRIPE_SECRET_KEY` = clé LIVE Stripe
  - [ ] `STRIPE_WEBHOOK_SECRET` = sera généré après
  - [ ] `FRONTEND_URL` = URL du site front en production
  - [ ] `SERVER_URL` = URL du backend (api.yassauto.fr)
  - [ ] `GMAIL_USER` = adresse Gmail
  - [ ] `GMAIL_PASSWORD` = mot de passe d'application Gmail
  - [ ] `ADMIN_EMAIL` = adresse admin
- [ ] Sécuriser le fichier: `chmod 600 .env`
- [ ] Vérifier: `cat .env | grep -v "^#" | grep -v "^$"` (pas de xxx_HERE)

### Certificat SSL
- [ ] Installer Certbot: `sudo apt-get install certbot python3-certbot-nginx`
- [ ] Générer le certificat: `sudo certbot certonly --nginx -d api.yassauto.fr`
- [ ] Vérifier: `sudo certbot certificates`
- [ ] Vérifier que le certificat est à:
  - `/etc/letsencrypt/live/api.yassauto.fr/fullchain.pem`
  - `/etc/letsencrypt/live/api.yassauto.fr/privkey.pem`

### Nginx
- [ ] Créer `/etc/nginx/sites-available/yassauto-api`
- [ ] Copier la configuration du fichier `nginx-config.example`
- [ ] Adapter les domaines si nécessaire
- [ ] Tester la config: `sudo nginx -t`
- [ ] Activer le site: `sudo ln -s /etc/nginx/sites-available/yassauto-api /etc/nginx/sites-enabled/`
- [ ] Recharger Nginx: `sudo systemctl reload nginx`
- [ ] Vérifier que Nginx écoute: `sudo systemctl status nginx`

### PM2
- [ ] Installer PM2: `npm install -g pm2`
- [ ] Vérifier: `pm2 --version`
- [ ] Lancer l'app: `cd /home/yassauto-app && pm2 start server/index.js --name yassauto-api`
- [ ] Sauvegarder la config: `pm2 save`
- [ ] Configurer le auto-restart: `pm2 startup`
- [ ] Vérifier le statut: `pm2 status`

---

## 🔗 Phase 3: Configuration Stripe

### Dashboard Stripe
- [ ] Se connecter à https://dashboard.stripe.com
- [ ] Vérifier que le compte est en mode **LIVE** (pas test)
- [ ] Aller dans **Developers > API Keys**
- [ ] Copier la clé secrète **LIVE** (sk_live_xxx)
- [ ] La mettre dans `.env` sur le serveur: `STRIPE_SECRET_KEY=sk_live_xxx`

### Webhook Configuration
- [ ] Dans Stripe Dashboard, aller dans **Developers > Webhooks**
- [ ] Cliquer sur **Add endpoint**
- [ ] Remplir:
  - [ ] URL de l'endpoint: `https://api.yassauto.fr/webhook/stripe`
  - [ ] Sélectionner les événements:
    - [ ] `checkout.session.completed`
    - [ ] `payment_intent.succeeded`
- [ ] Cliquer **Add endpoint**
- [ ] Aller dans l'endpoint créé et copier le **Signing secret** (whsec_xxx)
- [ ] Mettre à jour `.env` sur le serveur: `STRIPE_WEBHOOK_SECRET=whsec_xxx`
- [ ] Redémarrer le serveur: `pm2 restart yassauto-api`

### Test du Webhook
- [ ] Dans Stripe Dashboard, aller sur l'endpoint
- [ ] Cliquer **Send test event**
- [ ] Sélectionner `checkout.session.completed`
- [ ] Cliquer **Send event**
- [ ] Vérifier dans les logs du serveur: `pm2 logs yassauto-api`
- [ ] Le log doit montrer: `✅ Webhook received for checkout.session.completed`

---

## ✅ Phase 4: Vérifications de connectivité

### Serveur Node
- [ ] Vérifier que Node écoute: `netstat -tulpn | grep 4000`
- [ ] Tester en local: `curl -I http://localhost:4000/health`
- [ ] La réponse doit être: `{"status":"ok"}`

### Nginx & Reverse Proxy
- [ ] Vérifier que Nginx écoute: `sudo systemctl status nginx`
- [ ] Tester le reverse proxy: `curl -I https://api.yassauto.fr/health`
- [ ] La réponse doit être: `200 OK` (si certificat bon)
- [ ] Pas d'erreur 502 ou 503

### Certificat SSL
- [ ] Vérifier le certificat: `curl -I https://api.yassauto.fr/health`
- [ ] Pas d'erreur de certificat auto-signé
- [ ] La réponse doit commencer par: `HTTP/2 200`

### DNS & Domaine
- [ ] Vérifier que le domaine pointe vers le serveur IONOS
- [ ] `nslookup api.yassauto.fr` doit retourner l'IP du serveur
- [ ] Tester depuis un autre réseau: `ping api.yassauto.fr`

---

## 📧 Phase 5: Test des emails

### Configuration Gmail
- [ ] Vérifier que 2FA est activé sur le compte Gmail
- [ ] Générer un nouveau mot de passe d'application: https://myaccount.google.com/apppasswords
- [ ] Mettre à jour `.env` sur le serveur avec le nouveau mot de passe
- [ ] Redémarrer le serveur: `pm2 restart yassauto-api`

### Test d'envoi
- [ ] Trigger un test d'email: `curl -X POST https://api.yassauto.fr/booking/send-email \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Test","clientEmail":"test@example.com",...}'`
- [ ] Vérifier les logs: `pm2 logs yassauto-api`
- [ ] L'email doit être reçu par le client et l'admin
- [ ] Vérifier que le template s'affiche correctement

---

## 💳 Phase 6: Test de paiement

### Premier test (montant faible)
- [ ] Aller sur le site front: `https://www.yassauto.fr`
- [ ] Remplir le formulaire de réservation avec des données de test
- [ ] Cliquer sur "Payer"
- [ ] Utiliser une **carte de test Stripe LIVE**:
  - Numéro: `4242 4242 4242 4242`
  - Expiration: n'importe quelle date future
  - CVC: `123`
  - Autres champs: n'importe quelle valeur

### Vérification post-paiement
- [ ] Le paiement doit passer sans erreur
- [ ] L'utilisateur doit être redirigé vers une page de succès
- [ ] La réservation doit être créée dans `server/reservations.json`
- [ ] Le status doit passer de "pending" → "confirmed"
- [ ] Un timestamp `confirmedAt` doit être ajouté
- [ ] Les deux emails doivent être reçus (client + admin)

### Vérification dans Stripe
- [ ] Dans Stripe Dashboard, aller dans **Payments**
- [ ] Le paiement doit apparaître avec status "Succeeded"
- [ ] Le montant doit être correct (20€ = 2000 centimes)
- [ ] Dans **Developers > Webhooks**, l'événement `checkout.session.completed` doit avoir un statut vert (livré)

---

## 🔒 Phase 7: Sécurité

### Configuration .env
- [ ] Vérifier que `.env` a les bonnes permissions: `ls -la .env` → `-rw-------`
- [ ] Ne **JAMAIS** committer `.env` en version control
- [ ] Ajouter `.env` au `.gitignore`
- [ ] Vérifier que les secrets ne sont pas dans le code source

### Stripe & Webhook
- [ ] Le `STRIPE_WEBHOOK_SECRET` est bien en place (vérification de signature)
- [ ] Les clés Stripe sont des clés **LIVE** (pas test)
- [ ] Le webhook n'est accessible que via HTTPS (443)

### SSL/TLS
- [ ] Le certificat SSL est valide et non auto-signé
- [ ] Nginx force HTTPS (redirection 80 → 443)
- [ ] Test: `curl -I http://api.yassauto.fr` retourne redirect vers https://

### Permissions Fichiers
- [ ] `.env` est protégé: `chmod 600 .env`
- [ ] Les logs ne contiennent pas de secrets
- [ ] Les fichiers Node sont lisibles mais pas modifiables par l'utilisateur web

---

## 📊 Phase 8: Monitoring & Logs

### PM2 Monitoring
- [ ] Vérifier le statut: `pm2 status`
- [ ] Vérifier les ressources: `pm2 monit`
- [ ] Vérifier les logs: `pm2 logs yassauto-api`
- [ ] Pas d'erreur visibles dans les logs

### Nginx Logs
- [ ] Vérifier les access logs: `sudo tail -50 /var/log/nginx/yassauto-api-access.log`
- [ ] Vérifier les error logs: `sudo tail -50 /var/log/nginx/yassauto-api-error.log`
- [ ] Pas d'erreur 500 ou 502

### Auto-Restart
- [ ] Vérifier que PM2 a le auto-restart configuré: `pm2 status`
- [ ] Colonne "mode" doit montrer "fork" ou "cluster"
- [ ] Si le serveur redémarre, l'app doit relancer automatiquement

---

## ✨ Phase 9: Documentation & Handover

### Documentation à jour
- [ ] `DEPLOYMENT_IONOS.md` est complété avec vos informations spécifiques
- [ ] `TROUBLESHOOTING.md` est complet
- [ ] `.env.production.template` a tous les commentaires explicatifs
- [ ] `deploy.sh` est exécutable et testé

### Backup & Recovery
- [ ] Backup du `.env` production (stocké en sécurité)
- [ ] Backup du `server/reservations.json` régulièrement
- [ ] Procédure de restauration documentée

### Formation
- [ ] L'équipe sait comment redémarrer le serveur
- [ ] L'équipe sait comment vérifier les logs
- [ ] L'équipe sait comment modifier les templates d'email
- [ ] L'équipe sait comment réagir en cas de problème

---

## 🎉 Checklist finale - Le système est PRÊT si :

- [x] Tous les points ci-dessus sont cochés
- [x] Un test de paiement complet a réussi
- [x] Les deux emails ont été reçus
- [x] Les réservations sont bien persistées
- [x] Les logs ne montrent pas d'erreur
- [x] Nginx reverse-proxie correctement
- [x] Le certificat SSL est valide
- [x] Le webhook Stripe fonctionne
- [x] L'équipe est formée
- [x] La documentation est à jour

**Dès que tout est coché, le système est PRODUCTION-READY!** 🚀

---

## 📞 Support & Contacts

**En cas de problème pendant le déploiement:**
1. Consulter `TROUBLESHOOTING.md`
2. Vérifier les logs: `pm2 logs yassauto-api`
3. Tester manuellement avec `curl`
4. Consulter la doc officielle (Stripe, Node.js, Nginx)

Bonne chance! 🍀
