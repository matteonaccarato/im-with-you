const bcrypt = require('bcrypt')
const { SALT_ROUNDS } = require('../../../db/utilsDB')

const usersDB = require('../../../db/usersDB')
const countriesDB = require('../../../db/countriesDB')
const { ROLE } = require('../../../config/adminUtils')

const s3 = require('../s3')
const singleUpload = s3.upload.single('image')

exports.get_create = async(req, res) => {
    const response = await countriesDB.read()

    res.render('admin/users/create', {
        user: req.user,
        roles: {
            "admin": ROLE.ADMIN,
            "basic": ROLE.BASIC
        },
        countries: response.rows
    })
}

exports.create = (req, res) => {

    singleUpload(req, res, async function(err) {
        if (err) {
            console.log(err)
            return res.end("Error uploading file.");
        } else console.log('Image uploaded')

        const lastSeen = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
        const dateOfBirth = req.body.dateOfBirth
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS)
        const user = {
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            yearOfBirth: dateOfBirth.split('-')[0],
            monthOfBirth: dateOfBirth.split('-')[1],
            dayOfBirth: dateOfBirth.split('-')[2],
            img: (req.file) ? req.file.location : '',
            countryCode: req.body.countryCode,
            yearOfLastSeen: lastSeen.split('-')[0],
            monthOfLastSeen: lastSeen.split('-')[1],
            dayOfLastSeen: lastSeen.split('-')[2],
            role: req.body.role
        }
        console.log(user)

        usersDB.create(user);

        res.status(200).redirect(`/admin/${user.role}s`)
    })
}

exports.get_update = async(req, res) => {
    try {
        const countries = await countriesDB.read()
        await usersDB.readById(req.params.id, userToUpdate => {
            res.render('admin/users/update', {
                user: req.user,
                roles: {
                    "admin": ROLE.ADMIN,
                    "basic": ROLE.BASIC
                },
                countries: countries.rows,
                userToUpdate: userToUpdate
            })
        })
    } catch (e) {
        console.log(e)
    }


    /* res.render('admin/users/update', {
        user: req.user,
        roles: {
            "admin": ROLE.ADMIN,
            "basic": ROLE.BASIC
        },
        countries: countries.rows,
        userToUpdate: userToUpdate
    }) */
}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {

}