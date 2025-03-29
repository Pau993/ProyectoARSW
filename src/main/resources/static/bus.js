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
});

function drawBuses() {
    if (!window.ctx || !window.canvas) {
        console.error("❌ Error: El canvas o el contexto no están inicializados.");
        return;
    }

    // Limpiar el canvas antes de dibujar
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    // Redibujar el mapa
    drawMap();

    console.log("🚌 Dibujando buses, total:", Object.keys(buses).length);
    console.log(buses);

    Object.values(buses).forEach(bus => {
        // 🚌 Cuerpo del bus
        window.ctx.fillStyle = "yellow";
        window.ctx.fillRect(bus.x, bus.y, bus.width, bus.height);

        // 🖼 Ventanas del bus
        window.ctx.fillStyle = "blue";
        const windowPositions = [5, 20, 35];
        windowPositions.forEach(offset => {
            window.ctx.fillRect(bus.x + offset, bus.y + 5, 10, 10);
        });

        // ⚫ Ruedas del bus
        window.ctx.fillStyle = "black";
        [10, 40].forEach(offset => {
            window.ctx.beginPath();
            window.ctx.arc(bus.x + offset, bus.y + bus.height, 5, 0, Math.PI * 2);
            window.ctx.fill();
        });
    });
}