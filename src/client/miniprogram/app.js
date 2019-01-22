//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },

  globalData:{
    userInfo:undefined, // 登录用户信息
    exerciseToTeacherOpenId:undefined, // 提交回课记录的时候，选择的当前能够看到此练习记录的老师的id
    staffLastChoosed:undefined , //保存用户上一次选择的曲谱信息
  }
})
