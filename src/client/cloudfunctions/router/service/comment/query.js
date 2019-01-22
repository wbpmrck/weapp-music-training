

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const {removeDump} = require("../../framework/onelib/OneLib.Utils.Array");
const {pageCondition,buildPageSQL} = require("../../framework/dao/queryHelper");
const recordStatus = require('../../model/record-status');


/**
 * 获取练习记录下面的评论列表
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
    let queryExecution = db.collection('exercise_comment').where({
      ...otherCondition,
      enable:1
    }).orderBy('_createTime', 'desc');

    // 如果有分页，添加分页要求
    if(pager && pager.pageSize > 0){
      let pageParam = buildPageSQL(pager);
      console.log(`pageParam =`+JSON.stringify(pageParam))
      queryExecution=queryExecution.skip(pageParam.offset).limit(pageParam.limit);
    }

    let res = await queryExecution.get();

    //todo:还需要根据 _openid 去 users 表里查询 曲谱 信息一起返回
    if(res && res.data){

      console.log(`res.data=${JSON.stringify(res.data)}`)
      console.log(`res.data.length=${res.data.length}`)
      //拼接 openId 查询
      let openIds = removeDump(res.data.map((record)=>{
        return record._openid
      }));

      console.log(`openIds=${openIds}`);

      //查询评论关联的用户信息
      let usersInfos = await db.collection('users').where({
        _openid: _.in(openIds),
      }).get();


      //将查询出的信息，写入到主信息
      if(usersInfos && usersInfos.data){
        console.log('将查询出的信息，写入到主信息:'+ JSON.stringify(usersInfos))
        res.data.forEach(element => {
          element.userInfo = usersInfos.data
          .filter((it)=>{return it._openid == element._openid})
          .map((it)=>{return {
            role:it.role,
            sex:it.sex,
            nickName:it.nickName,
            avatar:it.avatar,
          }})
          [0]
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
