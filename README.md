# 🌐 Sosyal Ağ Analizi Uygulaması

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Graf teorisi tabanlı interaktif sosyal ağ analizi ve görselleştirme aracı**

[Demo](#kullanım) • [Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Algoritmalar](#-desteklenen-algoritmalar)

</div>

---
![](./Resim1.png)

## 📖 Hakkında

Bu proje, sosyal ağları interaktif olarak oluşturmanıza, görselleştirmenize ve analiz etmenize olanak sağlayan web tabanlı bir uygulamadır. Canvas API kullanılarak geliştirilen bu araç ile düğümler oluşturabilir, aralarında bağlantılar kurabilir ve çeşitli graf algoritmalarını çalıştırarak ağ yapısını analiz edebilirsiniz.

## ✨ Özellikler

### 🎨 Graf Oluşturma ve Düzenleme
- **Manuel Düğüm Ekleme**: Canvas üzerine tıklayarak düğüm oluşturma
- **Rastgele Ağ Üretimi**: Otomatik olarak rastgele sosyal ağ oluşturma
- **Sürükle-Bırak Bağlantı**: Düğümler arasında kolay bağlantı oluşturma
- **Bağlantı Silme**: İstenmeyen bağlantıları kaldırma
- **Düğüm Silme**: Çift tıklama ile düğüm silme

### 🔍 Algoritmalar
- **BFS (Genişlik Öncelikli Arama)**: Ağı seviye seviye keşfetme
- **DFS (Derinlik Öncelikli Arama)**: Ağı derinlemesine tarama
- **Dijkstra En Kısa Yol**: İki düğüm arasındaki en kısa yolu bulma
- **Welsh-Powell Renklendirme**: Graf renklendirme algoritması
- **Degree Centrality**: Düğümlerin merkezi önemini hesaplama

### 📊 Veri Aktarımı
- **JSON Dışa/İçe Aktarım**: Ağ yapısını JSON formatında kaydetme ve yükleme
- **CSV Dışa Aktarım**: Düğüm özelliklerini tablo formatında dışa aktarma
- **CSV İçe Aktarım**: Mevcut verileri içe aktarma

### 🖥️ Kullanıcı Arayüzü
- Modern ve responsive tasarım
- Animasyonlu gradient arka plan
- Modal popup ile detaylı düğüm bilgileri
- Gerçek zamanlı istatistikler (düğüm ve bağlantı sayıları)
- Interaktif kullanım kılavuzu

## 🛠️ Teknolojiler

| Teknoloji | Kullanım Alanı |
|-----------|---------------|
| **HTML5** | Sayfa yapısı ve Canvas API |
| **CSS3** | Modüler stil sistemi, animasyonlar |
| **JavaScript (ES6+)** | Graf mantığı, algoritmalar, kullanıcı etkileşimi |
| **Docker** | Containerized deployment |
| **Nginx** | Web sunucusu |

## 📁 Proje Yapısı

```
📦 Sosyal_Ag_Analiz_Uygulamasi
├── 📄 index.html              # Ana sayfa
├── 📄 script.js               # Ana JavaScript dosyası

├── 📄 Dockerfile              # Docker konfigürasyonu
├── 📂 js/
│   ├── 📂 interfaces/         # Arayüz tanımları
│   │   ├── IAlgorithm.js
│   │   ├── IDrawable.js
│   │   ├── IEdge.js
│   │   ├── IGraph.js
│   │   └── INode.js
│   ├── 📂 models/             # Veri modelleri
│   │   ├── Node.js
│   │   ├── Edge.js
│   │   └── Graph.js
│   ├── 📂 services/           # İş mantığı
│   │   ├── Algorithm.js
│   │   └── 📂 algorithms/
│   │       ├── BaseAlgorithm.js
│   │       ├── BFSAlgorithm.js
│   │       ├── DFSAlgorithm.js
│   │       ├── DijkstraAlgorithm.js
│   │       ├── WelshPowellAlgorithm.js
│   │       ├── DegreeCentralityAlgorithm.js
│   │       └── AlgorithmFactory.js
│   └── 📂 ui/                 # Kullanıcı arayüzü
│       └── ...
├── 📂 css/                    # Modüler CSS yapısı
│   ├── main.css
│   ├── 📂 base/
│   ├── 📂 components/
│   ├── 📂 layout/
│   └── 📂 sections/
└── 📂 html/                   # HTML parçaları
    └── 📂 partials/
```

## 🚀 Kurulum

### Yerel Çalıştırma

1. Projeyi klonlayın:
```bash
git clone https://github.com/[kullaniciadi]/sosyal-ag-analizi.git
cd sosyal-ag-analizi
```

2. `index.html` dosyasını bir web tarayıcısında açın veya bir yerel sunucu başlatın:
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve
```

3. Tarayıcıda `http://localhost:8000` adresine gidin.

### Docker ile Çalıştırma

1. Docker imajını oluşturun:
```bash
docker build -t sosyal-ag-analizi .
```

2. Konteyneri başlatın:
```bash
docker run -d -p 8080:80 sosyal-ag-analizi
```

3. Tarayıcıda `http://localhost:8080` adresine gidin.

## 📖 Kullanım

### Temel İşlemler

| İşlem | Nasıl Yapılır |
|-------|--------------|
| 🖱️ **Düğüm Ekle** | Canvas'a tıklayın veya "Düğüm Ekle" butonunu kullanın |
| 🔗 **Bağlantı Oluştur** | Bir düğümden başka bir düğüme sürükleyin |
| 🗑️ **Düğüm Sil** | Düğüme çift tıklayın |
| ✂️ **Bağlantı Sil** | "Bağlantı Sil" modunu aktifleştirip iki düğüme sırayla tıklayın |
| ℹ️ **Bilgi Görüntüle** | "Düğüm Bilgisi" modunda düğüme tıklayın |
| 🎲 **Rastgele Ağ** | "Rastgele Ağ Üret" butonuna tıklayın |

### Algoritma Çalıştırma

1. Sol panelden bir algoritma seçin
2. "Algoritmayı Çalıştır" butonuna tıklayın
3. Gerekirse başlangıç/bitiş düğümlerini seçin
4. Sonuçları görsel olarak canvas üzerinde ve sonuç panelinde inceleyin

## 🔬 Desteklenen Algoritmalar

### BFS (Breadth-First Search)
Başlangıç düğümünden itibaren ağı seviye seviye keşfeder. Kısa yol bulma ve bağlantı analizi için uygundur.

### DFS (Depth-First Search)
Ağı derinlemesine tarar, bir yol tükenene kadar ilerler sonra geri döner. Döngü tespiti ve bileşen analizi için kullanılır.

### Dijkstra En Kısa Yol
Ağırlıklı grafta iki düğüm arasındaki en kısa yolu bulur. Sosyal ağlarda "aradaki derece" hesaplaması için idealdir.

### Welsh-Powell Renklendirme
Düğümleri minimum renk sayısı ile boyar, komşu düğümler farklı renklere sahip olur. Çakışma tespiti ve zamanlama problemleri için kullanılır.

### Degree Centrality
Her düğümün bağlantı sayısını hesaplayarak ağdaki önemini belirler. Sosyal ağlarda etki analizi için kullanılır.

## 📸 Ekran Görüntüleri

<div align="center">

*Uygulama ekran görüntüleri buraya eklenebilir*

</div>

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

Bu proje üniversite projesi olarak geliştirilmiştir.

---

<div align="center">

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

</div>
