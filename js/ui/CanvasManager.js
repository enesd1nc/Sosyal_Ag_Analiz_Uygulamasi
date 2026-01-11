// ============================================================================
// CANVAS YÖNETİCİSİ SINIFI
// Canvas etkileşimlerini ve çizim döngüsünü yönetir
// ============================================================================
class CanvasManager {
    constructor(canvasId, graph) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.graph = graph;
        this.algorithm = new Algorithm(graph);

        // Etkileşim durumları
        this.isDragging = false;
        this.draggedNode = null;
        this.isConnecting = false;
        this.connectStartNode = null;

        // Seçim modu (algoritma için düğüm seçimi)
        this.selectionMode = null; // 'start', 'end', null
        this.selectedStartNode = null;
        this.selectedEndNode = null;
        this.currentAlgorithm = null;

        this.initCanvas();
        this.setupEventListeners();
        this.startRenderLoop();
    }

    // Canvas boyutunu ayarla
    initCanvas() {
        const resizeCanvas = () => {
            const parent = this.canvas.parentElement;
            this.canvas.width = parent.clientWidth - 40;
            this.canvas.height = parent.clientHeight - 80;
            this.render();
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Mouse ve touch olaylarını dinle
    setupEventListeners() {
        // Mouse olayları
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

        // Context menu'yi devre dışı bırak
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Canvas koordinatlarını al
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // Mouse basma olayı
    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        const clickedNode = this.graph.getNodeAt(pos.x, pos.y);

        // Seçim modundaysa
        if (this.selectionMode) {
            if (clickedNode) {
                this.handleNodeSelection(clickedNode);
            }
            return;
        }

        if (clickedNode) {
            // Sol tık: Sürükleme veya bağlantı başlat
            if (e.button === 0) {
                if (e.shiftKey) {
                    // Shift basılıysa bağlantı modu
                    this.isConnecting = true;
                    this.connectStartNode = clickedNode;
                } else {
                    // Normal sürükleme
                    this.isDragging = true;
                    this.draggedNode = clickedNode;
                    clickedNode.isDragging = true;
                }
            }
        } else {
            // Boş alana tıklama: Yeni düğüm ekle
            if (e.button === 0) {
                this.graph.addNode(pos.x, pos.y);
                this.updateStats();
            }
        }
    }

    // Mouse hareket olayı
    handleMouseMove(e) {
        const pos = this.getMousePos(e);

        // Düğüm sürükleme
        if (this.isDragging && this.draggedNode) {
            this.draggedNode.x = pos.x;
            this.draggedNode.y = pos.y;

            // Ağırlıkları güncelle (pozisyon değişimi ağırlığı etkilemese de)
            this.graph.recalculateWeights();
        }

        // Bağlantı çizgisi çizme (görsel feedback)
        if (this.isConnecting && this.connectStartNode) {
            this.render();

            // Geçici çizgi çiz
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(this.connectStartNode.x, this.connectStartNode.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    // Mouse bırakma olayı
    handleMouseUp(e) {
        const pos = this.getMousePos(e);

        // Bağlantı oluşturma
        if (this.isConnecting && this.connectStartNode) {
            const targetNode = this.graph.getNodeAt(pos.x, pos.y);
            if (targetNode && targetNode !== this.connectStartNode) {
                this.graph.addEdge(this.connectStartNode, targetNode);
                this.updateStats();
            }
            this.isConnecting = false;
            this.connectStartNode = null;
        }

        // Sürüklemeyi bitir
        if (this.isDragging && this.draggedNode) {
            this.draggedNode.isDragging = false;
            this.draggedNode = null;
            this.isDragging = false;
        }
    }

    // Çift tıklama: Düğüm sil
    handleDoubleClick(e) {
        const pos = this.getMousePos(e);
        const clickedNode = this.graph.getNodeAt(pos.x, pos.y);

        if (clickedNode) {
            this.graph.removeNode(clickedNode);
            this.updateStats();
        }
    }

    // Düğüm seçimi (algoritma için)
    handleNodeSelection(node) {
        if (this.selectionMode === 'start') {
            this.selectedStartNode = node;
            node.setColor('#00ff00'); // Yeşil
            document.getElementById('selectionInfo').textContent = 'Bitiş düğümünü seçin';
            this.selectionMode = 'end';
        } else if (this.selectionMode === 'end') {
            this.selectedEndNode = node;
            node.setColor('#ff0000'); // Kırmızı
            this.selectionMode = null;
            document.getElementById('nodeSelectorSection').style.display = 'none';

            // Algoritmayı çalıştır
            this.runSelectedAlgorithm();
        } else {
            this.selectedStartNode = node;
            this.selectedEndNode = null;
            this.selectionMode = null;
            document.getElementById('nodeSelectorSection').style.display = 'none';

            // Algoritmayı çalıştır
            this.runSelectedAlgorithm();
        }
    }

    // Seçilen algoritmayı başlat
    startAlgorithmSelection(algorithm) {
        this.currentAlgorithm = algorithm;
        this.graph.clearHighlights();

        // Dijkstra için iki düğüm seç
        if (algorithm === 'dijkstra') {
            if (this.graph.nodes.length < 2) {
                this.showResult('En az 2 düğüm gerekli!', 'error');
                return;
            }
            this.selectionMode = 'start';
            document.getElementById('nodeSelectorSection').style.display = 'block';
            document.getElementById('selectionInfo').textContent = 'Başlangıç düğümünü seçin';
        }
        // BFS ve DFS için tek düğüm seç
        else if (algorithm === 'bfs' || algorithm === 'dfs') {
            if (this.graph.nodes.length === 0) {
                this.showResult('En az 1 düğüm gerekli!', 'error');
                return;
            }
            this.selectionMode = 'start';
            document.getElementById('nodeSelectorSection').style.display = 'block';
            document.getElementById('selectionInfo').textContent = 'Başlangıç düğümünü seçin';
        }
        // Diğer algoritmalar düğüm seçimi gerektirmez
        else {
            this.runSelectedAlgorithm();
        }
    }

    // Seçimi iptal et
    cancelSelection() {
        this.selectionMode = null;
        this.selectedStartNode = null;
        this.selectedEndNode = null;
        this.currentAlgorithm = null;
        this.graph.clearHighlights();
        document.getElementById('nodeSelectorSection').style.display = 'none';
    }

    // Algoritmayı çalıştır
    async runSelectedAlgorithm() {
        if (!this.currentAlgorithm) return;

        let result;

        try {
            switch (this.currentAlgorithm) {
                case 'bfs':
                    result = await this.algorithm.bfs(this.selectedStartNode);
                    this.displayBFSResult(result);
                    break;

                case 'dfs':
                    result = await this.algorithm.dfs(this.selectedStartNode);
                    this.displayDFSResult(result);
                    break;

                case 'dijkstra':
                    result = await this.algorithm.dijkstra(this.selectedStartNode, this.selectedEndNode);
                    this.displayDijkstraResult(result);
                    break;

                case 'welsh-powell':
                    result = this.algorithm.welshPowell();
                    this.displayWelshPowellResult(result);
                    break;

                case 'degree-centrality':
                    result = this.algorithm.degreeCentrality();
                    this.displayDegreeCentralityResult(result);
                    break;
            }
        } catch (error) {
            this.showResult('Algoritma çalıştırılırken hata oluştu: ' + error.message, 'error');
        }

        // Seçimleri temizle
        this.selectedStartNode = null;
        this.selectedEndNode = null;
        this.currentAlgorithm = null;
    }

    // BFS sonuçlarını göster
    displayBFSResult(result) {
        const pathDisplay = result.visited.map(n => `<span style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 10px; border-radius: 6px; margin: 2px; display: inline-block; font-weight: 600;">${n.label}</span>`).join('<span style="color: #94a3b8; margin: 0 4px;">→</span>');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <p><strong>🔍 Ziyaret Sırası:</strong></p>
            <div style="margin-top: 10px; padding: 12px; background: #f8fafc; border-radius: 10px; line-height: 2;">
                ${pathDisplay}
            </div>
        `;
        this.showResult(html);
    }

    // DFS sonuçlarını göster
    displayDFSResult(result) {
        const pathDisplay = result.visited.map(n => `<span style="background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 4px 10px; border-radius: 6px; margin: 2px; display: inline-block; font-weight: 600;">${n.label}</span>`).join('<span style="color: #94a3b8; margin: 0 4px;">→</span>');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <p><strong>🔍 Ziyaret Sırası:</strong></p>
            <div style="margin-top: 10px; padding: 12px; background: #f8fafc; border-radius: 10px; line-height: 2;">
                ${pathDisplay}
            </div>
        `;
        this.showResult(html);
    }

    // Dijkstra sonuçlarını göster
    displayDijkstraResult(result) {
        if (result.path.length === 0) {
            this.showResult(`<div class="error-message"><span>✕</span> ${result.message}</div>`, 'error');
            return;
        }

        const pathDisplay = result.path.map(n => `<span style="background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 4px 10px; border-radius: 6px; margin: 2px; display: inline-block; font-weight: 600;">${n.label}</span>`).join('<span style="color: #94a3b8; margin: 0 4px;">→</span>');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <p><strong>🛤️ En Kısa Yol:</strong></p>
            <div style="margin-top: 10px; padding: 12px; background: #f8fafc; border-radius: 10px; line-height: 2;">
                ${pathDisplay}
            </div>
            <div style="margin-top: 14px; display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600; color: #334155;">📊 Toplam Maliyet:</span>
                <span style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 15px;">${result.distance.toFixed(2)}</span>
            </div>
        `;
        this.showResult(html);
    }

    // Welsh-Powell sonuçlarını göster
    displayWelshPowellResult(result) {
        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <div style="margin-top: 10px; padding: 14px; background: #f8fafc; border-radius: 10px; text-align: center;">
                <span style="font-size: 32px;">🎨</span>
                <p style="margin-top: 8px; color: #475569; font-weight: 500;">Graf başarıyla renklendirildi!</p>
                <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Komşu düğümler farklı renklerdedir.</p>
            </div>
        `;
        this.showResult(html);
    }

    // Degree Centrality sonuçlarını göster
    displayDegreeCentralityResult(result) {
        const tableRows = result.top5.map((item, index) => `
            <tr>
                <td style="font-weight: 600; color: ${index === 0 ? '#f59e0b' : '#64748b'};">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1)}</td>
                <td><span style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600;">${item.node.label}</span></td>
                <td><span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-weight: 600;">${item.degree}</span></td>
            </tr>
        `).join('');

        const html = `
            <div class="success-message">
                <span>✓</span> <strong>${result.message}</strong>
            </div>
            <table class="result-table">
                <thead>
                    <tr>
                        <th style="width: 60px;">Sıra</th>
                        <th>Düğüm</th>
                        <th style="width: 100px;">Bağlantı</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        this.showResult(html);
    }

    // Sonuç ekranını güncelle
    showResult(html, type = 'success') {
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.innerHTML = html;
    }

    // İstatistikleri güncelle
    updateStats() {
        document.getElementById('nodeCount').textContent = this.graph.nodes.length;
        document.getElementById('edgeCount').textContent = this.graph.edges.length;
    }

    // Render döngüsü
    startRenderLoop() {
        const animate = () => {
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Canvas'ı çiz
    render() {
        // Canvas'ı temizle
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Grafiği çiz
        this.graph.draw(this.ctx);
    }
}
