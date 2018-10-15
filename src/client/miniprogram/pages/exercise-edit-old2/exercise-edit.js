const {formatTime, showBusy, showSuccess, showModel} = require('../../framework/wechat/util')
const {redirectToPage,navigateToPage} = require('../../framework/wechat/router')
var {queryRecord} = require('../../service/exercise-service')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    id:"W7B-QwUup4nwKT4H",
    selfDesc:"",
    staff:{
      id:undefined,
      name:"点击选择",
      pictureIds:["",""]
    },
    videos:[
      {
        fileId:"cloud://huike-dev-4090b9.6875-huike-dev-4090b9/video/huike/oTSgl0fcrEy4Kg1UBeNWB3478gEk/2018-09-30/1538293312334.mp4",
        thumbFileId:"cloud://huike-dev-4090b9.6875-huike-dev-4090b9/video/huike/oTSgl0fcrEy4Kg1UBeNWB3478gEk/2018-09-30/1538293312334.jpg"
      }
    ]
  },

  /**
   * 选择曲谱
   */
  chooseStaff:function(){
    navigateToPage("staff-manage")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var self = this;
    var recordId = options.recordId;
    queryRecord({id:recordId})
    .then((res)=>{
        console.log('queryRecord 结果：'+JSON.stringify(res));
        var v = res.result.data[0];
        self.setData({
          id:v._id,
          videos:v.videos,
          staff:app.globalData.staffLastChoosed||{
            id:undefined,
            name:"点击选择",
            pictureIds:["",""]
          }, // 这里是查询出的曲谱信息
          selfDesc:v.selfDesc
        });
    })
    .catch((err)=>{
        console.error(err);
            util.showModel('createRecord 失败', err)
        }
    )

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

    const self = this;
    console.log('用户选择的曲谱:'+JSON.stringify(app.globalData.staffLastChoosed));

    self.setData({
      staff:app.globalData.staffLastChoosed||{
        id:undefined,
        name:"点击选择",
        pictureIds:["",""]
      }, // 这里是查询出的曲谱信息
    });
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