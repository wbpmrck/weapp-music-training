
const {userRegist} = require('../../service/user-service')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:undefined,
    reachBottomCount:0, //一个记录页面到达底部次数的计数器，用于传入给子组件，让子组件可以监听到此事件
    pullDownCount:0, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      userInfo:app.globalData.userInfo
    })
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
    console.log('hui ke onPullDownRefresh')
    this.setData({
      pullDownCount:this.data.pullDownCount+1
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      reachBottomCount:this.data.reachBottomCount+1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})