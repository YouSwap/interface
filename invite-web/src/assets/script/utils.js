// import $ from 'jquery'

export function GetRequest() {
    let url = location.href; //获取url中"?"符后的字串
    let theRequest = {};
    console.log(url)
    if (url.indexOf('?') !== -1) {
        let ind = url.indexOf('?');
        let str = url.substr(ind + 1);
        let strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
    }
    return theRequest;
}
/* eslint-disable */
export function getUrlKey(name) {
    return (
        decodeURIComponent(
            (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
    );
}
/* eslint-enable */
export function isEmpty(obj) {
    for (var i in obj) { //如果不为空，则会执行到这一步，返回false
        return false;
    }
    return true;
}

// 格式化时间戳
// 其中timestamp 参数表示 时间戳 （ms）
// fmt 表示 要转换成的时间格式 比如："yyyy-MM-dd hh:mm"，"yyyy/MM/dd hh/mm"
// 调用示例： formatDate(timestamp, "yyyy-MM-dd hh:mm");
export function formatDate(timestamp, fmt) {
    let date = new Date(timestamp);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}
export function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    } //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    } //判断是否IE浏览器
}

export function shortenAddress(address, chars = 4) {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

export function isPC() {
  var userAgentInfo = navigator.userAgent.toLowerCase();
  var Agents = new Array("android", "iphone", "symbianOS", "windows phone", "ipad", "ipod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}