const bcrypt = require('bcrypt');
const countriesDB = require('../../db/countriesDB')
const usersDB = require('../../db/usersDB')

const { ROLE } = require('../../config/adminUtils')
const { SALT_ROUNDS, internalError } = require('../../db/utilsDB')
const { checkUniqueFields, checkEmailValid, checkUsernameValid } = require('../../db/usersDB')

const { PAGES, LANGUAGES, getContents } = require('../public/languages/langUtils')

const s3 = require('./s3')
const singleUpload = s3.upload.single('image')

exports.get_page = (req, res) => {
    countriesDB.read()
        .then(result => {
            res.render('admin/profile', {
                user: req.user,
                countries: result.rows,
                role: ROLE.ADMIN
            })
        })
        .catch(result => console.log(result))
}

exports.get_user_page = (req, res) => {
    const contents = getContents(req.user, PAGES['/profile'])
    countriesDB.read()
        .then(result => {
            res.render('public/profile', {
                user: req.user,
                countries: result.rows,
                ROLE: ROLE,
                language: contents
            })
        })
        .catch(result => console.log(result))
}

exports.update = async(req, res) => {

    try {

        singleUpload(req, res, async function(err) {
            if (err) {
                console.log(err)
                return res.send('Error uploading file')
            } else console.log('Image uploaded')


            const emailNotChanged = req.user.email == req.body.email;
            const usernameNotChanged = req.user.username == req.body.username
            const emailValid = (await checkEmailValid(req.body.email))
            const usernameValid = (await checkUsernameValid(req.body.username))


            if ((emailNotChanged || emailValid) && (usernameNotChanged || usernameValid)) {
                /* console.log(req.body.deleteImage) */

                usersDB.getImageUrl(req.params.id)
                    .then(async obj => {
                        if (obj && obj.url !== '' && req.body.deleteImage == 1) {
                            const tmp = obj.url.split('/')
                            s3.deleteImage(tmp[tmp.length - 1])
                            console.log('Image updated!')
                        }

                        const dateOfBirth = req.body.dateOfBirth
                        const lastSeen = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
                        const changePassword = await bcrypt.compare(req.body.oldPassword, req.user.password);
                        if (changePassword || req.body.password == '') {
                            const hashedPassword = (req.body.password != '') ? await bcrypt.hash(req.body.password, SALT_ROUNDS) : ''
                            const user = {
                                    id: req.params.id,
                                    email: req.body.email,
                                    password: hashedPassword,
                                    username: req.body.username,
                                    name: req.body.name,
                                    surname: req.body.surname,
                                    yearOfBirth: dateOfBirth.split('-')[0],
                                    monthOfBirth: dateOfBirth.split('-')[1],
                                    dayOfBirth: dateOfBirth.split('-')[2],
                                    img: (req.body.deleteImage == 0) ? req.body.oldImgUrl : (req.file) ? req.file.location : '',
                                    countryCode: req.body.countryCode,
                                    yearOfLastSeen: lastSeen.split('-')[0],
                                    monthOfLastSeen: lastSeen.split('-')[1],
                                    dayOfLastSeen: lastSeen.split('-')[2],
                                    role: req.body.role
                                }
                                /* console.log(user) */

                            usersDB.update(user, () => {
                                req.flash('info', 'Modifica del profilo completata con successo')
                                if (req.user.role == ROLE.ADMIN) {
                                    res.status(200).redirect('/admin/dashboard')
                                } else {
                                    res.status(200).redirect('/')
                                }
                            })
                        } else {
                            req.flash('error', 'Password non corretta')
                            if (req.user.role == ROLE.ADMIN) {
                                res.redirect('/admin/profile')
                            } else {
                                res.status(200).redirect('/')
                            }
                        }
                    })
                    .catch(result => console.log(result))
            } else {
                req.flash('error', 'Qualcuno ha già utilizzato questa email o questo username')
                if (req.user.role == ROLE.ADMIN) {
                    res.redirect('/admin/profile')
                } else {
                    res.redirect('/')
                }
            }
        })
    } catch (err) {
        internalError(res, 500, err)
    }

    /* singleUpload(req, res, function(err) {
            if (err) {
                console.log(err)
                return res.send('Error uploading file')
            } else console.log('Image uploaded')

            console.log(req.body.deleteImage)

            usersDB.getImageUrl(req.params.id)
                .then(async obj => {
                    if (obj && obj.url !== '' && req.body.deleteImage == 1) {
                        const tmp = obj.url.split('/')
                        s3.deleteImage(tmp[tmp.length - 1])
                        console.log('Image updated!')
                    }

                    const dateOfBirth = req.body.dateOfBirth
                    const lastSeen = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
                    const changePassword = await bcrypt.compare(req.body.oldPassword, req.user.password);
                    if (changePassword || req.body.password == '') {
                        const hashedPassword = (req.body.password != '') ? await bcrypt.hash(req.body.password, SALT_ROUNDS) : ''
                        const user = {
                            id: req.params.id,
                            email: req.body.email,
                            password: hashedPassword,
                            username: req.body.username,
                            name: req.body.name,
                            surname: req.body.surname,
                            yearOfBirth: dateOfBirth.split('-')[0],
                            monthOfBirth: dateOfBirth.split('-')[1],
                            dayOfBirth: dateOfBirth.split('-')[2],
                            img: (req.body.deleteImage == 0) ? req.body.oldImgUrl : (req.file) ? req.file.location : '',
                            countryCode: req.body.countryCode,
                            yearOfLastSeen: lastSeen.split('-')[0],
                            monthOfLastSeen: lastSeen.split('-')[1],
                            dayOfLastSeen: lastSeen.split('-')[2],
                            role: req.body.role
                        }
                        console.log(user)
                        usersDB.update(user)
                        res.status(200).redirect('/admin/dashboard')
                    }
                })
                .catch(result => console.log(result))
        }) */
    /* } */


}