// 云函数入口文件
const cloud = require('wx-server-sdk')

const resp = require('./framework/web/responseHelper');
const validate = require("./framework/onelib/OneLib.Validation").targetWrapper;
const {replaceAll} = require('./framework/util/string');
cloud.init()

/**
 * 
 * @param {*} event _base:{serviceName}  依赖业务框架定义
 * @param {*} context {request_id,memory_limit_in_mb,time_limit_in_ms} 依赖微信
 */
exports.main = async (event, context) => {

    let {userInfo,_base} = event;
    let {request_id} = context;

    //注入cloud操作sdk
    context.cloud = cloud;

    console.log(`request:[${request_id}] begin: serviceName=[${_base.serviceName}]`)

    try{

        let {serviceName} = _base;
        // serviceName=  replaceAll(serviceName,'\\','/');
        // 下面进行任务路由
        let serviceRouteParam = `./service/${serviceName}.js`
        let serviceObject = require(serviceRouteParam);
        return serviceObject.main(event, context)
    }catch(e){
        console.error(`request:[${request_id}] error:`,e);
        return resp.failed({
            code: resp.codes.SERVER_ERROR,
            desc: e.toString()
        });
    }
}