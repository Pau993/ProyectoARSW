function createMap() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const tileSize = 200; // Tamaño de cada tile
    const mapSize = 5; // Tamaño del mapa (5x5)

    const gridWidth = mapSize;
    const gridHeight = mapSize;

    const busWidth = 50; // Ancho de un autobús
    const roadWidth = busWidth * 2; // Ancho total de la carretera para dos autobuses
    const laneWidth = busWidth; // Ancho de cada carril

    ctx.fillStyle = '#90EE90'; // Verde claro (césped)
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Dibujar carretera
    function drawRoad(x, y, horizontal, vertical) {
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

    // Dibujar carreteras en todas las posiciones
    for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
            drawRoad(x * tileSize, y * tileSize, true, true);
        }
    }

    // Función para dibujar un edificio con borde negro
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

    // Colocar edificios en el mapa
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

    // Dibujar obstáculos circulares huecos (negros)
    function drawHollowObstacle(x, y) {
        let obstacleSize = tileSize * 0.2;
        let centerX = x * tileSize + tileSize / 2;
        let centerY = y * tileSize + tileSize / 2;

        ctx.fillStyle = '#000000'; // Negro total
        ctx.beginPath();
        ctx.arc(centerX, centerY, obstacleSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Generar huecos aleatorios en la carretera
    function generateRandomHoles(count) {
        let placedPositions = new Set();

        for (let i = 0; i < count; i++) {
            let randomX, randomY, key;
            do {
                randomX = Math.floor(Math.random() * gridWidth);
                randomY = Math.floor(Math.random() * gridHeight);
                key = `${randomX},${randomY}`;
            } while (
                placedPositions.has(key) || 
                buildings.some(b => b.x === randomX && b.y === randomY) // Evita edificios
            );

            placedPositions.add(key);
            drawHollowObstacle(randomX, randomY);
        }
    }

    drawHollowObstacle(1,3);
}

// Cargar mapa al inicio
window.addEventListener('load', createMap);
