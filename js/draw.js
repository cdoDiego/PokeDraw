let canvas;
let previewLayer;

let currentTool = 'pencil'; // Herramienta de dibujo actual
let pencilColor = '#000000'; // Color del lápiz
let pencilSize = 2; // Tamaño del lápiz
let fillColor = '#ffffff80'; // Relleno transparente
let eraserSize = 20; // Tamaño de la goma de borrar
let startX, startY;

let drawingHistory = []; // Historial de dibujo para deshacer/rehacer
let redoHistory = []; // Historial de acciones rehacer

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('drawingCanvas');
    background(255);

    // Crear una capa adicional para dibujar el "preview"
    previewLayer = createGraphics(width, height);
    previewLayer.clear();
}

function draw() {
    // Limpiar el lienzo principal en cada iteración
    background(255);

    // Mostrar la capa de "preview" en el lienzo principal
    image(previewLayer, 0, 0);

    // Dibujar las formas anteriores en el lienzo principal
    for (let action of drawingHistory) {
        if (action.tool === 'pencil') {
            console.log(action);
            drawPencil(action.path, action.color, action.size);
        } else if (action.tool === 'line') {
            stroke(action.color);
            strokeWeight(action.size);
            line(action.start.x, action.start.y, action.end.x, action.end.y);
        } else if (action.tool === 'rectangle') {
            stroke(action.color);
            strokeWeight(action.size);
            noFill();
            rect(action.x, action.y, action.width, action.height);
        } else if (action.tool === 'circle') {
            stroke(action.color);
            strokeWeight(action.size);
            noFill();
            let diameter = dist(action.x, action.y, action.x + action.diameter / 2, action.y);
            ellipse(action.x, action.y, diameter);
        }
    }
}

function drawPencil(path, color, size) {
    beginShape();
    noFill();
    stroke(color);
    strokeWeight(size);
    for (let point of path) {
        curveVertex(point.x, point.y);
    }
    endShape();
}

function mousePressed() {
    startX = mouseX;
    startY = mouseY;

    if (currentTool === 'pencil') {
        // Iniciar un nuevo trazo para el lápiz
        let newPath = [];
        newPath.push({ x: mouseX, y: mouseY });
        drawingHistory.push({ tool: 'pencil', color: pencilColor, size: pencilSize, path: newPath });
    }
}

function mouseDragged() {
    if (currentTool === 'pencil') {
        // Dibujar con el lápiz en la capa de "preview"
        let currentPath = drawingHistory[drawingHistory.length - 1].path;
        currentPath.push({ x: mouseX, y: mouseY });
    }

    // Actualizar el "preview" en la capa adicional
    updatePreview();
}

function updatePreview() {
    previewLayer.clear(); // Limpiar la capa de "preview"

    // Dibujar en la capa de "preview" según la herramienta seleccionada
    if (currentTool === 'line') {
        previewLayer.stroke(pencilColor);
        previewLayer.strokeWeight(pencilSize);
        previewLayer.line(startX, startY, mouseX, mouseY);
    } else if (currentTool === 'rectangle') {
        previewLayer.stroke(pencilColor);
        previewLayer.strokeWeight(pencilSize);
        previewLayer.noFill();
        previewLayer.rect(startX, startY, mouseX - startX, mouseY - startY);
    } else if (currentTool === 'circle') {
        previewLayer.stroke(pencilColor);
        previewLayer.strokeWeight(pencilSize);
        previewLayer.noFill();
        let diameter = dist(startX, startY, mouseX, mouseY);
        previewLayer.ellipse(startX, startY, diameter);
    } else if (currentTool === 'eraser') {
        previewLayer.noStroke();
        previewLayer.fill(255);
        previewLayer.ellipse(mouseX, mouseY, eraserSize, eraserSize);
    }
}

function mouseReleased() {
    if (currentTool === 'line') {
        // Registrar la acción de línea en el historial de dibujo
        drawingHistory.push({ tool: 'line', color: pencilColor, size: pencilSize, start: { x: startX, y: startY }, end: { x: mouseX, y: mouseY } });
    } else if (currentTool === 'rectangle') {
        // Registrar la acción de rectángulo en el historial de dibujo
        drawingHistory.push({ tool: 'rectangle', color: pencilColor, size: pencilSize, x: startX, y: startY, width: mouseX - startX, height: mouseY - startY });
    } else if (currentTool === 'circle') {
        // Registrar la acción de círculo en el historial de dibujo
        let diameter = dist(startX, startY, mouseX, mouseY) * 2;
        drawingHistory.push({ tool: 'circle', color: pencilColor, size: pencilSize, x: startX, y: startY, diameter: diameter });
    }
}

function keyPressed() {
    if (key === 'z' && (keyIsDown(CONTROL) || keyIsDown(LEFT_CONTROL) || keyIsDown(RIGHT_CONTROL))) {
        // Deshacer (Ctrl+Z)
        undoAction();
    } else if (key === 'y' && (keyIsDown(CONTROL) || keyIsDown(LEFT_CONTROL) || keyIsDown(RIGHT_CONTROL))) {
        // Rehacer (Ctrl+Y)
        if (redoHistory.length > 0) {
            let nextAction = redoHistory.pop();
            drawingHistory.push(nextAction);
            redraw();
        }
    }
}

// Función para deshacer la última acción
function undoAction() {
    if (drawingHistory.length > 0) {
        let lastAction = drawingHistory.pop();
        redoHistory.push(lastAction);
        previewLayer.clear();
        redraw(); // Volver a dibujar todo
    }
}

// Función para rehacer la última acción deshecha
function redoAction() {
    if (redoHistory.length > 0) {
        let nextAction = redoHistory.pop();
        drawingHistory.push(nextAction);
        redraw(); // Volver a dibujar todo
    }
}

function undoButtonPressed() {
    // Limpiar el lienzo y restablecer el historial de dibujo
    background(255);
    drawingHistory = [];
    redoHistory = [];
}

function setColor() {
    // Cambiar el color de dibujo
    pencilColor = document.getElementById('colorPicker').value;
}

function setTool(tool) {
    // Cambiar la herramienta de dibujo
    currentTool = tool;
}

function setPencilSize(size) {
    // Cambiar el tamaño del lápiz
    pencilSize = size;
}

function setBrushSize() {
    pencilSize = document.getElementById('brushSize').value; // Actualiza el tamaño del pincel
}

function setFillColor(newColor) {
    // Cambiar el color de relleno transparente
    fillColor = newColor;
}

function setEraserSize(size) {
    // Cambiar el tamaño de la goma de borrar
    eraserSize = size;
}
