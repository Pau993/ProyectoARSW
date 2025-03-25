const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let buses = {}; // Lista de buses en el juego

// 🚍 Función para dibujar todos los buses en el canvas
function drawBuses() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.values(buses).forEach(bus => {
        // 🚍 Carrocería
        ctx.fillStyle = "yellow";
        ctx.fillRect(bus.x, bus.y, bus.width, bus.height);

        // 🔲 Ventanas
        ctx.fillStyle = "blue";
        ctx.fillRect(bus.x + 5, bus.y + 5, 10, 10);
        ctx.fillRect(bus.x + 20, bus.y + 5, 10, 10);
        ctx.fillRect(bus.x + 35, bus.y + 5, 10, 10);

        // ⚫ Ruedas
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(bus.x + 10, bus.y + bus.height, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bus.x + 40, bus.y + bus.height, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}
