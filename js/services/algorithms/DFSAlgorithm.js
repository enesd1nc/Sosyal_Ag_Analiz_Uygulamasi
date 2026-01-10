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
        const visitOrder = [];
        const self = this;

        const dfsRecursive = async (node) => {
            if (visited.has(node)) return;

            visited.add(node);
            visitOrder.push(node);

            // Görselleştirme
            if (visualize) {
                node.setColor('#dc3545'); // Kırmızı
                node.highlight(true);
                await self.sleep(500);
            }

            // Komşuları ziyaret et
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
