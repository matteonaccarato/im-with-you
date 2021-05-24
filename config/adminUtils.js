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
} */

function checkRole(role) {
    // return a middleware
    return (req, res, next) => {
        // check the role
        if (req.user.role !== role) {
            // you are forbidden
            // (not allowed)
            res.redirect( /* 401  ,*/ '/login')
        }

        next()
    }
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // true: user auth; false: user not auth
        return next()
    }

    // You need to sign in
    res.redirect(403, '/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = {
    ROLE,
    checkRole,
    checkAuthenticated,
    checkNotAuthenticated
}