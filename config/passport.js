const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initalize(passport, getUserByEmail, getUserById) {
    // if the user is correct
    const authenticateUser = async(email, password, done) => {
        getUserByEmail(email, async(user) => {
            if (user == null) {
                return done(null, false, { message: 'Nessun utente si è registrato con questa email' }) // no err, no user found, message ;; No user with that email
            }

            try {
                if (await bcrypt.compare(password, user.password)) { // la prima è quella messa nel form, l'altra è quella salvata 
                    // true => tutto ok, user autenticato
                    return done(null, user, { message: 'User logged in' }) // return user authenticated
                } else {
                    return done(null, false, { message: 'Password inserita non corretta' }) // Password incorrect
                }
            } catch (e) {
                return done(e)
            }
        });


    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) // options: la prima è il nome dell'utente 

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        getUserById(id, async(user, err) => {
            if (user == undefined) {
                user = null // invalidate existing login session (user NOT found)
            }
            /* console.log(user) */
            done(err, user)
        })
    })

}

module.exports = initalize