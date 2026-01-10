// ============================================================================
// SOSYAL AĞ ANALİZİ - OOP TABANLI JAVASCRIPT UYGULAMASI
// ============================================================================

// ============================================================================
// NODE (DÜĞÜM) SINIFI
// Her bir kullanıcıyı / düğümü temsil eder
// ============================================================================
class Node {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.color = '#667eea';
        this.label = `U${id}`;

        // Dinamik ağırlık hesaplaması için gerekli özellikler
        // Bu değerler rastgele atanır (1-100 arası)
        this.aktiflik = Math.floor(Math.random() * 100) + 1;
        this.etkilesim = Math.floor(Math.random() * 100) + 1;
        this.baglantiSayisi = 0; // Başlangıçta 0, bağlantı eklendikçe artacak

        // Görsel efektler için
        this.isHighlighted = false;
        this.isDragging = false;
    }

    // Düğümü canvas üzerine çiz
    draw(ctx) {
        ctx.save();

        // Vurguluysa daire çevresinde glow efekti
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

        // Label (düğüm adı)
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.x, this.y);

        ctx.restore();
    }

    // Bir noktanın bu düğümün içinde olup olmadığını kontrol et
    containsPoint(x, y) {
        const distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
        return distance <= this.radius;
    }

    // Düğümün rengini değiştir
    setColor(color) {
        this.color = color;
    }

    // Düğümü vurgula
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
        this.source = source;
        this.target = target;
        this.weight = this.calculateWeight(); // Dinamik ağırlık hesapla
        this.color = '#999';
        this.lineWidth = 2;
        this.isHighlighted = false;

        // Bağlantı sayısını güncelle
        source.baglantiSayisi++;
        target.baglantiSayisi++;
    }

    // Dinamik Ağırlık Formülü (PDF gereksinimi)
    // Maliyet = 1 + sqrt((Aktiflik_i - Aktiflik_j)^2 + (Etkilesim_i - Etkilesim_j)^2 + (BaglantiSayisi_i - BaglantiSayisi_j)^2)
    calculateWeight() {
        const aktiflikFark = Math.pow(this.source.aktiflik - this.target.aktiflik, 2);
        const etkilesimFark = Math.pow(this.source.etkilesim - this.target.etkilesim, 2);
        const baglantiSayisiFark = Math.pow(this.source.baglantiSayisi - this.target.baglantiSayisi, 2);

        const maliyet = 1 + Math.sqrt(aktiflikFark + etkilesimFark + baglantiSayisiFark);
        return Math.round(maliyet * 10) / 10; // 1 ondalık basamağa yuvarla
    }

    // Bağlantıyı çiz
    draw(ctx) {
        ctx.save();

        // Vurguluysa kalınlık ve renk değiştir
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

        // Ağırlığı çizginin ortasına yaz
        const midX = (this.source.x + this.target.x) / 2;
        const midY = (this.source.y + this.target.y) / 2;

        // Ağırlık için küçük bir arka plan kutusu
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(midX - 15, midY - 10, 30, 20);

        // Ağırlık değerini yaz
        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.weight.toFixed(1), midX, midY);

        ctx.restore();
    }

    // Bağlantıyı vurgula (Dijkstra için)
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

    // Bir noktanın bu bağlantının üzerinde olup olmadığını kontrol et
    containsPoint(x, y, threshold = 10) {
        // Nokta ile çizgi arasındaki mesafeyi hesapla
        const x1 = this.source.x;
        const y1 = this.source.y;
        const x2 = this.target.x;
        const y2 = this.target.y;

        // Çizgi uzunluğu
        const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (lineLength === 0) return false;

        // Nokta ile çizgi arasındaki mesafe (perpendicular distance)
        const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / lineLength;

        // Noktanın çizginin sınırları içinde olup olmadığını kontrol et
        const dotProduct = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (lineLength * lineLength);

        // 0 ile 1 arasında olmalı (çizginin uç noktaları arasında)
        if (dotProduct < 0 || dotProduct > 1) return false;

        return distance <= threshold;
    }

    // Bağlantının orta noktasını al
    getMidPoint() {
        return {
            x: (this.source.x + this.target.x) / 2,
            y: (this.source.y + this.target.y) / 2
        };
    }
}

// ============================================================================
// GRAPH (GRAF) SINIFI
// Tüm düğümleri ve bağlantıları yöneten ana sınıf
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

    // Belirli bir kenarı sil
    removeEdge(edge) {
        const index = this.edges.indexOf(edge);
        if (index === -1) return false;

        // Bağlı düğümlerin baglantiSayisi'nı azalt
        edge.source.baglantiSayisi--;
        edge.target.baglantiSayisi--;

        // Kenarı listeden çıkar
        this.edges.splice(index, 1);

        // Ağırlıkları yeniden hesapla
        this.recalculateWeights();

        return true;
    }

    // Belirli bir koordinattaki kenarı bul
    getEdgeAt(x, y) {
        // Ters sırada ara (üsttekiler önce)
        for (let i = this.edges.length - 1; i >= 0; i--) {
            if (this.edges[i].containsPoint(x, y)) {
                return this.edges[i];
            }
        }
        return null;
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

    // ==========================================================================
    // VERİ DIŞA AKTARIM FONKSİYONLARI
    // ==========================================================================

    // Graf verisini JSON formatına dönüştür (komşuluk listesi dahil)
    toJSON() {
        // Düğüm verileri
        const nodesData = this.nodes.map(node => ({
            id: node.id,
            label: node.label,
            x: Math.round(node.x),
            y: Math.round(node.y),
            aktiflik: node.aktiflik,
            etkilesim: node.etkilesim,
            baglantiSayisi: node.baglantiSayisi
        }));

        // Kenar verileri
        const edgesData = this.edges.map(edge => ({
            sourceId: edge.source.id,
            targetId: edge.target.id,
            weight: edge.weight
        }));

        // Komşuluk listesi oluştur
        const adjacencyList = {};
        this.nodes.forEach(node => {
            const neighbors = this.getNeighbors(node);
            adjacencyList[node.label] = neighbors.map(n => ({
                komsu: n.node.label,
                agirlik: n.weight
            }));
        });

        return {
            nodes: nodesData,
            edges: edgesData,
            adjacencyList: adjacencyList,
            metadata: {
                nodeCount: this.nodes.length,
                edgeCount: this.edges.length,
                exportDate: new Date().toISOString()
            }
        };
    }

    // Graf verisini CSV formatına dönüştür (komşuluk matrisi)
    toCSV() {
        const labels = this.nodes.map(n => n.label);
        const n = this.nodes.length;

        // Komşuluk matrisi oluştur
        const matrix = [];
        for (let i = 0; i < n; i++) {
            matrix[i] = new Array(n).fill(0);
        }

        // Kenarları matrise ekle
        this.edges.forEach(edge => {
            const sourceIdx = this.nodes.indexOf(edge.source);
            const targetIdx = this.nodes.indexOf(edge.target);
            if (sourceIdx !== -1 && targetIdx !== -1) {
                matrix[sourceIdx][targetIdx] = edge.weight;
                matrix[targetIdx][sourceIdx] = edge.weight; // Yönsüz graf
            }
        });

        // CSV oluştur
        let csv = ',' + labels.join(',') + '\n';
        for (let i = 0; i < n; i++) {
            csv += labels[i] + ',' + matrix[i].join(',') + '\n';
        }

        return csv;
    }

    // JSON verisinden graf yükle
    fromJSON(data) {
        this.clear();

        // Düğümleri oluştur
        const nodeMap = new Map();
        data.nodes.forEach(nodeData => {
            const node = new Node(nodeData.id, nodeData.x, nodeData.y);
            node.label = nodeData.label;
            node.aktiflik = nodeData.aktiflik || Math.floor(Math.random() * 100) + 1;
            node.etkilesim = nodeData.etkilesim || Math.floor(Math.random() * 100) + 1;
            node.baglantiSayisi = 0; // Yeniden hesaplanacak
            this.nodes.push(node);
            nodeMap.set(nodeData.id, node);

            // Sonraki düğüm için ID sayacını güncelle
            if (nodeData.id >= this.nodeIdCounter) {
                this.nodeIdCounter = nodeData.id + 1;
            }
        });

        // Kenarları oluştur
        data.edges.forEach(edgeData => {
            const source = nodeMap.get(edgeData.sourceId);
            const target = nodeMap.get(edgeData.targetId);
            if (source && target) {
                this.addEdge(source, target);
            }
        });
    }

    // CSV verisinden graf yükle (komşuluk matrisi)
    fromCSV(csvText) {
        this.clear();

        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return;

        // Başlık satırından etiketleri al
        const headers = lines[0].split(',').slice(1).map(h => h.trim());
        const n = headers.length;

        // Canvas boyutlarını al
        const canvas = document.getElementById('graphCanvas');
        const padding = 80;

        // Düğümleri oluştur (dairesel yerleşim)
        const nodeMap = new Map();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 3;

        headers.forEach((label, i) => {
            const angle = (2 * Math.PI * i) / n - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const node = this.addNode(x, y);
            node.label = label;
            nodeMap.set(label, node);
        });

        // Matris satırlarını oku ve kenarları oluştur
        for (let i = 1; i < lines.length && i <= n; i++) {
            const cells = lines[i].split(',');
            const rowLabel = cells[0].trim();
            const sourceNode = nodeMap.get(rowLabel);

            if (!sourceNode) continue;

            for (let j = 1; j < cells.length && j <= n; j++) {
                const weight = parseFloat(cells[j]);
                if (weight > 0 && j > i) { // Sadece üst üçgenı oku (çift sayım önleme)
                    const targetLabel = headers[j - 1];
                    const targetNode = nodeMap.get(targetLabel);
                    if (targetNode) {
                        this.addEdge(sourceNode, targetNode);
                    }
                }
            }
        }
    }
}

// ============================================================================
// BASE ALGORITHM (TEMEL ALGORİTMA) SINIFI
// Tüm algoritmaların miras aldığı soyut temel sınıf
// Kalıtım (Inheritance) ve Polimorfizm (Polymorphism) için temel yapı
// ============================================================================
class BaseAlgorithm {
    /**
     * @param {Graph} graph - Algoritmanın çalışacağı graf
     */
    constructor(graph) {
        if (new.target === BaseAlgorithm) {
            throw new Error('BaseAlgorithm soyut bir sınıftır, doğrudan örneklenemez!');
        }
        this.graph = graph;
        this.name = 'Base Algorithm';
        this.description = 'Temel algoritma sınıfı';
        this.requiresStartNode = false;
        this.requiresEndNode = false;
    }

    /**
     * Polimorfik metot - Her alt sınıf bu metodu kendine göre uygular
     * @param {Node} startNode - Başlangıç düğümü (opsiyonel)
     * @param {Node} endNode - Bitiş düğümü (opsiyonel)
     * @param {boolean} visualize - Görselleştirme yapılsın mı
     * @returns {Promise<Object>} - Algoritma sonucu
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        throw new Error('execute() metodu alt sınıfta uygulanmalı!');
    }

    /**
     * Algoritma için gerekli validasyonları yapar
     */
    validate(startNode, endNode) {
        if (this.requiresStartNode && !startNode) {
            return { error: true, message: 'Başlangıç düğümü gerekli!' };
        }
        if (this.requiresEndNode && !endNode) {
            return { error: true, message: 'Bitiş düğümü gerekli!' };
        }
        return null;
    }

    /**
     * Animasyon için gecikme sağlar
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Graf vurgularını temizler
     */
    clearHighlights() {
        this.graph.clearHighlights();
    }

    /**
     * Algoritma bilgilerini döndürür
     */
    getInfo() {
        return {
            name: this.name,
            description: this.description,
            requiresStartNode: this.requiresStartNode,
            requiresEndNode: this.requiresEndNode
        };
    }
}

// ============================================================================
// BFS (Breadth-First Search) ALGORİTMASI
// BaseAlgorithm sınıfından miras alır - Kalıtım örneği
// ============================================================================
class BFSAlgorithm extends BaseAlgorithm {
    constructor(graph) {
        super(graph);
        this.name = 'BFS (Genişlik Öncelikli Arama)';
        this.description = 'Seçilen düğümden başlayarak tüm ulaşılabilir düğümleri katman katman gezer';
        this.requiresStartNode = true;
        this.requiresEndNode = false;
    }

    /**
     * Polimorfik execute metodu - BFS algoritmasını çalıştırır
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        const validationError = this.validate(startNode, endNode);
        if (validationError) return validationError;

        this.clearHighlights();

        const visited = new Set();
        const queue = [startNode];
        const visitOrder = [];

        while (queue.length > 0) {
            const current = queue.shift();

            if (visited.has(current)) continue;

            visited.add(current);
            visitOrder.push(current);

            if (visualize) {
                current.setColor('#28a745');
                current.highlight(true);
                await this.sleep(500);
            }

            const neighbors = this.graph.getNeighbors(current);
            neighbors.forEach(({ node }) => {
                if (!visited.has(node)) {
                    queue.push(node);
                }
            });
        }

        return {
            visited: visitOrder,
            message: `BFS tamamlandı. ${visitOrder.length} düğüm ziyaret edildi.`
        };
    }
}

// ============================================================================
// DFS (Depth-First Search) ALGORİTMASI
// BaseAlgorithm sınıfından miras alır - Kalıtım örneği
// ============================================================================
class DFSAlgorithm extends BaseAlgorithm {
    constructor(graph) {
        super(graph);
        this.name = 'DFS (Derinlik Öncelikli Arama)';
        this.description = 'Seçilen düğümden başlayarak derine doğru gider';
        this.requiresStartNode = true;
        this.requiresEndNode = false;
    }

    /**
     * Polimorfik execute metodu - DFS algoritmasını çalıştırır
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        const validationError = this.validate(startNode, endNode);
        if (validationError) return validationError;

        this.clearHighlights();

        const visited = new Set();
        const visitOrder = [];
        const self = this;

        const dfsRecursive = async (node) => {
            if (visited.has(node)) return;

            visited.add(node);
            visitOrder.push(node);

            if (visualize) {
                node.setColor('#dc3545');
                node.highlight(true);
                await self.sleep(500);
            }

            const neighbors = self.graph.getNeighbors(node);
            for (const { node: neighbor } of neighbors) {
                await dfsRecursive(neighbor);
            }
        };

        await dfsRecursive(startNode);

        return {
            visited: visitOrder,
            message: `DFS tamamlandı. ${visitOrder.length} düğüm ziyaret edildi.`
        };
    }
}

// ============================================================================
// DİJKSTRA EN KISA YOL ALGORİTMASI
// BaseAlgorithm sınıfından miras alır - Kalıtım örneği
// ============================================================================
class DijkstraAlgorithm extends BaseAlgorithm {
    constructor(graph) {
        super(graph);
        this.name = 'Dijkstra En Kısa Yol';
        this.description = 'İki düğüm arasındaki en kısa yolu bulur (ağırlıklı)';
        this.requiresStartNode = true;
        this.requiresEndNode = true;
    }

    /**
     * Polimorfik execute metodu - Dijkstra algoritmasını çalıştırır
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        const validationError = this.validate(startNode, endNode);
        if (validationError) return validationError;

        if (startNode === endNode) {
            return { path: [startNode], distance: 0, message: 'Başlangıç ve bitiş aynı düğüm!' };
        }

        this.clearHighlights();

        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set(this.graph.nodes);

        this.graph.nodes.forEach(node => {
            distances.set(node, Infinity);
            previous.set(node, null);
        });
        distances.set(startNode, 0);

        while (unvisited.size > 0) {
            let current = null;
            let minDistance = Infinity;

            unvisited.forEach(node => {
                if (distances.get(node) < minDistance) {
                    minDistance = distances.get(node);
                    current = node;
                }
            });

            if (current === null || minDistance === Infinity) break;
            if (current === endNode) break;

            unvisited.delete(current);

            if (visualize && current !== startNode) {
                current.setColor('#ffc107');
                current.highlight(true);
                await this.sleep(300);
            }

            const neighbors = this.graph.getNeighbors(current);
            for (const { node: neighbor, weight } of neighbors) {
                if (!unvisited.has(neighbor)) continue;

                const alt = distances.get(current) + weight;

                if (alt < distances.get(neighbor)) {
                    distances.set(neighbor, alt);
                    previous.set(neighbor, current);
                }
            }
        }

        const path = [];
        let current = endNode;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        if (path[0] !== startNode) {
            return {
                path: [],
                distance: Infinity,
                message: 'Bu iki düğüm arasında yol bulunamadı!'
            };
        }

        if (visualize) {
            for (let i = 0; i < path.length; i++) {
                path[i].setColor('#ff0000');
                path[i].highlight(true);

                if (i > 0) {
                    const edge = this.graph.getEdge(path[i - 1], path[i]);
                    if (edge) {
                        edge.highlight('#ff0000', 5);
                    }
                }

                await this.sleep(400);
            }
        }

        return {
            path: path,
            distance: distances.get(endNode),
            message: `En kısa yol bulundu! Toplam maliyet: ${distances.get(endNode).toFixed(2)}`
        };
    }
}

// ============================================================================
// WELSH-POWELL RENKLENDİRME ALGORİTMASI
// BaseAlgorithm sınıfından miras alır - Kalıtım örneği
// ============================================================================
class WelshPowellAlgorithm extends BaseAlgorithm {
    constructor(graph) {
        super(graph);
        this.name = 'Welsh-Powell Renklendirme';
        this.description = 'Grafiği, komşu düğümler farklı renklerde olacak şekilde boyar';
        this.requiresStartNode = false;
        this.requiresEndNode = false;
    }

    /**
     * Polimorfik execute metodu - Welsh-Powell algoritmasını çalıştırır
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        this.clearHighlights();

        const sortedNodes = [...this.graph.nodes].sort((a, b) => {
            const degreeA = this.graph.getNeighbors(a).length;
            const degreeB = this.graph.getNeighbors(b).length;
            return degreeB - degreeA;
        });

        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
        ];

        const nodeColors = new Map();

        sortedNodes.forEach(node => {
            const neighborColors = new Set();
            const neighbors = this.graph.getNeighbors(node);

            neighbors.forEach(({ node: neighbor }) => {
                if (nodeColors.has(neighbor)) {
                    neighborColors.add(nodeColors.get(neighbor));
                }
            });

            let selectedColor = colors[0];
            for (const color of colors) {
                if (!neighborColors.has(color)) {
                    selectedColor = color;
                    break;
                }
            }

            nodeColors.set(node, selectedColor);
            node.setColor(selectedColor);
        });

        const usedColors = new Set(nodeColors.values());

        return {
            colorCount: usedColors.size,
            message: `Graf ${usedColors.size} farklı renkle boyandı. Kromatik sayı ≤ ${usedColors.size}`
        };
    }
}

// ============================================================================
// DEGREE CENTRALITY (DERECE MERKEZİLİĞİ) ALGORİTMASI
// BaseAlgorithm sınıfından miras alır - Kalıtım örneği
// ============================================================================
class DegreeCentralityAlgorithm extends BaseAlgorithm {
    constructor(graph) {
        super(graph);
        this.name = 'Degree Centrality';
        this.description = 'En fazla bağlantıya sahip düğümleri bulur (en popüler kullanıcılar)';
        this.requiresStartNode = false;
        this.requiresEndNode = false;
    }

    /**
     * Polimorfik execute metodu - Degree Centrality algoritmasını çalıştırır
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        this.clearHighlights();

        const centralityScores = this.graph.nodes.map(node => {
            const degree = this.graph.getNeighbors(node).length;
            return { node, degree };
        });

        centralityScores.sort((a, b) => b.degree - a.degree);

        const top5 = centralityScores.slice(0, 5);

        if (visualize) {
            top5.forEach((item, index) => {
                const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4169E1', '#32CD32'];
                item.node.setColor(colors[index]);
                item.node.highlight(true);
            });
        }

        return {
            rankings: centralityScores,
            top5: top5,
            message: `En popüler ${Math.min(5, centralityScores.length)} düğüm listelendi.`
        };
    }
}

// ============================================================================
// ALGORITHM FACTORY (ALGORİTMA FABRİKASI)
// Polimorfizm için fabrika deseni kullanarak algoritma örnekleri oluşturur
// ============================================================================
class AlgorithmFactory {
    /**
     * Algoritma tipine göre uygun algoritma örneği oluşturur (Polimorfizm)
     */
    static create(type, graph) {
        switch (type) {
            case 'bfs':
                return new BFSAlgorithm(graph);
            case 'dfs':
                return new DFSAlgorithm(graph);
            case 'dijkstra':
                return new DijkstraAlgorithm(graph);
            case 'welsh-powell':
                return new WelshPowellAlgorithm(graph);
            case 'degree-centrality':
                return new DegreeCentralityAlgorithm(graph);
            default:
                throw new Error(`Bilinmeyen algoritma tipi: ${type}`);
        }
    }

    /**
     * Mevcut tüm algoritmaları listeler
     */
    static getAvailableAlgorithms(graph) {
        const algorithms = ['bfs', 'dfs', 'dijkstra', 'welsh-powell', 'degree-centrality'];
        return algorithms.map(type => {
            const algo = AlgorithmFactory.create(type, graph);
            return {
                type: type,
                ...algo.getInfo()
            };
        });
    }
}

// Geriye uyumluluk için eski Algorithm sınıfı (Facade Pattern)
// Bu sınıf eski kodun çalışmasını sağlar ve yeni polimorfik yapıya yönlendirir
class Algorithm {
    constructor(graph) {
        this.graph = graph;
    }

    async bfs(startNode, visualize = true) {
        const algo = AlgorithmFactory.create('bfs', this.graph);
        return await algo.execute(startNode, null, visualize);
    }

    async dfs(startNode, visualize = true) {
        const algo = AlgorithmFactory.create('dfs', this.graph);
        return await algo.execute(startNode, null, visualize);
    }

    async dijkstra(startNode, endNode, visualize = true) {
        const algo = AlgorithmFactory.create('dijkstra', this.graph);
        return await algo.execute(startNode, endNode, visualize);
    }

    welshPowell() {
        const algo = AlgorithmFactory.create('welsh-powell', this.graph);
        return algo.execute(null, null, true);
    }

    degreeCentrality() {
        const algo = AlgorithmFactory.create('degree-centrality', this.graph);
        return algo.execute(null, null, true);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================================================
// CANVAS YÖNETİCİSİ SINIFI
// Canvas etkileşimlerini ve çizim döngüsünü yönetir
// ============================================================================
class CanvasManager {
    constructor(canvasId, graph) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.graph = graph;
        this.algorithm = new Algorithm(graph);

        // Etkileşim durumları
        this.isDragging = false;
        this.draggedNode = null;
        this.isConnecting = false;
        this.connectStartNode = null;

        // Bağlama modu (tıklama ile bağlantı kurma)
        this.linkingMode = false;
        this.linkingFirstNode = null;

        // Bağlantı silme modu (tıklama ile bağlantı silme)
        this.unlinkingMode = false;
        this.unlinkingFirstNode = null;

        // Bilgi modu (düğüm bilgisi görüntüleme)
        this.infoMode = false;

        // Seçim modu (algoritma için düğüm seçimi)
        this.selectionMode = null; // 'start', 'end', null
        this.selectedStartNode = null;
        this.selectedEndNode = null;
        this.currentAlgorithm = null;

        this.initCanvas();
        this.setupEventListeners();
        this.startRenderLoop();
    }

    // Canvas boyutunu ayarla
    initCanvas() {
        const resizeCanvas = () => {
            const parent = this.canvas.parentElement;
            this.canvas.width = parent.clientWidth - 40;
            this.canvas.height = parent.clientHeight - 80;
            this.render();
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Mouse ve touch olaylarını dinle
    setupEventListeners() {
        // Mouse olayları
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

        // Context menu'yi devre dışı bırak
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Canvas koordinatlarını al
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // Mouse basma olayı
    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        const clickedNode = this.graph.getNodeAt(pos.x, pos.y);

        // Bağlama modundaysa (tıklama ile bağlantı kurma)
        if (this.linkingMode) {
            if (clickedNode) {
                if (!this.linkingFirstNode) {
                    // İlk düğüm seçildi - yeşil renkte vurgula
                    this.linkingFirstNode = clickedNode;
                    clickedNode.setColor('#22c55e'); // Yeşil
                    clickedNode.highlight(true);
                    this.showResult(`
                        <div class="info-message">
                            <span>🔗</span> <strong>İlk düğüm seçildi: ${clickedNode.label}</strong>
                        </div>
                        <p style="color: #475569; text-align: center; margin-top: 10px;">
                            Şimdi bağlanacak ikinci düğümü seçin
                        </p>
                    `);
                } else if (clickedNode !== this.linkingFirstNode) {
                    // İkinci düğüm seçildi - bağlantı oluştur
                    const edge = this.graph.addEdge(this.linkingFirstNode, clickedNode);

                    if (edge) {
                        // Başarılı bağlantı bildirimi
                        this.showResult(`
                            <div class="connection-message">
                                <span>✓</span> <strong>Bağlantı oluşturuldu!</strong>
                            </div>
                            <div style="text-align: center; padding: 10px;">
                                <span style="font-size: 28px;">🔗</span>
                                <p style="color: #475569; margin-top: 8px;">
                                    <strong>${this.linkingFirstNode.label}</strong> ↔ <strong>${clickedNode.label}</strong>
                                </p>
                                <p style="color: #64748b; font-size: 13px; margin-top: 4px;">
                                    Ağırlık: ${edge.weight.toFixed(1)}
                                </p>
                            </div>
                        `);
                        this.updateStats();
                    } else {
                        // Bağlantı zaten var
                        this.showResult(`
                            <div class="error-message">
                                <span>✕</span> <strong>Bu bağlantı zaten mevcut!</strong>
                            </div>
                        `);
                    }

                    // İlk düğümü sıfırla (rengi geri al)
                    this.linkingFirstNode.setColor('#667eea');
                    this.linkingFirstNode.highlight(false);
                    this.linkingFirstNode = null;
                } else {
                    // Aynı düğüme tıklandı - seçimi iptal et
                    this.linkingFirstNode.setColor('#667eea');
                    this.linkingFirstNode.highlight(false);
                    this.linkingFirstNode = null;
                    this.showResult(`
                        <div class="info-message">
                            <span>🔗</span> <strong>Bağlama Modu Aktif</strong>
                        </div>
                        <p style="color: #475569; text-align: center; margin-top: 10px;">
                            Bağlamak istediğiniz ilk düğüme tıklayın
                        </p>
                    `);
                }
            }
            return;
        }

        // Bağlantı silme modundaysa (tıklama ile bağlantı silme)
        if (this.unlinkingMode) {
            if (clickedNode) {
                if (!this.unlinkingFirstNode) {
                    // İlk düğüm seçildi - kırmızı renkte vurgula
                    this.unlinkingFirstNode = clickedNode;
                    clickedNode.setColor('#ef4444'); // Kırmızı
                    clickedNode.highlight(true);
                    this.showResult(`
                        <div class="error-message">
                            <span>✂️</span> <strong>İlk düğüm seçildi: ${clickedNode.label}</strong>
                        </div>
                        <p style="color: #475569; text-align: center; margin-top: 10px;">
                            Şimdi bağlantıyı silmek için ikinci düğümü seçin
                        </p>
                    `);
                } else if (clickedNode !== this.unlinkingFirstNode) {
                    // İkinci düğüm seçildi - bağlantıyı sil
                    const edge = this.graph.getEdge(this.unlinkingFirstNode, clickedNode);

                    if (edge) {
                        const sourceLabel = this.unlinkingFirstNode.label;
                        const targetLabel = clickedNode.label;
                        this.graph.removeEdge(edge);

                        // Başarılı silme bildirimi
                        this.showResult(`
                            <div class="success-message">
                                <span>✓</span> <strong>Bağlantı silindi!</strong>
                            </div>
                            <div style="text-align: center; padding: 10px;">
                                <span style="font-size: 28px;">✂️</span>
                                <p style="color: #475569; margin-top: 8px;">
                                    <strong>${sourceLabel}</strong> ↔ <strong>${targetLabel}</strong>
                                </p>
                                <p style="color: #64748b; font-size: 13px; margin-top: 4px;">
                                    Bağlantı başarıyla kaldırıldı
                                </p>
                            </div>
                        `);
                        this.updateStats();
                    } else {
                        // Bağlantı yok
                        this.showResult(`
                            <div class="error-message">
                                <span>✕</span> <strong>Bu düğümler arasında bağlantı yok!</strong>
                            </div>
                        `);
                    }

                    // İlk düğümü sıfırla (rengi geri al)
                    this.unlinkingFirstNode.setColor('#667eea');
                    this.unlinkingFirstNode.highlight(false);
                    this.unlinkingFirstNode = null;
                } else {
                    // Aynı düğüme tıklandı - seçimi iptal et
                    this.unlinkingFirstNode.setColor('#667eea');
                    this.unlinkingFirstNode.highlight(false);
                    this.unlinkingFirstNode = null;
                    this.showResult(`
                        <div class="error-message">
                            <span>✂️</span> <strong>Bağlantı Silme Modu Aktif</strong>
                        </div>
                        <p style="color: #475569; text-align: center; margin-top: 10px;">
                            Bağlantısını silmek istediğiniz ilk düğüme tıklayın
                        </p>
                    `);
                }
            }
            return;
        }

        // Bilgi modundaysa (düğüm bilgisi görüntüleme)
        if (this.infoMode) {
            if (clickedNode) {
                this.showNodeInfo(clickedNode);
            }
            return;
        }

        // Seçim modundaysa
        if (this.selectionMode) {
            if (clickedNode) {
                this.handleNodeSelection(clickedNode);
            }
            return;
        }

        if (clickedNode) {
            // Sol tık: Sürükleme veya bağlantı başlat
            if (e.button === 0) {
                if (e.shiftKey) {
                    // Shift basılıysa bağlantı modu
                    this.isConnecting = true;
                    this.connectStartNode = clickedNode;
                } else {
                    // Normal sürükleme
                    this.isDragging = true;
                    this.draggedNode = clickedNode;
                    clickedNode.isDragging = true;
                }
            }
        } else {
            // Boş alana tıklama: Yeni düğüm ekle (bağlama veya silme modunda değilse)
            if (e.button === 0 && !this.linkingMode && !this.unlinkingMode) {
                this.graph.addNode(pos.x, pos.y);
                this.updateStats();
            }
        }
    }

    // Bağlama modunu aç/kapat
    toggleLinkingMode() {
        // Eğer diğer modlar aktifse önce onları kapat
        if (this.unlinkingMode) {
            this.toggleUnlinkingMode();
        }
        if (this.infoMode) {
            this.infoMode = false;
            document.getElementById('nodeInfoBtn').classList.remove('active');
            document.getElementById('nodeInfoBtn').innerHTML = '<span>ℹ️</span> Düğüm Bilgisi';
        }

        this.linkingMode = !this.linkingMode;

        // Eğer seçili düğüm varsa sıfırla
        if (this.linkingFirstNode) {
            this.linkingFirstNode.setColor('#667eea');
            this.linkingFirstNode.highlight(false);
            this.linkingFirstNode = null;
        }

        const linkBtn = document.getElementById('linkNodesBtn');

        if (this.linkingMode) {
            linkBtn.classList.add('active');
            linkBtn.innerHTML = '<span>🔗</span> Bağlama Modu Aktif';
            this.showResult(`
                <div class="info-message">
                    <span>🔗</span> <strong>Bağlama Modu Aktif</strong>
                </div>
                <p style="color: #475569; text-align: center; margin-top: 10px;">
                    Bağlamak istediğiniz ilk düğüme tıklayın
                </p>
            `);
        } else {
            linkBtn.classList.remove('active');
            linkBtn.innerHTML = '<span>🔗</span> Düğümleri Bağla';
            this.graph.clearHighlights();
            this.showResult(`
                <div class="info-message">
                    <span>👋</span> <strong>Bağlama modu kapatıldı</strong>
                </div>
            `);
        }
    }

    // Bağlantı silme modunu aç/kapat
    toggleUnlinkingMode() {
        // Eğer diğer modlar aktifse önce onları kapat
        if (this.linkingMode) {
            this.toggleLinkingMode();
        }
        if (this.infoMode) {
            this.infoMode = false;
            document.getElementById('nodeInfoBtn').classList.remove('active');
            document.getElementById('nodeInfoBtn').innerHTML = '<span>ℹ️</span> Düğüm Bilgisi';
        }

        this.unlinkingMode = !this.unlinkingMode;

        // Eğer seçili düğüm varsa sıfırla
        if (this.unlinkingFirstNode) {
            this.unlinkingFirstNode.setColor('#667eea');
            this.unlinkingFirstNode.highlight(false);
            this.unlinkingFirstNode = null;
        }

        const unlinkBtn = document.getElementById('unlinkNodesBtn');

        if (this.unlinkingMode) {
            unlinkBtn.classList.add('active');
            unlinkBtn.innerHTML = '<span>✂️</span> Silme Modu Aktif';
            this.showResult(`
                <div class="error-message">
                    <span>✂️</span> <strong>Bağlantı Silme Modu Aktif</strong>
                </div>
                <p style="color: #475569; text-align: center; margin-top: 10px;">
                    Bağlantısını silmek istediğiniz ilk düğüme tıklayın
                </p>
            `);
        } else {
            unlinkBtn.classList.remove('active');
            unlinkBtn.innerHTML = '<span>✂️</span> Bağlantı Sil';
            this.graph.clearHighlights();
            this.showResult(`
                <div class="info-message">
                    <span>👋</span> <strong>Silme modu kapatıldı</strong>
                </div>
            `);
        }
    }

    // Bilgi modunu aç/kapat
    toggleInfoMode() {
        // Eğer diğer modlar aktifse önce onları kapat
        if (this.linkingMode) {
            this.toggleLinkingMode();
        }
        if (this.unlinkingMode) {
            this.toggleUnlinkingMode();
        }

        this.infoMode = !this.infoMode;

        const infoBtn = document.getElementById('nodeInfoBtn');

        if (this.infoMode) {
            infoBtn.classList.add('active');
            infoBtn.innerHTML = '<span>ℹ️</span> Bilgi Modu Aktif';
            this.showResult(`
                <div class="info-message">
                    <span>ℹ️</span> <strong>Bilgi Modu Aktif</strong>
                </div>
                <p style="color: #475569; text-align: center; margin-top: 10px;">
                    Bilgilerini görmek istediğiniz düğüme tıklayın
                </p>
            `);
        } else {
            infoBtn.classList.remove('active');
            infoBtn.innerHTML = '<span>ℹ️</span> Düğüm Bilgisi';
            this.graph.clearHighlights();
            this.showResult(`
                <div class="info-message">
                    <span>👋</span> <strong>Bilgi modu kapatıldı</strong>
                </div>
            `);
        }
    }

    // Düğüm bilgilerini modal ile göster
    showNodeInfo(node) {
        // Düğümü vurgula
        this.graph.clearHighlights();
        node.setColor('#3b82f6'); // Mavi
        node.highlight(true);

        // Komşuları bul
        const neighbors = this.graph.getNeighbors(node);

        // Bağlı kenarları ve toplam ağırlığı hesapla
        let totalWeight = 0;
        neighbors.forEach(n => {
            totalWeight += n.weight;
        });
        const avgWeight = neighbors.length > 0 ? (totalWeight / neighbors.length).toFixed(2) : 0;

        // Derece merkezi olarak sıralama hesapla
        const allDegrees = this.graph.nodes.map(n => ({
            node: n,
            degree: this.graph.getNeighbors(n).length
        })).sort((a, b) => b.degree - a.degree);

        const rank = allDegrees.findIndex(item => item.node === node) + 1;

        // Komşu etiketlerini oluştur
        const neighborTags = neighbors.length > 0
            ? neighbors.map(n => `<span class="modal-neighbor-tag">${n.node.label}</span>`).join('')
            : '<span style="color: #94a3b8;">Bağlı düğüm yok</span>';

        // Modal içeriğini oluştur
        const modalContent = `
            <div class="modal-info-grid">
                <div class="modal-info-card">
                    <div class="icon">🆔</div>
                    <div class="label">ID</div>
                    <div class="value">${node.id}</div>
                </div>
                <div class="modal-info-card">
                    <div class="icon">📍</div>
                    <div class="label">Konum</div>
                    <div class="value">(${Math.round(node.x)}, ${Math.round(node.y)})</div>
                </div>
                <div class="modal-info-card">
                    <div class="icon">⚡</div>
                    <div class="label">Aktiflik</div>
                    <div class="value">${node.aktiflik}</div>
                </div>
                <div class="modal-info-card">
                    <div class="icon">💬</div>
                    <div class="label">Etkileşim</div>
                    <div class="value">${node.etkilesim}</div>
                </div>
                <div class="modal-info-card">
                    <div class="icon">🔗</div>
                    <div class="label">Bağlantı</div>
                    <div class="value">${node.baglantiSayisi}</div>
                </div>
                <div class="modal-info-card">
                    <div class="icon">📊</div>
                    <div class="label">Ort. Ağırlık</div>
                    <div class="value">${avgWeight}</div>
                </div>
            </div>

            <div style="text-align: center;">
                <div class="modal-rank-badge">
                    🏆 Popülerlik Sırası
                    <span class="rank-number">${rank}/${this.graph.nodes.length}</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">👥 Komşu Düğümler</div>
                <div class="modal-neighbors">
                    ${neighborTags}
                </div>
            </div>
        `;

        // Modal'ı aç
        this.openModal(`ℹ️ ${node.label} - Düğüm Bilgileri`, modalContent);

        // Sonuçlar panelinde de kısa bilgi göster
        this.showResult(`
            <div class="info-message">
                <span>ℹ️</span> <strong>${node.label} seçildi</strong>
            </div>
            <p style="color: #475569; text-align: center; margin-top: 10px;">
                Detaylı bilgiler modal penceresinde görüntüleniyor
            </p>
        `);
    }

    // Modal'ı aç
    openModal(title, content) {
        const modal = document.getElementById('infoModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.innerHTML = title;
        modalBody.innerHTML = content;

        modal.classList.add('active');
    }

    // Modal'ı kapat
    closeModal() {
        const modal = document.getElementById('infoModal');
        modal.classList.remove('active');
    }

    // Mouse hareket olayı
    handleMouseMove(e) {
        const pos = this.getMousePos(e);

        // Düğüm sürükleme
        if (this.isDragging && this.draggedNode) {
            this.draggedNode.x = pos.x;
            this.draggedNode.y = pos.y;

            // Ağırlıkları güncelle (pozisyon değişimi ağırlığı etkilemese de)
            this.graph.recalculateWeights();
        }

        // Bağlantı çizgisi çizme (görsel feedback)
        if (this.isConnecting && this.connectStartNode) {
            this.render();

            // Geçici çizgi çiz
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(this.connectStartNode.x, this.connectStartNode.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    // Mouse bırakma olayı
    handleMouseUp(e) {
        const pos = this.getMousePos(e);

        // Bağlantı oluşturma
        if (this.isConnecting && this.connectStartNode) {
            const targetNode = this.graph.getNodeAt(pos.x, pos.y);
            if (targetNode && targetNode !== this.connectStartNode) {
                this.graph.addEdge(this.connectStartNode, targetNode);
                this.updateStats();
            }
            this.isConnecting = false;
            this.connectStartNode = null;
        }

        // Sürüklemeyi bitir
        if (this.isDragging && this.draggedNode) {
            this.draggedNode.isDragging = false;
            this.draggedNode = null;
            this.isDragging = false;
        }
    }

    // Çift tıklama: Düğüm veya bağlantı sil
    handleDoubleClick(e) {
        const pos = this.getMousePos(e);

        // Önce düğüm kontrolü yap
        const clickedNode = this.graph.getNodeAt(pos.x, pos.y);
        if (clickedNode) {
            this.graph.removeNode(clickedNode);
            this.updateStats();
            this.showResult(`
                <div class="info-message">
                    <span>🗑️</span> <strong>Düğüm silindi: ${clickedNode.label}</strong>
                </div>
            `);
            return;
        }

        // Düğüm yoksa bağlantı kontrolü yap
        const clickedEdge = this.graph.getEdgeAt(pos.x, pos.y);
        if (clickedEdge) {
            const sourceLabel = clickedEdge.source.label;
            const targetLabel = clickedEdge.target.label;
            this.graph.removeEdge(clickedEdge);
            this.updateStats();
            this.showResult(`
                <div class="info-message">
                    <span>🔗</span> <strong>Bağlantı silindi</strong>
                </div>
                <p style="color: #475569; text-align: center; margin-top: 8px;">
                    ${sourceLabel} ↔ ${targetLabel} bağlantısı kaldırıldı
                </p>
            `);
        }
    }

    // Düğüm seçimi (algoritma için)
    handleNodeSelection(node) {
        if (this.selectionMode === 'start') {
            this.selectedStartNode = node;
            node.setColor('#00ff00'); // Yeşil
            document.getElementById('selectionInfo').textContent = 'Bitiş düğümünü seçin';
            this.selectionMode = 'end';
        } else if (this.selectionMode === 'end') {
            this.selectedEndNode = node;
            node.setColor('#ff0000'); // Kırmızı
            this.selectionMode = null;
            document.getElementById('nodeSelectorSection').style.display = 'none';

            // Algoritmayı çalıştır
            this.runSelectedAlgorithm();
        } else {
            this.selectedStartNode = node;
            this.selectedEndNode = null;
            this.selectionMode = null;
            document.getElementById('nodeSelectorSection').style.display = 'none';

            // Algoritmayı çalıştır
            this.runSelectedAlgorithm();
        }
    }

    // Seçilen algoritmayı başlat
    startAlgorithmSelection(algorithm) {
        this.currentAlgorithm = algorithm;
        this.graph.clearHighlights();

        // Dijkstra için iki düğüm seç
        if (algorithm === 'dijkstra') {
            if (this.graph.nodes.length < 2) {
                this.showResult('En az 2 düğüm gerekli!', 'error');
                return;
            }
            this.selectionMode = 'start';
            document.getElementById('nodeSelectorSection').style.display = 'block';
            document.getElementById('selectionInfo').textContent = 'Başlangıç düğümünü seçin';
        }
        // BFS ve DFS için tek düğüm seç
        else if (algorithm === 'bfs' || algorithm === 'dfs') {
            if (this.graph.nodes.length === 0) {
                this.showResult('En az 1 düğüm gerekli!', 'error');
                return;
            }
            this.selectionMode = 'start';
            document.getElementById('nodeSelectorSection').style.display = 'block';
            document.getElementById('selectionInfo').textContent = 'Başlangıç düğümünü seçin';
        }
        // Diğer algoritmalar düğüm seçimi gerektirmez
        else {
            this.runSelectedAlgorithm();
        }
    }

    // Seçimi iptal et
    cancelSelection() {
        this.selectionMode = null;
        this.selectedStartNode = null;
        this.selectedEndNode = null;
        this.currentAlgorithm = null;
        this.graph.clearHighlights();
        document.getElementById('nodeSelectorSection').style.display = 'none';
    }

    // Algoritmayı çalıştır
    async runSelectedAlgorithm() {
        if (!this.currentAlgorithm) return;

        let result;

        try {
            switch (this.currentAlgorithm) {
                case 'bfs':
                    result = await this.algorithm.bfs(this.selectedStartNode);
                    this.displayBFSResult(result);
                    break;

                case 'dfs':
                    result = await this.algorithm.dfs(this.selectedStartNode);
                    this.displayDFSResult(result);
                    break;

                case 'dijkstra':
                    result = await this.algorithm.dijkstra(this.selectedStartNode, this.selectedEndNode);
                    this.displayDijkstraResult(result);
                    break;

                case 'welsh-powell':
                    result = await this.algorithm.welshPowell();
                    this.displayWelshPowellResult(result);
                    break;

                case 'degree-centrality':
                    result = await this.algorithm.degreeCentrality();
                    this.displayDegreeCentralityResult(result);
                    break;
            }
        } catch (error) {
            this.showResult('Algoritma çalıştırılırken hata oluştu: ' + error.message, 'error');
        }

        // Seçimleri temizle
        this.selectedStartNode = null;
        this.selectedEndNode = null;
        this.currentAlgorithm = null;
    }

    // BFS sonuçlarını göster
    displayBFSResult(result) {
        const pathDisplay = result.visited.map(n => `<span style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 10px; border-radius: 6px; margin: 2px; display: inline-block; font-weight: 600;">${n.label}</span>`).join('<span style="color: #94a3b8; margin: 0 4px;">→</span>');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <p><strong>🔍 Ziyaret Sırası:</strong></p>
            <div style="margin-top: 10px; padding: 12px; background: #f8fafc; border-radius: 10px; line-height: 2;">
                ${pathDisplay}
            </div>
        `;
        this.showResult(html);
    }

    // DFS sonuçlarını göster
    displayDFSResult(result) {
        const pathDisplay = result.visited.map(n => `<span style="background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 4px 10px; border-radius: 6px; margin: 2px; display: inline-block; font-weight: 600;">${n.label}</span>`).join('<span style="color: #94a3b8; margin: 0 4px;">→</span>');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <p><strong>🔍 Ziyaret Sırası:</strong></p>
            <div style="margin-top: 10px; padding: 12px; background: #f8fafc; border-radius: 10px; line-height: 2;">
                ${pathDisplay}
            </div>
        `;
        this.showResult(html);
    }

    // Dijkstra sonuçlarını göster
    displayDijkstraResult(result) {
        if (result.path.length === 0) {
            this.showResult(`<div class="error-message"><span>✕</span> ${result.message}</div>`, 'error');
            return;
        }

        const pathDisplay = result.path.map(n => `<span style="background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 4px 10px; border-radius: 6px; margin: 2px; display: inline-block; font-weight: 600;">${n.label}</span>`).join('<span style="color: #94a3b8; margin: 0 4px;">→</span>');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <p><strong>🛤️ En Kısa Yol:</strong></p>
            <div style="margin-top: 10px; padding: 12px; background: #f8fafc; border-radius: 10px; line-height: 2;">
                ${pathDisplay}
            </div>
            <div style="margin-top: 14px; display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600; color: #334155;">📊 Toplam Maliyet:</span>
                <span style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 15px;">${result.distance.toFixed(2)}</span>
            </div>
        `;
        this.showResult(html);
    }

    // Welsh-Powell sonuçlarını göster
    displayWelshPowellResult(result) {
        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <div style="margin-top: 10px; padding: 14px; background: #f8fafc; border-radius: 10px; text-align: center;">
                <span style="font-size: 32px;">🎨</span>
                <p style="margin-top: 8px; color: #475569; font-weight: 500;">Graf başarıyla renklendirildi!</p>
                <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Komşu düğümler farklı renklerdedir.</p>
            </div>
        `;
        this.showResult(html);
    }

    // Degree Centrality sonuçlarını göster
    displayDegreeCentralityResult(result) {
        const tableRows = result.top5.map((item, index) => `
            <tr>
                <td style="font-weight: 600; color: ${index === 0 ? '#f59e0b' : '#64748b'};">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1)}</td>
                <td><span style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;">${item.node.label}</span></td>
                <td><span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-weight: 600;">${item.degree}</span></td>
            </tr>
        `).join('');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <table class="result-table">
                <thead>
                    <tr>
                        <th style="width: 60px;">Sıra</th>
                        <th>Düğüm</th>
                        <th style="width: 100px;">Bağlantı</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        this.showResult(html);
    }

    // Sonuç ekranını güncelle
    showResult(html, type = 'success') {
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.innerHTML = html;
    }

    // İstatistikleri güncelle
    updateStats() {
        document.getElementById('nodeCount').textContent = this.graph.nodes.length;
        document.getElementById('edgeCount').textContent = this.graph.edges.length;
    }

    // Render döngüsü
    startRenderLoop() {
        const animate = () => {
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Canvas'ı çiz
    render() {
        // Canvas'ı temizle
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Grafiği çiz
        this.graph.draw(this.ctx);
    }
}

// ============================================================================
// UYGULAMA BAŞLATICI
// DOM yüklendiğinde uygulamayı başlat
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Graf ve Canvas yöneticisini oluştur
    const graph = new Graph();
    const canvasManager = new CanvasManager('graphCanvas', graph);

    // Buton event listener'ları
    document.getElementById('addNodeBtn').addEventListener('click', () => {
        const canvas = document.getElementById('graphCanvas');
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * (canvas.height - 100) + 50;
        graph.addNode(x, y);
        canvasManager.updateStats();
    });

    document.getElementById('generateRandomBtn').addEventListener('click', () => {
        graph.generateRandom(10);
        canvasManager.updateStats();
        canvasManager.showResult(`
            <div class="success-message">
                <span>✓</span> <strong>Rastgele ağ oluşturuldu!</strong>
            </div>
            <div style="text-align: center; padding: 10px;">
                <span style="font-size: 28px;">🎲</span>
                <p style="color: #475569; margin-top: 8px;">10 düğümlü rastgele bir sosyal ağ oluşturuldu.</p>
            </div>
        `);
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        graph.clear();
        canvasManager.updateStats();
        canvasManager.showResult(`
            <p class="placeholder-text">
                Bir algoritma seçin ve çalıştırın
            </p>
        `);
    });

    document.getElementById('runAlgorithmBtn').addEventListener('click', () => {
        const algorithm = document.getElementById('algorithmSelect').value;

        if (!algorithm) {
            canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Lütfen bir algoritma seçin!</strong></div>', 'error');
            return;
        }

        if (graph.nodes.length === 0) {
            canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Graf boş!</strong> Lütfen düğüm ekleyin.</div>', 'error');
            return;
        }

        canvasManager.startAlgorithmSelection(algorithm);
    });

    document.getElementById('cancelSelectionBtn').addEventListener('click', () => {
        canvasManager.cancelSelection();
    });

    // Düğümleri Bağla butonu
    document.getElementById('linkNodesBtn').addEventListener('click', () => {
        canvasManager.toggleLinkingMode();
    });

    // Bağlantı Sil butonu
    document.getElementById('unlinkNodesBtn').addEventListener('click', () => {
        canvasManager.toggleUnlinkingMode();
    });

    // Düğüm Bilgisi butonu
    document.getElementById('nodeInfoBtn').addEventListener('click', () => {
        canvasManager.toggleInfoMode();
    });

    // Modal kapatma butonu
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        canvasManager.closeModal();
    });

    // Modal dışına tıklama ile kapatma
    document.getElementById('infoModal').addEventListener('click', (e) => {
        if (e.target.id === 'infoModal') {
            canvasManager.closeModal();
        }
    });

    // ESC tuşu ile modal kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            canvasManager.closeModal();
        }
    });

    // ==========================================================================
    // VERİ DIŞA/İÇE AKTARIM EVENT LISTENER'LARI
    // ==========================================================================

    // JSON Dışa Aktar (Kaydet diyaloğu ile)
    document.getElementById('exportJsonBtn').addEventListener('click', async () => {
        if (graph.nodes.length === 0) {
            canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Graf boş!</strong> Önce düğüm ekleyin.</div>');
            return;
        }

        const data = graph.toJSON();
        const jsonStr = JSON.stringify(data, null, 2);

        try {
            // Modern File System Access API - "Farklı Kaydet" diyaloğu açar
            if ('showSaveFilePicker' in window) {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: `sosyal_ag_${new Date().toISOString().slice(0, 10)}.json`,
                    types: [{
                        description: 'JSON Dosyası',
                        accept: { 'application/json': ['.json'] }
                    }]
                });

                const writable = await fileHandle.createWritable();
                await writable.write(jsonStr);
                await writable.close();

                // Başarı bildirimi (seçilen konum ile)
                canvasManager.showResult(`
                    <div class="success-message">
                        <span>✓</span> <strong>JSON kaydedildi!</strong>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <span style="font-size: 28px;">📤</span>
                        <p style="color: #475569; margin-top: 8px;">
                            Graf verisi komşuluk listesi ile birlikte kaydedildi.
                        </p>
                        <p style="color: #64748b; font-size: 12px; margin-top: 4px;">
                            ${data.metadata.nodeCount} düğüm, ${data.metadata.edgeCount} bağlantı
                        </p>
                    </div>
                `);
            } else {
                // Fallback: Eski tarayıcılar için otomatik indirme
                const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sosyal_ag_${new Date().toISOString().slice(0, 10)}.json`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();

                // Temizlik için biraz bekle
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                canvasManager.showResult(`
                    <div class="success-message">
                        <span>✓</span> <strong>JSON dışa aktarıldı!</strong>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <span style="font-size: 28px;">📤</span>
                        <p style="color: #475569; margin-top: 8px;">
                            Graf verisi komşuluk listesi ile birlikte kaydedildi.
                        </p>
                        <p style="color: #64748b; font-size: 12px; margin-top: 4px;">
                            ${data.metadata.nodeCount} düğüm, ${data.metadata.edgeCount} bağlantı
                        </p>
                    </div>
                `);
            }
        } catch (err) {
            // Kullanıcı iptal ettiğinde veya hata oluştuğunda
            if (err.name !== 'AbortError') {
                canvasManager.showResult(`<div class="error-message"><span>✕</span> <strong>Kayıt başarısız!</strong> ${err.message}</div>`);
            }
        }
    });

    // CSV Dışa Aktar (Komşuluk Matrisi)
    document.getElementById('exportCsvBtn').addEventListener('click', async () => {
        if (graph.nodes.length === 0) {
            canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Graf boş!</strong> Önce düğüm ekleyin.</div>');
            return;
        }

        const csvContent = graph.toCSV();
        const fileName = `komsuluk_matrisi_${new Date().toISOString().slice(0, 10)}.csv`;

        try {
            // Modern File System Access API - "Farklı Kaydet" diyaloğu açar
            if ('showSaveFilePicker' in window) {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'CSV Dosyası',
                        accept: { 'text/csv': ['.csv'] }
                    }]
                });

                const writable = await fileHandle.createWritable();
                await writable.write(csvContent);
                await writable.close();

                // Başarı bildirimi
                canvasManager.showResult(`
                    <div class="success-message">
                        <span>✓</span> <strong>CSV kaydedildi!</strong>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <span style="font-size: 28px;">📊</span>
                        <p style="color: #475569; margin-top: 8px;">
                            Komşuluk matrisi CSV formatında kaydedildi.
                        </p>
                        <p style="color: #64748b; font-size: 12px; margin-top: 4px;">
                            ${graph.nodes.length}x${graph.nodes.length} boyutunda matris
                        </p>
                    </div>
                `);
            } else {
                // Fallback: Eski tarayıcılar için otomatik indirme
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();

                // Temizlik için biraz bekle
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                // Başarı bildirimi
                canvasManager.showResult(`
                    <div class="success-message">
                        <span>✓</span> <strong>CSV dışa aktarıldı!</strong>
                    </div>
                    <div style="text-align: center; padding: 10px;">
                        <span style="font-size: 28px;">📊</span>
                        <p style="color: #475569; margin-top: 8px;">
                            Komşuluk matrisi CSV formatında kaydedildi.
                        </p>
                        <p style="color: #64748b; font-size: 12px; margin-top: 4px;">
                            ${graph.nodes.length}x${graph.nodes.length} boyutunda matris
                        </p>
                    </div>
                `);
            }
        } catch (err) {
            // Kullanıcı iptal ettiğinde veya hata oluştuğunda
            if (err.name !== 'AbortError') {
                canvasManager.showResult(`<div class="error-message"><span>✕</span> <strong>Kayıt başarısız!</strong> ${err.message}</div>`);
            }
        }
    });

    // Veri İçe Aktar
    document.getElementById('importFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const content = event.target.result;
            const fileName = file.name.toLowerCase();

            try {
                if (fileName.endsWith('.json')) {
                    // JSON içe aktarım
                    const data = JSON.parse(content);
                    graph.fromJSON(data);
                    canvasManager.updateStats();

                    canvasManager.showResult(`
                        <div class="success-message">
                            <span>✓</span> <strong>JSON içe aktarıldı!</strong>
                        </div>
                        <div style="text-align: center; padding: 10px;">
                            <span style="font-size: 28px;">📥</span>
                            <p style="color: #475569; margin-top: 8px;">
                                Graf başarıyla yüklendi.
                            </p>
                            <p style="color: #64748b; font-size: 12px; margin-top: 4px;">
                                ${graph.nodes.length} düğüm, ${graph.edges.length} bağlantı
                            </p>
                        </div>
                    `);
                } else if (fileName.endsWith('.csv')) {
                    // CSV içe aktarım
                    graph.fromCSV(content);
                    canvasManager.updateStats();

                    canvasManager.showResult(`
                        <div class="success-message">
                            <span>✓</span> <strong>CSV içe aktarıldı!</strong>
                        </div>
                        <div style="text-align: center; padding: 10px;">
                            <span style="font-size: 28px;">📥</span>
                            <p style="color: #475569; margin-top: 8px;">
                                Komşuluk matrisinden graf oluşturuldu.
                            </p>
                            <p style="color: #64748b; font-size: 12px; margin-top: 4px;">
                                ${graph.nodes.length} düğüm, ${graph.edges.length} bağlantı
                            </p>
                        </div>
                    `);
                } else {
                    canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Desteklenmeyen dosya formatı!</strong> JSON veya CSV dosyası seçin.</div>');
                }
            } catch (error) {
                canvasManager.showResult(`<div class="error-message"><span>✕</span> <strong>Dosya okunamadı!</strong> ${error.message}</div>`);
            }

            // Input'u sıfırla (aynı dosyayı tekrar seçebilmek için)
            e.target.value = '';
        };

        reader.onerror = () => {
            canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Dosya okunamadı!</strong></div>');
        };

        reader.readAsText(file);
    });

    // Başlangıç mesajı
    canvasManager.showResult(`
        <div class="info-message">
            <span>👋</span> <strong>Hoş Geldiniz!</strong>
        </div>
        <div style="text-align: center; padding: 10px;">
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Sol menüden işlemler yapabilir,<br>Canvas üzerinde düğümler oluşturabilirsiniz.
            </p>
        </div>
    `);
});
