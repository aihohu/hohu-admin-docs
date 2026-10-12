---
title: 域名、代理与 HTTPS
description: 为 HoHu 应用配置宿主机或内置 Nginx，使用 Cloudflare Origin CA 或 Certbot，并验证上传、指标边界和 AI 流式响应。
---

# 域名、代理与 HTTPS

本页使用 `app.example.com` 作为你的应用域名示例。先完成[CLI 部署](../deploy)，再选择负责 TLS 的代理。

## 选择代理位置

| 方式           | 部署设置                                             | 证书位置                 |
| -------------- | ---------------------------------------------------- | ------------------------ |
| 宿主机 Nginx   | ENABLE_NGINX=false，WEB_PORT / API_PORT 绑定回环地址 | 宿主机 Nginx 可读目录    |
| CLI 内置 Nginx | ENABLE_NGINX=true，确认 80/443 未冲突                | SSL_CERT_PATH 挂载的目录 |

以下完整示例适用于 **同一 Ubuntu 主机上的 Nginx 服务**。两个应用端口分别为 127.0.0.1:8080 和 127.0.0.1:8000。不要把宿主机回环地址直接复制到另一个 Nginx 容器。

## 1. 配置应用转发

将下面内容保存为示例路径 `/etc/nginx/snippets/hohu-proxy.conf`，由站点 server 引用。默认 Web 请求以 `/api/` 为前缀，proxy_pass 末尾的 `/` 会去掉该前缀。

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

105906176 是默认 100 MiB 文件硬上限加 1 MiB 请求开销。修改 UPLOAD_HARD_MAX_BYTES 后，对照 CLI 生成的 UPLOAD_REQUEST_MAX_BYTES 更新外层代理。公开图片仍由后端判定能否读取，不使用 alias 直接暴露存储目录。

AI 接口经 `/api/` 转发到后端，关闭缓冲以支持 SSE。若前面还有 CDN 或其他代理，也需要验证流式输出及连接超时。真实客户端 IP 只从受信代理恢复，不直接信任访客自带的转发头。

## 2. 启用站点配置

将下方所选方案的 server 配置保存为 `/etc/nginx/sites-available/hohu.conf`，替换示例域名和证书路径。Ubuntu 默认 Nginx 使用 sites-enabled 加载站点，首次创建链接：

```bash
sudo ln -s /etc/nginx/sites-available/hohu.conf /etc/nginx/sites-enabled/hohu.conf
```

已有链接时直接修改原文件；采用自定义 Nginx 目录结构时，确认主配置实际 include 了站点文件。选择以下一种证书方案，不要为同一域名重复启用两份 server 配置。

## 2A. Cloudflare Origin CA

适合域名持续启用 Cloudflare 代理的站点。浏览器到 Cloudflare 使用边缘证书，Cloudflare 到源站仍需要 TLS；选择 Full (strict)，不能用边缘 HTTPS 替代源站加密。[Cloudflare 模式说明](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)。

1. 在 Cloudflare 的 SSL/TLS → Origin Server 创建覆盖应用域名的证书。
2. 将 PEM 证书和私钥分别保存到下例路径，限制私钥读取权限。
3. 配置 443 并确认 Nginx 能加载证书，再启用 Full (strict)，检查经过代理的域名访问。

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

Origin CA 不需要 Certbot 管理，但仍需记录到期日和更换证书。关闭 Cloudflare 代理后，浏览器通常不会信任该源站证书；此时应改用公开信任的证书。步骤和限制见 [Origin CA 官方说明](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/)。

## 2B. Let's Encrypt / Certbot

适合直接访问源站，或希望证书同样可供浏览器直接验证的部署。保留前面的转发文件，先创建 HTTP 站点：

```nginx
server {
    listen 80;
    server_name app.example.com;
    include /etc/nginx/snippets/hohu-proxy.conf;
}
```

按 [Certbot 官方安装说明](https://certbot.eff.org/instructions)安装 Certbot 与 Nginx 插件。确认 DNS 指向正确服务器、80 端口可完成验证，且 Nginx 配置有效后执行：

```bash
sudo nginx -t
sudo certbot --nginx -d app.example.com
sudo certbot renew --dry-run
```

Certbot 会按交互选项签发并配置证书。检查安装方式提供的自动续期任务，以及续期后的 Nginx reload。DNS/CDN 或验证路径受限时，按官方文档选择匹配的验证方式，不通过忽略证书校验解决。参阅 [Certbot 使用说明](https://eff-certbot.readthedocs.io/en/stable/using.html#nginx)。

## 使用 CLI 内置 Nginx

设置 ENABLE_NGINX=true，将有效证书保存为 SSL_CERT_PATH 目录中的 `fullchain.pem`、`privkey.pem`，再设置 ENABLE_SSL=true 并运行 `hohu deploy`。相对路径以部署配置目录为基准。只有 DOMAIN 不会自动签发证书。

证书更新后需验证挂载文件和 Nginx 重新加载。使用 Let's Encrypt 符号链接证书时，确保容器同时能访问真实证书链文件；不能只挂载失去链接目标的 live 子目录。模板存在 Certbot 服务不等于签发、挂载和 reload 已配置完成。

## 上线验证

运行 `sudo nginx -t`，成功后再 `sudo systemctl reload nginx`。检查域名证书、登录、图片上传、私有文件鉴权、AI 流式回答以及公网无法读取指标。仅检查首页返回 200 不足以完成验收。
