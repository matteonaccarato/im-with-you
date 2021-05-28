const phrasesDB = require('../../db/phrasesDB')
const usersDB = require('../../db/usersDB')
const postsDB = require('../../db/postsDB')

const { ROLE } = require('./../../config/adminUtils')

exports.get_page = async(req, res) => {

    const nPhrases = (await phrasesDB.getCount()).nPhrases
    const nAdminUsers = (await usersDB.getCount(ROLE.ADMIN)).nUsers
    const nBasicUSers = (await usersDB.getCount(ROLE.BASIC)).nUsers
    const nPosts = (await postsDB.getCount()).nPosts

    res.render('admin/dashboard', {
        number_phrases: nPhrases,
        number_admins: nAdminUsers,
        number_basics: nBasicUSers,
        number_posts: nPosts,
        user: req.user
    });
}