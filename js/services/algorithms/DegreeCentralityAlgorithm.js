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
     * @param {Node} startNode - Kullanılmaz
     * @param {Node} endNode - Kullanılmaz
     * @param {boolean} visualize - Görselleştirme yapılsın mı
     * @returns {Object} - Sıralamalar, top 5 ve mesaj
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        this.clearHighlights();

        // Her düğümün derece sayısını hesapla
        const centralityScores = this.graph.nodes.map(node => {
            const degree = this.graph.getNeighbors(node).length;
            return { node, degree };
        });

        // Dereceye göre sırala
        centralityScores.sort((a, b) => b.degree - a.degree);

        // İlk 5'i vurgula
        const top5 = centralityScores.slice(0, 5);

        if (visualize) {
            top5.forEach((item, index) => {
                // Gradient renklendirme (altın, gümüş, bronz, ...)
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
