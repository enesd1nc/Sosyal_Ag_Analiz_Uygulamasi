// ============================================================================
// IDRAWABLE (ÇİZİLEBİLİR) ARAYÜZÜ
// Canvas üzerine çizilebilir nesneler için sözleşme tanımı
// ============================================================================

/**
 * IDrawable Arayüzü
 * Canvas'a çizilebilir tüm nesnelerin uyması gereken sözleşme
 * 
 * Bu arayüzü implement eden sınıflar:
 * - Node (Düğüm)
 * - Edge (Kenar)
 * - Graph (Graf)
 * 
 * @interface IDrawable
 */
const IDrawable = {
    /**
     * Arayüz adı
     * @type {string}
     */
    name: 'IDrawable',

    /**
     * Arayüzün gerektirdiği metodlar
     * @type {Array<Object>}
     */
    requiredMethods: [
        {
            name: 'draw',
            parameters: ['ctx'],
            description: 'Nesneyi canvas üzerine çizer',
            returnType: 'void'
        }
    ],

    /**
     * Bir nesnenin bu arayüzü implement edip etmediğini kontrol eder
     * @param {Object} instance - Kontrol edilecek nesne
     * @returns {boolean} - Arayüz implement edilmiş mi
     */
    isImplementedBy(instance) {
        return typeof instance.draw === 'function';
    },

    /**
     * Arayüz uyumluluğunu doğrular, hata varsa fırlatır
     * @param {Object} instance - Kontrol edilecek nesne
     * @throws {Error} - Arayüz implement edilmemişse
     */
    validate(instance) {
        if (!this.isImplementedBy(instance)) {
            throw new Error(`${instance.constructor.name} sınıfı IDrawable arayüzünü implement etmiyor! 'draw(ctx)' metodu gerekli.`);
        }
    }
};

// Global erişim için
if (typeof window !== 'undefined') {
    window.IDrawable = IDrawable;
}
