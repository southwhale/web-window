/**
 * @author yx
/**

 * 路由跳转
 * @param options
 * @constructor
 */
var TGO = tgo = {};
tgo.Router = function (options) {
    if (typeof options === 'object' && options.routes instanceof Array) {
        this.routes = options.routes;
    }
    if (typeof options === 'object' && options.parentFile) {
        this.parentFile = options.parentFile;
    }
    /**
     * 获取url的参数
     */
    this.query = {};
    var href = window.location.href;
    if (href.indexOf('?') > -1) {
        var params = href.substring(href.indexOf('?') + 1);
        var arr = params.split('&');
        for (var i = 0; i < arr.length; i++) {
            var objArr = arr[i].split('=');
            if (objArr[0]) {
                this.query[objArr[0]] = arr[i].substring(arr[i].indexOf("=") + 1) || "";
            }
        }
    }
};

tgo.Router.prototype.push = function (route) {
    var url = '';
    switch (typeof route) {
        case 'object':
            if (route.name) {
                for (var key in this.routes) {
                    if (this.routes[key].name === route.name) {
                        url = '/' + this.parentFile + this.routes[key].path;
                        var query = (function (href) {
                            var query = {};
                            if (href.split('?')[1]) {
                                var params = href.split('?')[1];
                                var arr = params.split('&');
                                for (var i = 0; i < arr.length; i++) {
                                    var objArr = arr[i].split('=');
                                    if (objArr[0]) {
                                        query[objArr[0]] = objArr[1] || "";
                                    }
                                }
                            }
                            return query;
                        })(url);
                        for (var param in query) {
                            !route.query[param] && (route.query[param] = query[param]);
                        }
                        if (typeof route.query === "object") {
                            url += '?';
                            var i = 0;
                            for (var k in route.query) {
                                if (route.query[k] != undefined) {
                                    if (i != 0) {
                                        url += '&' + k + '=' + route.query[k];
                                    } else {
                                        url += k + '=' + route.query[k];
                                    }
                                    i++;
                                }
                            }
                        }
                    }
                }
            } else if (route.path) {
                if (route.path.indexOf('/') == 0) { //绝对路径处理
                    url = '/' + this.parentFile + route.path;
                } else { //相对路径
                    url = route.path;
                }
                var query = (function (href) {
                    var query = {};
                    if (href.split('?')[1]) {
                        var params = href.split('?')[1];
                        var arr = params.split('&');
                        for (var i = 0; i < arr.length; i++) {
                            var objArr = arr[i].split('=');
                            if (objArr[0]) {
                                query[objArr[0]] = objArr[1] || "";
                            }
                        }
                    }
                    return query;
                })(url);
                for (var param in query) {
                    !route.query[param] && (route.query[param] = query[param]);
                }
                if (typeof route.query === "object") {
                    url = url.split('?')[0];
                    if (url.indexOf('?') == -1) {
                        url += '?';
                    } else {
                        url += '&';
                    }
                    var i = 0;
                    for (var k in route.query) {
                        if (route.query[k] != undefined) {
                            if (i != 0) {
                                url += '&' + k + '=' + route.query[k];
                            } else {
                                url += k + '=' + route.query[k];
                            }
                            i++;
                        }
                    }
                }
            }
            break;
        case 'string':
            if (route.indexOf('/') == 0) { //绝对路径处理
                url = '/' + this.parentFile + route;
            } else { //相对路径
                url = route;
            }
            break;
    }
    if (url) {
        window.location.href = url;
    } else {
        throw new Error('请指定path或者name');
    }
};

tgo.Router.prototype.replace = function (route) {
    var url = '';
    switch (typeof route) {
        case 'object':
            if (route.name) {
                for (var key in this.routes) {
                    if (this.routes[key].name === route.name) {
                        url = '/' + this.parentFile + this.routes[key].path;
                        var query = (function (href) {
                            var query = {};
                            if (href.split('?')[1]) {
                                var params = href.split('?')[1];
                                var arr = params.split('&');
                                for (var i = 0; i < arr.length; i++) {
                                    var objArr = arr[i].split('=');
                                    if (objArr[0]) {
                                        query[objArr[0]] = objArr[1] || "";
                                    }
                                }
                            }
                            return query;
                        })(url);
                        for (var param in query) {
                            !route.query[param] && (route.query[param] = query[param]);
                        }
                        if (typeof route.query === "object") {
                            url += '?';
                            var i = 0;
                            for (var k in route.query) {
                                if (i != 0) {
                                    url += '&' + k + '=' + route.query[k];
                                } else {
                                    url += k + '=' + route.query[k];
                                }
                                i++;
                            }
                        }
                    }
                }
            } else if (route.path) {
                if (route.path.indexOf('/') == 0) { //绝对路径处理
                    url = '/' + this.parentFile + route.path;
                } else { //相对路径
                    url = route.path;
                }
                var query = (function (href) {
                    var query = {};
                    if (href.split('?')[1]) {
                        var params = href.split('?')[1];
                        var arr = params.split('&');
                        for (var i = 0; i < arr.length; i++) {
                            var objArr = arr[i].split('=');
                            if (objArr[0]) {
                                query[objArr[0]] = objArr[1] || "";
                            }
                        }
                    }
                    return query;
                })(url);
                for (var param in query) {
                    !route.query[param] && (route.query[param] = query[param]);
                }
                if (typeof route.query === "object") {
                    url = url.split('?')[0];
                    if (url.indexOf('?') == -1) {
                        url += '?';
                    } else {
                        url += '&';
                    }
                    var i = 0;
                    for (var k in route.query) {
                        if (i != 0) {
                            url += '&' + k + '=' + route.query[k];
                        } else {
                            url += k + '=' + route.query[k];
                        }
                        i++;
                    }
                }
            }
            break;
        case 'string':
            if (route.indexOf('/') == 0) { //绝对路径处理
                url = '/' + this.parentFile + route;
            } else { //相对路径
                url = route;
            }
            break;
    }
    if (url) {
        window.location.replace(url);
    } else {
        throw new Error('请指定path或者name');
    }
};

var router = new TGO.Router();
// var $ = tgo.querySelector;
