const usersDB = require('../../../db/usersDB')
const { ROLE } = require('../../../config/adminUtils')

exports.get_page = (req, res) => {

    /* try { */

    usersDB.readByRole(ROLE.ADMIN)
        .then(result => {
            console.log(result)
            res.render('admin/users/all', {
                user: req.user,
                users: result.rows,
                role: ROLE.ADMIN
            })
        })
        .catch(result => console.log(result))


    /*  usersDB.readTest(ROLE.ADMIN, (row => {
         console.log('ZZZ')
         res.render('admin/users/admins/all', {
             user: req.user
         })
     })) */

    /* } catch (e) {
        console.log(e)
    }
 */


}