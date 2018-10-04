/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')
const pg = require('pg');
const sha256 = require('js-sha256')

// Initialise postgres client

const config = {
    user: 'kencheng',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
};



const pool = new pg.Pool(config);

pool.on('error', function(err) {
    console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

const getRoot = (request, response) => {

    if (request.cookies['loggedIn'] === 'true') {
        console.log ("Logged in!~");
    } else console.log ("Not logged in~!");

    const queryString = 'SELECT * from pokemon;';

    pool.query(queryString, (err, result) => {

        if (err) {

            console.error('Query error:', err.stack);

        } else {

            // console.log('Query result:', result);

            response.render('pokemon/home', { pokemon: result.rows });

        };
    });
};


const getNew = (request, response) => {

    response.render('pokemon/new');
};


const getPokemon = (request, response) => {

    const queryString = `SELECT * FROM pokemon WHERE id = ${request.params.id}`;

    const queryString2 = `
        SELECT pokemon.id AS pokemonid, pokemon.name AS pokemonname, users_pokemon.user_id AS trainerid, users.name AS trainername

        FROM users
        INNER JOIN users_pokemon
        ON (users.id = users_pokemon.user_id)
        INNER JOIN pokemon
        ON (users_pokemon.pokemon_id = pokemon.id)

        WHERE users_pokemon.pokemon_id = ${request.params.id}`;


    pool.query(queryString, (err, result) => {

        if (err) {console.error('Query error: ', err.stack);}

        else {

            pool.query(queryString2, (err2, result2) => {

                if (err2) {console.error('Query2 error: ', err2.stack);}

                else {

                    console.log('Query result: ', result);
                    console.log('Query2 result: ', result2)

                    response.render('pokemon/pokemon', { pokemon: result.rows[0], trainers: result2.rows });

                };
            });
        };
    });
};


const showPokemon = (request, response) => {

    if (Object.keys(request.query).length > 0) {

        response.redirect(`/pokemon/${request.query.id}`);

    } else {

        response.redirect('/');
    };
};


const postPokemon = (request, response) => {

    let params = request.body;

    const queryString = 'INSERT INTO pokemon(name, img, weight, height) VALUES($1, $2, $3, $4);';
    const values = [params.name, params.img, params.weight, params.height];

    pool.query(queryString, values, (err, result) => {

        if (err) {

            console.log('query error:', err.stack);

        } else {

            console.log('query result:', result);

            // redirect to home page
            response.redirect('/');

        };
    });
};


const editPokemonForm = (request, response) => {

    let id = request.params['id'];

    const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';

    pool.query(queryString, (err, result) => {

        if (err) {

            console.error('Query error:', err.stack);

        } else {

            console.log('Query result:', result);

            // redirect to home page
            response.render('pokemon/edit', { pokemon: result.rows[0] });

        };
    });
};


const updatePokemon = (request, response) => {

    let id = request.params['id'];
    let pokemon = request.body;
    const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
    const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];

    console.log(queryString);

    pool.query(queryString, values, (err, result) => {

        if (err) {

            console.error('Query error:', err.stack);

        } else {

            console.log('Query result:', result);

            // redirect to home page
            response.redirect('/');
        };
    });
};


const deletePokemonForm = (request, response) => {

    response.send("COMPLETE ME");
};


const deletePokemon = (request, response) => {

    response.send("COMPLETE ME");
};

/**
 * ===================================
 * User
 * ===================================
 */


const userNew = (request, response) => {

    response.render('users/new');
};


const userPost = (request, response) => {

    const queryString = 'INSERT INTO users (name, password) VALUES ($1, $2) returning *';

    const values = [request.body.name, sha256(request.body.password)];

    console.log(queryString);

    pool.query(queryString, values, (err, result) => {

        if (err) {

            console.error('Query error:', err.stack);
            response.send('dang it.');

        } else {

            console.log('Query result:', result);

            response.cookie ('loggedIn', 'true');

            response.redirect(`/users/${result.rows[0].id}`);
        };
    });
};


const userShow = (request, response) => {

    let userID = request.params['id'];

    const queryString = `
        SELECT users_pokemon.user_id, users.name AS trainername, users_pokemon.pokemon_id, pokemon.name AS pokemonname
        FROM pokemon
        INNER JOIN users_pokemon
        ON (pokemon.id = users_pokemon.pokemon_id)
        INNER JOIN users
        ON (users_pokemon.user_id = users.id)
        WHERE users_pokemon.user_id = ${userID}`;


    pool.query(queryString, (err, result) => {

        if (err) {

            console.error('Query error: ', err.stack);

        } else {

            console.log('Query result: ', result);

            const queryString2 = `SELECT * FROM users WHERE id = ${userID}`;

            pool.query(queryString2, (err2, result2) => {

                if (err2) {console.error('Query2 error: ', err2.stack);}

                else {

                    console.log('Query2 result: ', result2);
                    response.render('users/show', {
                        pokemon: result.rows,
                        trainer: result2.rows
                    });
                };
            });
        };
    });
};


const usersShow = (request, response) => {

    if (Object.keys(request.query).length > 0) {

        response.redirect(`/users/${request.query.id}`);

    } else {

        response.redirect('/');
    };
};


/**
 * ===================================
 * User captures Pokemon
 * ===================================
 */


const catchNew = (request, response) => {

    response.render('catch/new');
};


const catchPost = (request, response) => {

    let params = request.body;

    const queryString = 'INSERT INTO users_pokemon (user_id, pokemon_id) VALUES ($1, $2);';
    const values = [params.user_id, params.pokemon_id];

    const queryString2 = `SELECT pokemon_id from users_pokemon WHERE user_id = ${params.user_id}`;

    pool.query(queryString2, (err2, result2) => {

        if (err2) {console.log('query2 error: ', err.stack);}

        else {

            for (i in result2.rows) {

                if (parseInt(result2.rows[i].pokemon_id) === parseInt(params.pokemon_id)) {

                    console.log('Already caught, blocking submit');

                    return response.send('ERROR: Trainer has already captured that Pokemon! Try again.');

                };
            };


            pool.query(queryString, values, (err, result) => {

                if (err) {

                    console.log('query error: ', err.stack);

                } else {

                    console.log('query result:', result);

                    response.redirect(`/users/${params.user_id}`);

                };
            });
        };
    });
};


/**
 * ===================================
 * Authentication
 * ===================================
 */


const login = (request, response) => {

    const queryString = `SELECT * FROM users WHERE name = '${request.body.name}'`;

    pool.query(queryString, (err, result) => {

        if (err) {console.error('Query error:', err.stack);}

        else {

            console.log('Query result:', result);

            if (result.rows.length > 0 && result.rows[0].password === sha256(request.body.password) ) {

                console.log('Login successful~!');
                response.cookie('loggedIn', 'true');
                response.redirect(`/users/${result.rows[0].id}`);

            } else {

                console.log('Login unsuccessful~!');
                response.redirect(`/users/login`);

            };
        };
    });
};


const logout = (request, response) => {

    response.clearCookie('loggedIn');

    response.send('You are logged out~!');

};


/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);
app.get('/pokemon', showPokemon);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

app.get('/users/login', userNew);
app.get('/users/:id', userShow);
app.get('/users', usersShow);
app.post('/users', userPost);

app.get('/catch', catchNew);
app.post('/catch', catchPost);

app.post('/users/login', login);
app.delete('/logout', logout);


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */

const server = app.listen(3001, () => console.log('~~~ Ahoy we go from the port of 3001!!!'));



// Handles CTRL-C shutdown
function shutDown() {

    console.log('Recalling all ships to harbour...');

    server.close(() => {

        console.log('... all ships returned...');

        pool.end(() => {

            console.log('... all loot turned in!');

            process.exit(0);

        });
    });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);








