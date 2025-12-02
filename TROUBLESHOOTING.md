# Guide de Dépannage - YassAuto Backend

## Problèmes Courants et Solutions

---

## 1. ❌ Le serveur ne démarre pas

### Symptômes
- `pm2 status` montre le statut comme "stopped" ou "crashed"
- Les paiements ne fonctionnent pas

### Diagnostic
```bash
# Vérifier les logs
pm2 logs yassauto-api

# Vérifier les dernières 50 lignes
pm2 logs yassauto-api --lines 50
```

### Solutions

#### A. Erreur: "Port 4000 already in use"
Le port 4000 est déjà utilisé par un autre processus.

```bash
# Trouver le PID du processus
lsof -i :4000
# ou sur IONOS/CentOS:
netstat -tulpn | grep 4000

# Tuer le processus
kill -9 PID

# Redémarrer avec PM2
pm2 restart yassauto-api
```

#### B. Erreur: "STRIPE_SECRET_KEY is not defined"
Variable d'environnement manquante dans `.env`

```bash
# Vérifier que .env existe
ls -la .env

# Vérifier le contenu
cat .env | grep STRIPE_SECRET_KEY

# Si absent, l'ajouter:
echo "STRIPE_SECRET_KEY=sk_live_xxx" >> .env

# Redémarrer
pm2 restart yassauto-api
```

#### C. Erreur: "Cannot find module 'express'"
Les dépendances npm ne sont pas installées

```bash
cd /home/yassauto-app
npm install
pm2 restart yassauto-api
```

#### D. Erreur: "Error: ENOENT: no such file or directory"
Le fichier `server/index.js` n'existe pas ou chemin incorrect

```bash
# Vérifier que la structure est correcte
ls -la server/index.js

# Vérifier la configuration PM2
pm2 list

# Si le chemin est mauvais, redémarrer avec le bon:
pm2 delete yassauto-api
pm2 start /home/yassauto-app/server/index.js --name yassauto-api
```

---

## 2. ❌ Le webhook ne se déclenche pas

### Symptômes
- Le paiement est effectué mais la réservation reste "pending"
- Pas d'email de confirmation reçu
- `pm2 logs` ne montre pas "Webhook received"

### Diagnostic
```bash
# 1. Vérifier que le serveur écoute sur le port 4000
netstat -tulpn | grep 4000

# 2. Vérifier que Nginx reverse-proxie correctement
curl -I https://api.yassauto.fr/health

# 3. Tester le webhook manuellement
curl -X POST https://api.yassauto.fr/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed","data":{"object":{"id":"test"}}}'

# Vérifier la réponse dans les logs
pm2 logs yassauto-api
```

### Solutions

#### A. Certfificat SSL invalide
`curl` retourne une erreur SSL

```bash
# Vérifier le certificat
sudo certbot certificates

# Renouveler le certificat
sudo certbot renew --force-renewal

# Recharger Nginx
sudo systemctl reload nginx

# Tester à nouveau
curl -I https://api.yassauto.fr/health
```

#### B. Nginx ne reverse-proxie pas correctement
`curl` retourne une erreur 502 Bad Gateway

```bash
# Vérifier la configuration Nginx
sudo nginx -t

# Voir si Nginx a des erreurs
sudo systemctl status nginx
sudo tail -50 /var/log/nginx/error.log

# Vérifier que Node écoute sur localhost:4000
netstat -tulpn | grep 4000

# Si tout semble bien, recharger Nginx
sudo systemctl reload nginx
```

#### C. Webhook Secret incorrect dans Stripe
Le webhook se déclenche mais la vérification de signature échoue

```bash
# Vérifier la clé actuelle dans .env
cat .env | grep STRIPE_WEBHOOK_SECRET

# Aller dans Stripe Dashboard > Developers > Webhooks
# Cliquer sur l'endpoint yassauto-api
# Copier la clé (Signing secret) complète

# Mettre à jour .env
nano .env
# Remplacer STRIPE_WEBHOOK_SECRET par la bonne valeur

# Redémarrer
pm2 restart yassauto-api
```

#### D. L'endpoint webhook n'est pas créé dans Stripe
Aucun webhook n'existe dans Stripe Dashboard

```bash
# Aller dans Stripe Dashboard > Developers > Webhooks
# Ajouter endpoint:
#   - URL: https://api.yassauto.fr/webhook/stripe
#   - Événements: 
#       * checkout.session.completed
#       * payment_intent.succeeded
# Copier la clé Signing secret
# L'ajouter à .env: STRIPE_WEBHOOK_SECRET=whsec_...
# Redémarrer: pm2 restart yassauto-api
```

---

## 3. ❌ Les emails ne sont pas reçus

### Symptômes
- La réservation est confirmée (status = "confirmed" dans JSON)
- Mais pas d'email reçu par le client ou l'admin
- Les logs ne montrent pas d'erreur d'envoi

### Diagnostic
```bash
# Vérifier les logs détaillés
pm2 logs yassauto-api --lines 100 | grep -i email

# Vérifier les credentials Gmail dans .env
cat .env | grep GMAIL

# Vérifier l'adresse email admin
cat .env | grep ADMIN_EMAIL
```

### Solutions

#### A. Gmail: mot de passe d'application invalide
```bash
# Vérifier le mot de passe dans .env
cat .env | grep GMAIL_PASSWORD

# Aller à: https://myaccount.google.com/apppasswords
# Sélectionner Mail et Linux
# Copier le mot de passe généré (sans espaces)
# Mettre à jour .env:
nano .env
# Remplacer GMAIL_PASSWORD par la bonne valeur

# Redémarrer
pm2 restart yassauto-api
```

#### B. L'authentification 2FA n'est pas activée sur Gmail
Les mots de passe d'application ne fonctionnent que si 2FA est activé

```bash
# Aller à: https://myaccount.google.com
# Aller dans Sécurité
# Activer l'authentification 2FA
# Puis générer un mot de passe d'application (Mail + Linux)
# L'ajouter à .env
# Redémarrer: pm2 restart yassauto-api
```

#### C. L'adresse Gmail est bloquée/suspendue
Gmail refuse les connexions

```bash
# Vérifier que le compte Gmail n'est pas suspendu
# Aller à: https://accounts.google.com/SecurityCheckup
# Si le compte est suspendus, le déverrouiller

# Ou utiliser un autre compte Gmail:
# Mettre à jour .env:
GMAIL_USER=autre-email@gmail.com
GMAIL_PASSWORD=nouveau-mot-de-passe-app

# Redémarrer
pm2 restart yassauto-api
```

#### D. Les emails arrivent dans les spams
Les emails sont envoyés mais arrivent dans Spam

```bash
# Vérifier que les headers sont corrects
# Vérifier que le template email n'a pas de flags d'attaque
# 
# Solutions:
# 1. Configurer SPF/DKIM dans vos DNS
# 2. Utiliser un service d'email plus fiable (SendGrid, Mailgun)
#    (au lieu de Gmail SMTP)
# 3. Ajouter des headers d'authentification au template email
```

#### E. `reservations.json` n'a pas d'entrée `confirmedAt`
L'email n'a pas été envoyé car la réservation n'a pas été confirmée

```bash
# Vérifier que le webhook s'est déclenché
pm2 logs yassauto-api | grep "Webhook received"

# Si pas de log, voir la section "Le webhook ne se déclenche pas" ci-dessus

# Vérifier le fichier reservations.json
cat server/reservations.json | jq '.'

# Si la réservation est encore "pending", le webhook n'a pas déclenché
```

---

## 4. ❌ Les paiements Stripe sont refusés

### Symptômes
- La page Stripe Checkout charge mais refuse les paiements
- Le client voit un message d'erreur lors du paiement
- `pm2 logs` montre une erreur Stripe

### Diagnostic
```bash
# Vérifier la clé Stripe dans .env
cat .env | grep STRIPE_SECRET_KEY

# Vérifier que c'est bien une clé LIVE (sk_live_xxx)
# Pas une clé test (sk_test_xxx)

# Tester la clé Stripe directement
curl https://api.stripe.com/v1/account \
  -u sk_live_YOUR_KEY:

# Si erreur 401, la clé est invalide
```

### Solutions

#### A. Clé Stripe test utilisée au lieu de clé LIVE
```bash
# Aller dans Stripe Dashboard > Developers > API Keys
# Copier la clé LIVE secrète (sk_live_xxx)
# La mettre dans .env:
nano .env
STRIPE_SECRET_KEY=sk_live_...

# Redémarrer
pm2 restart yassauto-api
```

#### B. La clé Stripe a été révoquée/supprimée
```bash
# Aller dans Stripe Dashboard > Developers > API Keys
# Créer une nouvelle clé secrète
# Copier la nouvelle clé
# La mettre dans .env
# Redémarrer: pm2 restart yassauto-api
```

#### C. Le compte Stripe n'est pas validé
```bash
# Aller dans Stripe Dashboard
# Vérifier que le compte est complètement activé
# Terminer la vérification si nécessaire
```

#### D. La devise ou le montant est incorrect
```bash
# Vérifier que le montant dans Stripe est en centimes
# Exemple: 20€ = 2000 centimes

# Vérifier dans server/index.js ligne de création de session:
# amount: 2000  (pour 20€)

# Vérifier la devise
# currency: 'eur'
```

---

## 5. ⚠️ Certificat SSL expire bientôt

### Symptômes
- Les navigateurs affichent un avertissement de certificat
- Certaines requêtes HTTPS échouent

### Solutions
```bash
# Vérifier la date d'expiration
sudo certbot certificates

# Renouveler avant expiration
sudo certbot renew --force-renewal

# Recharger Nginx
sudo systemctl reload nginx

# Vérifier que le nouveau certificat est chargé
curl -I https://api.yassauto.fr/health
```

---

## 6. ❌ Performance: Le serveur est très lent

### Symptômes
- Les réponses prennent > 5 secondes
- Parfois "Gateway Timeout"

### Diagnostic
```bash
# Vérifier l'usage des ressources
pm2 monit

# Vérifier si le processus Node consomme beaucoup de mémoire
ps aux | grep node

# Vérifier les logs pour les erreurs
pm2 logs yassauto-api --lines 100
```

### Solutions

#### A. Node consomme trop de mémoire
```bash
# Redémarrer le serveur
pm2 restart yassauto-api

# Si ça revient, il y a une fuite mémoire
# Vérifier le code pour les variables globales non nettoyées
```

#### B. Trop de requêtes simultanées
```bash
# Augmenter les ressources du serveur IONOS
# Ou optimiser le code (mettre en cache, etc.)

# Vérifier les logs
pm2 logs yassauto-api
```

#### C. Le disque est plein
```bash
# Vérifier l'espace disque
df -h

# Si plein, nettoyer les anciens logs
pm2 flush

# Ou archiver les logs:
pm2 logs yassauto-api > logs-$(date +%Y-%m-%d).tar.gz
pm2 flush
```

---

## 7. ❌ Impossible de se connecter au serveur SSH

### Symptômes
- `ssh` retourne "Connection refused" ou "timeout"
- Impossible d'accéder au serveur IONOS

### Solutions

#### A. Vérifier les credentials SSH
```bash
# Vérifier les identifiants SSH
# (fournis par IONOS par email)

# Essayer de se connecter avec verbosité
ssh -vv user@api.yassauto.fr
```

#### B. Le serveur SSH n'écoute pas
```bash
# Cette situation nécessite l'accès au panel de contrôle IONOS
# Aller sur: https://www.ionos.fr/hosting/connexion
# Redémarrer le serveur depuis le panel
```

---

## 8. 📋 Checklist de diagnostic rapide

Quand quelque chose ne fonctionne pas, exécuter dans l'ordre :

```bash
# 1. Vérifier que le serveur est actif
pm2 status

# 2. Vérifier les logs récents
pm2 logs yassauto-api --lines 50

# 3. Vérifier le port 4000
netstat -tulpn | grep 4000

# 4. Vérifier la connectivité
curl -I http://localhost:4000/health

# 5. Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# 6. Vérifier la connectivité externe
curl -I https://api.yassauto.fr/health

# 7. Vérifier les permissions fichier
ls -la .env
chmod 600 .env

# 8. Redémarrer si tout échoue
pm2 restart yassauto-api
sudo systemctl reload nginx
```

---

## 9. 🆘 Rapporter un problème

Si le problème persiste, collecter ces informations :

```bash
# 1. Logs complets
pm2 logs yassauto-api > logs.txt

# 2. Statut du système
pm2 status > status.txt
pm2 monit > resources.txt
netstat -tulpn > ports.txt

# 3. Configuration
cat .env > config.txt  # ⚠️ Supprimer les secrets avant partage!

# 4. Vérification Nginx
sudo nginx -t > nginx-test.txt
sudo systemctl status nginx > nginx-status.txt

# Partager ces fichiers pour diagnostic
```

---

## Support Technique

- **Stripe Documentation**: https://stripe.com/docs
- **Node.js Docs**: https://nodejs.org/docs/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Nginx Docs**: https://nginx.org/en/docs/
- **IONOS Support**: https://www.ionos.fr/help

Bonne chance! 🍀
