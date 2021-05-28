const usersDB = require('../../../db/usersDB')
const { ROLE } = require('../../../config/adminUtils')

exports.get_page = (req, res) => {

    usersDB.readByRole(ROLE.BASIC)
        .then(result => {
            console.log(result)
            res.render('admin/users/all', {
                user: req.user,
                users: result.rows,
                role: ROLE.BASIC
            })
        })
        .catch(result => console.log(result))
}