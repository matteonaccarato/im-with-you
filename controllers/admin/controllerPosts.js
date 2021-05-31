const postsDB = require('../../db/postsDB')
const savesDB = require('../../db/savesDB')
const { internalError } = require('../../db/utilsDB')

exports.get_page = async(req, res) => {

    try {
        const posts = (await postsDB.read()).rows;
        const likes = (await savesDB.getLikes(savesDB.SAVES_TBLS.POST)).rows

        posts.map(post => {
            likes.forEach(like => {
                if (post.id == like.contentId) {
                    post.likes = like.likes;
                    return post
                }
            })
        })

        res.render('admin/posts/all', {
            posts: posts,
            user: req.user
        });

    } catch (err) {
        internalError(res, 500, err)
    }
}

exports.get_create = (req, res) => {
    res.render('admin/posts/createModify', {
        user: req.user,
        formAction: 'create',
        post: {},
    })
}

exports.create = (req, res) => {
    const date = new Date().toISOString().split('T')[0]
    const post = {
        title: req.body.title,
        text: req.body.text,
        authorId: req.user.id,
        isFinished: (req.body.isFinished === 'on') ? 1 : 0,
        yearOfPublication: date.split('-')[0],
        monthOfPublication: date.split('-')[1],
        dayOfPublication: date.split('-')[2],
    }

    postsDB.create(post, () => {
        req.flash('info', 'Post creato con successo!!')
        res.status(200).redirect('/admin/posts')
    })
}

exports.get_update = (req, res) => {
    postsDB.read(postsDB.FIELDS.ID, req.params.id)
        .then(result => {
            res.render('admin/posts/createModify', {
                post: result.rows[0],
                formAction: result.rows[0].id,
                user: req.user
            })
        })
        .catch(result => {
            console.log(result)
            res.render('errors/error', {
                code: 500,
                message: result.error
            })
        })
}

exports.update = (req, res) => {
    const date = new Date().toISOString().split('T')[0]
    const post = {
        id: req.params.id,
        title: req.body.title,
        text: req.body.text,
        authorId: req.user.id,
        isFinished: (req.body.isFinished === 'on') ? 1 : 0,
        yearOfPublication: date.split('-')[0],
        monthOfPublication: date.split('-')[1],
        dayOfPublication: date.split('-')[2],
    }
    postsDB.update(post, () => {
        req.flash('info', 'Post aggiornato con successo!!')
        res.status(200).redirect('/admin/posts')
    })
}

exports.delete = (req, res) => {

    savesDB.deleteByField(savesDB.SAVES_TBLS.POST, savesDB.FIELDS.CONTENT_ID, req.params.id, () => {
        postsDB.delete(req.params.id, () => {
            console.log('Post successfully deleted!')
            req.flash('info', 'Post eliminato con successo!!')
            res.status(200).redirect('/admin/posts')
        })
    })

}