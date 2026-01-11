// ============================================================================
// ALGORITHM FACTORY (ALGORİTMA FABRİKASI)
// Polimorfizm için fabrika deseni kullanarak algoritma örnekleri oluşturur
// ============================================================================
class AlgorithmFactory {
    /**
     * Algoritma tipine göre uygun algoritma örneği oluşturur
     * @param {string} type - Algoritma tipi ('bfs', 'dfs', 'dijkstra', vb.)
     * @param {Graph} graph - Algoritmanın çalışacağı graf
     * @returns {BaseAlgorithm} - Polimorfik algoritma örneği
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
     * @param {Graph} graph - Test için graf örneği
     * @returns {Array<Object>} - Algoritma bilgileri listesi
     */
    static getAvailableAlgorithms(graph) {
        const algorithms = ['bfs', 'dfs', 'dijkstra', 'welsh-powell', 'degree-centrality'];
        return algorithms.map(type => {
            const algo = AlgorithmFactory.create(type, graph);
            return {
                type: type,
                name: algo.name,
                description: algo.description,
                requiresStartNode: algo.requiresStartNode,
                requiresEndNode: algo.requiresEndNode
            };
        });
    }

    /**
     * Belirli bir algoritma tipinin bilgilerini döndürür
     * @param {string} type - Algoritma tipi
     * @param {Graph} graph - Graf örneği
     * @returns {Object} - Algoritma bilgileri
     */
    static getAlgorithmInfo(type, graph) {
        const algo = AlgorithmFactory.create(type, graph);
        return algo.getInfo();
    }
}
