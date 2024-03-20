const listaPokemon = document.querySelector('#listaPokemon');
const bottonsHeader = document.querySelectorAll('.btn-header');
const pokemons = [];
const URL = 'https://pokeapi.co/api/v2/pokemon/';

showLoader();

for(let i = 1; i <= 151; i++) {
    fetch(URL + i)
    .then((resp) => resp.json())
    .then((data) => addPokemon(data)); 
}

function addPokemon(data) {
    pokemons.push(data);
    if(pokemons.length == 151) {
        hideLoader();
        filterAndSortPokemon(null);
    }
}

function filterAndSortPokemon(filter) {
    listaPokemon.textContent = '';
    pokemons.filter(pok=> filter === null || typesContainedIn(pok.types, filter)).sort((a,b) => a.order > b.order ? 1 : -1).forEach(poke => mostrarPokemon(poke));
}

function typesContainedIn(types, filterType) {
    const typesPlain = types.map((type) => type.type).map(type => type.name);
    return typesPlain.includes(filterType);
}

function mostrarPokemon(poke) {
    const idBack = poke.id.toString().padStart(3, '0');
    const tipos = poke.types
        .map(type => type.type)
        .map(type => `<p class="tipo ${type.name}">${type.name.toUpperCase()}</p>`);

    const div = document.createElement('div');
    div.classList.add('pokemon');
    div.id = `pokemon-${poke.id}`;
    div.dataset.id = `${poke.id}`;
    
    div.innerHTML = `
        <p class="pokemon-id-back">#${idBack}</p>
        <div class="pokemon-imagen" id="pokemon-imagen-${poke.id}">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${poke.id}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">${tipos.join('')}</div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}M</p>
                <p class="stat">${poke.weight}Kg</p>
            </div>
        </div>
    `;
    
    listaPokemon.append(div);
}

function showLoader() {
    document.querySelector('#todos').classList.add('hidden');
    document.querySelector('#loader').classList.remove('hidden');
}

function hideLoader() {
    document.querySelector('#todos').classList.remove('hidden');
    document.querySelector('#loader').classList.add('hidden');
}

bottonsHeader.forEach(btn => btn.addEventListener('click', (e) => {
    const btnId = e.currentTarget.id;
    filterAndSortPokemon(`${btnId}` === 'ver-todos' ? null : btnId);
}));
