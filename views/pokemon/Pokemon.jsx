

var React = require("react");

class Pokemon extends React.Component {

    render() {

        console.log ( "Rendering Pokemon and Trainers who have caught it: ", this.props );

        const pokemonTrainers = this.props.trainers.map( (e) => {

            return (

                <option value={e.trainerid}>{e.trainername}</option>
            );
        });




        return (

            <html>

            <head />
            <body>
                <div>
                <ul className="pokemon-list">

                    <img src={`${this.props.pokemon.img}`} />
                    <br />&zwnj;

                    <li className="pokemon-attribute">
                        Pokedex ID #: {this.props.pokemon.id}
                    </li>

                    <li className="pokemon-attribute">
                        Name: {this.props.pokemon.name}
                    </li>

                    <li className="pokemon-attribute">
                        Height: {this.props.pokemon.height}
                    </li>

                    <li className="pokemon-attribute">
                        Weight: {this.props.pokemon.weight}
                    </li>

                </ul>
                </div>

                <div>
                <h3>Trainers who have caught {this.props.pokemon.name}</h3>

                <form action="/users">
                    <select name="id">
                        {pokemonTrainers}
                    </select>
                    <input type="submit" value="Submit" />
                </form>

                </div>

            </body>
            </html>
        );
    };
};

module.exports = Pokemon;






