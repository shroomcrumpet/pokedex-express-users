

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
                    <li className="pokemon-attribute">
                        id: {this.props.pokemon.id}
                    </li>
                    <li className="pokemon-attribute">
                        name: {this.props.pokemon.name}
                    </li>
                    <li className="pokemon-attribute">
                        img: {this.props.pokemon.img}
                    </li>
                    <li className="pokemon-attribute">
                        height: {this.props.pokemon.height}
                    </li>
                    <li className="pokemon-attribute">
                        weight: {this.props.pokemon.weight}
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






