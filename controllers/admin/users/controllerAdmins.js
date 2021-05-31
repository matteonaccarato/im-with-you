const usersDB = require('../../../db/usersDB')
const { ROLE } = require('../../../config/adminUtils')

exports.get_page = (req, res) => {

    usersDB.readByRole(ROLE.ADMIN)
        .then(result => {
            res.render('admin/users/all', {
                user: req.user,
                users: result.rows,
                role: ROLE.ADMIN
            })
        })
        .catch(result => console.log(result))
}