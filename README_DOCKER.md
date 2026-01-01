# Docker ile Sosyal Ağ Analizi Uygulaması

## Docker Kurulumu ve Çalıştırma

### 1. Docker Image Oluşturma
```bash
docker build -t sosyal-ag-analizi .
```

### 2. Container'ı Çalıştırma
```bash
docker run -d -p 8080:80 --name sosyal-ag sosyal-ag-analizi
```

### 3. Uygulamaya Erişim
Tarayıcınızda şu adresi açın:
```
http://localhost:8080
```

## Docker Komutları

### Container'ı Durdurma
```bash
docker stop sosyal-ag
```

### Container'ı Başlatma
```bash
docker start sosyal-ag
```

### Container'ı Silme
```bash
docker rm sosyal-ag
```

### Image'ı Silme
```bash
docker rmi sosyal-ag-analizi
```

### Container Loglarını Görüntüleme
```bash
docker logs sosyal-ag
```

### Çalışan Container'ları Listeleme
```bash
docker ps
```

## Farklı Port Kullanma
Eğer 8080 portu kullanımdaysa, başka bir port kullanabilirsiniz:
```bash
docker run -d -p 3000:80 --name sosyal-ag sosyal-ag-analizi
```
Bu durumda `http://localhost:3000` adresinden erişebilirsiniz.

## Notlar
- Image boyutu: ~25MB (nginx:alpine kullanıldığı için çok hafif)
- Port: Container içinde 80, dışarıda 8080 (değiştirilebilir)
- Web sunucu: Nginx
