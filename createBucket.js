const AWS = require('aws-sdk')
const id = 'AKIATBTD4NYDX5PFM2JZ'
const secret = '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'

const buck = 'im-with-you-dev'

const s3 = new AWS.S3({
    accessKeyId: id,
    secretAccessKey: secret,
});


const params = {
    Bucket: buck,
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "eu-central-1"
    }
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});