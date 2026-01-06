// ============================================================================
// UYGULAMA BAŞLATICI
// DOM yüklendiğinde uygulamayı başlat
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Graf ve Canvas yöneticisini oluştur
    const graph = new Graph();
    const canvasManager = new CanvasManager('graphCanvas', graph);

    // Buton event listener'ları
    document.getElementById('addNodeBtn').addEventListener('click', () => {
        const canvas = document.getElementById('graphCanvas');
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * (canvas.height - 100) + 50;
        graph.addNode(x, y);
        canvasManager.updateStats();
    });

    document.getElementById('generateRandomBtn').addEventListener('click', () => {
        graph.generateRandom(10);
        canvasManager.updateStats();
        canvasManager.showResult(`
            <div class="success-message">
                <span>✓</span> <strong>Rastgele ağ oluşturuldu!</strong>
            </div>
            <div style="text-align: center; padding: 10px;">
                <span style="font-size: 28px;">🎲</span>
                <p style="color: #475569; margin-top: 8px;">10 düğümlü rastgele bir sosyal ağ oluşturuldu.</p>
            </div>
        `);
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        graph.clear();
        canvasManager.updateStats();
        canvasManager.showResult(`
            <p class="placeholder-text">
                Bir algoritma seçin ve çalıştırın
            </p>
        `);
    });

    document.getElementById('runAlgorithmBtn').addEventListener('click', () => {
        const algorithm = document.getElementById('algorithmSelect').value;

        if (!algorithm) {
            canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Lütfen bir algoritma seçin!</strong></div>', 'error');
            return;
        }

        if (graph.nodes.length === 0) {
            canvasManager.showResult('<div class="error-message"><span>✕</span> <strong>Graf boş!</strong> Lütfen düğüm ekleyin.</div>', 'error');
            return;
        }

        canvasManager.startAlgorithmSelection(algorithm);
    });

    document.getElementById('cancelSelectionBtn').addEventListener('click', () => {
        canvasManager.cancelSelection();
    });

    // Başlangıç mesajı
    canvasManager.showResult(`
        <div class="info-message">
            <span>👋</span> <strong>Hoş Geldiniz!</strong>
        </div>
        <div style="text-align: center; padding: 10px;">
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Sol menüden işlemler yapabilir,<br>Canvas üzerinde düğümler oluşturabilirsiniz.
            </p>
        </div>
    `);
});
