const {redirectToPage,navigateToPage,navigateBack} = require('../../framework/wechat/router');
const {getStaffImagePath} = require('../../business/file-store-rule');
var {updateTeacherDetail} = require('../../service/user-service');
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime');
const { $Message } = require('../../framework/wechat/ui/base/index');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    submiting:false,
    maxPicture:9, //配置：最大图片数
    realName:"", //真实姓名
    introduce:"", //个人介绍
    rewardIntroduce:[], //获奖信息
    pictures:[]
  },

  addReward:function(){
    this.setData({
      // rewardIntroduce:this.data.rewardIntroduce.concat([{value:''}])
      rewardIntroduce:this.data.rewardIntroduce.concat([''])
    })
  },
  addImage:function(){
    let self = this;
    wx.chooseImage({
      count: self.data.maxPicture,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        tempFilePaths = self.data.pictures.concat(tempFilePaths).slice(0,self.data.maxPicture);
        self.setData({
          pictures:tempFilePaths
        });
      }
    })
  },

  /**
   * 提交创建请求
   */
  submitTap:async function(){

    let self = this;

    console.log(self.data)

    //防止多次提交
    if(self.data.submiting){
      return;
    }

    // 参数检查
    // realName:"", //真实姓名
    // introduce:"", //个人介绍
    // rewardIntroduce:[], //获奖信息
    const validateResult = await validate(self.data.realName, '真实姓名').notNull().notEmptyStr().lengthBetween(2,'*')
    .and(self.data.introduce, '个人介绍').notNull().notEmptyStr()
    .run();

    // 如果验证通过
    if (validateResult.pass) {

        //设置等待状态
        self.setData({submiting:true});

        //开始上传图片
        let imagesToUpload = self.data.pictures;

        let imagesInServer=[];

        try{

          // for(var i=0;i<imagesToUpload.length;i++){
          //   console.log(`------${i}------:`)
          //   // let uploadPath = getStaffImagePath("oTSgl0fcrEy4Kg1UBeNWB3478gEk",+new Date(),imagesToUpload[i].split('.').pop())
          //   let uploadPath = getStaffImagePath(app.globalData.userInfo._openid,+new Date(),imagesToUpload[i].split('.').pop())
      
          //   console.log(`准备上传文件:${imagesToUpload[i]}  到:${uploadPath}`);
      
          //   let result = await wx.cloud.uploadFile({
          //     cloudPath: uploadPath,
          //     filePath: imagesToUpload[i],
          //     // // 成功回调
          //     // success: res => {
          //     //     console.log('上传视频封面文件成功', res)
          //     //     var thumbFileId=res.fileID;
                  
          //     // },
          //     // fail:function(err){
          //     //     showModel('上传失败',JSON.stringify(err));
          //     // }
          //   })
      
          //   console.log(`上传结果:`)
          //   console.log(result);
          //   imagesInServer.push(result.fileID);
          // }


          //开始修改user数据记录

          let data = {
            realName:self.data.realName,
            introduce:self.data.introduce,
            rewardIntroduce:self.data.rewardIntroduce,
          };

          console.log(`准备发送数据:`+JSON.stringify(data))
          let createResult = await updateTeacherDetail(data);

          console.log(`结果:`)
          console.log(createResult);
          self.setData({submiting:false});

          $Message({
            content: '添加成功',
            duration: 3,
            type: 'success'
          });


          await app.refreshUserInfo();

          //延迟几秒退回上一页
          setTimeout(function(){
            navigateBack();
          },1000)

        }catch(e){

          self.setData({submiting:false});
          $Message({
            content: '出错:'+JSON.stringify(e),
            duration: 5,
            type: 'error'
          });
        }
    }else{
      $Message({
        content: `${validateResult.desc}${validateResult.funcDesc}`,
        duration: 2,
        type: 'error'
      });
    }

  },

  change:function(event){
    console.log(event);
    let data ={};
    data[event.target.dataset.fieldId] = event.detail.detail?event.detail.detail.value:event.detail.value

    console.log(data);
    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options.mode:'+options.mode);

    if(options.mode =='update'){
      //保存要展示的老师信息
      this.setData({
        realName:app.globalData.userInfo.teacher_detail.realName, //真实姓名
        introduce:app.globalData.userInfo.teacher_detail.introduce, //个人介绍
        rewardIntroduce:app.globalData.userInfo.teacher_detail.rewardIntroduce, //获奖信息
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})