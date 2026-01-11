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
     * @param {Node} startNode - Kullanılmaz
     * @param {Node} endNode - Kullanılmaz
     * @param {boolean} visualize - Görselleştirme yapılsın mı
     * @returns {Object} - Kullanılan renk sayısı ve mesaj
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        this.clearHighlights();

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
}
