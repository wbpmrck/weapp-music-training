

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const {removeDump} = require("../../framework/onelib/OneLib.Utils.Array");
const {pageCondition,buildPageSQL} = require("../../framework/dao/queryHelper");
const recordStatus = require('../../model/record-status');


/**
 * 获取练习记录[注意本接口只能查询用户自己的]
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
    let queryExecution = db.collection('exercise_record').where({
      ...otherCondition,
      _openid: userInfo.openId,
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
