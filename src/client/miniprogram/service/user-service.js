
const {invoke} = require('./cloud-invoker');
const db = wx.cloud.database();
module.exports = {
    /**
     * 注册接口：
     * 注册一个新用户，角色是传入的角色
     */
    userRegist:function({role,userDetail}){

        // 方法1：访问后台
        return invoke('user/regist',{role,userDetail})

        // // 方法2：直接操作数据库
        // var res = db.collection('users').add({
        //     // data 字段表示需新增的 JSON 数据
        //     data: {
        //       role: role,
        //       createTIme: new Date(),
        //       updateTIme: new Date()
        //     }
        //   });

        //   return res;
          
    },

    getUserInfo:function(){
        return invoke('user/get-me')
    },

    getMyTeachers:function(pager){
        return invoke('user/get-my-teachers',{condition:{pager} })
    }
};