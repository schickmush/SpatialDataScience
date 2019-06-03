
var cookie_helper={
    createCookie: function(name, value, days) {
        if (!days) {
            days = 10000;
        }
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
        document.cookie = name + '=' + value + expires + '; path=/';
    },
    readCookie: function(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: function(name) {
        cookie_helper.createCookie(name, '', 1);
    },
    getDocumentCookies: function() {
        var theCookies = document.cookie.split(';'),
            cookieObj = {},
            tmp, tmpName, tmpVal;
        for (var i = 1; i <= theCookies.length; i++) {
            tmp = theCookies[i - 1].split('=');
            if (tmp[0] !== undefined && tmp[1] !== undefined) {
                tmpName = decodeURIComponent(tmp[0].trim());
                tmpVal = decodeURIComponent(tmp[1].trim());
                if (tmpName.indexOf('[') > -1 && tmpName.indexOf(']') > -1) {
                    cookieObj[tmpName.split('[')[0]] = cookieObj[tmpName.split('[')[0]] || {};
                    cookieObj[tmpName.split('[')[0]][tmpName.split('[')[1].replace(']', '')] = tmpVal;
                } else {
                    cookieObj[tmpName] = tmpVal;
                }
            }
        }
        return cookieObj;
    }
};

function onBeforeLoad(e) {
    if (window != window.top) return;
}

document.addEventListener('beforeload', onBeforeLoad, true);

function OneClickpdfContent() {
    function Init() {
        if (location.href.indexOf('1clickpdf.com') != -1) {
            safari.self.tab.dispatchMessage('save_cookie',
            {
                'uid': cookie_helper.readCookie('uid')
            });
        }
    }
    return Init;
}

var objContent = new OneClickpdfContent();
objContent();

