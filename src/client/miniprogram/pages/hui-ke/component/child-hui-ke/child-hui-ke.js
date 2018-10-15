const {formatTime, showBusy, showSuccess, showModel} = require('../../../../framework/wechat/util')
const {getVideoPath} = require('../../../../business/file-store-rule')
const regeneratorRuntime = require('../../../../lib/regenerator-runtime/runtime')
const { $Message,$Toast } = require('../../../../framework/wechat/ui/base/index');
const {redirectToPage,navigateToPage} = require('../../../../framework/wechat/router')
var {createRecord} = require('../../../../service/exercise-service')
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        recordAnimation:{}
    },

    /**
     * 组件的方法列表
     */
    methods: {
        chooseVideo:async function(){
            let self = this;
            //先获取视频信息，然后分别上传视频文件以及封面图文件
            wx.chooseVideo({
                sourceType: ['album','camera'],
                compressed:true,
                maxDuration: 60,
                camera: 'back', //默认拉起后置摄像头
                success: async function(res) {
                  console.log('视频信息:')
                  console.log(res)

                  var videoTmp = res.tempFilePath;
                //todo: 2018年10月10日 发现微信的开发者工具有预览图，但是真机没有，暂时不做
                //   var thumbTmp = res.thumbTempFilePath;

                // $Toast({
                //     content: '正在上传视频',
                //     type: 'loading',
                //     duration: 0
                // });

                // try{

                //     let uploadPath = getVideoPath(app.globalData.userInfo._openid,+new Date(),videoTmp.split('.').pop())
            
                //     console.log(`uploadPath:`+JSON.stringify(uploadPath));
            
                //     let result = await wx.cloud.uploadFile({
                //         cloudPath: uploadPath.videoPath,
                //         filePath: videoTmp,
                //     });
            
                //     console.log(`上传结果:`)
                //     console.log(result);
                //     // 视频文件上传成功，跳转到回课记录编辑页面
                //     $Toast.hide();
                    // navigateToPage("exercise-edit",{fileId:result.fileID,thumbFileId:"",mode:"create"})
                    navigateToPage("exercise-edit",{fileId:videoTmp,thumbFileId:"",mode:"create"})
                // } catch(e){

                //     $Toast.hide();
                //     $Message({
                //         content: '出错:'+JSON.stringify(e),
                //         duration: 5,
                //         type: 'error'
                //     });
                // }
                },
                fail:function(err){
                    console.error(err);
                    // $Message({
                    //     content: '出错:'+JSON.stringify(err),
                    //     duration: 2,
                    //     type: 'error'
                    // });
                }
            })
        }
        // initAnimation:function(){

        //     var self = this;
        //     var animation = wx.createAnimation({
        //         duration: 2000,
        //         timingFunction: 'ease',
        //     });

        //     function _ani(){
        //         animation.rotate(0).scale(1.1, 1.1).step({duration: 200,timingFunction: 'ease'});
        //         animation.rotate(25).scale(1.5, 1.5).step({duration: 200,timingFunction: 'ease'});
        //         animation.rotate(-25).scale(1.2, 1.2).step({duration: 200,timingFunction: 'ease'});
        //         animation.rotate(35).scale(1.5, 1.5).step({duration: 300,timingFunction: 'ease'});
        //         animation.rotate(-35).scale(1.2, 1.2).step({duration: 300,timingFunction: 'ease'});
        //         animation.rotate(25).scale(1.5, 1.5).step({duration: 200,timingFunction: 'ease'});
        //         animation.rotate(-25).scale(1.2, 1.2).step({duration: 200,timingFunction: 'ease'});
        //         animation.rotate(0).scale(1.1, 1.1).step({duration: 200,timingFunction: 'ease'});

        //         console.log('播放动画')
        //         self.setData({
        //             recordAnimation:animation.export()
        //         })
        //     }
        //     setInterval(function(){
        //         _ani();
        //     },4000);
        //     _ani();
        // }

    },
    lifetimes:{
        created :function(){
            console.log('component created');
        },
        attached :function(){
            console.log('component attached');
            
        },
        ready :function(){
            console.log('component ready');

            //初始化按钮动画
            // this.initAnimation();
            
        },
        detached :function(){
            console.log('component detached');
            
        }
    },
    pageLifetimes:{

        show :function(){
        
            console.log('component page show');
        },
        hide :function(){
            console.log('component page hide');
        
        }
    }
})
