// miniprogram/pages/teacher-invite/teacher-invite.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    wx.showShareMenu({
      withShareTicket: true
    })
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
  onShareAppMessage(res) {
    console.log('onShareAppMessage res=')
    console.log(res)
    return {
      title: app.globalData.userInfo.teacher_detail.realName+'老师邀请你加入《天天回课》',
      path: '/pages/invite-landing/invite-landing?tId='+app.globalData.userInfo._openid+'&tName='+encodeURIComponent(app.globalData.userInfo.teacher_detail.realName)+'&avatar='+encodeURIComponent(app.globalData.userInfo.avatar),
      imageUrl:'/res/img/logo-1.png'
    }
  }
})