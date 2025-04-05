
let buses = {}; // Almacena los buses
let passengers = []; // Almacena los pasajeros
let obstacles = []; // Almacena los obstáculos
let score = 0; // Puntaje global
const tileSize = 200; // Tamaño de cada tile
const mapSize = 5; // Tamaño del mapa (5x5)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let people = []; // Almacena las personas
let peopleGenerated = false; // Bandera para evitar regenerar personas

// Inicializa el canvas
canvas.width = tileSize * mapSize;
canvas.height = tileSize * mapSize;

// Genera una posición aleatoria dentro del mapa
function randomPosition() {
    return Math.floor(Math.random() * mapSize) * tileSize + tileSize / 4;
}

// Dibuja el mapa
function drawMap() {
    ctx.fillStyle = '#90EE90'; // Fondo verde
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibuja las carreteras
    for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
            drawRoad(x * tileSize, y * tileSize, true, true);
        }
    }

    // Dibuja los edificios
    const buildings = [
        { x: 1.5, y: 0.5, color: '#F9C5D1' }, // Pastel Rosa Claro
        { x: 1.5, y: 1.5, color: '#A8D0E6' }, // Pastel Azul Claro
        { x: 1.5, y: 2.5, color: '#EEC9B7' }, // Pastel Melocotón Claro
        { x: 1.5, y: 3.5, color: '#B9E3B6' }, // Pastel Verde Claro
        { x: 1.5, y: 4.5, color: '#E6A3D9' }, // Pastel Lavanda
        { x: 0.5, y: 0.5, color: '#FFD4DA' },  // Pastel Rosa Claro
        { x: 0.5, y: 1.5, color: '#C0E8D5' },  // Pastel Aqua Suave
        { x: 0.5, y: 2.5, color: '#F1C8B2' },  // Pastel Naranja Suave
        { x: 0.5, y: 3.5, color: '#C7E5C6' },  // Pastel Verde Suave
        { x: 0.5, y: 4.5, color: '#F6C9D7' },  // Pastel Coral Claro
        { x: 2.5, y: 0.5, color: '#FFB4C0' },  // Pastel Rosa Suave
        { x: 2.5, y: 1.5, color: '#B1D9D4' },  // Pastel Aqua Claro
        { x: 2.5, y: 2.5, color: '#FFEBB7' },  // Pastel Amarillo Claro
        { x: 2.5, y: 3.5, color: '#A2C9F3' },  // Pastel Azul Claro
        { x: 2.5, y: 4.5, color: '#E8D0F2' },  // Pastel Lila Claro
        { x: 3.5, y: 0.5, color: '#F6E3D6' },  // Pastel Beige
        { x: 3.5, y: 1.5, color: '#C1D7E0' }, // Pastel Aqua Claro
        { x: 3.5, y: 2.5, color: '#F8D0C4' }, // Pastel Rosado Claro
        { x: 3.5, y: 3.5, color: '#C1D9E7' }, // Pastel Azul Suave
        { x: 3.5, y: 4.5, color: '#D4A2D8' }, // Pastel Lila Claro
        { x: 4.5, y: 0.5, color: '#FFD1E1' }, // Pastel Rosa Suave
        { x: 4.5, y: 1.5, color: '#B6D8F6' }, // Pastel Azul Claro
        { x: 4.5, y: 2.5, color: '#E4F2B7' }, // Pastel Verde Claro
        { x: 4.5, y: 3.5, color: '#F0C2B6' }, // Pastel Naranja Claro
        { x: 4.5, y: 4.5, color: '#D6B5E6' }, // Pastel Lavanda Claro
        { x: -0.5, y: 0.5, color: '#F7D2A1' }, // Pastel Amarillo Claro
        { x: -0.5, y: 1.5, color: '#F3D2E6' }, // Pastel Rosa Claro
        { x: -0.5, y: 2.5, color: '#B6E2B3' }, // Pastel Verde Suave
        { x: -0.5, y: 3.5, color: '#FFBC9A' }, // Pastel Naranja Claro
        { x: -0.5, y: 4.5, color: '#FFBDC6' }, // Pastel Rojo Suave
        { x: -0.5, y: -0.5, color: '#F2A3B7' }, // Pastel Rosa
        { x: 0.5, y: -0.5, color: '#F9D6A0' }, // Pastel Amarillo Claro
        { x: 1.5, y: -0.5, color: '#E4D4F3' }, // Pastel Lila Claro
        { x: 2.5, y: -0.5, color: '#F8C3A1' }, // Pastel Melocotón Claro
        { x: 3.5, y: -0.5, color: '#C9D9F7' }, // Pastel Azul Claro
        { x: 4.5, y: -0.5, color: '#FFD9E1' }  // Pastel Rosa Suave
    ];
    buildings.forEach(building => drawBuilding(building.x, building.y, building.color));
}

// Dibuja una carretera
function drawRoad(x, y, horizontal, vertical) {
    const roadWidth = tileSize * 0.2;
    const laneWidth = roadWidth / 3;

    ctx.fillStyle = '#4a4a4a'; // Gris oscuro para la carretera

    if (horizontal) ctx.fillRect(x, y + (tileSize - roadWidth) / 2, tileSize, roadWidth);
    if (vertical) ctx.fillRect(x + (tileSize - roadWidth) / 2, y, roadWidth, tileSize);

    ctx.strokeStyle = '#FFFFFF'; // Líneas de carril blancas
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);

    if (horizontal) {
        ctx.beginPath();
        ctx.moveTo(x, y + tileSize / 2 - laneWidth / 2);
        ctx.lineTo(x + tileSize, y + tileSize / 2 - laneWidth / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y + tileSize / 2 + laneWidth / 2);
        ctx.lineTo(x + tileSize, y + tileSize / 2 + laneWidth / 2);
        ctx.stroke();

        ctx.strokeStyle = '#FFD700'; // Línea central amarilla
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x, y + tileSize / 2);
        ctx.lineTo(x + tileSize, y + tileSize / 2);
        ctx.stroke();
    }

    if (vertical) {
        ctx.beginPath();
        ctx.moveTo(x + tileSize / 2 - laneWidth / 2, y);
        ctx.lineTo(x + tileSize / 2 - laneWidth / 2, y + tileSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + tileSize / 2 + laneWidth / 2, y);
        ctx.lineTo(x + tileSize / 2 + laneWidth / 2, y + tileSize);
        ctx.stroke();

        ctx.strokeStyle = '#FFD700'; // Línea central amarilla
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x + tileSize / 2, y);
        ctx.lineTo(x + tileSize / 2, y + tileSize);
        ctx.stroke();
    }
}

// Dibuja un edificio con borde negro
function drawBuilding(x, y, color) {
    let buildingSize = tileSize * 0.3;
    let offset = (tileSize - buildingSize) / 2;

    let baseX = x * tileSize + offset;
    let baseY = y * tileSize + offset;

    ctx.fillStyle = color;
    ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
}

// Dibuja los buses en el mapa
function drawBus(bus) {
    if (!ctx) {
        console.error("Error: El contexto del canvas no está inicializado.");
        return;
    }

    // Guardar la posición original para rotar el bus correctamente
    ctx.save();

    // Mover el contexto del canvas al centro del bus
    ctx.translate(bus.x + bus.width / 2, bus.y + bus.height / 2);

    // Rotar el contexto según el ángulo
    ctx.rotate(bus.angle * Math.PI / 180); // Convertir ángulo de grados a radianes

    // Cambiar el color del bus según la puntuación
    let busColor;
    if (score >= 20) {
        busColor = "red"; // Rojo si la puntuación es 10 o más
    } else if (score >= 10) {
        busColor = "green"; // Verde si la puntuación es 5 o más
    } else {
        busColor = "yellow"; // Amarillo por defecto
    }

    // Dibujar el cuerpo del bus
    ctx.fillStyle = busColor;
    ctx.fillRect(-bus.width / 2, -bus.height / 2, bus.width, bus.height);

    // Dibujar las ventanas del bus
    ctx.fillStyle = "blue";
    const windowPositions = [5, 20, 35];
    windowPositions.forEach(offset => {
        ctx.fillRect(-bus.width / 2 + offset, -bus.height / 2 + 5, 10, 10);
    });

    // Dibujar las ruedas del bus
    ctx.fillStyle = "black";
    [10, 40].forEach(offset => {
        ctx.beginPath();
        ctx.arc(-bus.width / 2 + offset, bus.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Restaurar el contexto para dibujar la placa
    ctx.restore();

    // Dibujar la placa encima del bus
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(bus.id, bus.x + bus.width / 2, bus.y - 10); // Ajusta la posición de la placa
}

// Genera pasajeros aleatorios en las zonas verdes
function generatePeople(passengerArray = []) {
    const minPassengers = 40; // Número mínimo de pasajeros
    const passengersToGenerate = Math.max(minPassengers - passengerArray.length, 0);

    // Generar pasajeros adicionales si es necesario
    for (let i = 0; i < passengersToGenerate; i++) {
        const x = randomPosition();
        const y = randomPosition();

        // Asegúrate de que el pasajero no esté en una posición ocupada por una carretera
        if (!isPositionOccupied(x, y)) {
            passengerArray.push({
                x,
                y,
                bodyColor: getRandomPersonColor(),
                skinColor: getRandomSkinColor()
            });
        }
    }

    passengers = passengerArray;
}

window.generatePeople = generatePeople;


// Dibuja los pasajeros (como personas)
function drawPassenger(passenger) {
    const personRadius = 10; // Radio de la persona

    // Cuerpo
    ctx.fillStyle = passenger.bodyColor || getRandomPersonColor();
    ctx.beginPath();
    ctx.arc(passenger.x, passenger.y, personRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black'; // Contorno negro
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cabeza
    ctx.fillStyle = passenger.skinColor || getRandomSkinColor();
    ctx.beginPath();
    ctx.arc(passenger.x, passenger.y - personRadius * 1.5, personRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black'; // Contorno negro
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Función para verificar si una posición está ocupada por una carretera
function isPositionOccupied(x, y) {
    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);

    const roadStartX = tileX * tileSize + (tileSize - tileSize * 0.2) / 2;
    const roadEndX = roadStartX + tileSize * 0.2;
    const roadStartY = tileY * tileSize + (tileSize - tileSize * 0.2) / 2;
    const roadEndY = roadStartY + tileSize * 0.2;

    return x >= roadStartX && x <= roadEndX && y >= roadStartY && y <= roadEndY;
}

// Función para obtener un color aleatorio para el cuerpo de una persona
function getRandomPersonColor() {
    const colors = ['#FF6347', '#4682B4', '#2E8B57', '#8A2BE2', '#FF4500', '#1E90FF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Función para obtener un color aleatorio para la piel de una persona
function getRandomSkinColor() {
    const skinColors = ['#FFA07A', '#DEB887', '#D2B48C', '#F4A460', '#CD853F'];
    return skinColors[Math.floor(Math.random() * skinColors.length)];
}

// Genera obstáculos aleatorios en las carreteras
function generateObstacles(num) {
    obstacles = [];
    for (let i = 0; i < num; i++) {
        let obstacleX, obstacleY;

        // Generar posición aleatoria dentro de las áreas de las carreteras
        do {
            const tileX = Math.floor(Math.random() * mapSize);
            const tileY = Math.floor(Math.random() * mapSize);

            // Centrar el obstáculo en la carretera
            obstacleX = tileX * tileSize + tileSize / 2;
            obstacleY = tileY * tileSize + tileSize / 2;
        } while (isPositionOccupiedByObstacle(obstacleX, obstacleY)); // Evitar superposición de obstáculos

        const type = Math.random() > 0.5 ? 'circle' : 'triangle';
        obstacles.push({ x: obstacleX, y: obstacleY, type });
    }
}

// Verifica si una posición ya está ocupada por otro obstáculo
function isPositionOccupiedByObstacle(x, y) {
    return obstacles.some(obstacle => {
        const distance = Math.sqrt(Math.pow(obstacle.x - x, 2) + Math.pow(obstacle.y - y, 2));
        return distance < tileSize / 4; // Evitar superposición
    });
}

// Dibuja un obstáculo
function drawObstacle(obstacle) {
    const size = tileSize / 12; // Tamaño más pequeño
    if (obstacle.type === 'circle') {
        ctx.fillStyle = '#4B3621'; // Relleno del círculo
        ctx.strokeStyle = 'black'; // Borde negro
        ctx.lineWidth = 2; // Grosor del borde

        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, size, 0, Math.PI * 2); // Dibuja el círculo
        ctx.fill();
        ctx.stroke();
    } else if (obstacle.type === 'triangle') {
        ctx.fillStyle = 'yellow'; // Relleno amarillo
        ctx.strokeStyle = 'black'; // Bordes negros
        ctx.lineWidth = 6;

        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y - size);
        ctx.lineTo(obstacle.x - size, obstacle.y + size);
        ctx.lineTo(obstacle.x + size, obstacle.y + size);
        ctx.closePath();

        ctx.fill();
        ctx.stroke(); // Aplica el borde
    }
}

// Mueve un bus en la dirección especificada
function moveBus(bus, direction) {
    switch (direction) {
        case 'UP':
            bus.y -= tileSize / 4;
            break;
        case 'DOWN':
            bus.y += tileSize / 4;
            break;
        case 'LEFT':
            bus.x -= tileSize / 4;
            break;
        case 'RIGHT':
            bus.x += tileSize / 4;
            break;
    }

    // Evita que el bus salga del mapa
    bus.x = Math.max(0, Math.min(bus.x, canvas.width - tileSize / 4));
    bus.y = Math.max(0, Math.min(bus.y, canvas.height - tileSize / 4));
}

// Detecta colisiones entre un bus y los pasajeros
function checkCollisions(bus) {
    const pickupRadius = tileSize / 3;
    const collisionRadius = tileSize / 3;

    // Pasajeros
    passengers = passengers.filter(passenger => {
        const dx = bus.x + tileSize / 8 - passenger.x;
        const dy = bus.y + tileSize / 8 - passenger.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pickupRadius) {
            console.log(`Pasajero recogido en posición (${passenger.x}, ${passenger.y})`);
            score++;
            return false; // Elimina al pasajero
        }
        return true; // Mantén al pasajero
    });

    // Si el bus no tiene un historial de colisiones, lo creamos
    if (!bus.collidedObstacles) bus.collidedObstacles = new Set();

    // Obstáculos
    obstacles.forEach(obstacle => {
        const dx = bus.x + tileSize / 8 - obstacle.x;
        const dy = bus.y + tileSize / 8 - obstacle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const obstacleId = `${obstacle.x},${obstacle.y}`;

        if (distance < collisionRadius) {
            if (!bus.collidedObstacles.has(obstacleId)) {
                if (obstacle.type === 'circle') {
                    const penalty = Math.ceil(score / 2); // Redondea hacia arriba
                    console.log(`Colisión con obstáculo circular (-${penalty})`);
                    score = Math.max(0, score - penalty);
                } else if (obstacle.type === 'triangle') {
                    console.log('Colisión con obstáculo triangular ');
                    score = Math.max(0, score - 2);
                }

                bus.collidedObstacles.add(obstacleId); // Marcar como colisionado
            }
        } else {
            // Si ya no hay colisión, se puede eliminar del historial
            bus.collidedObstacles.delete(obstacleId);
        }
    });
}


// Actualiza el estado del juego
function updateGame() {
    drawMap();

    // Dibuja los pasajeros
    passengers.forEach(drawPassenger);

    // Dibuja los obstáculos
    obstacles.forEach(drawObstacle);

    // Dibuja los buses
    Object.values(buses).forEach(bus => {
        drawBus(bus);
        checkCollisions(bus); // Verifica colisiones con pasajeros y obstáculos
    });

    // Muestra el puntaje
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Puntaje: ${score}`, 20, 20);
}

// Controla el movimiento de los buses
window.addEventListener('keydown', (e) => {
    const bus = buses['player1']; // Controla el bus del jugador
    if (!bus) return;

    switch (e.key) {
        case 'ArrowUp':
            moveBus(bus, 'UP');
            break;
        case 'ArrowDown':
            moveBus(bus, 'DOWN');
            break;
        case 'ArrowLeft':
            moveBus(bus, 'LEFT');
            break;
        case 'ArrowRight':
            moveBus(bus, 'RIGHT');
            break;
    }
});

// Inicializa el juego
function initGame() {
    const playerPlate = localStorage.getItem("playerId"); // Obtén la placa registrada o usa "SinPlaca" por defecto

    buses['player1'] = {
        id: playerPlate, // Asigna la placa como el identificador del bus
        x: randomPosition(),
        y: randomPosition(),
        width: tileSize / 4, // Ajusta el tamaño del bus
        height: tileSize / 8, // Ajusta el tamaño del bus
        angle: 0 // Ángulo inicial
    };
    generateObstacles(5); // Genera 5 obstáculos
    updateGame(); // Dibuja el estado inicial
}

function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', () => {
    initGame();
    requestAnimationFrame(gameLoop); // Lanza el bucle
});