# 📋 Post-Déploiement - Checklist Opérationnelle

Félicitations! Votre backend YassAuto est maintenant en production! 🎉

Voici la checklist pour les premiers jours et semaines.

---

## 🌅 J+1 - Jours suivant le déploiement

### Matin
- [ ] Vérifier que le serveur est en ligne
  ```bash
  pm2 status
  curl -I https://api.yassauto.fr/health
  ```
- [ ] Consulter les logs
  ```bash
  pm2 logs yassauto-api --lines 100
  ```
- [ ] Vérifier qu'aucune erreur n'apparaît
- [ ] Tester un paiement test (si Stripe en test mode)

### Midi
- [ ] Recevoir le feedback des utilisateurs
- [ ] Vérifier les emails reçus (format, contenu)
- [ ] Vérifier que les réservations sont bien stockées
  ```bash
  cat server/reservations.json | jq '.'
  ```

### Soir
- [ ] Archiver les logs: `pm2 save`
- [ ] Vérifier les metrics dans Stripe Dashboard
- [ ] Vérifier les certificats SSL
  ```bash
  sudo certbot certificates
  ```

---

## 📅 Semaine 1 - Configuration Fine-tuning

### À faire
- [ ] **Personnaliser les emails**
  - Éditer les templates dans `server/index.js`
  - Tester en redeployant: `pm2 restart yassauto-api`
  - Envoyer un test: `curl -X POST https://api.yassauto.fr/booking/send-email`

- [ ] **Monitorer les paiements**
  - Consulter Stripe Dashboard régulièrement
  - Noter les patterns de paiement
  - Identifier les problèmes récurrents

- [ ] **Surveiller les réservations**
  - Vérifier que le JSON grandit: `wc -l server/reservations.json`
  - Faire des backups réguliers
  - Exporter les données pour analyse

- [ ] **Optimiser les logs**
  - Mettre en place une rotation de logs
  - Configurer des alertes sur erreurs critiques

### À documenter
- [ ] Procédure de sauvegarde du JSON
- [ ] Contacts d'escalade
- [ ] Métriques normales de performance

---

## 📊 Semaine 2-4 - Stabilisation

### Performance
- [ ] Vérifier la charge du serveur
  ```bash
  pm2 monit
  top
  ```
- [ ] Vérifier les temps de réponse
  ```bash
  curl -w "@curl-format.txt" https://api.yassauto.fr/health
  ```
- [ ] Identifier les slowdowns potentiels

### Fiabilité
- [ ] Relancer le serveur pour tester le redémarrage auto
  ```bash
  pm2 restart yassauto-api
  # Vérifier qu'il redémarre sans intervention
  ```
- [ ] Tester la recuperation après erreur
- [ ] Vérifier qu'aucun paiement n'est perdu

### Sécurité
- [ ] Vérifier les logs de Nginx pour attaques
  ```bash
  sudo tail -100 /var/log/nginx/yassauto-api-error.log | grep -i error
  ```
- [ ] Vérifier les accès SSH
- [ ] Tester le renouvellement auto du certificat SSL

---

## 🔄 Maintenance Régulière (Mensuelle)

### Check-list mensuelle
- [ ] `pm2 status` - Tous les processus en ligne?
- [ ] `pm2 logs` - Pas d'erreurs acumulées?
- [ ] Stripe Dashboard - Tous les paiements OK?
- [ ] Certificat SSL - Expire dans combien de temps?
  ```bash
  sudo certbot certificates
  ```
- [ ] Espace disque
  ```bash
  df -h
  ```
- [ ] Backups effectués?

### Nettoyage mensuel
```bash
# Archiver les vieux logs
pm2 logs yassauto-api > logs-$(date +%Y-%m).txt
pm2 flush

# Vérifier le certificat
sudo certbot renew --dry-run

# Backup des réservations
cp server/reservations.json backups/reservations-$(date +%Y-%m-%d).json
```

---

## 🚨 Problèmes à surveiller

### Les signaux d'alerte
- ⚠️ `pm2 status` montre "stopped" → Le serveur a crashé
- ⚠️ `pm2 logs` montre "ENOENT" → Fichier manquant
- ⚠️ `pm2 logs` montre "EADDRINUSE" → Port déjà utilisé
- ⚠️ Paiements retardés → Webhook ne se déclenche pas
- ⚠️ Emails non reçus → Problème SMTP
- ⚠️ Certificat expiré → HTTPS en erreur
- ⚠️ Espace disque plein → Serveur ralenti

Si l'un de ces signaux apparaît:
1. Consulter `TROUBLESHOOTING.md`
2. Exécuter les diagnostics correspondants
3. Appliquer la solution

---

## 📞 Process d'escalade

### Niveau 1: Self-service
- Vérifier `pm2 logs`
- Vérifier `pm2 status`
- Consulter `TROUBLESHOOTING.md`

### Niveau 2: Restart
```bash
pm2 restart yassauto-api
pm2 logs yassauto-api --lines 50
```

### Niveau 3: Investigation
- Lire l'erreur complète dans les logs
- Vérifier les variables d'env: `cat .env`
- Tester manuellement: `curl -I https://api.yassauto.fr/health`

### Niveau 4: Escalade
- Problème persistant après redémarrage
- Contacter support/devops
- Avoir les logs prêts: `pm2 logs > logs.txt`

---

## 📈 Métriques à tracker

Mettre en place un système pour tracker:

### Performance
- Temps de réponse moyen
- Nombre de requêtes par jour
- Nombre de paiements par jour
- Taux de succès des paiements

### Erreurs
- Nombre d'erreurs par jour
- Types d'erreurs les plus fréquentes
- Taux de recovery

### Disponibilité
- Uptime du serveur (%)
- Temps de downtime
- Causes du downtime

---

## 🔄 Mises à jour & Dépannage

### Avant toute mise à jour
```bash
# Backup
cp server/reservations.json backups/reservations-before-update.json

# Stop
pm2 stop yassauto-api
```

### Mise à jour du code
```bash
cd /home/yassauto-app
git pull  # Ou copier les nouveaux fichiers
npm install --production
pm2 start yassauto-api
```

### Test post-update
```bash
pm2 logs yassauto-api
curl -I https://api.yassauto.fr/health
# Faire un paiement test
```

---

## 📚 Documentation à maintenir

### À jour
- [ ] `.env` (si changements)
- [ ] Contact de support
- [ ] Procédures de backup
- [ ] Procédures d'escalade

### À archiver
- [ ] Logs mensuels
- [ ] Métriques de performance
- [ ] Liste des incidents

---

## 🎯 Checklist finale

Une fois stable (semaine 2):

- [ ] Serveur en production 24/7 sans problème
- [ ] Tous les paiements traités correctement
- [ ] Tous les emails envoyés et reçus
- [ ] Réservations bien stockées
- [ ] Logs clean (pas d'erreurs répétitives)
- [ ] Certificat SSL valide
- [ ] Backups en place
- [ ] Équipe formée aux commandes de base
- [ ] Support disponible en cas de problème

---

## 📞 Support continu

### Qui contacter pour quoi?

**Admin Système:**
- Accès serveur SSH
- Configuration Nginx
- Certificat SSL
- Espace disque

**Dev Backend:**
- Changement de templates email
- Logique de paiement
- Connexion Stripe
- Emails

**Stripe Support:**
- Problèmes de paiement
- Configuration webhook
- Questions légales/taxes

---

## 🎉 Bravo!

Vous êtes maintenant en production avec un système professionnel.

Continuez à monitorer, maintenir et d'améliorer!

---

**Derniers conseils:**

✅ Consulter les logs régulièrement  
✅ Faire des backups réguliers  
✅ Monitorer les paiements Stripe  
✅ Rester à jour avec les notifications Let's Encrypt  
✅ Garder une documentation à jour  

Bon travail! 🚀
