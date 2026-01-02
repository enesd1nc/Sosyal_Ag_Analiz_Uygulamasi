// ============================================================================
// SOSYAL AĞ ANALİZİ - OOP TABANLI JAVASCRIPT UYGULAMASI
// ============================================================================

// ============================================================================
// NODE (DÜĞÜM) SINIFI
// Her kullanıcıyı temsil eder
// ============================================================================
class Node {
    constructor(id, x, y) {
        this.id = id;                  // Düğümün benzersiz kimliği
        this.x = x;                     // X koordinatı
        this.y = y;                     // Y koordinatı
        this.radius = 25;               // Düğümün yarıçapı
        this.color = '#667eea';         // Başlangıç rengi
        this.label = `U${id}`;          // Düğüm etiketi (U1, U2...)

        // Dinamik ağırlık hesaplaması için özellikler
        this.aktiflik = Math.floor(Math.random() * 100) + 1;    // 1-100 arasında rastgele
        this.etkilesim = Math.floor(Math.random() * 100) + 1;   // 1-100 arasında rastgele
        this.baglantiSayisi = 0;        // Başlangıçta bağlantı sayısı 0

        // Görsel durumlar
        this.isHighlighted = false;     // Vurgulanmış mı?
        this.isDragging = false;        // Sürükleniyor mu?
    }

    // Düğümü canvas üzerinde çiz
    draw(ctx) {
        ctx.save();

        // Eğer vurgulanmışsa glow efekti uygula
        if (this.isHighlighted) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
        }

        // Dış daire (border)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // İç daire (beyaz)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Düğüm etiketi
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.x, this.y);

        ctx.restore();
    }

    // Belirli bir nokta düğümün içindeyse true döner
    containsPoint(x, y) {
        const distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
        return distance <= this.radius;
    }

    // Rengi değiştir
    setColor(color) {
        this.color = color;
    }

    // Düğümü vurgula / vurgulamayı kaldır
    highlight(isHighlighted = true) {
        this.isHighlighted = isHighlighted;
    }
}

// ============================================================================
// EDGE (BAĞLANTI) SINIFI
// İki düğüm arasındaki bağlantıyı temsil eder
// ============================================================================
class Edge {
    constructor(source, target) {
        this.source = source;           // Bağlantının kaynağı
        this.target = target;           // Bağlantının hedefi
        this.weight = this.calculateWeight(); // Bağlantı ağırlığı
        this.color = '#999';            // Çizgi rengi
        this.lineWidth = 2;             // Çizgi kalınlığı
        this.isHighlighted = false;     // Vurgulanmış mı?

        // Düğümlerin bağlantı sayısını güncelle
        source.baglantiSayisi++;
        target.baglantiSayisi++;
    }

    // Bağlantının ağırlığını hesapla
    calculateWeight() {
        const aktiflikFark = Math.pow(this.source.aktiflik - this.target.aktiflik, 2);
        const etkilesimFark = Math.pow(this.source.etkilesim - this.target.etkilesim, 2);
        const baglantiSayisiFark = Math.pow(this.source.baglantiSayisi - this.target.baglantiSayisi, 2);

        const maliyet = 1 + Math.sqrt(aktiflikFark + etkilesimFark + baglantiSayisiFark);
        return Math.round(maliyet * 10) / 10; // 1 ondalık basamağa yuvarla
    }

    // Bağlantıyı canvas üzerinde çiz
    draw(ctx) {
        ctx.save();

        // Vurgulanmışsa kalın çizgi ve glow
        if (this.isHighlighted) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }

        // Çizgi çiz
        ctx.beginPath();
        ctx.moveTo(this.source.x, this.source.y);
        ctx.lineTo(this.target.x, this.target.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        // Ağırlık değerini çizgi ortasına yaz
        const midX = (this.source.x + this.target.x) / 2;
        const midY = (this.source.y + this.target.y) / 2;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(midX - 15, midY - 10, 30, 20);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.weight.toFixed(1), midX, midY);

        ctx.restore();
    }

    // Kenarı vurgula
    highlight(color = '#ff0000', lineWidth = 4) {
        this.isHighlighted = true;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    // Vurgulamayı kaldır
    unhighlight() {
        this.isHighlighted = false;
        this.color = '#999';
        this.lineWidth = 2;
    }
}

// ============================================================================
// GRAPH (GRAF) SINIFI
// Tüm düğümleri ve bağlantıları yöneten ana sınıf
// ============================================================================
class Graph {
    constructor() {
        this.nodes = [];            // Tüm düğümler
        this.edges = [];            // Tüm bağlantılar
        this.nodeIdCounter = 1;     // Yeni düğüm ID sayacı
    }

    // Yeni düğüm ekle
    addNode(x, y) {
        const node = new Node(this.nodeIdCounter++, x, y);
        this.nodes.push(node);
        return node;
    }

    // İki düğüm arasında bağlantı ekle
    addEdge(source, target) {
        if (source === target) return null;      // Kendine bağlantı yok
        if (this.hasEdge(source, target)) return null; // Aynı bağlantı yok

        const edge = new Edge(source, target);
        this.edges.push(edge);

        this.recalculateWeights(); // Ağırlıkları güncelle
        return edge;
    }

    // Belirli bir bağlantı var mı?
    hasEdge(source, target) {
        return this.edges.some(edge =>
            (edge.source === source && edge.target === target) ||
            (edge.source === target && edge.target === source)
        );
    }

    // Düğümü ve bağlı tüm kenarları sil
    removeNode(node) {
        this.edges = this.edges.filter(edge => {
            if (edge.source === node || edge.target === node) {
                if (edge.source !== node) edge.source.baglantiSayisi--;
                if (edge.target !== node) edge.target.baglantiSayisi--;
                return false;
            }
            return true;
        });
        this.nodes = this.nodes.filter(n => n !== node);
        this.recalculateWeights();
    }

    // Tüm kenar ağırlıklarını yeniden hesapla
    recalculateWeights() {
        this.edges.forEach(edge => {
            edge.weight = edge.calculateWeight();
        });
    }

    // Belirli koordinattaki düğümü bul
    getNodeAt(x, y) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].containsPoint(x, y)) return this.nodes[i];
        }
        return null;
    }

    // Bir düğümün komşularını getir
    getNeighbors(node) {
        const neighbors = [];
        this.edges.forEach(edge => {
            if (edge.source === node) neighbors.push({ node: edge.target, weight: edge.weight });
            else if (edge.target === node) neighbors.push({ node: edge.source, weight: edge.weight });
        });
        return neighbors;
    }

    // İki düğüm arasındaki kenarı bul
    getEdge(source, target) {
        return this.edges.find(edge =>
            (edge.source === source && edge.target === target) ||
            (edge.source === target && edge.target === source)
        );
    }

    // Grafı temizle
    clear() {
        this.nodes = [];
        this.edges = [];
        this.nodeIdCounter = 1;
    }

    // Rastgele graf üret
    generateRandom(nodeCount = 8) {
        this.clear();
        const canvas = document.getElementById('graphCanvas');
        const padding = 80;

        // Rastgele düğümler oluştur
        for (let i = 0; i < nodeCount; i++) {
            const x = padding + Math.random() * (canvas.width - padding * 2);
            const y = padding + Math.random() * (canvas.height - padding * 2);
            this.addNode(x, y);
        }

        // Rastgele bağlantılar (her düğüm 2-4 bağlantı)
        for (let i = 0; i < this.nodes.length; i++) {
            const connectionCount = Math.floor(Math.random() * 3) + 2;
            for (let j = 0; j < connectionCount; j++) {
                const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                if (randomNode !== this.nodes[i]) this.addEdge(this.nodes[i], randomNode);
            }
        }
    }

    // Grafı çiz
    draw(ctx) {
        this.edges.forEach(edge => edge.draw(ctx));  // Kenarlar altta
        this.nodes.forEach(node => node.draw(ctx));  // Düğümler üstte
    }

    // Tüm vurgulamaları temizle
    clearHighlights() {
        this.nodes.forEach(node => {
            node.highlight(false);
            node.setColor('#667eea');
        });
        this.edges.forEach(edge => edge.unhighlight());
    }
}

