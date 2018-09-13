var axios = require('axios');
var PropTypes = require('prop-types');
var jsonURL = "http://localhost:3000/Pokemon"; //Not really needed, link is already a URL

module.exports = {
    fetchAllPokemons: function () {

        return axios.get(jsonURL)
            .then(response => {
                console.log(response.data);
                return response.data;
            });
    },
    getPokedexData: function (entryId) {
        
        return axios.get(jsonURL)
            .then(response => {
                let results = response.data;
                let pokeArr = results.find(function(pokemon) {
                    if(pokemon.id === parseInt(entryId))
                    return pokemon;
                })
                console.log('Entry: ', pokeArr);
                return pokeArr;
            });
    }
    
}

