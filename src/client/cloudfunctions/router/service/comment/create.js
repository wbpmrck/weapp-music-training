

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const recordStatus = require('../../model/record-status');

const {queryUser} = require('../../dao/user');


/**
 * 添加 练习评论 
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  let {userInfo,exerciseId,commentId,content} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();
  const _ = db.command;

  try{
    let created = await db.collection('exercise_comment').add({
      data: {
        _openid:userInfo.openId,
        _createTime: new Date(),
        _updateTime: new Date(),
        exerciseId:exerciseId,
        commentId:commentId,
        contentString:content,
        enable:1,
        upVote:0,
        downVote:0,
      }
    });
    console.log('created._id  ='+created._id);

    if(created._id){

      let updateCommand = {
        _updateTime: new Date(),
        // 表示将 done 字段置为 true
        commentsCount: _.inc(1)
      };
      //如果评论者是老师，则老师评论数量要+1
      let userDetail =await queryUser(userInfo.openId,context);
      console.log('userDetail 22 =');
      console.log(userDetail);

      if(userDetail.data && userDetail.data.length>0){
        if(userDetail.data[0].role==='teacher'){
          updateCommand.teacherCommentsCount=_.inc(1);
        }
      }


      //更新评论所指向的回课记录的评论数量
      let updated = await db.collection('exercise_record').doc(exerciseId).update({
        // data 传入需要局部更新的数据
        data: updateCommand
      })

      console.log('updated=');
      console.log(updated);
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
