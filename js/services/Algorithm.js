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
