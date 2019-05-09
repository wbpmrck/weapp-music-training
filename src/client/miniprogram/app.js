
var {getUserInfo} = require('./service/user-service')
const regeneratorRuntime = require('./lib/regenerator-runtime/runtime');
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      console.log('wx.cloud.init');
      wx.cloud.init({
        traceUser: true,
      })
    }
  },

  onShow:function(options){
    console.log('app onshow');
    console.log(options);
    this.globalData.query = options?options.query:undefined;
  },

  refreshUserInfo:async function(){
    let res = await getUserInfo();

    console.log('getUserInfo 结果：'+JSON.stringify(res))
    this.globalData.userInfo = res.result.data;
  },
  globalData:{
    query:undefined, //app打开的时候传入的query
    userInfo:undefined, // 登录用户信息
    exerciseToTeacher:undefined, // 提交回课记录的时候，选择的当前能够看到此练习记录的老师
    staffLastChoosed:undefined , //保存用户上一次选择的曲谱信息
    
  }
})
