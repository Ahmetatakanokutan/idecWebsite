# IDEC-TT & KYDDTR Deployment Guide (Production V2)

This guide details how to deploy the secure, production-ready version of the application to your server for `https://www.kyddtr.com`.

## 1. Prerequisites (On Server)

Ensure you have the following installed on your Ubuntu server:
*   Java 17+ (`sudo apt install openjdk-17-jdk`)
*   Node.js 18+ & npm
*   Nginx
*   PostgreSQL

## 2. Backend Configuration

We have externalized all sensitive data. You must set these as Environment Variables in your systemd service file.

### Update Systemd Service

Edit your service file:
```bash
sudo nano /etc/systemd/system/idectt-backend.service
```

Add the `Environment` lines under `[Service]`:

```ini
[Unit]
Description=IDEC-TT Backend Service
After=syslog.target network.target postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/idecWebsite/backend/IdecTTBackend
ExecStart=/usr/bin/java -jar target/IdecTTBackend-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

# PRODUCTION CONFIGURATION
Environment="DB_URL=jdbc:postgresql://localhost:5432/idecttDb"
Environment="DB_USERNAME=postgres"
Environment="DB_PASSWORD=YOUR_STRONG_DB_PASSWORD"
Environment="JWT_SECRET=YOUR_VERY_LONG_AND_RANDOM_SECRET_KEY_MIN_64_CHARS"
Environment="CORS_ALLOWED_ORIGINS=https://www.kyddtr.com,https://kyddtr.com,http://localhost:5173"
Environment="DDL_AUTO=update" 
# Note: In a real banking app, DDL_AUTO should be 'validate' and use Flyway/Liquibase. 
# Keep 'update' only if you don't have migration scripts yet.

[Install]
WantedBy=multi-user.target
```

**Reload and Restart:**
```bash
sudo systemctl daemon-reload
sudo systemctl restart idectt-backend
```

## 3. Frontend Build

1.  Navigate to project root: `cd /home/ubuntu/idecWebsite`
2.  Install dependencies: `npm install`
3.  Build for production: `npm run build`

This will generate the `dist` folder.

## 4. Nginx Configuration (SSL & Domain)

Create a new config for your domain:

```bash
sudo nano /etc/nginx/sites-available/kyddtr
```

Paste the following:

```nginx
server {
    server_name kyddtr.com www.kyddtr.com;

    root /home/ubuntu/idecWebsite/dist;
    index index.html;

    # Frontend (React)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Prevent access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/kyddtr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. SSL Certificate (HTTPS)

Secure your site with Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d kyddtr.com -d www.kyddtr.com
```

Follow the prompts. Certbot will automatically update your Nginx config to force HTTPS.

## 6. Admin User Setup

After deployment, log in with your existing admin account.
Go to `/admin/users`. You can now:
*   Edit any user's Email, Phone, and Name.
*   Reset user passwords.
*   Manually set "Email Verified" status.
*   Assign/Remove Roles (USER, COMPANY, ADMIN).

## Security Checklist
- [ ] Database password is strong and set in systemd file.
- [ ] JWT Secret is long, random, and set in systemd file.
- [ ] Firewall (UFW) blocks port 8080 from outside (only Nginx can talk to it).
- [ ] SSL is enabled via Certbot.
