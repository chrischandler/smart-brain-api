// /profile/:id endpoint - return the profile information for the id submitted
const handleProfileGet = (req, res, db) => {
    const { id } = req.params;

    // Share what's happening on the console
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
}

module.exports = {handleProfileGet};