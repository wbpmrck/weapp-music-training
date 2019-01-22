

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const {removeDump} = require("../../framework/onelib/OneLib.Utils.Array");
const {pageCondition,buildPageSQL} = require("../../framework/dao/queryHelper");
const recordStatus = require('../../model/record-status');


/**
 * 获取我的老师列表
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

    //构造查询语句
    let queryExecution = db.collection('user_relation').where({
      student_open_id:userInfo.openId
    }).orderBy('_createTime', 'desc');

    // 如果有分页，添加分页要求
    if(pager && pager.pageSize > 0){
      let pageParam = buildPageSQL(pager);
      console.log(`pageParam =`+JSON.stringify(pageParam))
      queryExecution=queryExecution.skip(pageParam.offset).limit(pageParam.limit);
    }

    let res = await queryExecution.get();

    //根据 _openid 去 users 表里查询 老师 的详细信息一起返回
    if(res && res.data){

      console.log(`res.data=${JSON.stringify(res.data)}`)
      console.log(`res.data.length=${res.data.length}`)
      //拼接 openId 查询
      let openIds = removeDump(res.data.map((record)=>{
        return record.teacher_open_id
      }));

      console.log(`openIds=${openIds}`);

      let usersInfos = await db.collection('users').where({
        _openid: _.in(openIds),
      }).get();



      return resp.success({ reqId:request_id,data: usersInfos.data})
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
