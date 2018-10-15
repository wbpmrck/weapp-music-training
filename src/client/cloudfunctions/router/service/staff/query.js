

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;


/**
 * 获取用户的曲谱记录
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  let {userInfo,id} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();

  try{
    let res = await db.collection('staff').where({
      _openid: userInfo.openId,
      enable:1,
    }).get();

    //todo:还需要根据staffId去staff表里查询曲谱信息一起返回
    if(res){
      return resp.success({ reqId:request_id,data: res.data})
    }else{
      return resp.failed({
        code: resp.codes.SERVER_ERROR,
        desc: e.toString()
      });
    }
  }catch(e){
    return resp.failed({
      code: resp.codes.SERVER_ERROR,
      desc: e.toString()
    });
  }

}
