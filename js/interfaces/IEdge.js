// ============================================================================
// IEDGE (KENAR) ARAYÜZÜ
// Kenar nesneleri için sözleşme tanımı
// ============================================================================

/**
 * IEdge Arayüzü
 * Graf kenarlarının uyması gereken sözleşme
 * IDrawable arayüzünü de genişletir
 * 
 * @interface IEdge
 * @extends IDrawable
 */
const IEdge = {
    /**
     * Arayüz adı
     * @type {string}
     */
    name: 'IEdge',

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
        { name: 'source', type: 'INode', description: 'Kaynak düğüm' },
        { name: 'target', type: 'INode', description: 'Hedef düğüm' },
        { name: 'weight', type: 'number', description: 'Kenar ağırlığı' },
        { name: 'color', type: 'string', description: 'Kenar rengi' },
        { name: 'lineWidth', type: 'number', description: 'Çizgi kalınlığı' }
    ],

    /**
     * Arayüzün gerektirdiği metodlar
     * @type {Array<Object>}
     */
    requiredMethods: [
        {
            name: 'draw',
            parameters: ['ctx'],
            description: 'Kenarı canvas üzerine çizer',
            returnType: 'void'
        },
        {
            name: 'calculateWeight',
            parameters: [],
            description: 'Dinamik ağırlık hesaplar',
            returnType: 'number'
        },
        {
            name: 'highlight',
            parameters: ['color', 'lineWidth'],
            description: 'Kenarı vurgular',
            returnType: 'void'
        },
        {
            name: 'unhighlight',
            parameters: [],
            description: 'Vurgulamayı kaldırır',
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
            typeof instance.calculateWeight === 'function' &&
            typeof instance.highlight === 'function' &&
            typeof instance.unhighlight === 'function';

        // Özellik kontrolü
        const hasAllProperties =
            instance.source !== undefined &&
            instance.target !== undefined &&
            instance.weight !== undefined;

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
        if (typeof instance.calculateWeight !== 'function') missingMethods.push('calculateWeight()');
        if (typeof instance.highlight !== 'function') missingMethods.push('highlight(color, lineWidth)');
        if (typeof instance.unhighlight !== 'function') missingMethods.push('unhighlight()');

        // Özellik kontrolü
        if (instance.source === undefined) missingProps.push('source');
        if (instance.target === undefined) missingProps.push('target');
        if (instance.weight === undefined) missingProps.push('weight');

        if (missingMethods.length > 0 || missingProps.length > 0) {
            let errorMsg = `${instance.constructor.name} sınıfı IEdge arayüzünü implement etmiyor!\n`;
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
    window.IEdge = IEdge;
}
