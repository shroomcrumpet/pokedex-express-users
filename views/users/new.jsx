var React = require("react");

class New extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>

          <h3>Existing Trainer Login</h3>
          <form method="POST" action="/users/login">
            <div>
              name: <input name="name" type="text" /><br />
              password: <input name="password" type="text" />
            </div>
            <input type="submit" value="Submit" />
          </form>

          <h3>New Trainer Registration</h3>
          <form method="POST" action="/users">
            <div>
              name: <input name="name" type="text" /><br />
              password: <input name="password" type="text" />
            </div>
            <input type="submit" value="Submit" />
          </form>

          <h3>--------------------</h3>
          <form method="POST" action="/logout?_method=DELETE">
            <input type="submit" value="LOG OUT" />
          </form>

        </body>
      </html>
    );
  }
}

module.exports = New;
