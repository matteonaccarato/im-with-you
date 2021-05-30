require('dotenv').config()
const aws = require('aws-sdk');
const multerS3 = require('multer-s3'); /* https://www.npmjs.com/package/multer-s3 */
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
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.type === 'image/gif') {
        cb(null, true);
    } else {
        cb(null, false);
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
        const name = Date.now() + '.' + file.originalname.split('.').pop();
        console.log(name);
        cb(null, name)
    }
});

exports.upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

exports.deleteImage = key => {
    const params = { Bucket: bucketName, Key: key }
    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack)
        }
    })
}