exports.get_page = (req, res) => {
    res.render('admin/phrases');
}

exports.get_create = (req, res) => {
    res.render('admin/createPhrase')
}

exports.create = (req, res) => {
    console.log('ciao');
    console.log(req.body)
}