// miniprogram/pages/teacher-detail/teacher-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submiting:false,
    teacher:{}  //老师详细信息（从前一个页面传入）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let teacher =JSON.parse(decodeURIComponent(options.teacher));
    console.log('teacher detail received:'+teacher);

    //保存要展示的老师信息
    this.setData({
      teacher:teacher
    });
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