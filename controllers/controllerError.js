exports.get_page = (req, res) => {
    console.log(req.params.code)
    res.render('errors/error', {
        code: req.params.code,
        message: req.params.message
    })
}