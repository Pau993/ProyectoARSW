function createMap() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const tileSize = 200; // Tamaño de cada tile
    const mapSize = 5; // Tamaño del mapa (5x5)
    
    const busWidth = 50; // Ancho de un autobús
    const roadWidth = busWidth * 2; // Ancho total de la carretera para dos autobuses
    const laneWidth = busWidth; // Ancho de cada carril
    const centerLineWidth = 5; // Ancho de la línea central
    ctx.fillStyle = '#90EE90'; // Verde claro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Función para dibujar carretera
    function drawRoad(x, y, horizontal, vertical) {
        // Color base de la carretera
        ctx.fillStyle = '#4a4a4a'; // Gris más oscuro

        // Dibujar carretera base
        if (horizontal) {
            ctx.fillRect(x, y + (tileSize - roadWidth) / 2, tileSize, roadWidth);
        }
        if (vertical) {
            ctx.fillRect(x + (tileSize - roadWidth) / 2, y, roadWidth, tileSize);
        }

        // Dibujar líneas divisorias
        ctx.strokeStyle = '#FFFFFF'; // Línea blanca
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 20]); // Línea discontinua

        if (horizontal) {
            // Líneas de carril horizontales
            ctx.beginPath();
            ctx.moveTo(x, y + tileSize / 2 - laneWidth / 2);
            ctx.lineTo(x + tileSize, y + tileSize / 2 - laneWidth / 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, y + tileSize / 2 + laneWidth / 2);
            ctx.lineTo(x + tileSize, y + tileSize / 2 + laneWidth / 2);
            ctx.stroke();

            // Línea central amarilla
            ctx.strokeStyle = '#FFD700'; // Amarillo
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(x, y + tileSize / 2);
            ctx.lineTo(x + tileSize, y + tileSize / 2);
            ctx.stroke();
        }
        
        if (vertical) {
            // Líneas de carril verticales
            ctx.beginPath();
            ctx.moveTo(x + tileSize / 2 - laneWidth / 2, y);
            ctx.lineTo(x + tileSize / 2 - laneWidth / 2, y + tileSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + tileSize / 2 + laneWidth / 2, y);
            ctx.lineTo(x + tileSize / 2 + laneWidth / 2, y + tileSize);
            ctx.stroke();

            // Línea central amarilla
            ctx.strokeStyle = '#FFD700'; // Amarillo
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(x + tileSize / 2, y);
            ctx.lineTo(x + tileSize / 2, y + tileSize);
            ctx.stroke();
        }
    }

    // Generar todas las carreteras
    const roadPositions = [];

    // Carreteras horizontales y verticales en todas las posiciones
    for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
            roadPositions.push({x, y, horizontal: true, vertical: true});
        }
    }

    // Dibujar todas las carreteras
    roadPositions.forEach(road => {
        drawRoad(
            road.x * tileSize, 
            road.y * tileSize, 
            road.horizontal, 
            road.vertical
        );
    });
}

// Llamar a createMap cuando la página se cargue
window.addEventListener('load', createMap);
