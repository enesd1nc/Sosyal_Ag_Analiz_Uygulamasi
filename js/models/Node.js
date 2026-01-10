// ============================================================================
// NODE (DÜĞÜM) SINIFI
// Her bir kullanıcıyı / düğümü temsil eder
// ============================================================================
class Node {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.color = '#667eea';
        this.label = `U${id}`;
        
        // Dinamik ağırlık hesaplaması için gerekli özellikler
        // Bu değerler rastgele atanır (1-100 arası)
        this.aktiflik = Math.floor(Math.random() * 100) + 1;
        this.etkilesim = Math.floor(Math.random() * 100) + 1;
        this.baglantiSayisi = 0; // Başlangıçta 0, bağlantı eklendikçe artacak
        
        // Görsel efektler için
        this.isHighlighted = false;
        this.isDragging = false;
    }

    // Düğümü canvas üzerine çiz
    draw(ctx) {
        ctx.save();
        
        // Vurguluysa daire çevresinde glow efekti
        if (this.isHighlighted) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
        }
        
        // Dış daire (border)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // İç daire (beyaz)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Label (düğüm adı)
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.x, this.y);
        
        ctx.restore();
    }

    // Bir noktanın bu düğümün içinde olup olmadığını kontrol et
    containsPoint(x, y) {
        const distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
        return distance <= this.radius;
    }

    // Düğümün rengini değiştir
    setColor(color) {
        this.color = color;
    }

    // Düğümü vurgula
    highlight(isHighlighted = true) {
        this.isHighlighted = isHighlighted;
    }
}
