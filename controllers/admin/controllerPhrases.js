require('dotenv').config();

const phrasesDB = require('../../db/phrasesDB');
const peopleDB = require('../../db/peopleDB')
const savesDB = require('../../db/savesDB')

const s3 = require('./s3')
const singleUpload = s3.upload.single('image')

exports.get_page = (req, res) => {

    phrasesDB.read()
        .then(result => {
            res.render('admin/phrases/all', {
                phrases: result.rows,
                user: req.user
            })
        })
        .catch(result => console.log(result));
}

exports.get_create = (req, res) => {
    peopleDB.read()
        .then(result => {
            console.log(result)
            res.render('admin/phrases/create', {
                quotedById: result.rows,
                user: req.user
            })
        })
        .catch(result => console.log(result))
}

exports.create = (req, res) => {
    singleUpload(req, res, function(err) {
        if (err) {
            console.log(err)
            return res.end("Error uploading file.");
        } else console.log('Image uploaded')

        const date = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
        const phrase = {
            text: req.body.text,
            img: (req.file) ? req.file.location : '',
            quotedById: req.body.quotedById,
            authorId: req.user.id,
            isFinished: (req.body.isFinished === 'on') ? 1 : 0,
            yearOfPublication: date.split('-')[0],
            monthOfPublication: date.split('-')[1],
            dayOfPublication: date.split('-')[2]
        }

        phrasesDB.create(phrase);
        res.status(200).redirect('/admin/phrases')
    })
}


exports.get_update = (req, res) => {
    phrasesDB.read(phrasesDB.FIELDS.ID, req.params.id)
        .then(phrase => {
            console.log('ciaoooooo')
            console.log(phrase)

            peopleDB.read()
                .then(people => {
                    res.render('admin/phrases/update', {
                        phrase: phrase.rows[0],
                        quotedById: people.rows,
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
            return res.end('Error uploading file.')
        } else console.log('Image updated!')

        console.log(req.body.deleteImage)

        phrasesDB.getImageUrl(req.params.id)
            .then(obj => {
                if (obj && obj.url !== '' && req.body.deleteImage == 1) {
                    // getImageNameFromUrl
                    const tmp = obj.url.split('/')
                    s3.deleteImage(tmp[tmp.length - 1])
                }
                const date = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
                const phrase = {
                        id: req.params.id,
                        text: req.body.text,
                        img: (req.body.deleteImage == 0) ? req.body.oldImgUrl : (req.file) ? req.file.location : '',
                        quotedById: req.body.quotedById,
                        authorId: req.user.id,
                        isFinished: (req.body.isFinished === 'on') ? 1 : 0,
                        yearOfPublication: date.split('-')[0],
                        monthOfPublication: date.split('-')[1],
                        dayOfPublication: date.split('-')[2]
                    }
                    /* console.log(phrase) */
                phrasesDB.update(phrase)
                res.status(200).redirect('/admin/phrases')
            })
            .catch(result => console.log(result))

    })
}

exports.delete = (req, res) => {
    phrasesDB.getImageUrl(req.params.id)
        .then(obj => {
            if (obj.url && obj.url !== '') {
                // metto getImageFameFromUrl
                const tmp = obj.url.split('/')
                s3.deleteImage(tmp[tmp.length - 1])
                console.log('Image successfully deleted!')
            }
            savesDB.delete(savesDB.SAVES_TBLS.PHRASE, req.params.id, req.user.id)
            phrasesDB.delete(req.params.id)
            console.log('Phrase successfully deleted!')
            res.status(200).redirect('/admin/phrases')
        })
}