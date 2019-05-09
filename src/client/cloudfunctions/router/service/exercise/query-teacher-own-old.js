old

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const {removeDump} = require("../../framework/onelib/OneLib.Utils.Array");
const {pageCondition,buildPageSQL} = require("../../framework/dao/queryHelper");
const recordStatus = require('../../model/record-status');


/**
 * 获取老师可以看到的学生的回课记录[注意本接口会检查老师下面所有学生的回课记录，此逻辑已经废弃]
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  let {userInfo,condition} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();
  const _ = db.command;
  try{
    let {pager,...otherCondition} = condition;

    console.log(`pager =`+JSON.stringify(pager))
    console.log(`otherCondition =`+JSON.stringify(otherCondition))
    console.log(`userInfo =`)
    console.log(userInfo)

    // 先查询老师名下的学生列表

    //构造查询语句
    let teacherStudentsIds = await db.collection('user_relation').where({
      teacher_open_id: userInfo.openId,
    }).field({
      student_open_id: true,
    }).get();

    console.log('teacherStudentsIds=');
    console.log(teacherStudentsIds);

    teacherStudentsIds = teacherStudentsIds.data.map((item)=>{
      return item.student_open_id
    });



    //构造查询语句
    let queryExecution = db.collection('exercise_record').where({
      _openid: _.in(teacherStudentsIds),
      enable:1
    }).orderBy('_createTime', 'desc');

    // 如果有分页，添加分页要求
    if(pager && pager.pageSize > 0){
      let pageParam = buildPageSQL(pager);
      console.log(`pageParam =`+JSON.stringify(pageParam))
      queryExecution=queryExecution.skip(pageParam.offset).limit(pageParam.limit);
    }

    let res = await queryExecution.get();

    //todo:还需要根据staffId去staff表里查询曲谱信息一起返回
    if(res && res.data){

      console.log(`res.data=${JSON.stringify(res.data)}`)
      console.log(`res.data.length=${res.data.length}`)
      //拼接staffId查询
      let staffIds = removeDump(res.data.map((record)=>{
        return record.staffId
      }));

      console.log(`staffIds=${staffIds}`);

      //在曲谱表中查询指定id的曲谱信息
      let staffInfo = await db.collection('staff').where({
        _id: _.in(staffIds),
      }).get();


      //将查询出的曲谱信息，写入到主信息
      if(staffInfo && staffInfo.data){
        console.log('将查询出的曲谱信息，写入到主信息')
        res.data.forEach(element => {
          element.staff = staffInfo.data.filter((it)=>{return it._id == element.staffId})[0]
        });
      }

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
