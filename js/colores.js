var imagen = new Image();
imagen.crossOrigin = "anonymous";

// Crear un canvas para extraer los colores
let canvasImg;
let ctxImg;

let colorDefault = ['#FFFFFF', '#C0C0C0', '#808080', '#000000', '#FF0000', '#800000', '#FFFF00', '#808000',
    '#00FF00', '#008000', '#00FFFF', '#008080', '#0000FF', '#000080', '#FF00FF', '#800080'];
let colores = colorDefault;

// Cargar la imagen en el canvas (asegurarse de que la imagen está completamente cargada)
imagen.onload = function () {
    console.log(imagen.width);
    canvasImg.width = imagen.width;
    canvasImg.height = imagen.height;
    ctxImg.drawImage(imagen, 0, 0, imagen.width, imagen.height);

    // Obtener los datos de los píxeles
    const imageData = ctxImg.getImageData(0, 0, canvasImg.width, canvasImg.height);
    const data = imageData.data;

    // Objeto para contar la frecuencia de cada color
    const colorCount = {};

    // Recorrer los datos de los píxeles (cada píxel tiene 4 valores: r, g, b, a)
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const color = `rgb(${r},${g},${b})`;

        // Contar la frecuencia de cada color
        if (color in colorCount) {
            colorCount[color] += 1;
        } else {
            colorCount[color] = 1;
        }
    }

    // Encontrar los colores más comunes
    const sortedColors = Object.keys(colorCount).sort((a, b) => colorCount[b] - colorCount[a]);

    // Mostrar los colores más comunes (aquí podrías ajustar la cantidad que deseas mostrar)
    const numColorsToShow = sortedColors.length > 10 ? 10 : sortedColors;
    /*const div = document.getElementById('colores');
    div.innerHTML = '';*/
    for (let i = numColorsToShow; i >= 0; i--) {
        console.log(`Color: ${sortedColors[i]}, Frecuencia: ${colorCount[sortedColors[i]]}`);
        /*const elemento = document.createElement('div');

        // Agregar contenido al elemento, por ejemplo, una propiedad 'nombre'
        elemento.textContent = `Color: ${sortedColors[i]}, Frecuencia: ${colorCount[sortedColors[i]]}`; // Asegúrate de cambiar 'nombre' por la propiedad real de tus objetos
        elemento.style = `background-color: ${sortedColors[i]};`
        // Agregar el nuevo elemento al div
        div.appendChild(elemento);*/
        actualizarColores(rgbToHex(sortedColors[i]));
    }
    loadColores();
};

// Función para actualizar la lista de colores
function actualizarColores(nuevoColor) {
    // Verificar si el nuevo color ya está en la lista
    if (colores.includes(nuevoColor)) {
        // Si está repetido, no hacemos ningún cambio
        return;
    }

    // Si el color no está repetido, lo añadimos al principio de la lista
    colores.unshift(nuevoColor);

    // Verificar si la lista tiene más elementos de los permitidos
    const maxCantidadColores = colorDefault.length; // Cambia este valor según tu requisito
    if (colores.length > maxCantidadColores) {
        // Si la lista tiene más elementos de los permitidos, eliminamos el último
        colores.pop();
    }
}

function loadColores() {
    const div = document.getElementById('colors');
    div.innerHTML = '';
    console.log('loadColors');
    let input = document.createElement('input');
    input.type = "color";
    input.addEventListener("input", setColor);
    input.classList = 'color';
    input.id = 'colorPicker';
    input.setAttribute('aria-label', 'changeColor');
    div.appendChild(input);
    console.log('totalcolors: ' + colores.length);
    for (let i = 0; i < colores.length; i++) {
        let elemento = document.createElement('button');
        elemento.style = `background-color: ${colores[i]};`
        elemento.classList = 'color';
        elemento.id = `color${colores[i]}`;
        elemento.onclick = function () { changeColor(colores[i]); };
        elemento.setAttribute('aria-label', `changeColor-${colores[i]}`);
        // Agregar el nuevo elemento al div
        div.appendChild(elemento);
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    var result = /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*\d+\s*)?\)/.exec(rgb);
    if (result) {
        return "#" +
            componentToHex(+result[1], 2) +
            componentToHex(+result[2], 2) +
            componentToHex(+result[3], 2);
    }
    return undefined;
}

// Manejar errores de carga de la imagen
imagen.onerror = function () {
    console.error('Error al cargar la imagen');
};

function loadImagen(src) {
    // Iniciar la carga de la imagen
    console.log(src);
    imagen.src = src;
    canvasImg = document.createElement('canvas');
    ctxImg = canvasImg.getContext('2d');
}

async function suggestColors() {
    const src = await getPokemonImage(false);
    console.log(src);
    loadImagen(src);
}

async function getPokemonImage(home = true) {
    const winnerPoke = localStorage.getItem('ganador') || 'Blitzle';
    console.log(winnerPoke);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${winnerPoke.toLowerCase()}`);
    const data = await response.json();
    console.log(data);
    return home ? data.sprites.other.home.front_default : data.sprites.front_default;
}

