require('dotenv').config();
const sqlite3 = require('sqlite3');

const peopleDB = require('../../db/peopleDB')

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

}

exports.create = (req, res) => {

}


exports.get_update = (req, res) => {

}

exports.update = (req, res) => {


}

exports.delete = (req, res) => {

}