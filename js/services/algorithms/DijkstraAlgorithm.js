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
     * @param {Node} startNode - Başlangıç düğümü
     * @param {Node} endNode - Bitiş düğümü
     * @param {boolean} visualize - Görselleştirme yapılsın mı
     * @returns {Promise<Object>} - Yol, mesafe ve mesaj
     */
    async execute(startNode = null, endNode = null, visualize = true) {
        // Validasyon
        const validationError = this.validate(startNode, endNode);
        if (validationError) return validationError;

        if (startNode === endNode) {
            return { path: [startNode], distance: 0, message: 'Başlangıç ve bitiş aynı düğüm!' };
        }

        this.clearHighlights();

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
                message: 'Bu iki düğüm arasında yol bulunamadı!'
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
}
