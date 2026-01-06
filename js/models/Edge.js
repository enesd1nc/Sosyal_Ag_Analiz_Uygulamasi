// ============================================================================
// EDGE (BAĞLANTI) SINIFI
// İki düğüm arasındaki bağlantıyı temsil eder
// ============================================================================
class Edge {
    constructor(source, target) {
        this.source = source;
        this.target = target;
        this.weight = this.calculateWeight(); // Dinamik ağırlık hesapla
        this.color = '#999';
        this.lineWidth = 2;
        this.isHighlighted = false;

        // Bağlantı sayısını güncelle
        source.baglantiSayisi++;
        target.baglantiSayisi++;
    }

    // Dinamik Ağırlık Formülü (PDF gereksinimi)
    // Maliyet = 1 + sqrt((Aktiflik_i - Aktiflik_j)^2 + (Etkilesim_i - Etkilesim_j)^2 + (BaglantiSayisi_i - BaglantiSayisi_j)^2)
    calculateWeight() {
        const aktiflikFark = Math.pow(this.source.aktiflik - this.target.aktiflik, 2);
        const etkilesimFark = Math.pow(this.source.etkilesim - this.target.etkilesim, 2);
        const baglantiSayisiFark = Math.pow(this.source.baglantiSayisi - this.target.baglantiSayisi, 2);

        const maliyet = 1 + Math.sqrt(aktiflikFark + etkilesimFark + baglantiSayisiFark);
        return Math.round(maliyet * 10) / 10; // 1 ondalık basamağa yuvarla
    }

    // Bağlantıyı çiz
    draw(ctx) {
        ctx.save();

        // Vurguluysa kalınlık ve renk değiştir
        if (this.isHighlighted) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }

        // Çizgi çiz
        ctx.beginPath();
        ctx.moveTo(this.source.x, this.source.y);
        ctx.lineTo(this.target.x, this.target.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        // Ağırlığı çizginin ortasına yaz
        const midX = (this.source.x + this.target.x) / 2;
        const midY = (this.source.y + this.target.y) / 2;

        // Ağırlık için küçük bir arka plan kutusu
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(midX - 15, midY - 10, 30, 20);

        // Ağırlık değerini yaz
        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.weight.toFixed(1), midX, midY);

        ctx.restore();
    }

    // Bağlantıyı vurgula (Dijkstra için)
    highlight(color = '#ff0000', lineWidth = 4) {
        this.isHighlighted = true;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    // Vurgulamayı kaldır
    unhighlight() {
        this.isHighlighted = false;
        this.color = '#999';
        this.lineWidth = 2;
    }
}
