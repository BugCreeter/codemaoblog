"use strict"
var dbPath = '127.0.0.1:27017/codeblog'
var collections = ['users', 'articles']
var mongojs = require('mongojs')(dbPath, collections)
function find(table, key) {
    return new Promise(function (res, rej) {
        mongojs[table].find(key, function (e, d) {
            if (e) {
                rej(e)
            }
            else {
                res(d)
            }
        })
    })
}

function save(table, o) {
    return new Promise(function (res, rej) {
        mongojs[table].save(o, function (e, d) {
            if (e) {
                rej(e)
            }
            else {
                res(d)
            }
        })
    })
}

function multi(table, commandAndKey) {
    return new Promise(function (res, rej) {
        let commands = Object.keys(commandAndKey)
        for (let i = 0, count = commands.length; i < count; i++) {
            let command = commands[i],
                key = commandAndKey[command],
                mongojsResult = mongojs[table]

            if (i < count - 1) {
                mongojsResult = mongojsResult[command](key)
                console.log(mongojsResult)
            }
            else {
                mongojsResult = mongojsResult[command](key, function (e, data) {
                    res(data)
                })
            }
        }
    })
}
exports.find = find
exports.save = save
exports.multi = multi
