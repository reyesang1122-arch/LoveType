# Deploying LoveType to Vultr (lovetype.smartflowaimalaysia.com)

Server: `45.76.177.248` · Domain: `lovetype.smartflowaimalaysia.com` · Stack: Next.js + nginx + Let's Encrypt

## 0. Prerequisites (must be done first)

1. **DNS** — in Cloudflare, add an **A record**: `lovetype` → `45.76.177.248`.
   For the initial SSL issuance set it to **DNS only (grey cloud)**. After HTTPS works
   you may switch it back to **Proxied (orange)** with SSL mode **Full (strict)**.
   > Right now the domain points at Cloudflare, not the server, so certbot will fail
   > until this A record exists and resolves to 45.76.177.248.
2. **SSH access** to the server (root password or an SSH key).

## 1. Upload the project to the server

From your Windows machine (Git Bash / PowerShell), from the project root:

```bash
# create app dir on server
ssh root@45.76.177.248 'mkdir -p /var/www/lovetype'

# sync source (excludes node_modules/.next/.git)
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  ./ root@45.76.177.248:/var/www/lovetype/

# copy the production env (kept out of the normal sync)
scp deploy/.env.production root@45.76.177.248:/var/www/lovetype/.env.production
```

(No rsync on Windows? Use `scp -r` of a zipped build, or push to GitHub and `git clone` on the server.)

## 2. Run the one-shot deploy on the server

```bash
ssh root@45.76.177.248
cd /var/www/lovetype
sudo bash deploy/deploy.sh
```

This installs Node 20, nginx, certbot; builds the app; registers the `lovetype`
systemd service on port 3000; configures nginx; opens the firewall; and issues HTTPS.

## 3. Verify

```bash
systemctl status lovetype      # app running?
curl -I https://lovetype.smartflowaimalaysia.com
```

Visit: https://lovetype.smartflowaimalaysia.com
Dashboard: https://lovetype.smartflowaimalaysia.com/feedback  (password: FEEDBACK_PASSWORD)

## Updating later

```bash
rsync -az --exclude node_modules --exclude .next --exclude .git ./ root@45.76.177.248:/var/www/lovetype/
ssh root@45.76.177.248 'cd /var/www/lovetype && npm ci && npm run build && systemctl restart lovetype'
```

## Database (Supabase) — one-time

Run `supabase/schema.sql` once. Either:
- **Dashboard:** Supabase → SQL Editor → paste `supabase/schema.sql` → Run, **or**
- **Script:** `DATABASE_URL="postgresql://postgres:<DB_PASSWORD>@db.nbostqkgulskntvmkrgs.supabase.co:5432/postgres" node scripts/run-sql.mjs` (needs `npm i pg`).
