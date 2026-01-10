// ============================================================================
// INODE (DÜĞÜM) ARAYÜZÜ
// Düğüm nesneleri için sözleşme tanımı
// ============================================================================

/**
 * INode Arayüzü
 * Graf düğümlerinin uyması gereken sözleşme
 * IDrawable arayüzünü de genişletir
 * 
 * @interface INode
 * @extends IDrawable
 */
const INode = {
    /**
     * Arayüz adı
     * @type {string}
     */
    name: 'INode',

    /**
     * Genişletilen arayüzler
     * @type {Array<Object>}
     */
    extends: ['IDrawable'],

    /**
     * Gerekli özellikler
     * @type {Array<Object>}
     */
    requiredProperties: [
        { name: 'id', type: 'number', description: 'Düğüm benzersiz kimliği' },
        { name: 'x', type: 'number', description: 'X koordinatı' },
        { name: 'y', type: 'number', description: 'Y koordinatı' },
        { name: 'radius', type: 'number', description: 'Düğüm yarıçapı' },
        { name: 'color', type: 'string', description: 'Düğüm rengi' },
        { name: 'label', type: 'string', description: 'Düğüm etiketi' }
    ],

    /**
     * Arayüzün gerektirdiği metodlar
     * @type {Array<Object>}
     */
    requiredMethods: [
        {
            name: 'draw',
            parameters: ['ctx'],
            description: 'Düğümü canvas üzerine çizer',
            returnType: 'void'
        },
        {
            name: 'containsPoint',
            parameters: ['x', 'y'],
            description: 'Bir noktanın düğüm içinde olup olmadığını kontrol eder',
            returnType: 'boolean'
        },
        {
            name: 'setColor',
            parameters: ['color'],
            description: 'Düğümün rengini değiştirir',
            returnType: 'void'
        },
        {
            name: 'highlight',
            parameters: ['isHighlighted'],
            description: 'Düğümü vurgular veya vurguyu kaldırır',
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
            typeof instance.containsPoint === 'function' &&
            typeof instance.setColor === 'function' &&
            typeof instance.highlight === 'function';

        // Özellik kontrolü
        const hasAllProperties =
            instance.id !== undefined &&
            instance.x !== undefined &&
            instance.y !== undefined &&
            instance.radius !== undefined;

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
        if (typeof instance.containsPoint !== 'function') missingMethods.push('containsPoint(x, y)');
        if (typeof instance.setColor !== 'function') missingMethods.push('setColor(color)');
        if (typeof instance.highlight !== 'function') missingMethods.push('highlight(isHighlighted)');

        // Özellik kontrolü
        if (instance.id === undefined) missingProps.push('id');
        if (instance.x === undefined) missingProps.push('x');
        if (instance.y === undefined) missingProps.push('y');
        if (instance.radius === undefined) missingProps.push('radius');

        if (missingMethods.length > 0 || missingProps.length > 0) {
            let errorMsg = `${instance.constructor.name} sınıfı INode arayüzünü implement etmiyor!\n`;
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
    window.INode = INode;
}
