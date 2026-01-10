// ============================================================================
// GRAPH (GRAF) SINIFI
// Tüm düğümleri ve bağlantıları yöneten ana sınıf
// @implements {IGraph}
// @implements {IDrawable}
// ============================================================================
class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.nodeIdCounter = 1;
    }

    // Yeni düğüm ekle
    addNode(x, y) {
        const node = new Node(this.nodeIdCounter++, x, y);
        this.nodes.push(node);
        return node;
    }

    // İki düğüm arasında bağlantı ekle
    addEdge(source, target) {
        // Aynı düğüm arasında veya zaten var olan bağlantı kontrolü
        if (source === target) return null;
        if (this.hasEdge(source, target)) return null;

        const edge = new Edge(source, target);
        this.edges.push(edge);

        // Ağırlıkları yeniden hesapla (baglantiSayisi değişti)
        this.recalculateWeights();

        return edge;
    }

    // İki düğüm arasında bağlantı var mı kontrol et
    hasEdge(source, target) {
        return this.edges.some(edge =>
            (edge.source === source && edge.target === target) ||
            (edge.source === target && edge.target === source)
        );
    }

    // Düğümü ve ona bağlı tüm kenarları sil
    removeNode(node) {
        // Düğüme bağlı kenarları bul ve sil
        this.edges = this.edges.filter(edge => {
            if (edge.source === node || edge.target === node) {
                // Diğer düğümün baglantiSayisi'nı azalt
                if (edge.source !== node) edge.source.baglantiSayisi--;
                if (edge.target !== node) edge.target.baglantiSayisi--;
                return false;
            }
            return true;
        });

        // Düğümü listeden çıkar
        this.nodes = this.nodes.filter(n => n !== node);

        // Ağırlıkları yeniden hesapla
        this.recalculateWeights();
    }

    // Tüm kenar ağırlıklarını yeniden hesapla
    recalculateWeights() {
        this.edges.forEach(edge => {
            edge.weight = edge.calculateWeight();
        });
    }

    // Belirli bir koordinattaki düğümü bul
    getNodeAt(x, y) {
        // Ters sırada ara (üsttekiler önce)
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].containsPoint(x, y)) {
                return this.nodes[i];
            }
        }
        return null;
    }

    // Bir düğümün komşularını (bağlı olduğu düğümleri) getir
    getNeighbors(node) {
        const neighbors = [];
        this.edges.forEach(edge => {
            if (edge.source === node) {
                neighbors.push({ node: edge.target, weight: edge.weight });
            } else if (edge.target === node) {
                neighbors.push({ node: edge.source, weight: edge.weight });
            }
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

        // Düğümleri rastgele pozisyonlarda oluştur
        for (let i = 0; i < nodeCount; i++) {
            const x = padding + Math.random() * (canvas.width - padding * 2);
            const y = padding + Math.random() * (canvas.height - padding * 2);
            this.addNode(x, y);
        }

        // Rastgele bağlantılar oluştur (her düğüm en az 2 bağlantıya sahip olsun)
        for (let i = 0; i < this.nodes.length; i++) {
            const connectionCount = Math.floor(Math.random() * 3) + 2; // 2-4 bağlantı
            for (let j = 0; j < connectionCount; j++) {
                const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                if (randomNode !== this.nodes[i]) {
                    this.addEdge(this.nodes[i], randomNode);
                }
            }
        }
    }

    // Grafiği çiz
    draw(ctx) {
        // Önce kenarları çiz (altda kalsınlar)
        this.edges.forEach(edge => edge.draw(ctx));

        // Sonra düğümleri çiz (üstte olsunlar)
        this.nodes.forEach(node => node.draw(ctx));
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
