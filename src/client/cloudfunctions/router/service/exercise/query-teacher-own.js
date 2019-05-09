

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const {removeDump} = require("../../framework/onelib/OneLib.Utils.Array");
const {pageCondition,buildPageSQL} = require("../../framework/dao/queryHelper");
const recordStatus = require('../../model/record-status');


/**
 * 获取老师可以看到的学生的回课记录[本接口直接查询record里的teacher_allow]
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


    let whereClause= {
      teacher_allow:{},
      enable:1
    };
    whereClause.teacher_allow[userInfo.openId]=1;
    console.log(`whereClause =`)
    console.log(whereClause)

    //构造查询语句
    let queryExecution = db.collection('exercise_record').where(whereClause).orderBy('_createTime', 'desc');

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

      //根据openId去查询用户详细信息返回
      let userIds = removeDump(res.data.map((record)=>{
        return record._openid
      }));

      console.log(`userIds=`);
      console.log(userIds);

      //到用户表查询用户
      let usersInfo = await db.collection('users').where({
        _openid: _.in(userIds),
      }).get();

      //将查询出的用户信息，写入到主信息
      if(usersInfo && usersInfo.data){
        console.log('将查询出的用户信息，写入到主信息')
        res.data.forEach(element => {
          element.userInfo = usersInfo.data.filter((it)=>{return it._openid == element._openid})[0]
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
