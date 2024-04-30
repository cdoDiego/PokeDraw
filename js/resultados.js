function loadPokemon() {
    const pokemon = localStorage.getItem('ganador');
    const pokemonDiv = document.getElementById("pokemon");
    pokemonDiv.textContent = pokemon ? pokemon : 'Missing no.';
    getPokemonImage(pokemon || 'mimikyu');
}

async function getPokemonImage(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    var url = data.sprites.front_default;
    document.getElementById('imagenPoke').src = url;
    urlToBase64(url, function (base64) {
        document.getElementById('imagenPoke').src = base64;
    });

}

function descargarDibujo() {
    const pokemonName = localStorage.getItem('ganador');
    let base64 = localStorage.getItem('imagenBase64');
    var enlace = document.createElement('a');
    enlace.href = base64;
    enlace.download = `${pokemonName}_dibujo.png`; // Nombre del archivo
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

function descargarComparativa() {
    let imagen1 = document.getElementById('imagenDibujo');
    let imagen2 = document.getElementById('imagenPoke');
    console.log('wid: ' + imagen1.width + ' ' + imagen2.width);
    console.log('wid: ' + imagen1.height + ' ' + imagen2.height);

    let anchoImagen = imagen1.width + imagen2.width; // Calcular el ancho de la nueva imagen
    let altoImagen = Math.max(imagen1.height, imagen2.height); // Usar la altura máxima de ambas imágenes

    let canvas = document.createElement('canvas'); // Crear un nuevo lienzo
    canvas.width = anchoImagen;
    canvas.height = altoImagen;

    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagen1, 0, 0, imagen1.width, imagen1.height); // Dibujar la primera imagen
    // Configurar el atributo image-rendering para evitar la interpolación
    ctx.imageSmoothingEnabled = false;  // Para navegadores que soportan esta propiedad
    ctx.webkitImageSmoothingEnabled = false;  // Para navegadores basados en WebKit (como Safari)
    ctx.mozImageSmoothingEnabled = false;  // Para navegadores basados en Gecko (como Firefox)
    ctx.msImageSmoothingEnabled = false;  // Para Internet Explorer
    let size = Math.min(imagen2.width, imagen2.height);
    let offsetX = (imagen1.width - size)/2;
    let offsetY = (altoImagen - size)/2;
    console.log(offsetY);
    ctx.drawImage(imagen2 + offsetY, imagen1.width + offsetX, 0, size, size); // Dibujar la segunda imagen al lado de la primera

    let imagenCombinada = canvas.toDataURL('image/jpeg'); // Obtener la imagen combinada como base64
    descargarBase64ComoImagen(imagenCombinada, 'imagen_combinada.jpg'); // Descargar la imagen combinada
}

function descargarBase64ComoImagen(base64, nombreArchivo) {
    let link = document.createElement('a');
    link.download = nombreArchivo;
    link.href = base64;
    link.click();
}

function urlToBase64(url, callback) {
    // Crear un nuevo objeto Image
    var img = new Image();

    // Configurar un manejador de eventos onload
    img.onload = function () {
        // Crear un lienzo (canvas) para dibujar la imagen
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // Establecer el tamaño del lienzo según las dimensiones de la imagen
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la imagen en el lienzo
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Obtener la representación base64 de la imagen desde el lienzo
        var base64 = canvas.toDataURL('image/jpeg');

        // Llamar a la función de devolución de llamada con el resultado base64
        callback(base64);
    };

    // Configurar la fuente de la imagen como el URL proporcionado
    img.crossOrigin = 'anonymous';
    img.src = url;
}

document.addEventListener('DOMContentLoaded', function () {
    loadPokemon();
    let imgBase64 = localStorage.getItem('imagenBase64');
    if (imgBase64) {
        document.getElementById('imagenDibujo').src = imgBase64;
    } else {
        document.getElementById('imagenDibujo').src = 'assets/img/missing-no.webp'; // Cambia por una imagen por defecto
    }
});