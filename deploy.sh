#!/bin/bash
# deploy.sh - Script de déploiement rapide sur IONOS
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "================================"
echo "🚀 Déploiement YassAuto Backend"
echo "================================"

# Vérifier que .env existe
if [ ! -f .env ]; then
    echo "❌ Erreur: fichier .env non trouvé"
    echo "   Créer le fichier .env avec le contenu de .env.production.template"
    exit 1
fi

# Vérifier que Node est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo ""
echo "1️⃣  Arrêt du serveur actuel..."
pm2 stop yassauto-api 2>/dev/null || echo "   (Serveur pas encore actif)"

echo ""
echo "2️⃣  Installation des dépendances..."
npm install --production

echo ""
echo "3️⃣  Vérification de la configuration .env..."
if grep -q "YOUR_" .env; then
    echo "⚠️  ATTENTION: Valeurs par défaut détectées dans .env"
    echo "   Veuillez remplacer les valeurs xxx_HERE"
    exit 1
fi

echo ""
echo "4️⃣  Lancement du serveur avec PM2..."
if pm2 list | grep -q "yassauto-api"; then
    pm2 restart yassauto-api
else
    pm2 start server/index.js --name yassauto-api
    pm2 save
    pm2 startup
fi

echo ""
echo "5️⃣  Vérification du port 4000..."
sleep 2
if netstat -tulpn 2>/dev/null | grep -q ":4000 "; then
    echo "✅ Serveur actif sur le port 4000"
else
    echo "⚠️  Port 4000 ne semble pas actif"
    echo "   Vérifier: pm2 logs yassauto-api"
fi

echo ""
echo "6️⃣  Vérification du health check..."
HEALTH_CHECK=$(curl -s http://localhost:4000/health || echo "fail")
if echo "$HEALTH_CHECK" | grep -q "ok"; then
    echo "✅ Health check réussi"
else
    echo "⚠️  Health check échoué"
    echo "   Réponse: $HEALTH_CHECK"
    echo "   Vérifier: pm2 logs yassauto-api"
fi

echo ""
echo "================================"
echo "✅ Déploiement terminé!"
echo "================================"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Vérifier les logs: pm2 logs yassauto-api"
echo "  2. Tester le webhook Stripe"
echo "  3. Faire un test de paiement"
echo ""
echo "💡 Commandes utiles:"
echo "  - pm2 status"
echo "  - pm2 restart yassauto-api"
echo "  - pm2 logs yassauto-api"
echo "  - pm2 monit"
