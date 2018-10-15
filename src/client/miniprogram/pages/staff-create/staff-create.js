const {redirectToPage,navigateToPage,navigateBack} = require('../../framework/wechat/router');
const {getStaffImagePath} = require('../../business/file-store-rule');
var {createStaff} = require('../../service/staff-service');
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
    name:"",
    pictures:[]
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

    //防止多次提交
    if(self.data.submiting){
      return;
    }

    // 参数检查
    const validateResult = await validate(self.data.name, '曲谱名称').notNull().notEmptyStr()
    .and(self.data.pictures, '曲谱图片列表').lengthBetween(1,'*')
    .run();

    // 如果验证通过
    if (validateResult.pass) {

        //设置等待状态
        self.setData({submiting:true});

        //开始上传图片
        let imagesToUpload = self.data.pictures;

        let imagesInServer=[];

        try{

          for(var i=0;i<imagesToUpload.length;i++){
            console.log(`------${i}------:`)
            // let uploadPath = getStaffImagePath("oTSgl0fcrEy4Kg1UBeNWB3478gEk",+new Date(),imagesToUpload[i].split('.').pop())
            let uploadPath = getStaffImagePath(app.globalData.userInfo._openid,+new Date(),imagesToUpload[i].split('.').pop())
      
            console.log(`准备上传文件:${imagesToUpload[i]}  到:${uploadPath}`);
      
            let result = await wx.cloud.uploadFile({
              cloudPath: uploadPath,
              filePath: imagesToUpload[i],
              // // 成功回调
              // success: res => {
              //     console.log('上传视频封面文件成功', res)
              //     var thumbFileId=res.fileID;
                  
              // },
              // fail:function(err){
              //     showModel('上传失败',JSON.stringify(err));
              // }
            })
      
            console.log(`上传结果:`)
            console.log(result);
            imagesInServer.push(result.fileID);
          }
          //开始创建staff数据记录

          let data = {
            name:self.data.name,
            pictureIds:imagesInServer
          };

          console.log(`准备发送数据:`+JSON.stringify(data))
          let createResult = await createStaff(data);

          console.log(`结果:`)
          console.log(createResult);
          self.setData({submiting:false});

          $Message({
            content: '添加成功',
            duration: 3,
            type: 'success'
          });

          //延迟几秒退回上一页
          setTimeout(function(){
            navigateBack();
          },3000)

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
    this.setData({
      name:event.detail.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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