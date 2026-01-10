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
     * @param {Node} startNode - Başlangıç düğümü
     * @param {Node} endNode - Kullanılmaz
     * @param {boolean} visualize - Görselleştirme yapılsın mı
     * @returns {Promise<Object>} - Ziyaret edilen düğümler ve mesaj
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        // Validasyon
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
}
