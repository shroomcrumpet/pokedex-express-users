

var React = require("react");

class New extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <form method="POST" action="/catch">
            <div>
              Trainer (user) ID:<input name="user_id" type="number" />
              Pokemon Pokedex ID:<input name="pokemon_id" type="number" />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = New;
