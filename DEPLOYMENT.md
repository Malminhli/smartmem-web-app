# دليل النشر لمشروع SmartMem

## 🚀 متطلبات النشر

### المتطلبات الأساسية
- Node.js 22 أو أحدث
- npm أو pnpm
- MySQL 8+ أو TiDB
- خادم ويب (Nginx أو Apache)
- شهادة SSL/TLS

### المتطلبات الاختيارية
- Docker و Docker Compose
- CDN لتقديم الملفات الثابتة
- خدمة البريد الإلكتروني
- خدمة الرسائل النصية

## 📋 خطوات النشر

### 1. التحضير

```bash
# استنساخ المشروع
git clone <repository-url>
cd smartmem

# تثبيت المكتبات
pnpm install

# بناء المشروع
pnpm build
```

### 2. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
mysql -u root -p -e "CREATE DATABASE smartmem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# تشغيل الهجرات
pnpm db:push

# إنشاء جداول إضافية
pnpm db:seed
```

### 3. متغيرات البيئة

إنشاء ملف `.env.production`:

```env
# قاعدة البيانات
DATABASE_URL=mysql://user:password@host:3306/smartmem

# المصادقة
JWT_SECRET=your-secret-key-here
OAUTH_SERVER_URL=https://oauth.example.com

# التطبيق
VITE_APP_ID=your-app-id
VITE_APP_TITLE=ذِكر — SmartMem
VITE_APP_LOGO=https://example.com/logo.png
VITE_OAUTH_PORTAL_URL=https://oauth.example.com/portal

# البريد الإلكتروني
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# التخزين
S3_BUCKET=smartmem-storage
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

### 4. بناء الإصدار الإنتاجي

```bash
# بناء الواجهة الأمامية
pnpm build:client

# بناء الخادم
pnpm build:server

# بناء الصورة
pnpm build:docker
```

### 5. نشر الخادم

#### باستخدام PM2

```bash
# تثبيت PM2
npm install -g pm2

# بدء التطبيق
pm2 start dist/server.js --name smartmem

# حفظ الإعدادات
pm2 save

# تشغيل عند بدء النظام
pm2 startup
```

#### باستخدام Docker

```bash
# بناء الصورة
docker build -t smartmem:latest .

# تشغيل الحاوية
docker run -d \
  --name smartmem \
  -p 3000:3000 \
  -e DATABASE_URL=mysql://user:password@db:3306/smartmem \
  -e JWT_SECRET=your-secret \
  smartmem:latest
```

#### باستخدام Docker Compose

```bash
# بدء الخدمات
docker-compose up -d

# عرض السجلات
docker-compose logs -f

# إيقاف الخدمات
docker-compose down
```

### 6. إعداد خادم الويب

#### Nginx

```nginx
server {
    listen 80;
    server_name smartmem.example.com;
    
    # إعادة التوجيه إلى HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smartmem.example.com;
    
    # شهادات SSL
    ssl_certificate /etc/letsencrypt/live/smartmem.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smartmem.example.com/privkey.pem;
    
    # الملفات الثابتة
    location ~* ^/(assets|images|fonts)/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # الواجهة الأمامية
    location / {
        root /var/www/smartmem/client/dist;
        try_files $uri /index.html;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Apache

```apache
<VirtualHost *:443>
    ServerName smartmem.example.com
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/smartmem.example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/smartmem.example.com/privkey.pem
    
    # الملفات الثابتة
    <FilesMatch "^/assets|images|fonts">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    # الواجهة الأمامية
    DocumentRoot /var/www/smartmem/client/dist
    
    <Directory /var/www/smartmem/client/dist>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ /index.html [QSA,L]
    </Directory>
    
    # API
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api
</VirtualHost>
```

### 7. شهادات SSL

```bash
# استخدام Let's Encrypt
sudo certbot certonly --webroot -w /var/www/smartmem/client/dist -d smartmem.example.com

# تجديد تلقائي
sudo systemctl enable certbot.timer
```

## 🔍 التحقق من الصحة

```bash
# فحص الخادم
curl https://smartmem.example.com/api/health

# فحص قاعدة البيانات
pnpm db:check

# فحص الأداء
pnpm perf:test
```

## 📊 المراقبة

### السجلات

```bash
# عرض السجلات
pm2 logs smartmem

# حفظ السجلات
pm2 logs smartmem > logs/smartmem.log
```

### المقاييس

```bash
# استخدام الموارد
pm2 monit

# إحصائيات الخادم
pm2 info smartmem
```

## 🔐 الأمان

### تحديثات الأمان

```bash
# فحص الثغرات
npm audit

# إصلاح الثغرات
npm audit fix
```

### النسخ الاحتياطية

```bash
# نسخ احتياطية يومية
0 2 * * * /usr/local/bin/backup-smartmem.sh

# نسخ احتياطية للبيانات
mysqldump -u root -p smartmem > backup-$(date +%Y%m%d).sql
```

## 🚨 استكشاف الأخطاء

### الخادم لا يستجيب

```bash
# التحقق من الخدمة
pm2 status

# إعادة تشغيل الخدمة
pm2 restart smartmem

# عرض السجلات
pm2 logs smartmem --err
```

### مشاكل قاعدة البيانات

```bash
# التحقق من الاتصال
mysql -u user -p -h host -e "SELECT 1;"

# إصلاح الجداول
pnpm db:repair

# إعادة تشغيل الهجرات
pnpm db:reset
```

### مشاكل الأداء

```bash
# تحليل الأداء
pnpm perf:analyze

# تنظيف الذاكرة المؤقتة
pm2 kill
pm2 start smartmem
```

## 📈 التحديثات

### تحديث الإصدار

```bash
# سحب التحديثات
git pull origin main

# تثبيت المكتبات الجديدة
pnpm install

# تشغيل الهجرات
pnpm db:push

# بناء الإصدار الجديد
pnpm build

# إعادة تشغيل الخدمة
pm2 restart smartmem
```

## 📞 الدعم

للمساعدة في النشر، يرجى التواصل مع فريق الدعم:
- البريد الإلكتروني: support@smartmem.app
- الموقع: https://smartmem.app/support

---

**ملاحظة:** تأكد من اختبار جميع الخطوات في بيئة التطوير قبل النشر في الإنتاج.

