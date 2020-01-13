$(function () {
    let count = 0;
    let pokemons = [];

    function initTypes() {
        $.get(
            `https://pokeapi.co/api/v2/type/?limit=999`,
            function (data) {
                let template = '';
                data.results.forEach(type => {
                    template += `<option value="${type.name}" class="typeOption">${type.name}</option>`
                });
                $('#typesSelect').append(template);
            });
    };
    initTypes();

    function getPokemonsList(limit, offset, handler) {
        $.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`, handler)
    }

    function handlePokemonList(data) {
        if (data.results) {
            data.results.forEach(pokemon => {
                let pokemonId = extractPokemonId(pokemon.url);
                let name = pokemon.name;
                getPokemonDetails(pokemonId, (pokemonInf) => {
                    pokemons.push(pokemonInf);
                
                    let pokemonImgUrl = pokemonInf.sprites.front_shiny;

                    let template = `<div id="pokemonId_${pokemonId}" class="pokemonPoster">
                                    <img src="${pokemonImgUrl}" class="image" id="${pokemonId+'_'+name}">
                                    <div class="pokemonName">${name}</div>
                                    <div id="pokemonName_${name}" class="pokemonButton"></div> </div>`;
                    $('#pokemonContainer').append(template);

                    pokemonInf.types.forEach(typePokemon => {
                        let pokemonTypeName = typePokemon.type.name;

                        let template_ = `<input 
                            id="${pokemonId + '_' + pokemonTypeName}"
                            type="button" 
                            class="${pokemonTypeName}Type type" 
                            value="${pokemonTypeName === 'unknown' ? '???' : pokemonTypeName}"></input>`;
                        $(`#pokemonName_${name}`).append(template_);

                        $(`#${pokemonId + '_' + pokemonTypeName}`).click(pokemonSkills);
                        $(`#${pokemonId+'_'+name}`).click(pokemonSkills);
                    });
                })
            });
        }
    };

    function extractPokemonId(url) {
        let temp = url.split('/');
        return temp[temp.length - 2];
    }

    function getPokemonDetails(id, handler) {
        $.get(`https://pokeapi.co/api/v2/pokemon/${id}`, handler)
    }

    $("#more").click(more);

    function more() {
        $('.pokemonPoster').show();
        count++;
        getPokemonsList(12, count * 12, handlePokemonList);
    }

    function pokemonSkills(a) {
        $('.detailsContainer').show();
        let temp = a.target.id;
        let pokeId = temp.split("_")[0];
        let pokeType = temp.split("_")[1];

        let pokemon = pokemons.find(el => el.id == pokeId);

        let typeArr = [];
        pokemon.types.forEach(typeP => {
            let typeName = typeP.type.name;
            typeArr.push(typeName);
        })

        let typeStr = typeArr.join(',');
        console.log(typeStr);


        let templateDetails = `<div class="detailsSkillsPoke">`;
        templateDetails += `<div><img src="${pokemon.sprites.front_shiny}" class="imageDetails"></div>
        <div><p class="detailsName">${pokemon.name} #${pokeId}</p></div>`;
        templateDetails += `<table>
                            <tr><td>Type</td><td>${typeStr}</td></tr>
                            <tr><td>Attack</td><td>${pokemon.stats[4].base_stat}</td></tr>
                            <tr><td>Defense</td><td>${pokemon.stats[3].base_stat}</td></tr>
                            <tr><td>HP</td><td>${pokemon.stats[5].base_stat}</td></tr>
                            <tr><td>SP Attack</td><td>${pokemon.stats[2].base_stat}</td></tr>
                            <tr><td>SP Defense</td><td>${pokemon.stats[1].base_stat}</td></tr>
                            <tr><td>Speed</td><td>${pokemon.stats[0].base_stat}</td></tr>
                            <tr><td>Weight</td><td>${pokemon.weight}</td></tr>
                            <tr><td>Total moves</td><td>${pokemon.moves.length}</td></tr>`;
        templateDetails += `</table>`;

        templateDetails += `</div>`
        $('.detailsContainer').empty();
        $('.detailsContainer').append(templateDetails);
    }

    more();

    $('#typesSelect').change(function (u) {
        $('.detailsContainer').hide();
        if (u.target.value === 'all') {
            $('.pokemonPoster').show();
        }
        else {
            $('.pokemonPoster').hide();
            pokemons.forEach(poke => {
                if (poke.types.find(el => el.type.name == u.target.value))
                    $(`#pokemonId_${poke.id}`).show();
            });
        }
    })

    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('#top').fadeIn();
        } else {
            $('#top').fadeOut();
        }
    });
    $("#top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
    });
});