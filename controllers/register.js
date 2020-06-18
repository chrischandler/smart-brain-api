// /register endpoint - to create and login to a new account
const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    
    // Share what's happening on the console
    console.log('POST /register', name, email, password, hash);

    // Validate form submission.  Don't trust the front end.
    if (!name || !email || !password) {
        return res.status(400).json('incorrect form submission');
    }

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
}

module.exports = { handleRegister };