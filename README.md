Docker ile Sosyal Ağ Analizi Uygulaması
Docker Kurulumu ve Çalıştırma
1. Docker Görüntüsü Oluşturma
docker build -t sosyal-ag-analizi .
2. Container'ı Çalıştırma
docker run -d -p 8080:80 --name sosyal-ag sosyal-ag-analizi
3. Uygulamaya Erişim
Tarayıcınızdaki şu adresi açın:

http://localhost:8080
Docker Komutları
Konteyner'ı Durdurma
docker stop sosyal-ag
Konteyner'ı esma
docker start sosyal-ag
Konteyner'ı Silme
docker rm sosyal-ag
Image'ı Silme
docker rmi sosyal-ag-analizi
Konteyner Loglarını Görüntüleme
docker logs sosyal-ag
Çalışan Container'ları Listeleme
docker ps
Farklı Port Yapmak
Eğer 8080 portu kullanımdaysa, başka bir portu kullanabilirsiniz:

docker run -d -p 3000:80 --name sosyal-ag sosyal-ag-analizi
Bu durumda olduğunuzda http://localhost:3000erişebilirsiniz.

Notlar
Resim boyutu: ~25MB (nginx:alpine şirketi için çok hafif)
Liman: Konteyner içinde 80, dışarıda 8080 (değiştirilebilir)
Web sunucusu: Nginx
