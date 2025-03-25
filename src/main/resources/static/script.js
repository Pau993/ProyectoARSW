function getSaludo() {
    fetch('/api/saludo')
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').textContent = data.mensaje;
        });
}

function getFecha() {
    fetch('/api/fecha')
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').textContent = data.fecha;
        });
}
