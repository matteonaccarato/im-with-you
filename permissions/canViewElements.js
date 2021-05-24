const { ROLE } = require('../config/adminUtils')

function canViewElement(user, element) {
    return (
        user.role === ROLE.ADMIN ||
        element.authorId == user.id
    )
}

module.exports = {
    canViewElement
}