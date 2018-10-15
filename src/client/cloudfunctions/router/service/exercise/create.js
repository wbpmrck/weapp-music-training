

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const recordStatus = require('../../model/record-status');


/**
 * 添加 练习记录
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  let {userInfo,staffId,selfDesc,videos} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();

  try{
    let created = await db.collection('exercise_record').add({
      data: {
        _openid:userInfo.openId,
        _createTime: new Date(),
        _updateTime: new Date(),
        staffId:staffId,
        selfDesc:selfDesc,
        status:recordStatus.INIT,
        videos:videos,
        enable:1,
        commentsCount:0,
        teacherCommentsCount:0,
        upVote:0,
        downVote:0,
      }
    });

    if(created._id){

      return resp.success({ reqId:request_id,data: {_id:created._id}})
    }else{
      return resp.failed({
        code: resp.codes.CREATE_FAIL,
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
