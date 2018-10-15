

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const recordStatus = require('../../model/record-status');


/**
 * 删除 练习记录
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  let {userInfo,id} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();

  try{
    let updated = await db.collection('exercise_record').doc(id).update({
      data: {
        _updateTime: new Date(),
        enable:0,
      }
    });

    console.log(updated)
    if(updated && updated.stats && updated.stats.updated>0){
      return resp.success({ reqId:request_id,data: updated})
    }else{
      return resp.failed({
        code: resp.codes.UPDATE_FAIL,
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
