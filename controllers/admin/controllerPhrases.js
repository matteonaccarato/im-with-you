require('dotenv').config();
const sqlite3 = require('sqlite3');
/* const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer'); */

const phrasesDB = require('../../db/phrasesDB');
const peopleDB = require('../../db/peopleDB')

const upload = require('./s3')
const singleUpload = upload.single('myImg')

// mettere tutto in un aws.init


/* require('dotenv').config()
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');



const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

aws.config.update({
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKeyId,
    region: region
})
const s3 = new aws.S3()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'public-read',
    metadata: function(req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
        let name = file.originalname.split('.').slice(0, -1).join('.');
        let type = file.originalname.split('.').pop();
        console.log(name + '.' + type);
        cb(null, name + "-" + Date.now() + '.' + type);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 15
    }
}).single('myImg') */








/* const failureCallback = () => {
    res.send('maybe')
} */

exports.get_page = (req, res) => {

    phrasesDB.read()
        .then(result => {
            /* console.log(result); */
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
    singleUpload(req, res, function(err) {
        if (err) {
            console.log(err)
            return res.end("Error uploading file.");
        }

        const phrase = {
            text: req.body.text,
            img: req.file.location,
            quotedById: req.body.quotedById,
            authorId: 1,
            isFinished: (req.body.isFinished === 'on') ? 1 : 0,
            date: new Date().toLocaleDateString()
        }

        phrasesDB.create(phrase);
        res.status(200).redirect('/admin/phrases')
    })
}


exports.get_update = (req, res) => {
    phrasesDB.read(req.params.id)
        .then(phrase => {

            console.log(phrase)

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
    const phrase = {
        id: req.params.id,
        text: req.body.text,
        img: 'https://upload.wikimedia.org/wikipedia/commons/6/62/F12019_Leclerc_Schloss_Gabelhofen.jpg',
        quotedById: req.body.quotedById,
        authorId: 1,
        isFinished: (req.body.isFinished === 'on') ? 1 : 0,
        date: new Date().toLocaleDateString()
    }
    console.log(phrase)
    phrasesDB.update(phrase)
    res.status(200).redirect('/admin/phrases')
}

exports.delete = (req, res) => {
    phrasesDB.delete(req.params.id)
    console.log('Phrase successfully deleted')
    res.status(200).redirect('/admin/phrases')
}