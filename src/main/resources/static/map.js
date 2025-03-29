document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        console.error("❌ Error: No se encontró el canvas 'gameCanvas'.");
        return;
    }

    window.ctx = canvas.getContext("2d"); // Hacer `ctx` accesible globalmente
    window.canvas = canvas; // Hacer `canvas` accesible globalmente

    drawMap(); // Dibujar el mapa inicialmente
});

function drawMap() {
    // Carreteras horizontales
    drawRoad(0, 100, 1000, 20);
    drawRoad(0, 300, 1000, 20);
    drawRoad(0, 500, 1000, 20);
    drawRoad(0, 700, 1000, 20);
    drawRoad(0, 900, 1000, 20);

    // Carreteras verticales
    drawRoad(100, 0, 20, 1000);
    drawRoad(300, 0, 20, 1000);
    drawRoad(500, 0, 20, 1000);
    drawRoad(700, 0, 20, 1000);
    drawRoad(900, 0, 20, 1000);
}

function drawRoad(x, y, width, height) {
    window.ctx.fillStyle = '#808080'; // Color de la carretera
    window.ctx.fillRect(x, y, width, height);

    // Líneas blancas
    window.ctx.strokeStyle = '#FFFFFF';
    window.ctx.lineWidth = 2;
    window.ctx.setLineDash([20, 15]); // Líneas discontinuas

    if (width > height) {
        // Línea horizontal
        window.ctx.beginPath();
        window.ctx.moveTo(x, y + height / 2);
        window.ctx.lineTo(x + width, y + height / 2);
        window.ctx.stroke();
    } else {
        // Línea vertical
        window.ctx.beginPath();
        window.ctx.moveTo(x + width / 2, y);
        window.ctx.lineTo(x + width / 2, y + height);
        window.ctx.stroke();
    }
}