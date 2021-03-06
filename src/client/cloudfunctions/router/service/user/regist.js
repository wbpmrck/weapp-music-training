

const resp = require('../../framework/web/responseHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const ROLE = require('../../model/role');


/**
 * 获取用户信息
 * @param {*} event :{role}
 * @param {*} context 
 */
exports.main =async (event, context) => {

  // userDetail:{nickName,city,avatarUrl,country,gender}
  let {userInfo,role,userDetail} = event;
  let {cloud,request_id} = context;
  const db = cloud.database();

  let dataToCreate ={
    _openid:userInfo.openId,
    role: role,
    avatar: userDetail.avatarUrl,
    nickName: userDetail.nickName,
    city: userDetail.city,
    country: userDetail.country,
    gender: userDetail.gender,
    language: userDetail.language,
    province: userDetail.province,
    _createTime: new Date(),
    _updateTime: new Date()
  };
  if(role===ROLE.TEACHER){
    dataToCreate.teacher_detail={
      introduce:'',
      level:0,
      realName:'',
      rewardIntroduce:[],
      imageIntroduce:[],
      videoIntroduce:[],
      certification:[],
      verifyStatus:1, //TODO:这里默认已经通过审核。以后可以考虑老师采用注册审核制
    }
  }
  try{
    let registed = await db.collection('users').add({
      data:dataToCreate
    });

    if(registed._id){
      let data = await db.collection('users').doc(registed._id).get();

      console.log(`resited data:`+JSON.stringify(data.data));

      return resp.success({ reqId:request_id,data: data.data})
    }else{
      return resp.failed({
        code: resp.codes.REGIST_FAIL,
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
