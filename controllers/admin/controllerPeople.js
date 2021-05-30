/* require('dotenv').config(); */
/* const sqlite3 = require('sqlite3'); */

const peopleDB = require('../../db/peopleDB')
const countriesDB = require('../../db/countriesDB')

const s3 = require('./s3')
const singleUpload = s3.upload.single('image')

exports.get_page = (req, res) => {

    peopleDB.read()
        .then(result => {
            res.render('admin/people/all', {
                people: result.rows,
                user: req.user
            })
        })
        .catch(result => console.log(result));
}

exports.get_create = (req, res) => {
    countriesDB.read()
        .then(result => {
            res.render('admin/people/create', {
                countries: result.rows,
                user: req.user
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

        const date = req.body.dateOfBirth.split('-');
        const person = {
            name: req.body.name,
            surname: req.body.surname,
            yearOfBirth: date[0],
            monthOfBirth: date[1],
            dayOfBirth: date[2],
            quotationMarksColor: req.body.quotationMarksColor,
            img: (req.file) ? req.file.location : '',
            job: req.body.job,
            countryCode: req.body.countryCode
        }

        peopleDB.create(person, () => {
            req.flash('info', 'Persona creata con successo!')
            res.status(200).redirect('/admin/people')
        })
    })
}


exports.get_update = (req, res) => {
    peopleDB.read(req.params.id)
        .then(resultPeople => {
            console.log(resultPeople)

            countriesDB.read()
                .then(resultCountries => {
                    res.render('admin/people/update', {
                        person: resultPeople.rows[0],
                        countries: resultCountries.rows,
                        user: req.user
                    })
                })
                .catch(result => console.log(result))
        })
        .catch(result => console.log(result))

}

exports.update = (req, res) => {
    singleUpload(req, res, function(err) {
        if (err) {
            console.log(err)
            return res.send('Error uploading file')
        } else console.log('Image uploaded')

        console.log(req.body.deleteImage)

        peopleDB.getImageUrl(req.params.id)
            .then(obj => {
                if (obj && obj.url !== '' && req.body.deleteImage == 1) {
                    const tmp = obj.url.split('/')
                    s3.deleteImage(tmp[tmp.length - 1])
                    console.log('Image updated!')
                }

                const date = req.body.dateOfBirth.split('-');
                const person = {
                    id: req.params.id,
                    name: req.body.name,
                    surname: req.body.surname,
                    yearOfBirth: date[0],
                    monthOfBirth: date[1],
                    dayOfBirth: date[2],
                    quotationMarksColor: req.body.quotationMarksColor,
                    img: (req.body.deleteImage == 0) ? req.body.oldImgUrl : (req.file) ? req.file.location : '',
                    job: req.body.job,
                    countryCode: req.body.countryCode
                }
                console.log(person)
                peopleDB.update(person, () => {
                    req.flash('info', 'Persona aggiornata con successo!')
                    res.status(200).redirect('/admin/people')
                })
            })
            .catch(result => console.log(result))
    })
}

exports.delete = (req, res) => {
    peopleDB.getImageUrl(req.params.id)
        .then(obj => {
            if (obj.url && obj.url !== '') {
                /* s3.deleteImage(s3.getImageNameFromLink(obj.url)) */
                const tmp = obj.url.split('/')
                s3.deleteImage(tmp[tmp.length - 1])
                console.log('Image successfully deleted')
            }
            peopleDB.delete(req.params.id, () => {
                console.log('Person successfully deleted')
                req.flash('info', 'Persona eliminata con successo!')
                res.status(200).redirect('/admin/people')
            })
        })
}