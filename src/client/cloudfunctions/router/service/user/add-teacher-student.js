

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const ROLE = require('../../model/role');


/**
 * 添加学生和老师的关系
 * 
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  let {userInfo,studentOpenId,teacherOpenId} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();

  let dataToCreate ={
    student_open_id: studentOpenId,
    teacher_open_id: teacherOpenId,
    _createTime: new Date(),
    _updateTime: new Date()
  };
  
  try{


    //先查看当前是否已经存在这个师生关系
    let relation =await db.collection('user_relation').where({
      student_open_id: studentOpenId,
      teacher_open_id: teacherOpenId
    }).get();

    console.log(`relation =`);
    console.log(relation);

    if(relation && relation.total>0){
      return resp.success({ reqId:request_id,data: undefined})
    }else{

    }

    let added = await db.collection('user_relation').add({
      data:dataToCreate
    });

    if(added._id){
      return resp.success({ reqId:request_id,data: added})
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
  // return new Promise((resolve,reject)=>{
  //   db.collection('users').add({
  //       data: {
  //         role: role,
  //         createTime: new Date(),
  //         updateTime: new Date()
  //       }
  //     })
  //   .then((res)=>{
  //     console.log(`regist:`+JSON.stringify(res))
  //     resolve(resp.success({ reqId:request_id,data: res}))
  //   })
  //   .catch((e)=>{
  //     reject(resp.failed({
  //       code: resp.codes.SERVER_ERROR,
  //       desc: e.toString()
  //     }))
  //   });
  //   return 
  // })

}
