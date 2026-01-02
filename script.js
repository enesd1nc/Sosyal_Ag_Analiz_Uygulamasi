// ============================================================================
// SOSYAL AĞ ANALİZİ - OOP TABANLI JAVASCRIPT UYGULAMASI
// ============================================================================

// ============================================================================
// NODE SINIFI
// Her kullanıcıyı temsil eder
// ============================================================================
class Node {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.color = '#667eea';
        this.label = `U${id}`;
        
        // Rastgele değerler (1-100)
        this.aktiflik = Math.floor(Math.random() * 100) + 1;
        this.etkilesim = Math.floor(Math.random() * 100) + 1;
        this.baglantiSayisi = 0; // Başlangıçta 0
        
        // Görsel durumlar
        this.isHighlighted = false;
        this.isDragging = false;
    }

    // Düğümü canvas üzerine çiz
    draw(ctx) { /* ... */ }

    // Bir noktanın düğüm içinde olup olmadığını kontrol et
    containsPoint(x, y) { /* ... */ }

    // Düğümün rengini ayarla
    setColor(color) { /* ... */ }

    // Düğümü vurgula
    highlight(isHighlighted = true) { /* ... */ }
}

// ============================================================================
// EDGE SINIFI
// İki düğüm arasındaki bağlantıyı temsil eder
// ============================================================================
class Edge {
    constructor(source, target) {
        this.source = source;
        this.target = target;
        this.weight = this.calculateWeight(); // Ağırlığı hesapla
        this.color = '#999';
        this.lineWidth = 2;
        this.isHighlighted = false;
        
        // Bağlantı sayısını güncelle
        source.baglantiSayisi++;
        target.baglantiSayisi++;
    }

    // Ağırlık hesaplama formülü
    calculateWeight() { /* ... */ }

    // Bağlantıyı çiz
    draw(ctx) { /* ... */ }

    // Bağlantıyı vurgula
    highlight(color = '#ff0000', lineWidth = 4) { /* ... */ }

    // Vurgulamayı kaldır
    unhighlight() { /* ... */ }
}

// ============================================================================
// GRAPH SINIFI
// Düğümleri ve kenarları yöneten ana sınıf
// ============================================================================
class Graph {
    constructor() { /* ... */ }

    addNode(x, y) { /* ... */ }
    addEdge(source, target) { /* ... */ }
    hasEdge(source, target) { /* ... */ }
    removeNode(node) { /* ... */ }
    recalculateWeights() { /* ... */ }
    getNodeAt(x, y) { /* ... */ }
    getNeighbors(node) { /* ... */ }
    getEdge(source, target) { /* ... */ }
    clear() { /* ... */ }
    generateRandom(nodeCount = 8) { /* ... */ }
    draw(ctx) { /* ... */ }
    clearHighlights() { /* ... */ }
}

// ============================================================================
// ALGORITHM SINIFI
// Graf algoritmalarını içerir (BFS, DFS, Dijkstra, Welsh-Powell, Degree Centrality)
// ============================================================================
class Algorithm {
    constructor(graph) { /* ... */ }

    // BFS - Genişlik öncelikli arama
    async bfs(startNode, visualize = true) { /* ... */ }

    // DFS - Derinlik öncelikli arama
    async dfs(startNode, visualize = true) { /* ... */ }

    // Dijkstra - En kısa yol
    async dijkstra(startNode, endNode, visualize = true) { /* ... */ }

    // Welsh-Powell - Graf boyama
    welshPowell() { /* ... */ }

    // Degree Centrality - En popüler düğümler
    degreeCentrality() { /* ... */ }

    // Yardımcı: Gecikme
    sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}

// ============================================================================
// CANVAS MANAGER SINIFI
// Canvas ve kullanıcı etkileşimlerini yönetir
// ============================================================================
class CanvasManager {
    constructor(canvasId, graph) { /* ... */ }

    initCanvas() { /* ... */ }
    setupEventListeners() { /* ... */ }
    getMousePos(e) { /* ... */ }
    handleMouseDown(e) { /* ... */ }
    handleMouseMove(e) { /* ... */ }
    handleMouseUp(e) { /* ... */ }
    handleDoubleClick(e) { /* ... */ }
    handleNodeSelection(node) { /* ... */ }
    startAlgorithmSelection(algorithm) { /* ... */ }
    cancelSelection() { /* ... */ }
    async runSelectedAlgorithm() { /* ... */ }
    displayBFSResult(result) { /* ... */ }
    displayDFSResult(result) { /* ... */ }
    displayDijkstraResult(result) { /* ... */ }
    displayWelshPowellResult(result) { /* ... */ }
    displayDegreeCentralityResult(result) { /* ... */ }
    showResult(html, type = 'success') { /* ... */ }
    updateStats() { /* ... */ }
    startRenderLoop() { /* ... */ }
}

