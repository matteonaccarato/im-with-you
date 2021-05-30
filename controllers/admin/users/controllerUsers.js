const bcrypt = require('bcrypt')

const usersDB = require('../../../db/usersDB')
const phrasesDB = require('../../../db/phrasesDB')
const postsDB = require('../../../db/postsDB')
const savesDB = require('../../../db/savesDB')
const countriesDB = require('../../../db/countriesDB')
const { checkUniqueFields, checkEmailValid, checkUsernameValid } = require('../../../db/usersDB')
const { SALT_ROUNDS, internalError } = require('../../../db/utilsDB')
const { ROLE } = require('../../../config/adminUtils')

const s3 = require('../s3')
const singleUpload = s3.upload.single('image')

const ROLES = {
    "admin": ROLE.ADMIN,
    "basic": ROLE.BASIC
}

exports.get_create = async(req, res) => {
    try {
        const response = await countriesDB.read()

        res.render('admin/users/createModify', {
            user: req.user,
            roles: ROLES,
            countries: response.rows,
            formAction: 'create',
            userToUpdate: {}
        })
    } catch (err) {
        internalError(res, 500, err)
    }
}

exports.create = (req, res) => {

    try {
        singleUpload(req, res, async function(err) {
            if (err) {
                console.log(err)
                return res.end("Error uploading file.");
            } else console.log('Image uploaded')

            const lastSeen = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
            const dateOfBirth = req.body.dateOfBirth
            const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS)
            const usernameEmailValid = (await checkUniqueFields(req.body.email, req.body.username)).isValid

            if (usernameEmailValid) {
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
                usersDB.create(user, () => {
                    req.flash('info', 'Utente creato/aggiornato con successo!')
                    res.status(200).redirect(`/admin/${user.role}s`)
                });
            } else {
                req.flash('error', 'È già stato registrato un utente con questa email o password')
                res.redirect('/admin/users/create')
            }
        })

    } catch (err) {
        internalError(res, 500, err)
    }


    /* singleUpload(req, res, async function(err) {
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
        usersDB.create(user);
        res.status(200).redirect(`/admin/${user.role}s`)
    }) */
}

exports.get_update = async(req, res) => {
    try {
        const countries = await countriesDB.read()
        usersDB.readById(req.params.id, userToUpdate => {
            res.render('admin/users/createModify', {
                user: req.user,
                roles: ROLES,
                countries: countries.rows,
                userToUpdate: userToUpdate,
                formAction: `${userToUpdate.id}`
            })
        })
    } catch (e) {
        console.log(e)
    }
}

exports.update = async(req, res) => {

    try {
        const userToModify = (await usersDB.readGeneric(usersDB.FIELDS.ID, req.params.id)).rows[0]
            /* console.log(userToModify) */

        singleUpload(req, res, async function(err) {
            if (err) {
                console.log(err)
                return res.send('Error uploading file')
            } else console.log('Image uploaded')


            const emailNotChanged = userToModify.email == req.body.email;
            const usernameNotChanged = userToModify.username == req.body.username
            const emailValid = (await checkEmailValid(req.body.email))
            const usernameValid = (await checkUsernameValid(req.body.username))

            if ((emailNotChanged || emailValid) && (usernameNotChanged || usernameValid)) {

                usersDB.getImageUrl(req.params.id)
                    .then(async obj => {
                        if (obj && obj.url && obj.url !== '' && req.body.deleteImage == 1) {
                            console.log(obj)
                            const tmp = obj.url.split('/')
                            s3.deleteImage(tmp[tmp.length - 1])
                            console.log('Image updated!')
                        }

                        const dateOfBirth = req.body.dateOfBirth
                        const lastSeen = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
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
                        usersDB.update(user, () => {
                            req.flash('info', 'Utente creato/aggiornato con successo!')
                            res.status(200).redirect(`/admin/${user.role}s`)
                        })
                    })
                    .catch(result => console.log(result))
            } else {
                req.flash('error', 'È già stato registrato un utente con questa email o password')
                res.redirect(`/admin/users/${req.params.id}`)
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
            .then(obj => {
                if (obj && obj.url && obj.url !== '' && req.body.deleteImage == 1) {
                    console.log(obj)
                    const tmp = obj.url.split('/')
                    s3.deleteImage(tmp[tmp.length - 1])
                    console.log('Image updated!')
                }
                console.log(req.body)

                const dateOfBirth = req.body.dateOfBirth
                const lastSeen = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
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
                usersDB.update(user)
                res.status(200).redirect(`/admin/${user.role}s`)
            })
            .catch(result => console.log(result))
    }) */

}

exports.delete = (req, res) => {

    usersDB.getImageUrl(req.params.id)
        .then(obj => {
            if (obj.url && obj.url !== '') {
                const tmp = obj.url.split('/')
                s3.deleteImage(tmp[tmp.length - 1])
                console.log('Image successfully deleted!')
            }

            phrasesDB.deleteByField(phrasesDB.FIELDS.AUTHORID, req.params.id, () => {
                postsDB.deleteByField(postsDB.FIELDS.AUTHORID, req.params.id, () => {
                    savesDB.deleteByField(savesDB.SAVES_TBLS.PHRASE, savesDB.FIELDS.USER_ID, req.params.id, () => {
                        savesDB.deleteByField(savesDB.SAVES_TBLS.POST, savesDB.FIELDS.USER_ID, req.params.id, () => {
                            usersDB.deleteUser(req.params.id, () => {
                                console.log('User successfully deleted!')
                                req.flash('info', 'Utente eliminato con successo!!')
                                res.status(200).redirect(`/admin/${req.params.role}s`)
                            })
                        })
                    })
                })
            })

        })


    /* usersDB.getImageUrl(req.params.id)
        .then(async obj => {
            if (obj.url && obj.url !== '') {
                const tmp = obj.url.split('/')
                s3.deleteImage(tmp[tmp.length - 1])
                console.log('Image successfully deleted!')
            }
            try {
                
                await savesDB.deleteByField(savesDB.SAVES_TBLS.PHRASE, savesDB.FIELDS.USER_ID, req.params.id)
                await savesDB.deleteByField(savesDB.SAVES_TBLS.POST, savesDB.FIELDS.USER_ID, req.params.id)
                await usersDB.deleteUser(req.params.id)
                console.log('User successfully deleted!')
                res.status(200).redirect(`/admin/${req.params.role}s`)
            } catch (err) {
                internalError(res, 500, err)
            }
        }) */
}