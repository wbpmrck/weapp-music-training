
const resp = require('../framework/web/responseHelper');
const validate = require("../framework/onelib/OneLib.Validation").targetWrapper;

exports.queryUser = async (openId,context)=>{
    let {cloud,request_id} = context;
    const db = cloud.database();
    const _ = db.command;
    let u= await db.collection('users').where({
    _openid: openId,
    }).get();

    return u;
};