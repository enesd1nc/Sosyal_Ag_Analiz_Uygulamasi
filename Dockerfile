# Nginx tabanlı hafif bir image kullan
FROM nginx:alpine

# Çalışma dizinini ayarla
WORKDIR /usr/share/nginx/html

# Mevcut Nginx içeriğini temizle
RUN rm -rf ./*

# Proje dosyalarını container'a kopyala
COPY index.html .
COPY script.js .
COPY style.css .

# Port 80'i dışarıya aç
EXPOSE 80

# Nginx'i başlat (varsayılan olarak çalışır)
CMD ["nginx", "-g", "daemon off;"]
