// ============================================================================
// IGRAPH (GRAF) ARAYÜZÜ
// Graf yapısı için sözleşme tanımı
// ============================================================================

/**
 * IGraph Arayüzü
 * Graf veri yapısının uyması gereken sözleşme
 * IDrawable arayüzünü de genişletir
 * 
 * @interface IGraph
 * @extends IDrawable
 */
const IGraph = {
    /**
     * Arayüz adı
     * @type {string}
     */
    name: 'IGraph',

    /**
     * Genişletilen arayüzler
     * @type {Array<string>}
     */
    extends: ['IDrawable'],

    /**
     * Gerekli özellikler
     * @type {Array<Object>}
     */
    requiredProperties: [
        { name: 'nodes', type: 'Array<INode>', description: 'Graf düğümleri' },
        { name: 'edges', type: 'Array<IEdge>', description: 'Graf kenarları' }
    ],

    /**
     * Arayüzün gerektirdiği metodlar
     * @type {Array<Object>}
     */
    requiredMethods: [
        {
            name: 'draw',
            parameters: ['ctx'],
            description: 'Grafı canvas üzerine çizer',
            returnType: 'void'
        },
        {
            name: 'addNode',
            parameters: ['x', 'y'],
            description: 'Grafa yeni düğüm ekler',
            returnType: 'INode'
        },
        {
            name: 'addEdge',
            parameters: ['source', 'target'],
            description: 'İki düğüm arasında kenar ekler',
            returnType: 'IEdge|null'
        },
        {
            name: 'removeNode',
            parameters: ['node'],
            description: 'Düğümü ve bağlı kenarları siler',
            returnType: 'void'
        },
        {
            name: 'getNeighbors',
            parameters: ['node'],
            description: 'Düğümün komşularını döndürür',
            returnType: 'Array<{node: INode, weight: number}>'
        },
        {
            name: 'hasEdge',
            parameters: ['source', 'target'],
            description: 'İki düğüm arasında kenar var mı kontrol eder',
            returnType: 'boolean'
        },
        {
            name: 'getEdge',
            parameters: ['source', 'target'],
            description: 'İki düğüm arasındaki kenarı döndürür',
            returnType: 'IEdge|undefined'
        },
        {
            name: 'clear',
            parameters: [],
            description: 'Grafı temizler',
            returnType: 'void'
        },
        {
            name: 'clearHighlights',
            parameters: [],
            description: 'Tüm vurgulamaları temizler',
            returnType: 'void'
        }
    ],

    /**
     * Bir nesnenin bu arayüzü implement edip etmediğini kontrol eder
     * @param {Object} instance - Kontrol edilecek nesne
     * @returns {boolean} - Arayüz implement edilmiş mi
     */
    isImplementedBy(instance) {
        // Metod kontrolü
        const hasAllMethods =
            typeof instance.draw === 'function' &&
            typeof instance.addNode === 'function' &&
            typeof instance.addEdge === 'function' &&
            typeof instance.removeNode === 'function' &&
            typeof instance.getNeighbors === 'function' &&
            typeof instance.hasEdge === 'function' &&
            typeof instance.getEdge === 'function' &&
            typeof instance.clear === 'function' &&
            typeof instance.clearHighlights === 'function';

        // Özellik kontrolü
        const hasAllProperties =
            Array.isArray(instance.nodes) &&
            Array.isArray(instance.edges);

        return hasAllMethods && hasAllProperties;
    },

    /**
     * Arayüz uyumluluğunu doğrular, hata varsa fırlatır
     * @param {Object} instance - Kontrol edilecek nesne
     * @throws {Error} - Arayüz implement edilmemişse
     */
    validate(instance) {
        const missingMethods = [];
        const missingProps = [];

        // Metod kontrolü
        if (typeof instance.draw !== 'function') missingMethods.push('draw(ctx)');
        if (typeof instance.addNode !== 'function') missingMethods.push('addNode(x, y)');
        if (typeof instance.addEdge !== 'function') missingMethods.push('addEdge(source, target)');
        if (typeof instance.removeNode !== 'function') missingMethods.push('removeNode(node)');
        if (typeof instance.getNeighbors !== 'function') missingMethods.push('getNeighbors(node)');
        if (typeof instance.hasEdge !== 'function') missingMethods.push('hasEdge(source, target)');
        if (typeof instance.getEdge !== 'function') missingMethods.push('getEdge(source, target)');
        if (typeof instance.clear !== 'function') missingMethods.push('clear()');
        if (typeof instance.clearHighlights !== 'function') missingMethods.push('clearHighlights()');

        // Özellik kontrolü
        if (!Array.isArray(instance.nodes)) missingProps.push('nodes (Array)');
        if (!Array.isArray(instance.edges)) missingProps.push('edges (Array)');

        if (missingMethods.length > 0 || missingProps.length > 0) {
            let errorMsg = `${instance.constructor.name} sınıfı IGraph arayüzünü implement etmiyor!\n`;
            if (missingMethods.length > 0) {
                errorMsg += `Eksik metodlar: ${missingMethods.join(', ')}\n`;
            }
            if (missingProps.length > 0) {
                errorMsg += `Eksik özellikler: ${missingProps.join(', ')}`;
            }
            throw new Error(errorMsg);
        }
    }
};

// Global erişim için
if (typeof window !== 'undefined') {
    window.IGraph = IGraph;
}
