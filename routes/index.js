var express = require('express');
var router = express.Router();
var dbPath = '127.0.0.1:27017/codeblog'
var collections = ['users', 'articles']
var mongojs = require('mongojs')(dbPath, collections)
var ObjectId = mongojs.ObjectId
var mongodb = require('../lib/mongodb')
var md = require('node-markdown').Markdown
var test = md('+ a\r\n+ b')

var mdTool = require('../lib/markdownTool')

var app


function setRouters(uri, viewPath, data, method, fn, continued) {
    if ((viewPath === '' || viewPath === undefined) && uri !== undefined) {
        viewPath = uri.toString().match(/\/(.*)/)[1]
    }
    if (!method || method === '') {
        method = 'get'
    }
    if (data === undefined) {
        data = {}
    }
    app[method](uri, function (req, res, next) {
        data.msg = req.flash('msg')
        if (fn !== undefined) {
            fn(req, res,data)
        }
        else {
            res.render(viewPath, { data: data, session: req.session })
        }
        if (continued) {
            next()
        }
    })
}

module.exports = function (mainApp) {
    app = mainApp
    setRouters('/', 'index', { title: '编程猫' }, 'get', function (req, res, data) {
        var page = Number(req.query.page) || 1,
            tag = req.query.tag
        var articles = [],
            keys = {}
        if (tag) {
            keys.tag = tag
        }
        mongodb.find('articles', keys).then(function (d) {
            data.articlesLength = d.length
            mongojs.articles.find(keys).sort({ time: -1 }).limit(3).skip(3 * (page-1), function (e, articles) {
                for (var article of articles) {
                    article.id = article._id
                }
                if (d.length / 3 > page) {
                    articles.next = page+1
                }
                if (d.length /3 < page && page !== 0) {
                    articles.prev = page-1
                }
                data.articles = articles
                res.render('index', { data: data, session: req.session })
            })
        })
    })
    setRouters('/register', '', { title: '注册' })
    setRouters('/register', '', {}, 'post', function (req, res) {
        var mail = req.body.mail,
            name = req.body.name,
            pass = req.body.pass
        if (mail.match(/^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i) === null) {
            req.flash('msg','邮箱格式不正确')
            return res.redirect('/register')
        }
        else if (name === '') {
            req.flash('msg', '用户名不能为空')
            return res.redirect('/register')
        }
        else if (name.match(/[^a-zA-Z0-9_\u4e00-\u9fa5]+/) !== null) {
            req.flash('msg', '用户名使用了不允许的字符')
            return res.redirect('/register')
        }
        else if (pass === '') {
            req.flash('msg', '密码不能为空')
            return res.redirect('/register')
        }
        mongodb.find('users', { mail: mail })
            .then(function (data) {
                if (data.length === 0) {
                    mongodb.save('users', {
                        name: name,
                        mail: mail,
                        pass: pass
                    })
                }
                else {
                    req.flash('msg', '已注册过')
                    return res.redirect('/register')
                }
            })
            .then(function () {
                req.flash('msg', '成功注册')
                return res.redirect('/')
            })
            .catch(function (e) {
            req.flash('msg', e)
            return res.redirect('/register')
        })
    })
    setRouters('/login', '', {}, 'post', function (req, res) {
        var mail = req.body.mail,
            pass = req.body.pass
        mongodb.find('users', { mail: mail, pass: pass }).then(
            function (user) {
                if (user.length !== 0) {
                    req.flash('msg','登录成功')
                    user = user[0]
                    req.session.user = user
                    res.redirect('/uploadArticle')
                }
                else {
                    req.flash('msg','用户名或密码不正确')
                    res.redirect('/')
                }
            })
    })
    setRouters('/logout', '', {title:'退出'}, 'use', function (req, res) {
        req.session.destroy(function () {
            res.redirect('/')
        })
    })
    setRouters('/uploadArticle', '', { title: '发布文章' })
    //处理上传，以后可扩充种类
    setRouters('/upload', '', {}, 'use', function (req, res) {
        var type = req.body.type
        if (!type) {
            res.redirect('/')
        }
        else if (type === 'article') {
            if (!req.session.user || !req.session.user._id) {
                req.flash('msg', '用户未登录！')
                res.redirect('/')
            }
            var title = req.body.title,
                content = req.body.content,
                author = req.session.user.name,
                authorid = req.session.user._id,
                tag = req.body.tag,
                time = Date.now()
            if (title === '' || content === '') {
                req.flash('msg', '标题或正文不能为空')
                res.redirect('/')
            }
            else {
                var simpleContent = mdTool.getSimpleContent(content)
                var imgSrc = mdTool.getFirstImg(content)
                mongodb.save('articles', {
                    title: title,
                    content: content,
                    simpleContent: simpleContent,
                    imgSrc: imgSrc,
                    author: author,
                    authorid: authorid,
                    tag: tag,
                    time: time
                }).then(function () {
                    req.flash('msg', '提交文章成功')
                    res.redirect('/')
                })
            }
        }
    })
    setRouters('/article', '', {}, 'get', function (req, res,data) {
        var articleid = req.query.id
        if (articleid === '') {
            req.flash('文章不存在')
            res.redirect('/')
        }
        mongodb.find('articles', { _id: ObjectId(articleid) }).then(function (d) {
            if (d.length === 0) {
                req.flash('文章不存在')
                res.redirect('/')
            }
            else {
                var article = d[0]
                article.content = md(article.content)
                data.article = article
                data.title = article.title
                res.render('article', { data: data, session: req.session })
            }
        })
    })
    setRouters('/about', '', { title: '关于' })
        
}