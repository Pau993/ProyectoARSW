// Esperar a que el DOM esté completamente cargado antes de inicializar el canvas
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        console.error("❌ Error: No se encontró el canvas 'gameCanvas'.");
        return;
    }

    window.ctx = canvas.getContext("2d"); // Hacer `ctx` accesible globalmente
    window.canvas = canvas; // Hacer `canvas` accesible globalmente

    drawMap(); // Dibujar el mapa inicialmente

    // Inicializar el bus en una posición aleatoria dentro de la carretera
    const startPosition = getRandomRoadPosition();
    window.bus = { x: startPosition.x, y: startPosition.y, width: 30, height: 20 };

    drawBus(); // Dibujar el bus inicialmente
});

function getRandomRoadPosition() {
    const roadPositions = [];
    const width = window.canvas.width;
    const height = window.canvas.height;
    const busWidth = 30;
    const busHeight = 20;
    const roadSize = 40; // Tamaño de las carreteras

    // Carreteras horizontales
    for (let y = 100; y < height; y += 200) {
        for (let x = 0; x < width; x += 200) {
            roadPositions.push({ x: x + (roadSize - busWidth) / 2, y: y + (roadSize - busHeight) / 2 });
        }
    }

    // Carreteras verticales
    for (let x = 100; x < width; x += 200) {
        for (let y = 0; y < height; y += 200) {
            roadPositions.push({ x: x + (roadSize - busWidth) / 2, y: y + (roadSize - busHeight) / 2 });
        }
    }

    // Seleccionar una posición aleatoria
    return roadPositions[Math.floor(Math.random() * roadPositions.length)];
}

function drawBus() {
    if (!window.ctx || !window.canvas) {
        console.error("❌ Error: El canvas o el contexto no están inicializados.");
        return;
    }

    // Limpiar el canvas antes de dibujar
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    // Redibujar el mapa
    drawMap();

    // 🚌 Cuerpo del bus
    window.ctx.fillStyle = "yellow";
    window.ctx.fillRect(window.bus.x, window.bus.y, window.bus.width, window.bus.height);

    // 🖼 Ventanas del bus
    window.ctx.fillStyle = "blue";
    const windowPositions = [5, 15];
    windowPositions.forEach(offset => {
        window.ctx.fillRect(window.bus.x + offset, window.bus.y + 2, 8, 8);
    });

    // ⚫ Ruedas del bus
    window.ctx.fillStyle = "black";
    [5, 20].forEach(offset => {
        window.ctx.beginPath();
        window.ctx.arc(window.bus.x + offset, window.bus.y + window.bus.height, 3, 0, Math.PI * 2);
        window.ctx.fill();
    });
}