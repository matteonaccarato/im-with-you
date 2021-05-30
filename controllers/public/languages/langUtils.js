const PAGES = {
    "/": "home",
    "/register": "register",
    "/login": "login",
    "/phrases": "phrases",
    "/posts": "posts",
    "/saved": "saved",
    "/profile": "profile",
    "/*": "404"
}

const LANGUAGES = {
    "IT": "it",
    "EN": "en"
}


const getContents = (user, page) => {
    const rawContents = require('../../../views/public/contents.json')
    if (user) {
        switch (user.countryCode) {
            case LANGUAGES.IT:
                contents = rawContents[LANGUAGES.IT][page]
                break;
            default:
                contents = rawContents[LANGUAGES.EN][page]
        }
    } else contents = rawContents[LANGUAGES.EN][page]

    return contents;
}

module.exports = {
    PAGES,
    LANGUAGES,
    getContents
};