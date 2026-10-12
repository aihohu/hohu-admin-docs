---
title: Domains, proxying, and HTTPS
description: Configure host or bundled Nginx for HoHu with Cloudflare Origin CA or Certbot, and verify uploads, metrics boundaries, and AI streaming.
---

# Domains, proxying, and HTTPS

This page uses `app.example.com` for your application domain. Complete [CLI deployment](../deploy), then choose the TLS proxy.

## Choose the proxy location

| Option        | Deployment settings                              | Certificates                            |
| ------------- | ------------------------------------------------ | --------------------------------------- |
| Host Nginx    | ENABLE_NGINX=false; loopback WEB_PORT / API_PORT | Directory readable by host Nginx        |
| Bundled Nginx | ENABLE_NGINX=true; no 80/443 conflicts           | Directory mounted through SSL_CERT_PATH |

The complete example below uses **Nginx on the same Ubuntu host**, with application ports 127.0.0.1:8080 and 127.0.0.1:8000. Do not copy host loopback addresses into a separate Nginx container.

## 1. Configure application forwarding

Save this as `/etc/nginx/snippets/hohu-proxy.conf` and include it from the site server. Default Web requests use `/api/`; the trailing slash in proxy_pass removes that prefix.

```nginx
client_max_body_size 105906176;

location = /metrics { return 404; }
location = /api/metrics { return 404; }
location ^~ /private_uploads/ { return 404; }

location /api/ {
    proxy_pass http://127.0.0.1:8000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_read_timeout 300s;
}

location /uploads/ {
    proxy_pass http://127.0.0.1:8000/uploads/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

105906176 represents the default 100 MiB file ceiling plus 1 MiB request overhead. After changing UPLOAD_HARD_MAX_BYTES, align the outer proxy with CLI-generated UPLOAD_REQUEST_MAX_BYTES. Let the backend authorize public-image reads; do not expose storage with a direct alias.

AI requests pass through `/api/` with buffering disabled for SSE. Verify streaming and timeouts through any CDN or additional proxy too. Restore client IPs only through trusted proxies, not visitor-supplied forwarding headers.

## 2. Enable the site

Save the server configuration for your chosen option below as `/etc/nginx/sites-available/hohu.conf`, replacing the example domain and certificate paths. Default Ubuntu Nginx loads sites-enabled; create the link once:

```bash
sudo ln -s /etc/nginx/sites-available/hohu.conf /etc/nginx/sites-enabled/hohu.conf
```

If the link already exists, edit its source file. With a custom Nginx directory layout, verify that the main configuration includes the site file. Choose one certificate option below; do not enable duplicate server configurations for the same domain.

## 2A. Cloudflare Origin CA

Use this when the domain stays proxied through Cloudflare. Edge HTTPS protects browser-to-Cloudflare traffic; the origin still needs TLS. Select Full (strict). See [Cloudflare encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).

1. Create a certificate covering the application domain under SSL/TLS → Origin Server.
2. Save the PEM certificate and private key at the example paths, restricting key access.
3. Configure port 443, verify certificate loading, then enable Full (strict) and test the proxied domain.

```nginx
server {
    listen 80;
    server_name app.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name app.example.com;
    ssl_certificate /etc/nginx/certs/hohu/origin.pem;
    ssl_certificate_key /etc/nginx/certs/hohu/origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    include /etc/nginx/snippets/hohu-proxy.conf;
}
```

Origin CA needs no Certbot management, but track expiry and replacement. Browsers generally do not trust this certificate when Cloudflare proxying is disabled; use a publicly trusted certificate for direct access. See [Origin CA instructions](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/).

## 2B. Let's Encrypt / Certbot

Use a publicly trusted certificate for direct origin access or browser-verifiable origin TLS. Keep the forwarding snippet and start with an HTTP site:

```nginx
server {
    listen 80;
    server_name app.example.com;
    include /etc/nginx/snippets/hohu-proxy.conf;
}
```

Install Certbot and its Nginx plugin using the [official instructions](https://certbot.eff.org/instructions). Verify DNS, port 80 validation, and Nginx configuration, then run:

```bash
sudo nginx -t
sudo certbot --nginx -d app.example.com
sudo certbot renew --dry-run
```

Certbot obtains and configures certificates according to your interactive choices. Verify the installation's renewal task and Nginx reload after renewal. If DNS/CDN rules or validation paths interfere, choose a suitable documented challenge method rather than disabling certificate validation. See the [Certbot guide](https://eff-certbot.readthedocs.io/en/stable/using.html#nginx).

## Bundled Nginx

Set ENABLE_NGINX=true, place valid `fullchain.pem` and `privkey.pem` files in SSL_CERT_PATH, then set ENABLE_SSL=true and run `hohu deploy`. Relative paths resolve against the deployment directory. DOMAIN alone does not obtain a certificate.

After replacement, verify mounted files and Nginx reload. For Let's Encrypt symlinks, ensure the container can access the real certificate files too; mounting only a live directory can break targets. A Certbot template service does not mean issuance, mounting, and reload are fully configured.

## Launch verification

Run `sudo nginx -t`, then `sudo systemctl reload nginx` after it succeeds. Check domain certificates, sign-in, image uploads, private-file authorization, AI streaming, and blocked public metrics. A homepage 200 response is not sufficient validation.
