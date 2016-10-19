let list = {}
if (location.pathname === '/about') {
    list = document.querySelectorAll('li a[href="about"]')
}
else if (location.pathname === '/') {
    list = document.querySelectorAll('li a[href="/"]')
}

for (let i in list) {
    if (!list.hasOwnProperty(i)) {
        continue
    }
    let li = list[i].parentNode
    if (li.className) {
        li.className += ' active'
    }
    else {
        li.className = 'active'
    }
}