

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const role = require('../../model/role');


/**
 * 修改老师的详细信息
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  // userDetail:{nickName,city,avatarUrl,country,gender}
  let {userInfo,realName,introduce,rewardIntroduce} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();
  const _ = db.command;

  try{
      let updated= await db.collection('users').where({
        _openid: userInfo.openId
      })
        .update({
          data: {
            teacher_detail: {
              realName,
              introduce,
              rewardIntroduce,
            }     
          },
        })

      console.log(`updated data:`);
      console.log(updated);

      return resp.success({ reqId:request_id,data: updated})
    
  }catch(e){
    return resp.failed({
      code: resp.codes.SERVER_ERROR,
      desc: e.toString()
    });
  }
}
