exports.get_page = (req, res) => {
    res.render('errors/error', {
        code: req.params.code,
        message: req.params.message,
        user: req.user
    })
}