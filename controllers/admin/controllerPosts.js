const postsDB = require('../../db/postsDB')

exports.get_page = (req, res) => {
    postsDB.read()
        .then(result => {
            res.render('admin/posts/all', {
                posts: result.rows,
                user: req.user
            });
        })
        .catch(result => {
            console.log(result)
            res.render('errors/error', {
                code: 500,
                message: result.error
            })
        })
}

exports.get_create = (req, res) => {
    res.render('admin/posts/createModify', {
        post: {},
        user: req.user
    })
}

exports.create = (req, res) => {
    const date = new Date().toISOString().split('T')[0]
    console.log(req.body)
    const post = {
        title: req.body.title,
        text: req.body.text,
        authorId: req.user.id,
        isFinished: (req.body.isFinished === 'on') ? 1 : 0,
        yearOfPublication: date.split('-')[0],
        monthOfPublication: date.split('-')[1],
        dayOfPublication: date.split('-')[2],
    }
    console.log(post)

    postsDB.create(post)
    res.status(200).redirect('/admin/posts')
}

exports.get_update = (req, res) => {
    postsDB.read(req.params.id)
        .then(result => {
            res.render('admin/posts/createModify', {
                post: result.rows[0],
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
    postsDB.update(post)
    res.status(200).redirect('/admin/posts')
}

exports.delete = id => {
    postsDB.delete(req.params.id)
    console.log('Post successfully deleted!')
    res.status(200).redirect('/admin/posts')
}