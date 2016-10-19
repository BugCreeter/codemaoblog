var md = require('node-markdown').Markdown
var cheerio = require('cheerio')


function getFirstImg(text) {
    var src = text.match(/\!\[.*\]\(([^\)]*)\)/)
    if (src !== null) {
        return src[1]
    }
    else {
        return false
    }
}
function getSimpleContent(text) {
    var $ = cheerio.load(md(text))
    return $.text().replace(/\n/g,' ').substr(0,100)
}
exports.getFirstImg = getFirstImg
exports.getSimpleContent = getSimpleContent