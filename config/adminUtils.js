const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

function checkRole(role) {
    // return a middleware
    return (req, res, next) => {
        // you need permissions
        // check the role
        if (req.user.role !== role) {
            res.status(403).render('errors/error', {
                code: 403,
                message: 'Forbidden'
            })
        }

        next()
    }
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // true: user auth; false: user not auth
        return next()
    }

    // you need to sign in
    res.status(401).render('errors/error', {
        code: 401,
        message: 'Unauthorized'
    })
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