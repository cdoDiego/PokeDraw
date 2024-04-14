const genParams = {
    primeraGen: true,
    segundaGen: true,
    terceraGen: true,
    cuartaGen: true,
    quintaGen: true,
    sextaGen: true,
    septimaGen: true,
    octavaGen: true,
    novenaGen: true
};
document.addEventListener("DOMContentLoaded", () => {
    const generationIcons = document.querySelectorAll('.gen-icon');

    // Event listener para cada ícono de generación
    generationIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            console.log('o');
            icon.classList.toggle('active'); // Alternar clase 'active' al hacer clic
        });
    });
});

// Función para generar un Pokémon aleatorio
async function generateRandomPokemon() {
    const activeGenerations = Array.from(document.querySelectorAll('.gen-icon.active'))
        .map(icon => icon.getAttribute('data-gen'));

    const randomGen = activeGenerations[Math.floor(Math.random() * activeGenerations.length)];
    const randomPokemonNumber = Math.floor(Math.random() * 151) + 1;

    const pokemonImage = document.getElementById('pokemon-image');
    pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonNumber}.png`;

    // Opcional: Mostrar la imagen durante 3 segundos
    await new Promise(resolve => setTimeout(resolve, 3000));
    pokemonImage.src = 'assets/img/missgno.gif';
}

const getPokemonByGeneration = async (gen) => {
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`);
    const data = await response.json();
    return data.pokemon_species.map(pokemon => pokemon.name);
};

const getRandomPokemonList = async () => {
    let allPokemon = [];

    const activeGenerations = Array.from(document.querySelectorAll('.gen-icon.active'))
        .map(icon => icon.getAttribute('data-gen'));

    const randomGen = activeGenerations[Math.floor(Math.random() * activeGenerations.length)];
    console.log(randomGen);
    document.getElementById('gif').style.display = 'none';
    document.getElementById('sorteo').style.display = 'flex';
    allPokemon = await getPokemonByGeneration(randomGen);
    allPokemon.sort(function() {
        return 0.5 - Math.random();
    });
      
    const randomPokemon = allPokemon.slice(0, 20);
    console.log(randomPokemon);

    iniciarRuleta(randomPokemon);
};
