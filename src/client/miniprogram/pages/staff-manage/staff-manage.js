
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const {formatTime, showBusy, showSuccess, showModel} = require('../../framework/wechat/util')
const {redirectToPage,navigateToPage,navigateBack} = require('../../framework/wechat/router')
const { $Message } = require('../../framework/wechat/ui/base/index');
var {queryStaff} = require('../../service/staff-service')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submiting:false,
    staffs:[
      // {
      //   _id:"123",name:"B小调"
      // },
      // {
      //   _id:"1234",name:"B小调2"
      // },
      // {
      //   _id:"1235",name:"B小调3"
      // },
      // {
      //   _id:"1236",name:"B小调4"
      // },
      // {
      //   _id:"1237",name:"B小调5"
      // },
    ]
  },

  choose:function({currentTarget:{dataset:{staffId}}}){
    console.log(staffId);

    let staff = this.data.staffs.filter(function(s){
      return s._id == staffId
    })[0];

    app.globalData.staffLastChoosed={
      id:staff._id,
      name:staff.name,
      pictureIds:staff.pictures
    }
    navigateBack();
  },

  /**
   * 发送请求到服务器，查询用户的曲谱列表
   */
  pageQueryStaff:async function(){

    let self =  this;
    self.setData({submiting:true});
    try{

      let data = await queryStaff();
      console.log('data=')
      console.log(data)
      self.setData({
        staffs:data.result.data
      })

      self.setData({submiting:false});
    }catch(e){

      self.setData({submiting:false});
      $Message({
        content: '出错:'+JSON.stringify(e),
        duration: 5,
        type: 'error'
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('staff-manage onload')
  },

  /**
   * 点击创建曲谱按钮
   */
  createStaff:function(){
    navigateToPage("staff-create");
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
    console.log('曲谱管理 onshow')
    //加载用户名下的曲谱信息
    this.pageQueryStaff();
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