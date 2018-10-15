const {redirectToPage,navigateToPage,navigateBack} = require('../../framework/wechat/router');
const {formatDate} = require('../../framework/util/time');
const {getStaffImagePath} = require('../../business/file-store-rule');
var {queryRecord,deleteRecord} = require('../../service/exercise-service');
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime');
const { $Message,$Toast } = require('../../framework/wechat/ui/base/index');
const { pageCondition } = require('../../framework/dao/queryHelper');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    submiting:false,
    currentPlayId:"",
    exerciseList:[
      // {
      //   _createTime:'',
      //   _updateTime:'',
      //   downVote:0,
      //   upVote:0,
      //   enable:1,
      //   commentsCount:135,
      //   teacherCommentsCount:4,
      //   selfDesc:'',
      //   status:0,
      //   staff:{
      //     _id:123,
      //     name:"贝多芬",
      //     pictures:[
      //       'cloud://huike-dev-4090b9.6875-huike-dev-4090b9/image/staff/oTSgl0fcrEy4Kg1UBeNWB3478gEk/2018-10-11/1539221186422.jpg'
      //     ]
      //   }
      // }
    ]
  },

  _state:{
    //分页查询条件
    pager:{
      ...pageCondition //使用扩展运算符复制查询条件。直接引用对象会导致页面之间互相影响
    },
    hasNext:true,
    lastVideo:undefined
  },

  videoScreenChange:function({detail:{fullScreen, direction}}){
    console.log('videoScreenChange,fullScreen='+fullScreen)
      //如果从全屏模式退回，则停止当前视频
      if(!fullScreen){
        this._state.lastVideo.stop();
      }
  },
  /**
   * 播放当前曲谱的视频
   */
  playVideo: function(event){
    console.log('playVideo')
    console.log(event);

    let self = this;
    if(self._state.lastVideo){
      self._state.lastVideo.stop();
    }
    let videoContext = wx.createVideoContext(event.currentTarget.dataset.videoId);
    videoContext.requestFullScreen({
      direction:0
    });
    videoContext.play();
    self._state.lastVideo = videoContext;
    self.setData({
      currentPlayId:event.currentTarget.dataset.videoId
    })
  },


  queryExercise:async function(){

    let self =  this;

    if(!self._state.hasNext){
      console.log('已经没有下一页了');
      return;
    }

    self.setData({submiting:true});
    try{

      let data = await queryRecord({pager:self._state.pager});
      console.log('data=')
      console.log(data)

      self._state.pager.pageIndex++;

      self._state.hasNext = false;
      data.result.data.forEach((record)=>{
        self._state.hasNext = true; //trick的写法，如果返回有数据，则默认还有下一页
        // record._updateTimeText = formatDate( new Date(record._updateTime),"yyyy-MM-dd hh:mm:ss" )
        record._updateTimeText = formatDate( new Date(record._updateTime),"yyyy-MM-dd" )
      })
      console.log('data 2=')
      console.log(data)

      self.setData({
        submiting:false,
        exerciseList: self.data.exerciseList.concat(data.result.data)
      })
    }catch(e){

      self.setData({submiting:false});
      $Message({
        content: '出错:'+JSON.stringify(e),
        duration: 5,
        type: 'error'
      });
    }
  },
  viewComments:function(event){
    console.log("viewComments")
    console.log(event)
  },

  /**
   * 把指定id的列表项从列表中移除
   * @param {string} id 
   */
  removeItem:function(id){
    let data = this.data.exerciseList;
    for(var i = data.length-1;i>=0;i--){
      if(data[i]._id === id){
        data.splice(i,1);
      }
    }
    this.setData({
      exerciseList:data
    })
  },
  deleteRecord:async function(event){
    console.log("deleteRecord")
    console.log(event)

    let data  = await deleteRecord({id:event.currentTarget.dataset.recordId});
    console.log(data);
    if(data && data.result.code ==='0000'){
      this.removeItem(event.currentTarget.dataset.recordId);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryExercise();
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
    setTimeout(function(){
      $Message({
        content: '向左滑动可以查看评论',
        duration: 1.5
      });
    },1000)
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

  onPageScroll: function (event) {
    // console.log('historu onPageScroll')
    // console.log(event);

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
    console.log('history reach bottom')
    this.queryExercise();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})