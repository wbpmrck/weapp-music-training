// miniprogram/pages/invite-landing/invite-landing.js
var {addTeacherStudent,userRegist} = require('../../service/user-service')
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime');
const { $Message,$Toast } = require('../../framework/wechat/ui/base/index');
const {redirectToPage,navigateToPage,switchToTab} = require('../../framework/wechat/router')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    routeParam:'',
    teacherId:'',
    teacherName:'',
    teacherAvatar:'',
  },

  //接受邀请
  accept:async function(e){

    try{
      $Toast({
        content: '正在处理...',
        type: 'loading'
      });
      //先检查当前用户是否已经注册过
      await app.refreshUserInfo();
      //如果用户不存在，则自动进行注册逻辑，以学生身份
      if(app.globalData.userInfo===undefined){
        let registed = await userRegist({role:'child',userDetail:e.detail.userInfo});

        app.globalData.userInfo = registed.result.data;
      }
      // 3.把自己和老师建立关系
      let added = await addTeacherStudent({studentOpenId:app.globalData.userInfo._openid,teacherOpenId:this.data.teacherId});

      console.log('added:');
      console.log(added);

      if(added.result.success){
        $Toast({
          content: '您已经成为'+this.data.teacherName+'老师的学生啦~',
          type: 'success',
          duration: 0
        });

        setTimeout(function(){
          $Toast.hide();
          redirectToPage("index")
        },4000)
      }else{

        redirectToPage("index")
      }
    }catch(e){
      $Toast.hide();

      console.log(e);

      $Toast({
        content: '出错拉:'+e.toString(),
        type: 'error',
        duration: 3
      });
    }

  },
  cancel:function(){
    redirectToPage("index")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('landing onLoad');
    console.log(options);
    console.log(app.globalData.query.tId);
    console.log(decodeURIComponent(app.globalData.query.tName));

    this.setData({
      teacherId:options.tId,
      teacherAvatar:decodeURIComponent(options.avatar),
      teacherName:decodeURIComponent(options.tName),
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

  onShow:function(options){
    console.log('landing onshow');
    console.log(options);
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