const {redirectToPage,navigateToPage,navigateBack} = require('../../framework/wechat/router');
const {formatDate} = require('../../framework/util/time');
const {getStaffImagePath} = require('../../business/file-store-rule');
var {getMyTeachers} = require('../../service/user-service');
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
    mode:'normal',
    currentPlayId:"",
    teacherList:[
      // {
      //   _createTime:'',
      //   _updateTime:'',
      //   avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKyEJx6dG2dMqxmE6ibmR1emdSq0qavKmgC1hNxScpgqjlIG8CBMMugoGGfdEicSmeojibpwyAyw1qnQ/132',

      //   teacher_detail:{
      //     introduce:"王振山，小提琴教育家，中央音乐学院教授 在从事小提琴教学的同时，长期教授室内乐，任中央音乐学院室内乐教研室主任、组建了中央音乐学院室内乐团，任艺术指导；曾任中央广播交响乐团、中央歌剧院、北京交响乐团弦乐四重奏艺术指导。培训的很多优秀弦乐四重奏参加全国及国际室内乐比赛获奖，并多次代表国家出国演出。曾倡导举办了第一届全国青少年小提琴比赛。多次出任小提琴、室内乐比赛评委；多次应聘任文化部、国家交响乐团专业资格考试评委；多次率团出国比赛、演出，并应邀赴欧洲、美国访问、讲学。1996年，获“杨雪兰教育奖”。  主要著作有《小提琴高级音阶、双音教程》",
      //     rewardIntroduce:[
      //       'xxxx年获得合肥市优秀教师称号'
      //     ],
      //     level:1,
      //     realName:'王振山',
      //     verifyStatus:0
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



  queryTeacher:async function(){

    let self =  this;

    if(!self._state.hasNext){
      console.log('已经没有下一页了');
      return;
    }

    self.setData({submiting:true});
    try{

      let data = await getMyTeachers({pager:self._state.pager});
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
        teacherList: self.data.teacherList.concat(data.result.data)
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

  /**
   * 查看老师详情
   * @param {} event 
   */
  teacherDetail:function(event){
    console.log("teacherDetail,choose  teacher:");
    let data = this.data.teacherList[event.currentTarget.dataset.index];
    console.log(data);
    navigateToPage("teacher-detail",{id:event.currentTarget.dataset.openId,teacher:JSON.stringify(data)});
  },

  /**
   * 选择了某个老师返回
   * @param {string} id 
   */
  choose:function({currentTarget:{dataset:{openId}}}){
    console.log("choose:"+openId);
    app.globalData.exerciseToTeacherOpenId=openId;
    navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("my teacher"+" onLoad");
    console.log(options);
    this.setData({
      mode: options.mode
    });
    this.queryTeacher();
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
    let self = this;
    setTimeout(function(){
      $Message({
        content: '向左滑动可以'+ (self.data.mode==="normal"?'查看详情':'选择老师'),
        duration: 1
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
    this.queryTeacher();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})