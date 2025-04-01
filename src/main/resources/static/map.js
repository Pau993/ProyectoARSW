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

    // Dibujar obstaculos (ejemplo: edificios cafes)
    function drawBuilding(x, y) {
        let buildingSize = tileSize * 0.2; // Hace el edificio un 60% del tamaño de la celda
        let offset = (tileSize - buildingSize) / 2; // Centrarlo en la celda
    
        let baseX = x * tileSize + offset;
        let baseY = y * tileSize + offset;

        // Dibujar el cuerpo del edificio
        ctx.fillStyle = '#8B4513'; // Marrón
        ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

        // Dibujar el borde negro
        ctx.strokeStyle = '#000000'; // Negro
        ctx.lineWidth = 2; // Grosor del borde
        ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
    }
    
    drawBuilding(1.5, 1.5); // Edificio en el centro
    drawBuilding(3.5, 3.5);
    drawBuilding(2.5, 4.5);
    drawBuilding(-0.5, 0.5);
    drawBuilding(4.5, 2.5);
    drawBuilding(0.5, 3.5); // Edificio en la esquina

    function drawBuildingB(x, y){
        let buildingSize = tileSize * 0.2; // Hace el edificio un 60% del tamaño de la celda
        let offset = (tileSize - buildingSize) / 2; // Centrarlo en la celda

        let baseX = x * tileSize + offset;
        let baseY = y * tileSize + offset;

        ctx.fillStyle = '#3B83BD'; // Marrón
        ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

        // Dibujar el borde negro
        ctx.strokeStyle = '#000000'; // Negro
        ctx.lineWidth = 2; // Grosor del borde
        ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
    }

    drawBuildingB(2.5, 2.5); // Edificio en el centro
    drawBuildingB(3.5, 2.5);
    drawBuildingB(-0.5, -0.5);
    drawBuildingB(2.5, 3.5);
    drawBuildingB(-0.5, 2.5);
    drawBuildingB(4.5, 4.5);
    drawBuildingB(0.5, 1.5); // Edificio en la esquina

    function drawBuildingR(x, y){
        let buildingSize = tileSize * 0.2; // Hace el edificio un 60% del tamaño de la celda
        let offset = (tileSize - buildingSize) / 2; // Centrarlo en la celda

        let baseX = x * tileSize + offset;
        let baseY = y * tileSize + offset;

        ctx.fillStyle = '#FF0000'; // Rojo
        ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

        // Dibujar el borde negro
        ctx.strokeStyle = '#000000'; // Negro
        ctx.lineWidth = 2; // Grosor del borde
        ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
    }
    drawBuildingR(0.5, 0.5); // Edificio en el centro
    drawBuildingR(1.5, 0.5);
    drawBuildingR(3.5, -0.5);
    drawBuildingR(2.5, 2.5);
    drawBuildingR(-0.5, 1.5);
    drawBuildingR(4.5, 1.5);
    drawBuildingR(2.5, 1.5); // Edificio en la esquina

    function drawBuildingG(x, y){
        let buildingSize = tileSize * 0.2; // Hace el edificio un 60% del tamaño de la celda
        let offset = (tileSize - buildingSize) / 2; // Centrarlo en la celda

        let baseX = x * tileSize + offset;
        let baseY = y * tileSize + offset;

        ctx.fillStyle = '#008F39'; // Verde
        ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

        // Dibujar el borde negro
        ctx.strokeStyle = '#000000'; // Negro
        ctx.lineWidth = 2; // Grosor del borde
        ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
    }
    drawBuildingG(1.5, 4.5); // Edificio en el centro
    drawBuildingG(3.5, 0.5);
    drawBuildingG(0.5, 4.5);
    drawBuildingG(2.5, -0.5);
    drawBuildingG(-0.5, 4.5);
    drawBuildingG(4.5, 3.5);
    drawBuildingG(0.5, 2.5); // Edificio en la esquina

    function drawBuildingP(x, y){
        let buildingSize = tileSize * 0.2; // Hace el edificio un 60% del tamaño de la celda
        let offset = (tileSize - buildingSize) / 2; // Centrarlo en la celda

        let baseX = x * tileSize + offset;
        let baseY = y * tileSize + offset;

        ctx.fillStyle = '#572364'; // Rosa
        ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

        // Dibujar el borde negro
        ctx.strokeStyle = '#000000'; // Negro
        ctx.lineWidth = 2; // Grosor del borde
        ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
    }
    drawBuildingP(3.5, 4.5); // Edificio en el centro
    drawBuildingP(1.5, 3.5);
    drawBuildingP(-0.5, 2.5);
    drawBuildingP(1.5, 2.5);
    drawBuildingP(4.5, -0.5);
    drawBuildingP(4.5, 1.5);
    drawBuildingP(2.5, 0.5); // Edificio en la esquina

    function drawBuildingPi(x, y){
        let buildingSize = tileSize * 0.2; // Hace el edificio un 60% del tamaño de la celda
        let offset = (tileSize - buildingSize) / 2; // Centrarlo en la celda

        let baseX = x * tileSize + offset;
        let baseY = y * tileSize + offset;

        ctx.fillStyle = '#FFCBDB'; // Rosa
        ctx.fillRect(baseX, baseY, buildingSize, buildingSize);

        // Dibujar el borde negro
        ctx.strokeStyle = '#000000'; // Negro
        ctx.lineWidth = 2; // Grosor del borde
        ctx.strokeRect(baseX, baseY, buildingSize, buildingSize);
    }
    drawBuildingPi(4.5, 4.5); // Edificio en el centro
    drawBuildingPi(1.5, 1.5);
    drawBuildingPi(3.5, 1.5);
    drawBuildingPi(1.5, -0.5);
    drawBuildingPi(2.5, 3.5);
    drawBuildingPi(4.5, 0.5); // Edificio en la esquina
    drawBuildingPi(-0.5, 3.5); // Edificio en la esquina
  
}

// Llamar a createMap cuando la página se cargue
window.addEventListener('load', createMap);
