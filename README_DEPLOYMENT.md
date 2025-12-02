# 📚 Documentation YassAuto - Index Complet

Bienvenue! Voici tous les documents créés pour le déploiement production du backend YassAuto.

---

## 🚀 PAR OÙ COMMENCER?

### Si vous déployez pour la première fois:
1. **Lire** → `DEPLOYMENT_SUMMARY.md` (vue d'ensemble)
2. **Vérifier** → `DEPLOYMENT_CHECKLIST.md` (checklist étape par étape)
3. **Suivre** → `DEPLOYMENT_IONOS.md` (guide détaillé)
4. **En cas de problème** → `TROUBLESHOOTING.md` (dépannage)

---

## 📖 Guide rapide par situation

### 📝 "Je commence le déploiement"
→ Lire **`DEPLOYMENT_SUMMARY.md`** (5 min)  
→ Puis suivre **`DEPLOYMENT_IONOS.md`** (30-60 min)

### ✅ "Je dois vérifier tout avant le go-live"
→ Imprimer **`DEPLOYMENT_CHECKLIST.md`** et cocher les cases

### ❌ "Quelque chose ne fonctionne pas"
→ Consulter **`TROUBLESHOOTING.md`** pour des solutions

### ⚙️ "Comment configurer Nginx/SSL?"
→ Voir la section dans **`DEPLOYMENT_IONOS.md`**  
→ Ou utiliser **`nginx-config.example`** comme template

### 🔧 "Je dois configurer les variables .env"
→ Copier **`.env.production.template`** en `.env`  
→ Remplir les valeurs xxx_HERE

### ⚡ "Je veux automatiser le déploiement"
→ Utiliser **`setup-ionos.sh`** (script bash)  
→ Ou **`deploy.sh`** pour redéploiement rapide

---

## 📁 Structure des fichiers de documentation

```
Documentation Production
├── 📄 DEPLOYMENT_SUMMARY.md .......... Vue d'ensemble + checklist rapide
├── 📄 DEPLOYMENT_IONOS.md ........... Guide complet 9 sections
├── 📄 DEPLOYMENT_CHECKLIST.md ....... Checklist détaillée à cocher
├── 📄 TROUBLESHOOTING.md ............ Guide dépannage complet
├── 📄 nginx-config.example .......... Template config Nginx
├── 📄 .env.production.template ...... Template variables d'env
├── 🔨 setup-ionos.sh ............... Script automatisé complet
├── 🔨 deploy.sh ................... Script déploiement rapide
└── 📄 README_DEPLOYMENT.md .......... Ce fichier
```

---

## 🎯 Qu'est-ce qui a été livré?

### Backend Production
- ✅ API Node.js + Express complète
- ✅ Intégration Stripe (paiements 20€)
- ✅ Système d'emails (client + admin)
- ✅ Stockage réservations (JSON)
- ✅ Webhook sécurisé

### Infrastructure
- ✅ Configuration PM2 (auto-restart)
- ✅ Configuration Nginx (reverse proxy)
- ✅ Configuration SSL (Let's Encrypt)
- ✅ Scripts d'automatisation
- ✅ Monitoring intégré

### Documentation
- ✅ Guide déploiement complet (9 sections)
- ✅ Checklist pré-déploiement (8 phases)
- ✅ Guide dépannage (8 problèmes courants)
- ✅ Configuration exemple (Nginx, .env)
- ✅ Ce résumé de navigation

---

## 📋 Fichiers clés par type

### 📖 Documentation à lire
| Fichier | Utilité | Durée |
|---------|---------|-------|
| `DEPLOYMENT_SUMMARY.md` | Vue générale + résumé | 5 min |
| `DEPLOYMENT_IONOS.md` | Guide complet étape par étape | 30-60 min |
| `DEPLOYMENT_CHECKLIST.md` | Vérification avant go-live | 30 min |
| `TROUBLESHOOTING.md` | Résolution de problèmes | Au besoin |

### ⚙️ Configuration à adapter
| Fichier | Utilité |
|---------|---------|
| `.env.production.template` | Variables d'environnement |
| `nginx-config.example` | Configuration web server |
| `server/index.js` | Personnalisation templates email |

### 🔨 Scripts à exécuter
| Fichier | Utilité | Commande |
|---------|---------|----------|
| `setup-ionos.sh` | Automatisation complète | `sudo bash setup-ionos.sh` |
| `deploy.sh` | Déploiement rapide | `./deploy.sh` |

---

## 🔐 Sécurité essentielles

### ✅ À ne pas oublier

1. **Variables d'environnement**
   - Ne JAMAIS committer `.env` en Git
   - Utiliser des clés LIVE Stripe (pas test)
   - Protéger : `chmod 600 .env`

2. **Certificat SSL**
   - Utiliser Let's Encrypt (gratuit)
   - Configuration auto-renew
   - Redirection HTTP → HTTPS

3. **Webhook Stripe**
   - Vérification de signature activée
   - HTTPS obligatoire
   - IP whitelist si possible

4. **Monitoring**
   - PM2 logs activé
   - Nginx logs accessibles
   - Auto-restart configuré

---

## 🚀 Étapes de déploiement (résumé)

### Phase 1: Local (avant serveur)
```bash
npm install
npm test  # Si disponible
node server/index.js
# Vérifier que tout fonctionne
```

### Phase 2: Serveur
```bash
# Connexion SSH
ssh user@domaine.fr

# Copier le code
git clone [repo] /home/yassauto-app

# Configurer
cp .env.production.template .env
nano .env  # Remplir les vraies valeurs

# Installer & lancer
npm install --production
pm2 start server/index.js --name yassauto-api
```

### Phase 3: Stripe
```bash
# Dashboard Stripe
1. Créer webhook: https://api.yassauto.fr/webhook/stripe
2. Copier Signing Secret
3. Mettre à jour .env: STRIPE_WEBHOOK_SECRET=whsec_xxx
4. Redémarrer: pm2 restart yassauto-api
```

### Phase 4: Tests
```bash
# Faire un paiement test
# Vérifier : réservation créée + 2 emails reçus
# ✅ Go live!
```

---

## 📞 Commandes importantes à connaître

### Monitoring
```bash
pm2 status           # État du serveur
pm2 logs yassauto-api    # Voir les logs
pm2 monit            # Ressources (CPU, mémoire)
```

### Maintenance
```bash
pm2 restart yassauto-api # Redémarrer
pm2 stop yassauto-api    # Arrêter
pm2 start yassauto-api   # Relancer
```

### Vérifications
```bash
curl -I http://localhost:4000/health      # Local
curl -I https://api.yassauto.fr/health    # Public
netstat -tulpn | grep 4000                # Port Node
sudo nginx -t                             # Test Nginx
```

---

## ❓ FAQ rapide

**Q: Quel est le domaine par défaut?**  
A: `api.yassauto.fr` - adapter si besoin dans `nginx-config.example`

**Q: Que se passe-t-il si le serveur crash?**  
A: PM2 le relance automatiquement (si `pm2 startup` configuré)

**Q: Où sont stockées les réservations?**  
A: Dans `server/reservations.json` sur le serveur

**Q: Comment éditer les emails?**  
A: Dans `server/index.js`, fonctions `clientMailOptions()` et `adminMailOptions()`

**Q: Peut-on modifier le montant du paiement?**  
A: Oui, chercher `amount: 2000` (en centimes) dans `server/index.js`

**Q: Le certificat SSL expire tous les 90 jours?**  
A: Non, Let's Encrypt dure 90 jours mais renouvellement auto configuré en cron

**Q: Comment les clients reçoivent le lien de réservation?**  
A: Par email après paiement réussi (email dans le formulaire)

**Q: Peut-on avoir plusieurs domaines?**  
A: Oui, créer un webhook Stripe pour chaque domaine

---

## 📊 Ressources supplémentaires

### Documentation officielle
- [Stripe Docs](https://stripe.com/docs)
- [Node.js Docs](https://nodejs.org/docs/)
- [PM2 Docs](https://pm2.keymetrics.io/docs/)
- [Nginx Docs](https://nginx.org/en/docs/)

### Outils utiles
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Let's Encrypt](https://letsencrypt.org/)
- [IONOS Control Panel](https://www.ionos.fr/)
- [Certbot](https://certbot.eff.org/)

---

## 🎓 Différents profils d'utilisation

### Pour le **Développeur** 👨‍💻
1. Lire `DEPLOYMENT_IONOS.md` section par section
2. Adapter `nginx-config.example` à votre contexte
3. Exécuter `setup-ionos.sh` ou configuration manuelle
4. Tester en local d'abord

### Pour l'**Admin Serveur** 👨‍💼
1. Consulter checklist `DEPLOYMENT_CHECKLIST.md`
2. Exécuter le script `setup-ionos.sh`
3. Savoir utiliser `pm2 logs` et `pm2 monit`
4. Garder `TROUBLESHOOTING.md` à portée

### Pour le **Project Manager** 📋
1. Lire `DEPLOYMENT_SUMMARY.md` pour la vue générale
2. Utiliser `DEPLOYMENT_CHECKLIST.md` pour suivre la progression
3. Connaître les étapes : code → test → deploy → verify

### Pour l'**Équipe Support** 🆘
1. Apprendre les commandes PM2
2. Consulter `TROUBLESHOOTING.md` en cas de problème
3. Savoir qu'il y a des logs dans `pm2 logs yassauto-api`

---

## 🎉 Vous êtes prêt!

Tous les documents et scripts nécessaires sont en place.

**Prochaine étape :**
1. Choisir votre approche (script automatisé vs manuel)
2. Imprimer ou ouvrir `DEPLOYMENT_CHECKLIST.md`
3. Commencer le déploiement!

Bon déploiement! 🚀

---

**Questions fréquentes?** → Consulter `TROUBLESHOOTING.md`  
**En doute?** → Vérifier `DEPLOYMENT_CHECKLIST.md`  
**Besoin d'aide?** → Relire `DEPLOYMENT_IONOS.md` section pertinente  

Bonne chance! 🍀
