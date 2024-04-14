
// Array de valores de clase para rotar
let values = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'invisible'];

// Valor del nuevo Pokémon a mostrar
let newPoke = 'Psyduck';

// Función para iniciar la animación con aceleración y desaceleración aleatoria
function iniciarRuleta2() {
    const rouletteContainer = document.getElementById('roulette');
    const divs = rouletteContainer.querySelectorAll('div');

    // Determinar la velocidad inicial y el punto de desaceleración
    const initialSpeed = 50; // Duración inicial en milisegundos (muy rápida)
    const finalSpeed = 500; // Duración final en milisegundos (más lenta)
    const randomStop = Math.floor(Math.random() * (divs.length - 1)); // Punto de detención aleatorio

    // Animación con aceleración y desaceleración
    animate(0, initialSpeed);

    function animate(index, duration) {
        setTimeout(() => {
            // Rotar las clases y el contenido

            // Agregar un nuevo div invisible antes del primer div
            const nuevoDiv = document.createElement('div');
            nuevoDiv.textContent = newPoke;
            nuevoDiv.className = 'invisible';
            rouletteContainer.insertBefore(nuevoDiv, divs[0]);
            const divUpdated = rouletteContainer.querySelectorAll('div');

            for (let i = 0; i < 5; i++) {
                divUpdated[i].className = values[i].className;
            }


            // Eliminar el último div después de la animación
            setTimeout(() => {
                divUpdated[divs.length - 1].remove();
            }, duration); // Duración de la animación actual
        }, duration);
    }

    // Función para interpolar la duración de la animación
    function interpolate(x, x0, x1, y0, y1) {
        return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
    }
}

function initRuleta9() {
    const initialSpeed = 50;
    const finalSpeed = 5000;
    const randomStop = Math.floor(Math.random() * (40)); // Punto de detención aleatorio
    setTimeout(animacion, duracion);
}

function animacion() {
    const rouletteContainer = document.getElementById('roulette');
    const divs = rouletteContainer.querySelectorAll('div');
    const nuevoDiv = document.createElement('div');
    nuevoDiv.textContent = newPoke;
    nuevoDiv.className = 'invisible newItem';
    rouletteContainer.insertBefore(nuevoDiv, divs[0]);
    const divUpdated = rouletteContainer.querySelectorAll('div');
    for (let i = 0; i < 5; i++) {
        divUpdated[i].className = i == 0 ? values[i] + ' newItem' : values[i];
    }
    newPoke = divUpdated[divUpdated.length - 1].innerHTML;
    divUpdated[divUpdated.length - 1].remove();
}

function iniciarRuleta4() {
    let ejecuciones = 0;
    const ejecucionesMinimas = 100; // Número mínimo de ejecuciones
    const ejecucionesMaximas = 200; // Número máximo de ejecuciones
    let ejecucionesDetenidas = false;

    function ejecutar() {
        ejecuciones++;

        if (!ejecucionesDetenidas) {
            console.log(`Ejecución número ${ejecuciones}`);
        }

        if (ejecuciones >= ejecucionesMinimas) {
            ejecucionesDetenidas = Math.random() < 0.5; // Detener de forma aleatoria después de alcanzar el mínimo
        }

        if (ejecuciones >= ejecucionesMaximas || ejecucionesDetenidas) {
            console.log('Deteniendo de manera aleatoria o después de alcanzar el máximo...');
            return;
        }

        // Calcular el retardo para que sea más rápido al principio y más lento después
        const progreso = ejecuciones / ejecucionesMinimas;
        let retardo = Math.max(100, 1000 - progreso * 900); // Retardo decreciente con el progreso
        animacion();
        retardo = 1000 - retardo;
        console.log(retardo);
        // Programar la próxima ejecución con el retardo calculado
        setTimeout(ejecutar, retardo);
    }

    ejecutar();
}

function iniciarRuleta() {
    // Generar valores de retraso y ejecutar la función con los retardos
    // Generar valores de retraso y ejecutar la función con los retardos
    //const valoresRetraso = generarValoresDeRetraso();
    // Ejemplo de uso:
    const cantidadMinimaValores = 40;
    const cantidadMaximaValores = 55;
    const N = Math.floor(Math.random() * (cantidadMaximaValores - cantidadMinimaValores) + cantidadMinimaValores);
    console.log(N);
    ejecutarConRetraso(generarLista(N));
}

function funcionExponencialEstabilizada(x, x0) {
    let k = 0.1; // Ajusta este valor para que la transición sea más rápida

    // Ajustar k basado en x0 para que la función se acerque a 400 en el punto de estabilización
    if (x0 < 400) {
        k = k + (400 - x0) * 0.0025;
    } else {
        k = k + (x0 - 400) * 0.0025;
    }

    const L = 390; // Diferencia entre el valor de estabilización y el valor inicial

    // Modificar la función para un crecimiento más gradual al principio
    const resultado = L / (1 + Math.exp(-k * (x - x0))) + 10;
    return resultado > 400 ? resultado - (resultado - 400) * 0.02 : resultado + (400 - resultado) * 0.005 * x;
}

console.log(funcionExponencialEstabilizada(0)); // Debería ser cercano a 10
console.log(funcionExponencialEstabilizada(1000)); // Debería estabilizarse alrededor de 400


function generarValoresDeRetraso() {
    const cantidadMinimaValores = 200;
    const cantidadMaximaValores = 800;
    const x0 = Math.random() * (cantidadMaximaValores - cantidadMinimaValores) + cantidadMinimaValores; // Punto de estabilización aleatorio entre 200 y 800
    const valores = [];

    // Generar una cantidad aleatoria de valores entre cantidadMinimaValores y cantidadMaximaValores
    const cantidadValores = x0;

    let valorActual = 10;
    let incrementoBase = 0.1;

    for (let i = 0; i < cantidadValores; i++) {
        valores.push(Math.round(funcionExponencialEstabilizada(i, x0)));
    }
    console.log(valores.length);
    return valores;
}

function ejecutarConRetraso(valoresRetraso) {
    let index = 0;
    let delayClass = false;

    function llamarFuncionConRetraso() {
        if (index < valoresRetraso.length) {
            const retraso = valoresRetraso[index];

            setTimeout(() => {
                // Llamar a tu función aquí o realizar alguna acción
                console.log(`Llamando a la función después de ${retraso} ms ${index}`);

                // Incrementar el índice para pasar al siguiente valor de retraso
                index++;

                // Llamar recursivamente para el siguiente valor de retraso
                animacion();
                if(retraso > 200 && !delayClass) {
                    delayClass = true;
                    crearEstilo();
                }
                llamarFuncionConRetraso();
            }, retraso);
        } else {
            const rouletteContainer = document.getElementById('roulette');
            const divs = rouletteContainer.querySelectorAll('div');
            console.log(divs[2]);
            eliminarEstilo();
            setTimeout(() => {
                divs[2].classList.add('animate__animated', 'animate__tada');
            },500);
            console.log('Todos los retardos han sido utilizados');
        }
    }

    // Comenzar el proceso llamando a la función con el primer retraso
    llamarFuncionConRetraso();
}

function generarLista(N) {
    let lista = [];
    let incrementoMenor = 10;
    let incrementoMayor = 200;
    for (let i = 0; i < N; i++) {
        if (i / N < 0.8) {
            // 85% de los números incrementando de 10 hasta cerca de 110
            lista.push(Math.min(incrementoMenor, 115));
            incrementoMenor += Math.floor(Math.random() * (4 - 2) + 2); // Incremento aleatorio entre 0 y 2
        } else {
            // Resto de los números incrementando más rápido hasta cerca de 400
            lista.push(incrementoMayor);
            incrementoMayor += Math.floor(Math.random() * (80 - 50) + 50 / (N - i)); // Incremento que se ajusta para alcanzar cerca de 400
        }
    }
    return lista;
}

function crearEstilo() {
    let styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);

    // Agregar una regla CSS a la hoja de estilos
    styleSheet.sheet.insertRule('.roulette-container>div  { transition: font-size 0.2s ease; }', 0);
}

function eliminarEstilo() {
    // Obtener la hoja de estilos que hemos creado
    var styleSheet = document.querySelector('style');

    if (styleSheet) {
        // Remover la hoja de estilos del DOM
        styleSheet.parentNode.removeChild(styleSheet);
    } else {
        console.warn('No se encontró ninguna hoja de estilos para eliminar.');
    }
}




