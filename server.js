const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Connect to the database
const db = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : 'postgres',
      database : 'smart-brain'
    }
  });

// Middleware Configurations

// Middleware cors - to allow us to use the localhost domain???
const app = express();
app.use(cors());

// Middleware to convert responses into JSON
app.use(express.json());

// / endpoint
app.get('/', (req, res) => {
    console.log('GET /');
    res.send(database.users);
})

// /signin endpoint - to login to a specified account
app.post('/signin', (req, res) => {
    console.log('POST /signin', req.body.email);
    db.select('email', 'hash').from('login')
        .where("email",'=', req.body.email)
        .then(data => {
            const isValid = data.bcryptSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                .where("email", "=", res.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'));
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
})

// /register endpoint - to create and login to a new account
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log('POST /register', name, email, password);
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'));
})

// /profile/:id endpoint - return the profile information for the id submitted
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    console.log('GET /profile/' + id);
    db.select('*').from('users').where({id:id})
        .then(user => {
            // Check if object contains characters, and if so, send the object as a JSON object.
            if (user.length) {
                res.json(user[0])
            } else {
                // if the object is empty, the user wasn't found
                res.status(400).json('not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

// /image endpoint - updates the entries and increases the count
app.put('/image', (req, res) => {
    console.log('PUT /image/')
    const { id } = req.body;
    db('users').where('id', "=", id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
});

// Required for the server to listen for incoming requests
app.listen(3000, () => {
    console.log("SMART-BRAIN app is running on port 3000");
})