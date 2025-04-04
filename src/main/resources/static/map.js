let buses = {}; // Almacena los buses
let passengers = []; // Almacena los pasajeros
let obstacles = []; // Almacena los obstáculos
let score = 0; // Puntaje global
const tileSize = 200; // Tamaño de cada tile
const mapSize = 5; // Tamaño del mapa (5x5)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
            ctx.fillStyle = '#4a4a4a'; // Carretera gris
            ctx.fillRect(x * tileSize + tileSize / 4, y * tileSize + tileSize / 4, tileSize / 2, tileSize / 2);
        }
    }
}

// Dibuja un bus
function drawBus(bus) {
    ctx.save();
    ctx.translate(bus.x + tileSize / 4, bus.y + tileSize / 4);
    ctx.fillStyle = 'yellow'; // Color del bus
    ctx.fillRect(-tileSize / 8, -tileSize / 8, tileSize / 4, tileSize / 4);
    ctx.restore();
}

// Dibuja un pasajero
function drawPassenger(passenger) {
    ctx.fillStyle = 'blue'; // Color del pasajero
    ctx.beginPath();
    ctx.arc(passenger.x, passenger.y, tileSize / 8, 0, Math.PI * 2);
    ctx.fill();
}

// Dibuja un obstáculo
function drawObstacle(obstacle) {
    if (obstacle.type === 'circle') {
        ctx.fillStyle = 'red'; // Obstáculo circular
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, tileSize / 8, 0, Math.PI * 2);
        ctx.fill();
    } else if (obstacle.type === 'triangle') {
        ctx.fillStyle = 'orange'; // Obstáculo triangular
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y - tileSize / 8);
        ctx.lineTo(obstacle.x - tileSize / 8, obstacle.y + tileSize / 8);
        ctx.lineTo(obstacle.x + tileSize / 8, obstacle.y + tileSize / 8);
        ctx.closePath();
        ctx.fill();
    }
}

// Genera pasajeros aleatorios
function generatePassengers(num) {
    passengers = [];
    for (let i = 0; i < num; i++) {
        passengers.push({ x: randomPosition(), y: randomPosition() });
    }
}

// Genera obstáculos aleatorios
function generateObstacles(num) {
    obstacles = [];
    for (let i = 0; i < num; i++) {
        const type = Math.random() > 0.5 ? 'circle' : 'triangle';
        obstacles.push({ x: randomPosition(), y: randomPosition(), type });
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
    passengers = passengers.filter(passenger => {
        const distance = Math.sqrt(
            Math.pow(bus.x + tileSize / 8 - passenger.x, 2) +
            Math.pow(bus.y + tileSize / 8 - passenger.y, 2)
        );

        if (distance < tileSize / 4) { // Ajusta el umbral según sea necesario
            console.log(`Colisión detectada con pasajero en posición (${passenger.x}, ${passenger.y})`);
            score++; // Incrementa el puntaje
            return false; // Elimina al pasajero de la lista
        }
        return true; // Mantén al pasajero si no hay colisión
    });

    // Detecta colisiones con obstáculos
    obstacles.forEach(obstacle => {
        const distance = Math.sqrt(
            Math.pow(bus.x + tileSize / 8 - obstacle.x, 2) +
            Math.pow(bus.y + tileSize / 8 - obstacle.y, 2)
        );

        if (distance < tileSize / 4) {
            if (obstacle.type === 'circle') {
                console.log('Colisión con obstáculo circular');
                score = Math.max(0, score - 1); // Resta 1 punto
            } else if (obstacle.type === 'triangle') {
                console.log('Colisión con obstáculo triangular');
                score = Math.max(0, score - 2); // Resta 2 puntos
            }
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
    ctx.fillText(`Puntaje: ${score}`, 10, 20);
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
    updateGame();
});

// Inicializa el juego
function initGame() {
    buses['player1'] = { x: randomPosition(), y: randomPosition() }; // Agrega un bus
    generatePassengers(5); // Genera 5 pasajeros
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