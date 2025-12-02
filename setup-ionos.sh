#!/bin/bash
# setup-ionos.sh - Configuration automatisée pour IONOS
# Usage: sudo bash setup-ionos.sh
#
# Ce script automatise:
# 1. Installation des dépendances
# 2. Configuration Nginx
# 3. Configuration PM2
# 4. Setup SSL Let's Encrypt
#
# PREREQUIS:
# - Accès SSH au serveur IONOS
# - Droits sudo
# - Node.js 18+ déjà installé

set -e  # Arrêter en cas d'erreur

echo "=================================================="
echo "🚀 Configuration YassAuto Backend - IONOS"
echo "=================================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="api.yassauto.fr"
APP_PATH="/home/yassauto-app"
APP_NAME="yassauto-api"
APP_PORT="4000"

# Vérifier que le script est exécuté en sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Ce script doit être exécuté en tant que root (sudo)${NC}"
   exit 1
fi

# Fonction pour afficher les messages
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

echo ""
read -p "Entrer le domaine pour le certificat SSL [api.yassauto.fr]: " domain_input
DOMAIN="${domain_input:-api.yassauto.fr}"

read -p "Entrer le chemin de l'app [/home/yassauto-app]: " path_input
APP_PATH="${path_input:-/home/yassauto-app}"

echo ""
log_info "Configuration:"
echo "  Domaine: $DOMAIN"
echo "  Chemin app: $APP_PATH"
echo "  Port: $APP_PORT"
echo ""

read -p "Continuer? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# ===== 1. MISES À JOUR SYSTÈME =====
echo ""
echo "1️⃣  Mise à jour du système..."
apt-get update
apt-get upgrade -y
log_success "Système mis à jour"

# ===== 2. INSTALLATION DES DÉPENDANCES =====
echo ""
echo "2️⃣  Installation des dépendances..."

# Nginx
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
    log_success "Nginx installé"
else
    log_info "Nginx déjà installé"
fi

# Certbot
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
    log_success "Certbot installé"
else
    log_info "Certbot déjà installé"
fi

# PM2 global
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    log_success "PM2 installé globalement"
else
    log_info "PM2 déjà installé"
fi

# ===== 3. PRÉPARATION DOSSIER =====
echo ""
echo "3️⃣  Préparation des dossiers..."

if [ ! -d "$APP_PATH" ]; then
    log_error "Le dossier $APP_PATH n'existe pas!"
    echo "   Copier le code de l'application d'abord"
    exit 1
fi

# Permissions
chmod 755 "$APP_PATH"
log_success "Dossier préparé: $APP_PATH"

# ===== 4. NPM INSTALL =====
echo ""
echo "4️⃣  Installation des dépendances npm..."

cd "$APP_PATH"
npm install --production
log_success "Dépendances npm installées"

# ===== 5. VÉRIFIER .ENV =====
echo ""
echo "5️⃣  Vérification du fichier .env..."

if [ ! -f "$APP_PATH/.env" ]; then
    log_error ".env n'existe pas!"
    echo "   Créer $APP_PATH/.env avec le contenu de .env.production.template"
    echo "   Puis relancer ce script"
    exit 1
fi

# Vérifier que .env n'a pas les valeurs par défaut
if grep -q "YOUR_" "$APP_PATH/.env"; then
    log_error ".env contient des valeurs par défaut (YOUR_xxx)"
    echo "   Mettre à jour les valeurs dans $APP_PATH/.env"
    exit 1
fi

chmod 600 "$APP_PATH/.env"
log_success ".env trouvé et sécurisé"

# ===== 6. CONFIGURATION SSL =====
echo ""
echo "6️⃣  Configuration du certificat SSL..."

# Vérifier si le certificat existe déjà
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    log_info "Certificat SSL existe déjà pour $DOMAIN"
else
    log_info "Génération du certificat SSL pour $DOMAIN..."
    log_info "(Assurer que $DOMAIN pointe vers ce serveur)"
    sleep 2
    
    certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN
    log_success "Certificat SSL généré"
fi

# ===== 7. CONFIGURATION NGINX =====
echo ""
echo "7️⃣  Configuration de Nginx..."

# Créer la configuration Nginx
cat > /etc/nginx/sites-available/$APP_NAME << EOF
upstream yassauto_backend {
    server localhost:$APP_PORT;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5:!3DES;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    client_max_body_size 10M;

    location / {
        proxy_pass http://yassauto_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /webhook/stripe {
        proxy_pass http://yassauto_backend;
        proxy_request_buffering off;
        client_max_body_size 0;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
log_success "Nginx configuré"

# ===== 8. CONFIGURATION PM2 =====
echo ""
echo "8️⃣  Configuration de PM2..."

cd "$APP_PATH"

# Arrêter l'app si elle existe
pm2 delete "$APP_NAME" 2>/dev/null || true

# Démarrer l'app
pm2 start server/index.js --name "$APP_NAME"
pm2 save
pm2 startup
log_success "PM2 configuré"

# ===== 9. SETUP AUTO-RENEW SSL =====
echo ""
echo "9️⃣  Configuration du renouvellement automatique SSL..."

# Ajouter cron pour renouvellement SSL
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "0 0 1 * * certbot renew --quiet && systemctl reload nginx") | crontab -
log_success "Renouvellement SSL configuré"

# ===== 10. VÉRIFICATIONS =====
echo ""
echo "🔟 Vérifications..."

# Vérifier que Node écoute
sleep 2
if netstat -tulpn | grep -q ":$APP_PORT "; then
    log_success "Node écoute sur le port $APP_PORT"
else
    log_error "Node n'écoute pas sur le port $APP_PORT"
    echo "   Vérifier: pm2 logs $APP_NAME"
fi

# Vérifier que Nginx écoute
if netstat -tulpn | grep -q ":443 "; then
    log_success "Nginx écoute sur le port 443 (HTTPS)"
else
    log_error "Nginx n'écoute pas sur le port 443"
fi

# Test health check
sleep 2
if curl -s http://localhost:$APP_PORT/health | grep -q "ok"; then
    log_success "Health check OK"
else
    log_error "Health check échoué"
fi

# ===== RÉSUMÉ =====
echo ""
echo "=================================================="
echo "✅ Configuration terminée!"
echo "=================================================="
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Créer le webhook Stripe:"
echo "     - URL: https://$DOMAIN/webhook/stripe"
echo "     - Copier le Signing Secret"
echo "     - Mettre à jour .env: STRIPE_WEBHOOK_SECRET=..."
echo "  2. Vérifier les logs: pm2 logs $APP_NAME"
echo "  3. Tester un paiement en production"
echo ""
echo "📞 Commandes utiles:"
echo "  - pm2 status"
echo "  - pm2 logs $APP_NAME"
echo "  - pm2 restart $APP_NAME"
echo "  - curl -I https://$DOMAIN/health"
echo ""
echo "=================================================="
