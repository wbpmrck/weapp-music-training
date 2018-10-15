

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;


/**
 * 添加 曲谱记录
 * @param {*} event :{}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  let {userInfo,name,pictureIds} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();

  try{
    let created = await db.collection('staff').add({
      data: {
        _openid:userInfo.openId,
        _createTime: new Date(),
        _updateTime: new Date(),
        name,
        enable:1,
        pictures:pictureIds,
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
