#!/usr/bin/env bash
# ===========================================================================
# LoveType one-shot deploy for Ubuntu (Vultr).
# Run this ON THE SERVER, from inside the synced project dir (/var/www/lovetype).
#   sudo bash deploy/deploy.sh
# ===========================================================================
set -euo pipefail

DOMAIN="lovetype.smartflowaimalaysia.com"
APP_DIR="/var/www/lovetype"
EMAIL="admin@smartflowaimalaysia.com"   # for Let's Encrypt expiry notices

echo "==> 1/6 System packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates nginx ufw

echo "==> 2/6 Node.js 20 (if missing)"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v && npm -v

echo "==> 3/6 Build app"
cd "$APP_DIR"
# .env.production must already be present here
test -f .env.production || { echo "!! .env.production missing in $APP_DIR"; exit 1; }
npm ci
npm run build

echo "==> 4/6 systemd service"
cp deploy/lovetype.service /etc/systemd/system/lovetype.service
systemctl daemon-reload
systemctl enable lovetype
systemctl restart lovetype
sleep 3
systemctl --no-pager status lovetype | head -8 || true

echo "==> 5/6 nginx"
cp deploy/nginx-lovetype.conf /etc/nginx/sites-available/lovetype
ln -sf /etc/nginx/sites-available/lovetype /etc/nginx/sites-enabled/lovetype
rm -f /etc/nginx/sites-enabled/default
mkdir -p /var/www/html
nginx -t
systemctl reload nginx

echo "==> 6/6 Firewall + HTTPS"
ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true
yes | ufw enable || true
apt-get install -y certbot python3-certbot-nginx
# NOTE: the domain's A record must point to THIS server (DNS-only / grey cloud in
# Cloudflare) for the HTTP-01 challenge to succeed.
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect || \
  echo "!! certbot failed — check that $DOMAIN resolves to this server (Cloudflare DNS-only), then re-run: certbot --nginx -d $DOMAIN"
systemctl reload nginx

echo "============================================================"
echo " Done. App service: systemctl status lovetype"
echo " Visit: https://$DOMAIN"
echo "============================================================"
