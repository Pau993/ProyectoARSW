function drawBuses() {
    if (!window.ctx || !window.canvas) {
        console.error("❌ Error: El canvas o el contexto no están inicializados.");
        return;
    }

    // Limpiar el canvas antes de dibujar
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    createMap();

    console.log("🚌 Dibujando buses, total:", Object.keys(buses).length);
    console.log(buses); // ✅ Muestra los buses en consola

    Object.values(buses).forEach(bus => {
        // Guardar la posición original para rotar el bus correctamente
        window.ctx.save();

        // Mover el contexto del canvas al centro del bus
        window.ctx.translate(bus.x + bus.width / 2, bus.y + bus.height / 2);

        // Rotar el contexto según el ángulo
        window.ctx.rotate(bus.angle * Math.PI / 180); // Convertir ángulo de grados a radianes

        // Dibujar el bus
        window.ctx.fillStyle = "yellow";
        window.ctx.fillRect(-bus.width / 2, -bus.height / 2, bus.width, bus.height); // Dibujar el bus centrado

        // 🖼 Ventanas del bus
        window.ctx.fillStyle = "blue";
        const windowPositions = [5, 20, 35];
        windowPositions.forEach(offset => {
            window.ctx.fillRect(-bus.width / 2 + offset, -bus.height / 2 + 5, 10, 10);
        });

        // ⚫ Ruedas del bus
        window.ctx.fillStyle = "black";
        [10, 40].forEach(offset => {
            window.ctx.beginPath();
            window.ctx.arc(-bus.width / 2 + offset, bus.height / 2, 5, 0, Math.PI * 2);
            window.ctx.fill();
        });

        // Restaurar el contexto
        window.ctx.restore();
    });
}
