// Modificar el event listener inicial
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        console.error("Error: No se encontró el canvas 'gameCanvas'.");
        return;
    }

    window.ctx = canvas.getContext("2d"); // Hacer `ctx` accesible globalmente
    
    // Dibujar el mapa una vez al cargar la página
    createMap();
});

function drawBuses() {
    console.log("Datos actuales de buses:", buses);
    // Verificar si el canvas y el contexto están inicializados
    if (!buses) {
        console.error("Error: No hay datos de buses disponibles.");
        return;
    }
    if (!window.ctx || !window.canvas) {
        console.error("Error: El canvas o el contexto no están inicializados.");
        return;
    }

    console.log("Dibujando buses, total:", Object.keys(buses).length);
    console.log(buses); // Muestra los buses en consola

    // Redibujar el mapa completo antes de dibujar los buses
    createMap();

    // Dibujar nuevos buses
    Object.entries(buses).forEach(([id, bus]) => {
        // Cuerpo del bus
        window.ctx.fillStyle = "yellow";
        window.ctx.fillRect(bus.x, bus.y, bus.width, bus.height);

        // Ventanas del bus
        window.ctx.fillStyle = "blue";
        const windowPositions = [5, 20, 35];
        windowPositions.forEach(offset => {
            window.ctx.fillRect(bus.x + offset, bus.y + 5, 10, 10);
        });

        // Ruedas del bus
        window.ctx.fillStyle = "black";
        [10, 40].forEach(offset => {
            window.ctx.beginPath();
            window.ctx.arc(bus.x + offset, bus.y + bus.height, 5, 0, Math.PI * 2);
            window.ctx.fill();
        });

        // Dibujar la placa encima del bus
        window.ctx.fillStyle = "black";
        window.ctx.font = "14px Arial";
        window.ctx.textAlign = "center";
        window.ctx.fillText(id, bus.x + bus.width / 2, bus.y - 5);
    });
}
