/*
    处理时间相关的util
*/

const ms = 1;
const s = ms * 1000;
const min = s * 60;
const hour = min * 60;
var formatDate =function (date,fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    //将毫秒补位成3位
    var less = 3 - ("" + o["f+"]).length;
    while (less > 0) {
        o["f+"] = "0" + o["f+"];
        less--;
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports={
    formatDate:formatDate
}