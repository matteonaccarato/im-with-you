require('dotenv').config();
const sqlite3 = require('sqlite3');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');

const phrasesDB = require('../../db/phrasesDB');
const peopleDB = require('../../db/peopleDB')

// mettere tutto in un aws.init
/* const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
    bucket: '',
    region: 'eu-central-1'
})

const fileFilter = (req, file, cb) => {
    // fare con operatore ternario
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

let nomeTemp;

const multerS3Config = multerS3({
    s3: s3,
    bucket: 'arn:aws:s3:eu-central-1:209589136903:accesspoint/dev',
    acl: 'public-read',
    metadata: function(req, file, cb) {
        cb(null, { fieldName: file.fieldName })
    },
    key: function(req, file, cb) {
        console.log(file);
        nomeTemp = new Date.toISOString() + '-' + file.originalname
        cb(null, nomeTemp)
    }
})

const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
}).single('phraseImage') */

/* const failureCallback = () => {
    res.send('maybe')
} */

exports.get_page = (req, res) => {

    phrasesDB.read()
        .then(result => {
            console.log(result);
            res.render('admin/phrases/all', {
                phrases: result.rows
            })
        })
        .catch(result => console.log(result));
}

exports.get_create = (req, res) => {
    peopleDB.read()
        .then(result => {
            console.log(result)
            res.render('admin/phrases/create', {
                quotedById: result.rows
            })
        })
        .catch(result => console.log(result))
}

exports.create = (req, res) => {
    /* upload(req, res, function(err) {
        if (err) {
            console.log('Error uploading file')
            return res.end('Error uploading file') // mandare una pagina di errore
        }

        console.log('maybe uploaded')

        console.log('https://im-with-you-dev.s3.eu-central-1.amazonaws.com/' + nomeTemp)

        console.log(req.body)
        res.status(200).redirect('/admin/phrases')
    }) */

    /* console.log(req.body) */

    const phrase = {
        text: req.body.text,
        img: 'https://upload.wikimedia.org/wikipedia/commons/6/62/F12019_Leclerc_Schloss_Gabelhofen.jpg',
        quotedById: req.body.quotedById,
        authorId: 1,
        isFinished: 1,
        date: new Date().toLocaleDateString()
    }

    phrasesDB.create(phrase);
    res.status(200).redirect('/admin/phrases')
}


exports.get_update = (req, res) => {
    phrasesDB.read(req.params.id)
        .then(phrase => {

            peopleDB.read()
                .then(people => {
                    res.render('admin/phrases/update', {
                        phrase: phrase.rows[0],
                        quotedById: people.rows
                    })
                })
                .catch(result => console.log(result))

        })
        .catch(result => console.log(result))
}

exports.update = (req, res) => {


}

exports.delete = (req, res) => {
    phrasesDB.delete(req.params.id)
    console.log('Phrase successfully deleted')
    res.status(200).redirect('/admin/phrases')
}