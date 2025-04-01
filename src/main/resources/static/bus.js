const mapWidth = 5 * 200;  // Ancho total del mapa (en píxeles)
const mapHeight = 5 * 200; // Alto total del mapa (en píxeles)

function generateRandomBusPosition() {
    const tileSize = 200; // Tamaño de cada celda
    const roadWidth = 100; // Ancho de la carretera

    let x, y;

    // Generar coordenadas aleatorias dentro del mapa (entre 0 y mapWidth/mapHeight)
    do {
        x = Math.floor(Math.random() * (mapWidth - roadWidth)); // Asegurarse de que el bus esté dentro del mapa
        y = Math.floor(Math.random() * (mapHeight - roadWidth)); // Asegurarse de que el bus esté dentro del mapa
    } while (!isOnRoad(x, y)); // Solo devolver coordenadas válidas sobre las carreteras

    return { x, y };
}

function isOnRoad(x, y) {
    const tileSize = 200;
    const roadWidth = 100;

    const xIndex = Math.floor(x / tileSize);
    const yIndex = Math.floor(y / tileSize);

    // Comprobar si está sobre una carretera (horizontal o vertical)
    const isHorizontalRoad = (y % tileSize) >= (tileSize - roadWidth) / 2 && (y % tileSize) <= (tileSize + roadWidth) / 2;
    const isVerticalRoad = (x % tileSize) >= (tileSize - roadWidth) / 2 && (x % tileSize) <= (tileSize + roadWidth) / 2;

    return isHorizontalRoad || isVerticalRoad;
}

// Asumiendo que `buses` es un objeto global que contiene todos los buses

// Verificar si dos buses colisionan
function checkCollision(bus1, bus2) {
    const distance = Math.sqrt(
        Math.pow(bus1.x - bus2.x, 2) + Math.pow(bus1.y - bus2.y, 2)
    );

    const minDistance = (bus1.width + bus2.width) / 2;  // Ajustar según el tamaño del bus

    // Si la distancia entre los buses es menor que la distancia mínima, hay colisión
    if (distance < minDistance) {
        // Verificar si es una colisión frontal
        if (Math.abs(bus1.angle - bus2.angle) <= 15) {
            // Colisión frontal
            return true;
        }
    }

    return false;
}

// Manejar la colisión entre dos buses
function handleCollision(bus1, bus2) {
    if (checkCollision(bus1, bus2)) {
        console.log(`¡Colisión frontal! El bus ${bus1.id} ha chocado con el bus ${bus2.id}.`);
        // Eliminar el bus que ha muerto (puedes elegir uno de los dos o ambos)
        delete buses[bus1.id]; // Ejemplo: eliminar el primer bus
    }
}

// Función que actualiza los buses y revisa colisiones
function updateBuses() {
    const busArray = Object.values(buses);  // Obtener todos los buses

    // Revisar las colisiones entre todos los buses
    for (let i = 0; i < busArray.length; i++) {
        for (let j = i + 1; j < busArray.length; j++) {
            handleCollision(busArray[i], busArray[j]);  // Verificar colisión entre dos buses
        }
    }
}


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

    // Asegurarse de que las coordenadas de los buses sean válidas dentro de los límites del mapa
    Object.entries(buses).forEach(([id, bus]) => {
        if (!isOnRoad(bus.x, bus.y)) {
            console.error(`Coordenadas inválidas para el bus ${id}`);
            // Si el bus no está sobre una carretera, generar nuevas coordenadas dentro del mapa
            const newBusPosition = generateRandomBusPosition();
            bus.x = newBusPosition.x;
            bus.y = newBusPosition.y;
            console.log(`Se generaron nuevas coordenadas para el bus ${id}:`, newBusPosition);
        }

        // Asegurarse de que los buses no se salgan de los límites del mapa
        if (bus.x < 0) bus.x = 0;
        if (bus.x > mapWidth - bus.width) bus.x = mapWidth - bus.width;
        if (bus.y < 0) bus.y = 0;
        if (bus.y > mapHeight - bus.height) bus.y = mapHeight - bus.height;

        console.log(`Dibujando bus ${id} en X: ${bus.x}, Y: ${bus.y}`);

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
