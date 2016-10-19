var regBtn = document.querySelector('#registerBtn')
var loginBtn = document.querySelector('#loginBtn')
var logoutBtn = document.querySelector('#logoutBtn')
var postBtn = document.querySelector('#postBtn')

function checkRegInfo() {
    var mail = document.querySelector('#registerEmail').value,
        name = document.querySelector('#registerName').value,
        pass = document.querySelector('#registerPassword').value,
        pass2 = document.querySelector('#registerPassword2').value,
        form = document.querySelector('[action="register"]')
    if (mail === '') {
        alert('邮箱不能为空')
    }
    else if (mail.match(/^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i) === null) {
        alert('邮箱格式有误')
    }
    else if (name === '') {
        alert('用户名不能为空')
    }
    else if (name.match(/[^a-zA-Z0-9_\u4e00-\u9fa5]+/) !== null) {
        alert('用户名使用了不允许的字符')
    }
    else if (pass === '') {
        alert('密码不能为空')
    }
    else if (pass !== pass2) {
        alert('密码不一致')
    }
    else {
        form.submit()
    }
}
function checkLoginInfo() {
    var mail = document.querySelector('#inputEmail').value,
        pass = document.querySelector('#inputPassword').value,
        form = document.querySelector('[action="login"]')
    if (mail.match(/^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i) === null) {
        alert('邮箱格式有误')
    }
    else if (mail === '') {
        alert('邮箱不能为空')
    }
    else if (pass === '') {
        alert('密码不能为空')
    }
    else {
        form.submit()
    }
}
function checkLogoutInfo() {
    var form = document.querySelector('[action="logout"]')
    if (confirm('确定要退出？')) {
        form.submit()
    }
}
function checkPostInfo() {
    var form = document.querySelector('[action="upload"]'),
        title = form.querySelector('input[name="title"]').value,
        content = form.querySelector('textarea[name="content"]').value,
        tag = form.querySelector('input[name="tag"]').value
    if (title === '' || content === '') {
        alert('标题或正文不能为空')
    }
    else if (confirm('确认提交？')) {
        form.submit()
    }
}
if (regBtn) {
    regBtn.addEventListener('click', checkRegInfo)
}
if (loginBtn) {
    loginBtn.addEventListener('click', checkLoginInfo)
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', checkLogoutInfo)
}
if (postBtn) {
    postBtn.addEventListener('click', checkPostInfo)
}