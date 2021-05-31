const phrasesDB = require('../../db/phrasesDB')
const usersDB = require('../../db/usersDB')
const postsDB = require('../../db/postsDB')

const { ROLE } = require('./../../config/adminUtils')
const { internalError } = require('../../db/utilsDB')

exports.get_page = async(req, res) => {

    try {
        const nPhrases = (await phrasesDB.getCount()).nPhrases
        const nAdminUsers = (await usersDB.getCount(ROLE.ADMIN)).nUsers
        const nBasicUSers = (await usersDB.getCount(ROLE.BASIC)).nUsers
        const nPosts = (await postsDB.getCount()).nPosts
        const usersActive = (await usersDB.getUsersActiveToday())

        const lastPhrases = (await phrasesDB.readLasts(3)).rows
        const lastPosts = (await postsDB.readLasts(3)).rows

        res.render('admin/dashboard', {
            number_phrases: nPhrases,
            number_admins: nAdminUsers,
            number_basics: nBasicUSers,
            number_posts: nPosts,
            number_users: usersActive.nUsers,
            number_usersActiveToday: usersActive.nActive,
            lastPhrases: lastPhrases,
            lastPosts: lastPosts,
            user: req.user
        });
    } catch (err) {
        internalError(res, 500, err)
    }
}