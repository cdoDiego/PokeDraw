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
let pg;

const directions = [
    { x: 1, y: 0 },   // Derecha
    { x: -1, y: 0 },  // Izquierda
    { x: 0, y: 1 },   // Abajo
    { x: 0, y: -1 }   // Arriba
];

function setup() {
    let drawingCanvas = select('#drawingCanvas');
    
    // Obtiene el ancho y alto del div
    let w = drawingCanvas.width;
    let h = drawingCanvas.height;
    console.log(h);

    canvas = createCanvas(w, h);
    canvas.parent('drawingCanvas');
    background(255);

    // Crear una capa adicional para dibujar el "preview"
    previewLayer = createGraphics(width, height);
    previewLayer.clear();
    loadPixels();
    cursor('../assets/cursor2.png');
}

function draw() {
    // Limpiar el lienzo principal en cada iteración
    background(255);

    // Dibujar las formas anteriores en el lienzo principal
    for (let action of drawingHistory) {
        if (action.tool === 'pencil') {
            drawPencilN(action.path, action.color, action.size);
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

    // Mostrar la capa de "preview" en el lienzo principal
    image(previewLayer, 0, 0);
}

// Obtener el color del píxel en la posición (x, y)
function getColorAtPixel(x, y) {
    let pixelColor = get(x, y); // Obtener el color del píxel en formato [R, G, B, A]

    // Crear un objeto p5.Color con los componentes RGBA
    let colorObject = color(pixelColor[0], pixelColor[1], pixelColor[2], pixelColor[3]);

    return colorObject;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? color(
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)) : hex;
}

// Función de relleno por inundación (flood fill)
function floodFill(x, y, targetColor, fillColor) {
    // Verificar si targetColor y fillColor son objetos de tipo p5.Color válidos
    if (!(targetColor instanceof p5.Color) || !(fillColor instanceof p5.Color)) {
        console.error('Error: targetColor y fillColor deben ser objetos de tipo p5.Color válidos.');
        return;
    }

    // Crear una matriz de seguimiento para los píxeles visitados
    let visited = Array.from({ length: width }, () => Array(height).fill(false));

    // Crear una pila para el algoritmo de relleno por inundación
    let stack = [];
    stack.push({ x: x, y: y });
    console.log('stack');
    while (stack.length > 0) {
        let pixel = stack.pop();
        let px = pixel.x;
        let py = pixel.y;

        // Verificar si el píxel está dentro de los límites del lienzo
        if (px >= 0 && px < width && py >= 0 && py < height) {
            // Verificar si visited[px] es un arreglo definido
            if (!visited[px]) {
                visited[px] = Array(height).fill(false); // Inicializar visited[px] si es undefined
            }

            // Verificar si el píxel no ha sido visitado y tiene el color objetivo
            if (!visited[px][py] && colorsMatch(getColorAtPixel(px, py), targetColor)) {
                // Cambiar el color del píxel al color de relleno
                set(px, py, fillColor);
                changedPixels.push({ x: px, y: py });

                // Marcar como visitado
                visited[px][py] = true;

                // Agregar píxeles adyacentes a la pila si no han sido visitados
                stack.push({ x: px + 1, y: py }); // Derecha
                stack.push({ x: px - 1, y: py }); // Izquierda
                stack.push({ x: px, y: py + 1 }); // Abajo
                stack.push({ x: px, y: py - 1 }); // Arriba
            }
        }
    }

    // Actualizar el lienzo después del relleno por inundación
    console.log('update');
    console.log(changedPixels);
    console.log(stack);
    updatePixels();
}

function floodFill2(x, y, colour) {
    let stack = [{ x: Math.round(x), y: Math.round(y), colour }];
    set(Math.round(x), Math.round(y), pencilColor);
    let checked = Array(width).fill().map(() => Array(height).fill(false));

    while (stack.length > 0) {
        let current = stack.pop();
        if (current.x < 0 || current.x >= width || current.y < 0 || current.y >= height)
            continue;
        if (checked[current.x][current.y]) continue;
        checked[current.x][current.y] = true;

        for (let i = 0; i < directions.length; i++) {
            let child = {
                x: Math.round(current.x + directions[i][0]),
                y: Math.round(current.y + directions[i][1]),
                colour
            };
            if (isValidPixel(child.x, child.y, child.colour) && !checked[child.x][child.y]) {
                set(child.x, child.y, pencilColor);
                set(child.x + 1, child.y, pencilColor);
                set(child.x, child.y + 1, pencilColor);
                set(child.x - 1, child.y, pencilColor);
                set(child.x, child.y - 1, pencilColor);
                set(child.x + 1, child.y + 1, pencilColor);
                set(child.x - 1, child.y - 1, pencilColor);
                set(child.x + 1, child.y - 1, pencilColor);
                set(child.x - 1, child.y + 1, pencilColor);
                stack.push(child);
            }
        }
    }
}

function isValidPixel(x, y, colour) {
    return (x >= 0 && y >= 0 && x < width && y < height && colorsMatch(get(x, y), colour));
}

function scanlineFill(x, y, targetColor, fillColor) {
    let stack = [{ x: Math.round(x), y: Math.round(y) }];
    let checked = Array.from({ length: width }, () => Array(height).fill(false));
    let newPath = [];
    while (stack.length > 0) {
        let pixel = stack.pop();
        let px = pixel.x;
        let py = pixel.y;

        // Verificar si px y py están dentro de los límites del lienzo
        if (px >= 0 && px < width && py >= 0 && py < height && !checked[px][py] && colorsMatch(getColorAtPixel(px, py), targetColor)) {
            // Marcar el pixel como visitado
            checked[px][py] = true;

            // Rellenar el pixel con el color de relleno
            set(px, py, fillColor);
            newPath.push({x: px, y: py});

            // Agregar píxeles adyacentes a la pila si cumplen las condiciones
            if (py > 0 && !checked[px][py - 1] && colorsMatch(getColorAtPixel(px, py - 1), targetColor)) {
                stack.push({ x: px, y: py - 1 });
            }
            if (py < height - 1 && !checked[px][py + 1] && colorsMatch(getColorAtPixel(px, py + 1), targetColor)) {
                stack.push({ x: px, y: py + 1 });
            }
            if (px > 0 && !checked[px - 1][py] && colorsMatch(getColorAtPixel(px - 1, py), targetColor)) {
                stack.push({ x: px - 1, y: py });
            }
            if (px < width - 1 && !checked[px + 1][py] && colorsMatch(getColorAtPixel(px + 1, py), targetColor)) {
                stack.push({ x: px + 1, y: py });
            }
        }
    }
    drawingHistory.push({ tool: 'pencil', color: pencilColor, size: pencilSize, path: newPath });
    updatePixels();
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
            newPath.push({x: px, y: py});

            for (let dir of directions) {
                let nx = px + dir.x;
                let ny = py + dir.y;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    stack.push({ x: nx, y: ny });
                }
            }
        }
    }
    drawingHistory.push({ tool: 'pencil', color: pencilColor, size: pencilSize, path: newPath });
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

function existInChangePixels(objeto) {
    return !changedPixels.some(elemento => elemento.x === objeto.x && elemento.y === objeto.y);
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

function drawPencilN(path, color, size) {
    stroke(color);
    strokeWeight(size);
    for (let i = 0; i < path.length - 1; i++) {
        let pointA = path[i];
        let pointB = path[i + 1];
        line(pointA.x, pointA.y, pointB.x, pointB.y);
    }
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

    if (currentTool === 'fill') {
        /*let targetColor = getColorAtPixel(mouseX, mouseY);
        floodFill(mouseX, mouseY, targetColor, hexToRgb(pencilColor));*/
        loadPixels();
        let targetColor = getColorAtPixel(mouseX, mouseY);
        floodFillOptimized(mouseX, mouseY, targetColor, pencilColor);
        updatePixels();
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
    previewLayer.clear();
}

function setColor() {
    // Cambiar el color de dibujo
    pencilColor = document.getElementById('colorPicker').value;
}

function changeColor(color) {
    // Cambiar el color de dibujo
    pencilColor = color;
}

function setTool(tool) {
    // Cambiar la herramienta de dibujo
    currentTool = tool;
    if(tool != 'pencil') {
        cursor(CROSS);
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
