# [cite_start]Temel imaj olarak hızlı ve hafif olduğu için Nginx'in alpine versiyonunu seçtim [cite: 1]
FROM nginx:alpine

# Dosyalarımızı yükleyeceğimiz yeri ayarlıyoruz
WORKDIR /usr/share/nginx/html

# İçeride kalan gereksiz varsayılan dosyaları bir temizleyelim
RUN rm -rf ./*

# [cite_start]Hazırladığımız dosyaları (html, js, css) içeriye aktarıyoruz [cite: 2]
COPY index.html .
COPY script.js .
COPY style.css .

# Konteynerın 80 portu üzerinden haberleşeceğini not düşüyoruz
EXPOSE 80

# Nginx'i ayağa kaldırıyoruz, sistemin sürekli çalışmasını sağlıyoruz
CMD ["nginx", "-g", "daemon off;"]
