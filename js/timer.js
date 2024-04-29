function loadPokemon() {
    const pokemon = localStorage.getItem('ganador');
    const pokemonDiv = document.getElementById("pokemon");
    pokemonDiv.textContent = pokemon ? '   ' + pokemon + '   ' : '   Missing no.   ';
    let elemento = document.createElement('span');
    elemento.id = `timer`;
    pokemonDiv.append(elemento);
}

// Función para iniciar el cronómetro
function iniciarCronometro(duracion) {
    let tiempoRestante = duracion; // Duración en segundos
    const cronometroElemento = document.getElementById("timer");

    // Función para actualizar el cronómetro
    function actualizarCronometro() {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        cronometroElemento.textContent = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
        if (tiempoRestante > 0) {
            tiempoRestante--;
        } else {
            clearInterval(intervalo);
            cronometroElemento.textContent = "Tiempo agotado";
            //Acción de terminar timer
        }
    }

    actualizarCronometro(); // Actualizar el cronómetro inmediatamente
    const intervalo = setInterval(actualizarCronometro, 1000); // Actualizar cada segundo
}

// Llamar a la función con la duración deseada en minutos (por ejemplo, 1 minuto)
loadPokemon();
//iniciarCronometro(60);
