const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

/* function authUser(req, res, next) {
    if (req.user == null) {
        res.status(403) // ??
        return res.send('You need to sign in')
    }

    next()
}

function authRole(role) {
    // return a middleware
    return (req, res, next) => {
        // check the role
        if (req.user.role !== role) {
            // you are forbidden
            res.status(401)
            return res.send('Not allowed')
        }

        next()
    }
}

module.exports = {
    ROLE,
    authUser,
    authRole
} */


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // true: user auth; false: user not auth
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = {
    ROLE,
    checkAuthenticated,
    checkNotAuthenticated
}