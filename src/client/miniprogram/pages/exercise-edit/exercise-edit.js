const {formatTime, showBusy, showSuccess, showModel} = require('../../framework/wechat/util')
const {redirectToPage,navigateToPage,reLaunchToPage,navigateBack} = require('../../framework/wechat/router')
const {getVideoPath} = require('../../business/file-store-rule')
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


      $Toast.hide();
      
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
          let createResult = await createRecord({
            staffId:self.data.staff.id,
            selfDesc:self.data.selfDesc,
            videos:self.data.videos
          });

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