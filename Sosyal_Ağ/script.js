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

// ============================================================================
// ALGORITHM (ALGORİTMA) SINIFI
// Tüm graf algoritmaları bu sınıfta
// ============================================================================
class Algorithm {
    constructor(graph) {
        this.graph = graph;
    }

    // ========================================================================
    // BFS (Breadth-First Search - Genişlik Öncelikli Arama)
    // Seçilen düğümden başlayarak tüm ulaşılabilir düğümleri katman katman gezer
    // ========================================================================
    async bfs(startNode, visualize = true) {
        if (!startNode) return { visited: [], message: "Başlangıç düğümü bulunamadı!" };
        
        this.graph.clearHighlights();
        
        const visited = new Set();
        const queue = [startNode];
        const visitOrder = [];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (visited.has(current)) continue;
            
            visited.add(current);
            visitOrder.push(current);
            
            // Görselleştirme
            if (visualize) {
                current.setColor('#28a745'); // Yeşil
                current.highlight(true);
                await this.sleep(500);
            }
            
            // Komşuları kuyruğa ekle
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

    // ========================================================================
    // DFS (Depth-First Search - Derinlik Öncelikli Arama)
    // Seçilen düğümden başlayarak derine doğru gider
    // ========================================================================
    async dfs(startNode, visualize = true) {
        if (!startNode) return { visited: [], message: "Başlangıç düğümü bulunamadı!" };
        
        this.graph.clearHighlights();
        
        const visited = new Set();
        const visitOrder = [];
        
        const dfsRecursive = async (node) => {
            if (visited.has(node)) return;
            
            visited.add(node);
            visitOrder.push(node);
            
            // Görselleştirme
            if (visualize) {
                node.setColor('#dc3545'); // Kırmızı
                node.highlight(true);
                await this.sleep(500);
            }
            
            // Komşuları ziyaret et
            const neighbors = this.graph.getNeighbors(node);
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

    // ========================================================================
    // DİJKSTRA EN KISA YOL ALGORİTMASI
    // İki düğüm arasındaki en kısa yolu bulur (ağırlıklı)
    // ========================================================================
    async dijkstra(startNode, endNode, visualize = true) {
        if (!startNode || !endNode) {
            return { path: [], distance: Infinity, message: "Başlangıç veya bitiş düğümü bulunamadı!" };
        }
        
        if (startNode === endNode) {
            return { path: [startNode], distance: 0, message: "Başlangıç ve bitiş aynı düğüm!" };
        }
        
        this.graph.clearHighlights();
        
        // Mesafe ve önceki düğüm bilgilerini tut
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set(this.graph.nodes);
        
        // Başlangıç mesafelerini ayarla
        this.graph.nodes.forEach(node => {
            distances.set(node, Infinity);
            previous.set(node, null);
        });
        distances.set(startNode, 0);
        
        // Ana döngü
        while (unvisited.size > 0) {
            // En küçük mesafeli düğümü bul
            let current = null;
            let minDistance = Infinity;
            
            unvisited.forEach(node => {
                if (distances.get(node) < minDistance) {
                    minDistance = distances.get(node);
                    current = node;
                }
            });
            
            // Eğer ulaşılamaz bir duruma geldiyse dur
            if (current === null || minDistance === Infinity) break;
            
            // Hedefe ulaştıysak dur
            if (current === endNode) break;
            
            unvisited.delete(current);
            
            // Görselleştirme - şu anki düğüm
            if (visualize && current !== startNode) {
                current.setColor('#ffc107'); // Sarı
                current.highlight(true);
                await this.sleep(300);
            }
            
            // Komşuları kontrol et
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
        
        // Yolu oluştur
        const path = [];
        let current = endNode;
        
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }
        
        // Yol bulunamazsa
        if (path[0] !== startNode) {
            return { 
                path: [], 
                distance: Infinity, 
                message: "Bu iki düğüm arasında yol bulunamadı!" 
            };
        }
        
        // Yolu vurgula
        if (visualize) {
            for (let i = 0; i < path.length; i++) {
                path[i].setColor('#ff0000'); // Kırmızı
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

    // ========================================================================
    // WELSH-POWELL RENKLENDİRME ALGORİTMASI
    // Grafiği, komşu düğümler farklı renklerde olacak şekilde boyar
    // ========================================================================
    welshPowell() {
        this.graph.clearHighlights();
        
        // Düğümleri derece sayısına göre sırala (en fazla bağlantı en üstte)
        const sortedNodes = [...this.graph.nodes].sort((a, b) => {
            const degreeA = this.graph.getNeighbors(a).length;
            const degreeB = this.graph.getNeighbors(b).length;
            return degreeB - degreeA;
        });
        
        // Renk paleti
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
        ];
        
        const nodeColors = new Map();
        
        // Her düğüm için renk ata
        sortedNodes.forEach(node => {
            // Komşuların renklerini al
            const neighborColors = new Set();
            const neighbors = this.graph.getNeighbors(node);
            
            neighbors.forEach(({ node: neighbor }) => {
                if (nodeColors.has(neighbor)) {
                    neighborColors.add(nodeColors.get(neighbor));
                }
            });
            
            // İlk uygun rengi bul
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
        
        // Kullanılan renk sayısı
        const usedColors = new Set(nodeColors.values());
        
        return {
            colorCount: usedColors.size,
            message: `Graf ${usedColors.size} farklı renkle boyandı. Kromatik sayı ≤ ${usedColors.size}`
        };
    }

    // ========================================================================
    // DEGREE CENTRALITY (DERECE MERKEZİLİĞİ)
    // En fazla bağlantıya sahip düğümleri bulur (en popüler kullanıcılar)
    // ========================================================================
    degreeCentrality() {
        this.graph.clearHighlights();
        
        // Her düğümün derece sayısını hesapla
        const centralityScores = this.graph.nodes.map(node => {
            const degree = this.graph.getNeighbors(node).length;
            return { node, degree };
        });
        
        // Dereceye göre sırala
        centralityScores.sort((a, b) => b.degree - a.degree);
        
        // İlk 5'i vurgula
        const top5 = centralityScores.slice(0, 5);
        
        top5.forEach((item, index) => {
            // Gradient renklendirme (altın, gümüş, bronz, ...)
            const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4169E1', '#32CD32'];
            item.node.setColor(colors[index]);
            item.node.highlight(true);
        });
        
        return {
            rankings: centralityScores,
            top5: top5,
            message: `En popüler ${Math.min(5, centralityScores.length)} düğüm listelendi.`
        };
    }

    // Yardımcı fonksiyon: Animasyon için gecikme
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
            // Boş alana tıklama: Yeni düğüm ekle
            if (e.button === 0) {
                this.graph.addNode(pos.x, pos.y);
                this.updateStats();
            }
        }
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

    // Çift tıklama: Düğüm sil
    handleDoubleClick(e) {
        const pos = this.getMousePos(e);
        const clickedNode = this.graph.getNodeAt(pos.x, pos.y);
        
        if (clickedNode) {
            this.graph.removeNode(clickedNode);
            this.updateStats();
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
                    result = this.algorithm.welshPowell();
                    this.displayWelshPowellResult(result);
                    break;
                    
                case 'degree-centrality':
                    result = this.algorithm.degreeCentrality();
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
        const html = `
            <div class="success-message">
                <strong>✓ ${result.message}</strong>
            </div>
            <p><strong>Ziyaret Sırası:</strong></p>
            <p>${result.visited.map(n => n.label).join(' → ')}</p>
        `;
        this.showResult(html);
    }

    // DFS sonuçlarını göster
    displayDFSResult(result) {
        const html = `
            <div class="success-message">
                <strong>✓ ${result.message}</strong>
            </div>
            <p><strong>Ziyaret Sırası:</strong></p>
            <p>${result.visited.map(n => n.label).join(' → ')}</p>
        `;
        this.showResult(html);
    }

    // Dijkstra sonuçlarını göster
    displayDijkstraResult(result) {
        if (result.path.length === 0) {
            this.showResult(`<div class="error-message">${result.message}</div>`, 'error');
            return;
        }
        
        const html = `
            <div class="success-message">
                <strong>✓ ${result.message}</strong>
            </div>
            <p><strong>En Kısa Yol:</strong></p>
            <p>${result.path.map(n => n.label).join(' → ')}</p>
            <p><strong>Toplam Maliyet:</strong> ${result.distance.toFixed(2)}</p>
        `;
        this.showResult(html);
    }

    // Welsh-Powell sonuçlarını göster
    displayWelshPowellResult(result) {
        const html = `
            <div class="success-message">
                <strong>✓ ${result.message}</strong>
            </div>
            <p>Graf başarıyla renklendirildi. Komşu düğümler farklı renklerdedir.</p>
        `;
        this.showResult(html);
    }

    // Degree Centrality sonuçlarını göster
    displayDegreeCentralityResult(result) {
        const tableRows = result.top5.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.node.label}</td>
                <td>${item.degree}</td>
            </tr>
        `).join('');
        
        const html = `
            <div class="success-message">
                <strong>✓ ${result.message}</strong>
            </div>
            <table class="result-table">
                <thead>
                    <tr>
                        <th>Sıra</th>
                        <th>Düğüm</th>
                        <th>Bağlantı</th>
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
        canvasManager.showResult('<p class="placeholder-text">Rastgele ağ oluşturuldu!</p>');
    });
    
    document.getElementById('clearBtn').addEventListener('click', () => {
        graph.clear();
        canvasManager.updateStats();
        canvasManager.showResult('<p class="placeholder-text">👆 Bir algoritma seçin ve çalıştırın</p>');
    });
    
    document.getElementById('runAlgorithmBtn').addEventListener('click', () => {
        const algorithm = document.getElementById('algorithmSelect').value;
        
        if (!algorithm) {
            canvasManager.showResult('<div class="error-message">Lütfen bir algoritma seçin!</div>', 'error');
            return;
        }
        
        if (graph.nodes.length === 0) {
            canvasManager.showResult('<div class="error-message">Graf boş! Lütfen düğüm ekleyin.</div>', 'error');
            return;
        }
        
        canvasManager.startAlgorithmSelection(algorithm);
    });
    
    document.getElementById('cancelSelectionBtn').addEventListener('click', () => {
        canvasManager.cancelSelection();
    });
    
    // Başlangıç mesajı
    canvasManager.showResult(`
        <div class="info-message">
            <strong>Hoş Geldiniz!</strong><br>
            Sol menüden işlemler yapabilir, Canvas üzerinde düğümler oluşturabilirsiniz.
        </div>
    `);
});
