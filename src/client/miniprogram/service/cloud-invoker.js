/*
    用于对腾讯云开发的接口层进行封装
    1、增加serviceName到event参数里，用于后台云函数进行路由
*/


let invoke=function(serviceName,data){
    data = data===undefined?{}:data;
    data._base={serviceName};
    return new Promise((resolve, reject) => {
       // 调用云函数
        wx.cloud.callFunction({
            name: 'router',
            data
        })
        .then(res => {
            console.log(`[云函数] [${serviceName}]invoke success,requestId=[${res.result.reqId}],code=[${res.result.code}],errMsg=[${res.errMsg}]`)
            resolve(res)
        })
        .catch((err)=>{
            console.error(`[云函数] [${serviceName}] 调用失败,`, err)
            reject(err)
        })
      })
}

module.exports={
    invoke
}