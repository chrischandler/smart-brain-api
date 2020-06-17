const Clarifai = require('clarifai');
const { json } = require('express');

// Clarifai - Define API key
const app = new Clarifai.App({
	apiKey: '18b91d9801a64210ad1dd00e748ccf78'
});

// /imageurl endpoint - Calls the Clarifai API to detect the face
const handleApiCall = (req, res) => {
    // Share what's happening on the server console
    console.log('POST /imageurl', req.body.input);
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

// /image endpoint - updates the entries and increases the count
const handleImage = (req, res, db) => {
    const { id } = req.body;

    // Share what's happening on the server console
    console.log('PUT /image/')

    db('users').where('id', "=", id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {handleImage, handleApiCall}