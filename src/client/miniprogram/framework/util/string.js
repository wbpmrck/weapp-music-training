
var replaceAll = function (str,FindText, RepText) {
    regExp = new RegExp(FindText, "g");
    return str.replace(regExp, RepText);
}

module.exports ={
    replaceAll
}