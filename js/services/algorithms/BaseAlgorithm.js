// ============================================================================
// BASE ALGORITHM (TEMEL ALGORİTMA) SINIFI
// Tüm algoritmaların miras aldığı soyut temel sınıf
// Kalıtım (Inheritance) ve Polimorfizm (Polymorphism) için temel yapı
// @implements {IAlgorithm}
// @abstract
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
     * @param {Node} startNode - Başlangıç düğümü
     * @param {Node} endNode - Bitiş düğümü
     * @returns {Object|null} - Hata varsa hata objesi, yoksa null
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
     * @param {number} ms - Milisaniye cinsinden gecikme
     * @returns {Promise<void>}
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
     * @returns {Object} - Algoritma meta verileri
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
