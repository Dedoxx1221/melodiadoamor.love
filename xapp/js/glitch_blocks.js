// Script de background com blocos roxo/preto que se movem (tipo glitch)
function initGlitchBlocks(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cores roxo e preto
    const colors = ['#2d1b4e', '#3d2461', '#4d3578', '#5d4592', '#6d55a8', '#1a0f2e', '#0d0617'];
    
    // Cria blocos que se movem
    const blocks = [];
    const blockCount = 40;
    
    for (let i = 0; i < blockCount; i++) {
        blocks.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: 40 + Math.random() * 80,
            height: 40 + Math.random() * 80,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.3 + Math.random() * 0.4
        });
    }

    let animationId = null;
    let lastTime = 0;

    function drawBlocks(currentTime) {
        if (document.hidden) {
            animationId = requestAnimationFrame(drawBlocks);
            return;
        }

        if (lastTime === 0) lastTime = currentTime;
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Fundo escuro (quase preto)
        ctx.fillStyle = 'rgba(5, 2, 15, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenha e move os blocos
        for (let block of blocks) {
            // Atualiza posição
            block.x += block.speedX;
            block.y += block.speedY;

            // Bounce nas bordas
            if (block.x < 0 || block.x + block.width > canvas.width) {
                block.speedX *= -1;
            }
            if (block.y < 0 || block.y + block.height > canvas.height) {
                block.speedY *= -1;
            }

            // Garante que não sai dos limites
            block.x = Math.max(0, Math.min(block.x, canvas.width - block.width));
            block.y = Math.max(0, Math.min(block.y, canvas.height - block.height));

            // Desenha o bloco
            ctx.fillStyle = block.color;
            ctx.globalAlpha = block.opacity;
            ctx.fillRect(block.x, block.y, block.width, block.height);
            
            // Adiciona borda roxo claro
            ctx.strokeStyle = '#a78bfa';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            ctx.strokeRect(block.x, block.y, block.width, block.height);
        }

        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(drawBlocks);
    }

    animationId = requestAnimationFrame(drawBlocks);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener('beforeunload', () => {
        if (animationId) cancelAnimationFrame(animationId);
    });
}

// Inicializa quando o DOM está pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initGlitchBlocks('matrix-canvas');
    });
} else {
    initGlitchBlocks('matrix-canvas');
}
