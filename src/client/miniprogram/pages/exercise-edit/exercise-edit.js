const {formatTime, showBusy, showSuccess, showModel} = require('../../framework/wechat/util')
const {redirectToPage,navigateToPage,reLaunchToPage,navigateBack} = require('../../framework/wechat/router')
const {getVideoPath} = require('../../business/file-store-rule')
var {getMyTeachers} = require('../../service/user-service');
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const { $Message,$Toast } = require('../../framework/wechat/ui/base/index');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
var {createRecord} = require('../../service/exercise-service')
const app = getApp();
Page({

  //页面私有状态
  _state:{
    submiting:false
  },
  /**
   * 页面的初始数据
   */
  data: {

    id:"",
    selfDesc:"",
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
    ],
    staff:{
      id:undefined,
      name:"点击选择",
      pictureIds:["",""]
    },
    videos:[
      // {
      //   fileId:"cloud://huike-dev-4090b9.6875-huike-dev-4090b9/video/huike/oTSgl0fcrEy4Kg1UBeNWB3478gEk/2018-09-30/1538293312334.mp4",
      //   thumbFileId:"cloud://huike-dev-4090b9.6875-huike-dev-4090b9/video/huike/oTSgl0fcrEy4Kg1UBeNWB3478gEk/2018-09-30/1538293312334.jpg"
      // }
    ]
  },

  /**
   * 选择曲谱
   */
  chooseStaff:function(){
    navigateToPage("staff-manage")
  },

  // 选择老师
  chooseTeacher:function(){
    navigateToPage("my-teacher",{mode:'choose'})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {


    var self = this;
    //通过页面参数传递临时视频文件id、缩略图id
    let {fileId,thumbFileId,mode} = options;

    fileId = decodeURIComponent(fileId);
    console.log(`exercise edit onload,mode=[${mode}],fileId=[${fileId}]`);

    //如果是新增练习记录
    if(mode=='create'){

    //   //根据云文件id获取可访问的http链接

    //   $Toast({
    //     content: '准备视频中...',
    //     type: 'loading',
    //     duration: 0
    // });

    //   let fileAddress = await wx.cloud.getTempFileURL({
    //     fileList: [fileId]
    //   });

    //   console.log(`获得地址:`)
    //   console.log(fileAddress.fileList)

      self.setData({
        id:"",
        videos:[
          {
            fileId,
            // fileUrl:fileAddress.fileList[0].tempFileURL,
            thumbFileId,
          }
        ],
        staff:app.globalData.staffLastChoosed||{
          id:undefined,
          name:"点击选择",
          pictureIds:["",""]
        }, 
        selfDesc:""
      });

      console.log('准备查询用户的老师信息')
      await this.queryMyTeacher();
      // $Toast.hide();
      
    }

  },


  /**
   * 用户自我评价修改
   * @param {*} event 
   */
  descChange:function(event){

    console.log('descChange');
    console.log(event);
    this.setData({
      selfDesc:event.detail.value
    });
  },

  cancel:function(){
    navigateBack();
  },

  /**
   * 查询自己的老师
   */
  queryMyTeacher:async function(){

    let self =  this;

    console.log('app.globalData.exerciseToTeacher=')
    console.log(app.globalData.exerciseToTeacher)

    if(app.globalData.exerciseToTeacher===undefined){
      $Toast({
        content: '获取回课信息...',
        type: 'loading',
        duration: 0
      });
      try{

        let data = await getMyTeachers();
        console.log('getMyTeachers=')
        console.log(data)

        $Toast.hide();
        self.setData({
          teacherList: data.result.data
        })
      }catch(e){

        $Toast.hide();
        $Message({
          content: '出错:'+JSON.stringify(e),
          duration: 5,
          type: 'error'
        });
      }
    }
  },
  /**
   * 提交练习记录
   */
  submit:async function(){

    let self = this;
    console.log(`准备提交:[${this._state.submiting}]`)
    if(this._state.submiting){
      return;
    }

    this._state.submiting = true;

    // 参数检查
    const validateResult = await validate(this.data.staff.id, '请选择练习的曲谱').notNull().notEmptyStr()
    // .and(this.data.selfDesc, '请填写练习自我评价').notNull().notEmptyStr()
    .and(this.data.videos, '没有选择练习视频').lengthBetween(1,'*')
    .run();

    // 如果验证通过
    if (validateResult.pass) {

        // 1.上传视频
        $Toast({
          content: '正在上传练习记录',
          type: 'loading',
          duration: 0
        });

        try{

          let videoTmp = this.data.videos[0].fileId
          let uploadPath = getVideoPath(app.globalData.userInfo._openid,+new Date(),videoTmp.split('.').pop())
                  
          console.log(`uploadPath:`+JSON.stringify(uploadPath));
      
          let result = await wx.cloud.uploadFile({
              cloudPath: uploadPath.videoPath,
              filePath: videoTmp,
          });
      
          console.log(`上传结果:`)
          console.log(result);

          self.data.videos[0].fileId = result.fileID;
          // 视频文件上传成功，跳转到回课记录编辑页面
          $Toast.hide();
      
          // 2.保存记录到数据库
          let r = {
            staffId:self.data.staff.id,
            selfDesc:self.data.selfDesc,
            videos:self.data.videos,
            teacher_allow:{}
          };
          r.teacher_allow[self.data.teacherList[0]._openid] = 1;
          let createResult = await createRecord(r);

          console.log(`结果:`)
          console.log(createResult);



          
          $Message({
            content: '练习记录创建成功',
            duration: 3,
            type: 'success'
          });
          // 3.返回
          setTimeout(function(){
            self._state.submiting = false;
            // navigateBack();
            reLaunchToPage("my");
          },3000)

        }catch(e){
          console.error(e);
          $Toast.hide();
          this._state.submiting = false;
          $Message({
            content: '系统出错，请稍后再试',
            duration: 3,
            type: 'error'
          });
        }
    }else{
      this._state.submiting = false;
      $Message({
        content: `${validateResult.desc}`,
        duration: 2,
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
  onShow: function (option) {

    console.log(`exercise edit onShow , option=`+JSON.stringify(option));
    const self = this;
    console.log('用户选择的曲谱:'+JSON.stringify(app.globalData.staffLastChoosed));

    self.setData({
      staff:app.globalData.staffLastChoosed||{
        id:undefined,
        name:"点击选择",
        pictureIds:["",""]
      }, // 这里是查询出的曲谱信息
    });

    // 设置用户选择的老师
    if(app.globalData.exerciseToTeacher){
      self.setData({
        teacherList:[app.globalData.exerciseToTeacher]
      });
    }
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

    console.log(`exercise edit onUnload`);
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