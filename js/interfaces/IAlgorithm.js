// ============================================================================
// IALGORITHM (ALGORİTMA) ARAYÜZÜ
// Graf algoritmaları için sözleşme tanımı
// ============================================================================

/**
 * IAlgorithm Arayüzü
 * Tüm graf algoritmalarının uyması gereken sözleşme
 * 
 * @interface IAlgorithm
 */
const IAlgorithm = {
    /**
     * Arayüz adı
     * @type {string}
     */
    name: 'IAlgorithm',

    /**
     * Gerekli özellikler
     * @type {Array<Object>}
     */
    requiredProperties: [
        { name: 'graph', type: 'IGraph', description: 'Algoritmanın çalışacağı graf' },
        { name: 'name', type: 'string', description: 'Algoritma adı' },
        { name: 'description', type: 'string', description: 'Algoritma açıklaması' },
        { name: 'requiresStartNode', type: 'boolean', description: 'Başlangıç düğümü gerekli mi' },
        { name: 'requiresEndNode', type: 'boolean', description: 'Bitiş düğümü gerekli mi' }
    ],

    /**
     * Arayüzün gerektirdiği metodlar
     * @type {Array<Object>}
     */
    requiredMethods: [
        {
            name: 'execute',
            parameters: ['startNode', 'endNode', 'visualize'],
            description: 'Algoritmayı çalıştırır',
            returnType: 'Promise<Object>',
            isAsync: true
        },
        {
            name: 'validate',
            parameters: ['startNode', 'endNode'],
            description: 'Giriş parametrelerini doğrular',
            returnType: 'Object|null'
        },
        {
            name: 'getInfo',
            parameters: [],
            description: 'Algoritma meta verilerini döndürür',
            returnType: 'Object'
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
            typeof instance.execute === 'function' &&
            typeof instance.validate === 'function' &&
            typeof instance.getInfo === 'function';

        // Özellik kontrolü
        const hasAllProperties =
            instance.graph !== undefined &&
            instance.name !== undefined &&
            instance.description !== undefined &&
            instance.requiresStartNode !== undefined &&
            instance.requiresEndNode !== undefined;

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
        if (typeof instance.execute !== 'function') missingMethods.push('execute(startNode, endNode, visualize)');
        if (typeof instance.validate !== 'function') missingMethods.push('validate(startNode, endNode)');
        if (typeof instance.getInfo !== 'function') missingMethods.push('getInfo()');

        // Özellik kontrolü
        if (instance.graph === undefined) missingProps.push('graph');
        if (instance.name === undefined) missingProps.push('name');
        if (instance.description === undefined) missingProps.push('description');
        if (instance.requiresStartNode === undefined) missingProps.push('requiresStartNode');
        if (instance.requiresEndNode === undefined) missingProps.push('requiresEndNode');

        if (missingMethods.length > 0 || missingProps.length > 0) {
            let errorMsg = `${instance.constructor.name} sınıfı IAlgorithm arayüzünü implement etmiyor!\n`;
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
    window.IAlgorithm = IAlgorithm;
}
