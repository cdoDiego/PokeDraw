let newPoke = [];
let values = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'invisible'];

function iniciarRuleta(lista) {
    newPoke = lista;
    const cantidadMinimaValores = 40;
    const cantidadMaximaValores = 55;
    const N = Math.floor(Math.random() * (cantidadMaximaValores - cantidadMinimaValores) + cantidadMinimaValores);
    ejecutarConRetraso(generarLista(N));
}

function generarLista(N) {
    let lista = [];
    let incrementoMenor = 10;
    let incrementoMayor = 200;
    for (let i = 0; i < N; i++) {
        if (i / N < 0.8) { // 80% de los números incrementando de 10 hasta cerca de 110
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

                //Acciones a ejecutar
                animacion();
                if (retraso > 200 && !delayClass) {
                    delayClass = true;
                    crearEstilo();
                }

                // Llamar recursivamente para el siguiente valor de retraso
                llamarFuncionConRetraso();
            }, retraso);
        } else {
            finEjecucion();
        }
    }

    // Comenzar el proceso llamando a la función con el primer retraso
    llamarFuncionConRetraso();
}

function finEjecucion() {
    const rouletteContainer = document.getElementById('roulette');
    const divs = rouletteContainer.querySelectorAll('div');
    eliminarEstilo();
    setTimeout(() => {
        divs[2].classList.add('animate__animated', 'animate__tada');
    }, 500);
    console.log(`Ganador: ${divs[2].innerText}`);
    const ganador = divs[2].innerText;
    localStorage.setItem('ganador', ganador);
    console.log('Todos los retardos han sido utilizados');
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

function animacion() {
    const rouletteContainer = document.getElementById('roulette');
    const divs = rouletteContainer.querySelectorAll('div');
    const nuevoDiv = document.createElement('div');
    let primerElemento = newPoke.shift();
    nuevoDiv.textContent = primerElemento;
    nuevoDiv.className = 'invisible newItem';
    rouletteContainer.insertBefore(nuevoDiv, divs[0]);
    const divUpdated = rouletteContainer.querySelectorAll('div');
    for (let i = 0; i < 5; i++) {
        divUpdated[i].className = i == 0 ? values[i] + ' newItem' : values[i];
    }
    newPoke.push(primerElemento);
    divUpdated[divUpdated.length - 1].remove();
}
