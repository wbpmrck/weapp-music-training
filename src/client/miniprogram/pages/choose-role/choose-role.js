// miniprogram/pages/choose-role.js

var util = require('../../framework/wechat/util')
var {userRegist} = require('../../service/user-service')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:"none"
  },

  check:function(event){
    let side = event.currentTarget.dataset.role;
    this.setData({
      checked:side
    })
  },

  onGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

    this.chooseRole(e.detail.userInfo);
  },
  /**
   * 用户选择了角色
   */
  chooseRole:function(userInfo){

    // if(this.data.checked!=='child'){

    //   util.showModel('温馨提示','当前版本只能选择学生')
    // }else{
      userRegist({role:this.data.checked,userDetail:userInfo})
      .then((res)=>{
        console.log('userRegist 结果：'+JSON.stringify(res));
  
        app.globalData.userInfo = res.result.data;
        //将用户选择的角色信息，注册到数据库，并根据其角色，选择跳转到学生首页还是老师首页
        wx.switchTab({
          url: '/pages/hui-ke/hui-ke'
        })
  
      })
      .catch((err)=>{
        console.error(err);
          util.showModel('登录失败', err)
      })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})