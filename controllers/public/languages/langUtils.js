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
            case '':
                contents = rawContents[LANGUAGES.IT][page]
                break;
            case LANGUAGES.IT:
                contents = rawContents[LANGUAGES.IT][page]
                break;
            default:
                contents = rawContents[LANGUAGES.EN][page]
        }
    } else contents = rawContents[LANGUAGES.IT][page]

    return contents;
}

const getSpecificContents = (lang, page) => {
    console.log(lang + ' ' + page)
    const rawContents = require('../../../views/public/contents.json')
    return rawContents[lang][page]
}

module.exports = {
    PAGES,
    LANGUAGES,
    getContents,
    getSpecificContents
};