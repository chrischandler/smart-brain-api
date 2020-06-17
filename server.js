// Load dependencies
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Load controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



// Connect to the database
const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl : true
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

// other endpoints found in ./controllers directory
app.post('/signin',     signin.handleSignIn(db, bcrypt));
app.post('/register',   (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image',       (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl',   (req, res) => { image.handleApiCall(req, res) });

// Required for the server to listen for incoming requests
app.listen(process.env.PORT || 3000, () => {
    console.log(`SMART-BRAIN app is running on port ${process.env.PORT}`);
})