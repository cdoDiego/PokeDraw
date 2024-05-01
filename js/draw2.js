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
let changedPixels = [];

const directions = [
    { x: 1, y: 0 },   // Derecha
    { x: -1, y: 0 },  // Izquierda
    { x: 0, y: 1 },   // Abajo
    { x: 0, y: -1 }   // Arriba
];
let pg;


function setup() {
    // Crear el lienzo y configurar el resto de tu programa
    let divCanvas = document.getElementById('drawingCanvas');
    let w = divCanvas.clientWidth; // Usar clientWidth en lugar de offsetWidth
    let h = divCanvas.clientHeight; // Usar clientHeight en lugar de offsetHeight
    canvas = createCanvas(w, h);
    canvas.parent('drawingCanvas');
    background(255);

    // Crear una capa adicional para dibujar el "preview"
    previewLayer = createGraphics(width, height);
    previewLayer.clear();
    //loadPixels();
    cursor('../assets/cursor2.png');

    // Asignar eventos de ratón o táctiles según el dispositivo
    if (isTouchDevice()) {
        canvas.touchStarted(touchStarted);
        canvas.touchMoved(touchMoved);
        canvas.touchEnded(touchEnded);
    } else {
        canvas.mousePressed(mousePressed);
        //canvas.mouseDragged(mouseDragged2);
        canvas.mouseReleased(mouseReleased);
    }
}

function draw() {
    // Limpiar el lienzo principal en cada iteración
    background(255);

    // Dibujar las formas anteriores en el lienzo principal
    for (let action of drawingHistory) {
        if (action.tool === 'pencil') {
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
            let diameter = dist(action.x, action.y, action.x + action.diameter, action.y);
            ellipse(action.x, action.y, diameter);
        } else if (action.tool === 'fill') {
            drawFill(action.path, action.color, action.size);
        }
    }

    // Mostrar la capa de "preview" en el lienzo principal
    image(previewLayer, 0, 0);
}

function floodFillOptimized(x, y, targetColor, fillColor) {
    let stack = [{ x: Math.round(x), y: Math.round(y) }];
    let visited = new Set();
    let newPath = [];
    while (stack.length > 0) {
        let { x: px, y: py } = stack.pop();

        if (px >= 0 && px < width && py >= 0 && py < height && !visited.has(`${px},${py}`) && colorsMatch(getColorAtPixel(px, py), targetColor)) {
            visited.add(`${px},${py}`);
            set(px, py, fillColor);
            newPath.push({ x: px, y: py });

            for (let dir of directions) {
                let nx = px + dir.x;
                let ny = py + dir.y;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    stack.push({ x: nx, y: ny });
                }
            }
        }
    }
    drawingHistory.push({ tool: 'fill', color: pencilColor, size: 2, path: newPath });
    updatePixels(); // Actualizar los píxeles en el lienzo después de completar el llenado
    console.log('o');
    cursor(CROSS);
}

function colorsMatch(c1, c2) {
    return c1.levels[0] === c2.levels[0] &&
        c1.levels[1] === c2.levels[1] &&
        c1.levels[2] === c2.levels[2] &&
        c1.levels[3] === c2.levels[3];
}

// Obtener el color del píxel en la posición (x, y)
function getColorAtPixel(x, y) {
    let pixelColor = get(x, y); // Obtener el color del píxel en formato [R, G, B, A]

    // Crear un objeto p5.Color con los componentes RGBA
    let colorObject = color(pixelColor[0], pixelColor[1], pixelColor[2], pixelColor[3]);

    return colorObject;
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

function drawFill(path, color, size) {
    stroke(color);
    strokeWeight(size);
    for (let i = 0; i < path.length - 1; i++) {
        let pointA = path[i];
        let pointB = path[i + 1];
        line(pointA.x, pointA.y, pointB.x, pointB.y);
    }
}

function touchStarted() {
    startX = touches[0].x;
    startY = touches[0].y;
    if (currentTool === 'pencil') {
        // Iniciar un nuevo trazo para el lápiz
        let newPath = [];
        newPath.push({ x: startX, y: startY });
        drawingHistory.push({ tool: 'pencil', color: pencilColor, size: pencilSize, path: newPath });
    }
    handleToolInteraction();
}

function touchMoved() {
    handleToolInteraction();
}

function touchEnded() {
    realaseTool();
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
    handleToolInteraction();
}

function mouseDragged2() {
    handleToolInteraction();
}

function mouseReleased() {
    realaseTool();
}

function handleToolInteraction() {
    if (currentTool === 'pencil') {
        if (mouseIsPressed || touches.length > 0) {
            // Dibujar con el lápiz en la capa de "preview"
            let currentPath = drawingHistory[drawingHistory.length - 1].path;
            currentPath.push({ x: isTouchDevice() ? touches[0].x : mouseX, y: isTouchDevice() ? touches[0].y : mouseY });
        }
    } else if (currentTool === 'line') {
        if (mouseIsPressed || touches.length > 0) {
            updatePreview();
        }
    } else if (currentTool === 'rectangle' || currentTool === 'circle') {
        if (mouseIsPressed || touches.length > 0) {
            updatePreview();
        }
    } else if (currentTool === 'fill') {
        if (mouseIsPressed || touches.length > 0) {
            cursor(WAIT);
            let targetColor = getColorAtPixel(startX, startY);
            floodFillOptimized(startX, startY, targetColor, pencilColor);
            updatePixels();
        }
    }
}

function realaseTool() {
    if (currentTool === 'line') {
        // Registrar la acción de línea en el historial de dibujo
        drawingHistory.push({ tool: 'line', color: pencilColor, size: pencilSize, start: { x: startX, y: startY }, end: { x: mouseX, y: mouseY } });
    } else if (currentTool === 'rectangle') {
        // Registrar la acción de rectángulo en el historial de dibujo
        drawingHistory.push({ tool: 'rectangle', color: pencilColor, size: pencilSize, x: startX, y: startY, width: mouseX - startX, height: mouseY - startY });
    } else if (currentTool === 'circle') {
        // Registrar la acción de círculo en el historial de dibujo
        let diameter = dist(startX, startY, isTouchDevice() ? touches[0].x : mouseX, isTouchDevice() ? touches[0].y : mouseY) * 2;
        drawingHistory.push({ tool: 'circle', color: pencilColor, size: pencilSize, x: startX, y: startY, diameter: diameter });
    }
}

function updatePreview() {
    previewLayer.clear(); // Limpiar la capa de "preview"

    // Dibujar en la capa de "preview" según la herramienta seleccionada
    if (currentTool === 'line') {
        previewLayer.stroke(pencilColor);
        previewLayer.strokeWeight(pencilSize);
        previewLayer.line(startX, startY, isTouchDevice() ? touches[0].x : mouseX, isTouchDevice() ? touches[0].y : mouseY);
    } else if (currentTool === 'rectangle') {
        previewLayer.stroke(pencilColor);
        previewLayer.strokeWeight(pencilSize);
        previewLayer.noFill();
        previewLayer.rect(startX, startY, isTouchDevice() ? touches[0].x - startX : mouseX - startX, isTouchDevice() ? touches[0].y - startY : mouseY - startY);
    } else if (currentTool === 'circle') {
        previewLayer.stroke(pencilColor);
        previewLayer.strokeWeight(pencilSize);
        previewLayer.noFill();
        let diameter = dist(startX, startY, isTouchDevice() ? touches[0].x : mouseX, isTouchDevice() ? touches[0].y : mouseY) * 2;
        previewLayer.ellipse(startX, startY, diameter);
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
    previewLayer.clear();
}

function setColor() {
    // Cambiar el color de dibujo
    pencilColor = document.getElementById('colorPicker').value;
}

function changeColor(color) {
    // Cambiar el color de dibujo
    document.getElementById('colorPicker').value = color;
    pencilColor = color;
}

function setTool(tool) {
    // Cambiar la herramienta de dibujo
    currentTool = tool;
    if (tool != 'pencil') {
        cursor(CROSS);
        if(tool == 'eraser') {
            currentTool = 'pencil';
            changeColor('rgb(255,255,255)');
            pencilSize = eraserSize;
        }
    } else {
        cursor('../assets/cursor2.png')
    }
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

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function windowResized() {
    let divCanvas = document.getElementById('drawingCanvas');
    let w = divCanvas.offsetWidth;
    let h = divCanvas.offsetHeight;
    console.log('resize');
    resizeCanvas(w, h);
    previewLayer.resizeCanvas(w, h);
}

function resizeInfo() {
    let divCanvas = document.getElementById('drawingCanvas');
    let w = divCanvas.offsetWidth;
    let h = divCanvas.offsetHeight - 14;
    console.log('listo');
    resizeCanvas(w, h);
    previewLayer.resizeCanvas(w, h);
}

function dibujoListo() {
    saveFrames('mi_dibujo', 'png', 1, 1, function (data) {
        let imgBase64 = data[0].imageData;
        localStorage.setItem('imagenBase64', imgBase64);
        window.location.href = 'resultado.html';
    });
}

setTimeout(resizeInfo, 500);

document.addEventListener('DOMContentLoaded', function () {
    console.log('o');
    loadColores();
    console.log('call');
});