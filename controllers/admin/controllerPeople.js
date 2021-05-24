require('dotenv').config();
const sqlite3 = require('sqlite3');

const peopleDB = require('../../db/peopleDB')
const countriesDB = require('../../db/countriesDB')

const s3 = require('./s3')
const singleUpload = s3.upload.single('image')

exports.get_page = (req, res) => {

    peopleDB.read()
        .then(result => {
            res.render('admin/people/all', {
                people: result.rows
            })
        })
        .catch(result => console.log(result));
}

exports.get_create = (req, res) => {
    countriesDB.read()
        .then(result => {
            res.render('admin/people/create', {
                countries: result.rows
            })
        })
        .catch(result => console.log(result))
}

exports.create = (req, res) => {
    singleUpload(req, res, function(err) {
        if (err) {
            console.log(err)
            return res.send('Error uploading file.')
        } else console.log('Image uploaded')

        const person = {
            name: req.body.name,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth,
            quotationMarksColor: req.body.quotationMarksColor,
            img: (req.file) ? req.file.location : '',
            job: req.body.job,
            countryCode: req.body.countryCode
        }

        peopleDB.create(person)
        res.status(200).redirect('/admin/people')
    })
}


exports.get_update = (req, res) => {
    peopleDB.read(req.params.id)
        .then(result => {
            res.render('admin/people/update', {
                person: result.rows[0]
            })
        })
        .catch(result => console.log(result))

}

exports.update = (req, res) => {
    singleUpload(req, res, function(err) {
        if (err) {
            console.log(err)
            return res.send('Error uploading file')
        } else console.log('Image uploaded')

        peopleDB.getImageUrl(req.params.id)
            .then(obj => {
                if (obj && obj.url !== '') {
                    const tmp = obj.url.split('/')
                    s3.deleteImage(tmp[tmp.length - 1])
                }

                const person = {
                    name: req.body.name,
                    surname: req.body.surname,
                    dateOfBirth: req.body.dateOfBirth,
                    quotationMarksColor: req.body.quotationMarksColor,
                    img: (req.file) ? req.file.location : '',
                    job: req.body.job,
                    country: req.body.country
                }
                console.log(person)
                peopleDB.update(person)
                res.status(200).redirect('/admin/people')
            })
            .catch(result => console.log(result))
    })
}

exports.delete = (req, res) => {
    peopleDB.getImageUrl(req.params.id)
        .then(obj => {
            if (obj.url && obj.url !== '') {
                s3.deleteImage(getImageNameFromLink(obj.url))
                console.log('Image successfully deleted')
            }
            peopleDB.delete(req.params.id)
            console.log('Person successfully deleted')
            res.status(200).redirect('/admin/people')
        })
}