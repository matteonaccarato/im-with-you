const countriesDB = require('../../db/countriesDB')

const s3 = require('./s3')
const singleUpload = s3.upload.single('image')

exports.get_page = (req, res) => {

    // const countries = await countriesDB.read()

    countriesDB.read()
        .then(result => {
            res.render('admin/profile', {
                user: req.user,
                countries: result.rows,
            })
        })
        .catch(result => console.log(result))
}

exports.update = (req, res) => {
    // ...
}