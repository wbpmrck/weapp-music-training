
const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const role = require('../../model/role');


/**
 * 获取用户信息
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main = (event, context) => {

  let {userInfo} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();

  return new Promise((resolve,reject)=>{

    console.log(`get-me:get user ${userInfo.openId}`)

    db.collection('users').where({
      _openid:userInfo.openId
    }).get()
    .then((res)=>{
      console.log(`get-me:`+JSON.stringify(res))
      resolve(resp.success({ reqId:request_id,data: res.data[0]}))
    })
    .catch((e)=>{
      reject(resp.failed({
        code: resp.codes.SERVER_ERROR,
        desc: e.toString()
      }))
    });
    return 
  })

}
