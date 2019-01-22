const {redirectToPage,navigateToPage,navigateBack} = require('../../framework/wechat/router');
const {formatDate} = require('../../framework/util/time');
const {getStaffImagePath} = require('../../business/file-store-rule');
var {queryComments,createComment} = require('../../service/comment-service');
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

    exerciseId:'',//本页评论针对的回课记录id
    submiting:false, //是否在查询评论
    noMoreComment:false,//是否已经没有评论数据了
    submitingComment:false, //是否在提交评论
    commentToSend:'',
    commentToResponse:null, //当前评论针对的评论 (点击某一个评论可以进入回复状态)
    comments:[
      // {
      //   _id:'',
      //   _openId:'',
      //   _createTime:'',
      //   _updateTime:'',
      //   exerciseId:'',
      //   commentId:'',
      //   contentString:'',
      //   accessorys:[],
      //   enable:1,
      //   userInfo:{
      //     role:'child',
      //     sex:3,
      //     nickName:'stone凯',
      //     avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKyEJx6dG2dMqxmE6ibmR1emdSq0qavKmgC1hNxScpgqjlIG8CBMMugokwsib5hbm6ptVEMHicHaQjQQ/132',
      //   }
      // }
    ]
  },

  _state:{
    //分页查询条件
    pager:{
      pageSize:10,
      needTotal:1,
      pageIndex:1,
    },
    hasNext:true,
  },

  clearDataAndPager:function(){
    
    this._state={
      //分页查询条件
      pager:{
        pageSize:10,
        needTotal:1,
        pageIndex:1,
      },
      hasNext:true,
    };

    this.setData({
      submiting:false, //是否在查询评论
      noMoreComment:false,//是否已经没有评论数据了
      comments:[]
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`view comments loaded:${JSON.stringify(options)}`)
    this.setData({
      exerciseId:options.exerciseId
    });
    this.queryComments(options.exerciseId);
  },

  commentChange:function(event){
    console.log(event);

    let data ={
      commentToSend:event.detail.value,
    };
    if(event.detail.value.length<1){
      data.commentToResponse = null ; //如果文本改为空，则认为取消对某人的回复
    }
    this.setData(data);
  },

  /**
   * 针对某个评论进行回复
   * @param {Object} event 事件对象
   */
  responseToComment:function(event){
    let index = event.currentTarget.dataset.commentIndex;
    let commentToResp = this.data.comments[index];

    this.setData({
      commentToResponse:commentToResp
    })
  },

  submitComment:async function(){
    var self = this;

    if(self.data.submitingComment){
      console.log('评论提交中，无法重复提交')
      return;
    }

    $Toast({
      content: '评论提交中',
      type: 'loading',
      duration: 0
    });
    self.setData({submitingComment:true});
    try{
        //处理有回复的情况
        let _commentToSend=self.data.commentToSend;
        if(self.data.commentToResponse){
          _commentToSend='@'+self.data.commentToResponse.userInfo.nickName+":"+_commentToSend;
        }
        let data = await createComment({exerciseId:self.data.exerciseId,content:_commentToSend,commentId:self.data.commentToResponse?self.data.commentToResponse._id:''});
        
        $Toast.hide();
        console.log('data=')
        console.log(data)
        
        if(data.result.success){
          $Toast({
            content: '发表评论成功',
            type: 'success',
            duration: 1.5
          });

          self.queryComments(self.data.exerciseId,true);
        }else{
          $Message({
            content: '发表评论失败',
            duration: 2,
            type: 'error'
          });
        }

        self.setData({
          submitingComment:false,
          commentToSend:'', //清空内容
          commentToResponse:null//清空回复的评论id
        })
      }catch(e){

        $Toast.hide();
        self.setData({submitingComment:false});
        $Message({
          content: '出错:'+JSON.stringify(e),
          duration: 3,
          type: 'error'
        });
      }
  },

  /**
   * 查询评论信息
   * @param {String} exerciseId 回课记录id
   * @param {Boolean} forceQuery 是否强制刷新
   */
  queryComments:async function(exerciseId,forceQuery){

    let self =  this;

    if(forceQuery){
      self.clearDataAndPager();
    }


    if(!self._state.hasNext){
      console.log('已经没有下一页了');
      return;
    }

    self.setData({submiting:true});
    try{

      let data = await queryComments({exerciseId:exerciseId,pager:self._state.pager});
      console.log('data=')
      console.log(data)

      if(data.result && data.result.data.length>=self._state.pager.pageSize){
        //如果当前页返回的数据等于我请求的数量，那可能还有下一页
        self._state.pager.pageIndex++;
        self._state.hasNext = true;
      }else{
        self._state.hasNext = false;
      }
      

      data.result.data.forEach((record)=>{


        // self._state.hasNext = true; //trick的写法，如果返回有数据，则默认还有下一页
        // record._updateTimeText = formatDate( new Date(record._updateTime),"yyyy-MM-dd hh:mm:ss" )
        record._updateTimeText = formatDate( new Date(record._updateTime),"yyyy-MM-dd hh:mm:ss" )
      })
      console.log('data 2=')
      console.log(data)
      self.setData({
        submiting:false,
        noMoreComment:!self._state.hasNext,
        comments: self.data.comments.concat(data.result.data)
      })
    }catch(e){

      self.setData({submiting:false});
      $Message({
        content: '出错:'+JSON.stringify(e),
        duration: 3,
        type: 'error'
      });
    }
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

    console.log('comment reach bottom')
    this.queryComments(this.data.exerciseId);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})