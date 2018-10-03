

var React = require('react');

class UserShow extends React.Component {

    render() {

        console.log ( "Rendering Trainer & Pokemon info: ", this.props.pokemon );

        const trainerPokemons = this.props.pokemon.map( (e) => {

            return (

                <li>{e.pokemonname}</li>
            );
        });


        return (

            <div>

                <h1>Pokemon Trainer Page</h1>

                <h3>Pokemon caught by {this.props.pokemon[0].trainername} ----- (Trainer ID: {this.props.pokemon[0].user_id})</h3>

                <ul>

                    {trainerPokemons}

                </ul>

            </div>

        );
    };
};


module.exports = UserShow;








