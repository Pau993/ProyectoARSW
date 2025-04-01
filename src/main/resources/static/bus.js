function drawBuses() {
    if (!window.ctx || !window.canvas) {
        console.error("Error: El canvas o el contexto no están inicializados.");
        return;
    }

    // Limpiar el canvas antes de dibujar
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    createMap();

    buses = Object.fromEntries(
        Object.entries(buses).filter(([id, bus]) => bus.x !== undefined && bus.y !== undefined)
    );

    console.log("Dibujando buses, total:", Object.keys(buses).length);
    console.log(buses); // Muestra los buses en consola

    // Función para verificar si las coordenadas están sobre una carretera
    function isOnRoad(x, y) {
        const tileSize = 200;
        const roadWidth = 100; // Asumimos que el ancho de la carretera es 100

        // Verificamos si las coordenadas están dentro de un área de carretera
        // Ajustar las coordenadas según la carretera
        const xIndex = Math.floor(x / tileSize);
        const yIndex = Math.floor(y / tileSize);

        // Revisa si está dentro de la carretera (horizontal o vertical)
        const isHorizontalRoad = (y % tileSize) >= (tileSize - roadWidth) / 2 && (y % tileSize) <= (tileSize + roadWidth) / 2;
        const isVerticalRoad = (x % tileSize) >= (tileSize - roadWidth) / 2 && (x % tileSize) <= (tileSize + roadWidth) / 2;

        return isHorizontalRoad || isVerticalRoad;
    }

    // Función para generar coordenadas válidas para los buses dentro del mapa
    function generateRandomBusPosition() {
        const tileSize = 200; // Tamaño de cada celda
        const mapSize = 5;    // Tamaño del mapa (5x5)
        const roadWidth = 100; // Ancho de la carretera

        let x, y;

        // Generar coordenadas aleatorias dentro del mapa (entre 0 y mapSize - 1)
        do {
            x = Math.floor(Math.random() * mapSize) * tileSize + Math.floor(Math.random() * (tileSize - roadWidth));
            y = Math.floor(Math.random() * mapSize) * tileSize + Math.floor(Math.random() * (tileSize - roadWidth));
        } while (!isOnRoad(x, y)); // Solo devolver coordenadas válidas sobre las carreteras

        return { x, y };
    }

    // Asegurarse de que las coordenadas de los buses sean válidas
    Object.entries(buses).forEach(([id, bus]) => {
        if (!isOnRoad(bus.x, bus.y)) {
            console.error(`Coordenadas inválidas para el bus ${id}`);
            // Si el bus no está sobre una carretera, generar nuevas coordenadas dentro del mapa
            const newBusPosition = generateRandomBusPosition();
            bus.x = newBusPosition.x;
            bus.y = newBusPosition.y;
            console.log(`Se generaron nuevas coordenadas para el bus ${id}:`, newBusPosition);
        }

        // Guardar la posición original para rotar el bus correctamente
        window.ctx.save();

        // Mover el contexto del canvas al centro del bus
        window.ctx.translate(bus.x + bus.width / 2, bus.y + bus.height / 2);

        // Rotar el contexto según el ángulo
        window.ctx.rotate(bus.angle * Math.PI / 180); // Convertir ángulo de grados a radianes

        // Dibujar el bus
        window.ctx.fillStyle = "yellow";
        window.ctx.fillRect(-bus.width / 2, -bus.height / 2, bus.width, bus.height); // Dibujar el bus centrado

        // Ventanas del bus
        window.ctx.fillStyle = "blue";
        const windowPositions = [5, 20, 35];
        windowPositions.forEach(offset => {
            window.ctx.fillRect(-bus.width / 2 + offset, -bus.height / 2 + 5, 10, 10);
        });

        // Ruedas del bus
        window.ctx.fillStyle = "black";
        [10, 40].forEach(offset => {
            window.ctx.beginPath();
            window.ctx.arc(-bus.width / 2 + offset, bus.height / 2, 5, 0, Math.PI * 2);
            window.ctx.fill();
        });

        // Restaurar el contexto para dibujar la placa
        window.ctx.restore();

        // Dibujar la placa encima del bus
        window.ctx.fillStyle = "black";
        window.ctx.font = "14px Arial";
        window.ctx.textAlign = "center";
        window.ctx.fillText(id, bus.x + bus.width / 2, bus.y - 5);
    });
}
