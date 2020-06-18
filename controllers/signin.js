// /signin endpoint - to login to a specified account
const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    // Share what's happening on the console
    console.log('POST /signin', req.body);
    
    // Validate form submission.  Don't trust the front end.
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
        .where("email",'=', email)
        .then(data => {
            // const isValid = bcrypt.compareSync(password, data[0].hash);
            const isValid = true;
            if (isValid) {
                console.log('login is valid');
                return db.select('*').from('users')
                .where("email", "=", email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'));
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
}

module.exports = {handleSignIn};