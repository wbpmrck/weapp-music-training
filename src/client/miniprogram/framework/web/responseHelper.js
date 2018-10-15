'use strict'
/**
 * Created by kaicui on 16/11/15.
 * 用于对响应进行统一处理
 * 依赖:外部使用的web框架,是使用body存返回数据
 *
 * 格式:
 *
 {
    code:"0000", //0000代表成功
    desc:"成功",
    success:true,
    data:[Object] //返回数据对象

 }
 */
const util = require("util");

const returnCodeDiction= {

    /*
        下面是框架自带的系统管理相关返回码，请勿更改！！！
     */
    "SUCCESS":["0000", "成功%s"],
    "NOT_LOGIN":["0001", "用户未登录%s"],
    "SERVER_ERROR":["0002", "服务错误:%s"],
    "NOT_AUTH": ["0003", "用户没有权限%s"],
    "PARAM_ILLEGAL":["0004", "请求输入参数问题:%s"],
    "USERNAME_DUMP":["0101", "用户名已经存在了%s"],
    "NO_USER":["0102", "用户不存在%s"],
    "PASSWORD_WRONG":["0103", "用户密码错误%s"],
    "DATABASE_WRONG":["0104","访问数据库错误"],
    "DATABASE_NOSN":["0105","数据库没有该sn"],
    "DATABASE_RECOVERY":["0105","数据库回收操作出错"],
};

/**
 * 创建一个返回对象
 * @param codeAndDesc
 * @param descCustom
 * @param data
 * @returns {{code: *, desc, data: *}}
 * @private
 */
function _makeResponse(codeAndDesc,descCustom,data) {
    let descTemplate = codeAndDesc[1],
        code = codeAndDesc[0];
    let returnDesc = util.format(descTemplate,descCustom);

    return {
        "code":code,
        "desc":returnDesc,
        "data":data
    }
}
module.exports={
    codes:returnCodeDiction,

    /**
     *
     * 处理成功
     * 自动为 httpContext 生成 json 返回
     * 或者直接返回响应对象
     * @param context
     * @param desc
     * @param data
     */
    success:function ({desc="",data=undefined},context) {
        if(context){
            context.body = _makeResponse(returnCodeDiction.SUCCESS,desc,data);
            context.body.success=true;
        }else{
            var dto = _makeResponse(returnCodeDiction.SUCCESS,desc,data);
            dto.success=true;
            return dto;
        }
    },
    /**
     * 处理失败
     * 自动为 httpContext 生成 json 返回
     * 或者直接返回响应对象
     * @param context
     * @param code
     * @param desc
     * @param data
     */
    failed:function ({code=returnCodeDiction.SERVER_ERROR,desc="",data=undefined},context) {
        if(context){
            context.body = _makeResponse(code,desc,data)
            context.body.success=false;
        }else{
            var dto = _makeResponse(code,desc,data)
            dto.success=false;
            return dto;
        }
    }
}
