

const getQueryStrFromObj = function (paras) {
    var paraString = "";
    if (paras) {
        for (var i in paras) {
            if(paras.hasOwnProperty(i)){
                var val = paras[i];
                if(typeof val !=='function'){
                    paraString += i + "=" + encodeURIComponent(paras[i]) + "&";
                }
            }
        }
        if (paraString.length > 0) {
            paraString = "?" + paraString.substr(0, paraString.length - 1); //去掉最后一个&
        }
    }
    return paraString;
};


const redirectToPage = function(name,params){
    let url =`/pages/${name}/${name}`;
    if(params!==undefined){
        url = url + getQueryStrFromObj(params);
    } 
    wx.redirectTo({
        url:url
    })
}

const reLaunchToPage = function(name,params){
    let url =`/pages/${name}/${name}`;
    if(params!==undefined){
        url = url + getQueryStrFromObj(params);
    } 
    wx.reLaunch({
        url:url
    })
}

const navigateToPage = function(name,params){
    let url =`/pages/${name}/${name}`;
    if(params!==undefined){
        url = url + getQueryStrFromObj(params);
    } 
    wx.navigateTo({
        url:url
    })
}

const switchToTab = function(name){
    let url =`/pages/${name}/${name}`;
    wx.switchTab({
        url:url
    })
}
const navigateBack = function(params){
   
    wx.navigateBack(params)
}

module.exports = {redirectToPage,navigateToPage,navigateBack,switchToTab,reLaunchToPage}