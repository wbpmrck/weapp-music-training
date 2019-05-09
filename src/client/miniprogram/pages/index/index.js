//index.js
var util = require('../../framework/wechat/util')
var {getUserInfo} = require('../../service/user-service')
const {redirectToPage,navigateToPage,switchToTab} = require('../../framework/wechat/router')
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime');
const app = getApp();

Page({
    data: {
        userInfo: {},
    },

    onLoad:async function(){
        let self=this;
        console.log('index onload');
        wx.getSystemInfo({
            success:function(res){
                console.log(`系统信息:`+JSON.stringify(res))
            }
        });

        try{
            await app.refreshUserInfo();
             //如果用户不存在，则进入选择角色页面
             if(app.globalData.userInfo===undefined){
                redirectToPage("choose-role")
                // wx.redirectTo({
                //     url: "/pages/choose-role/choose-role"
                // })
            }else{
                // wx.switchTab({
                //     url: '/pages/hui-ke/hui-ke'
                //   });
                //   wx.redirectTo({
                //       url: '/pages/exercise-edit/exercise-edit?recordId='+"W7B-QwUup4nwKT4H"
                //     })
                    // redirectToPage("exercise-edit",{
                    //     recordId:"W7B-QwUup4nwKT4H"
                    // })
                    switchToTab("hui-ke")
            }
        }catch(err){
            util.showModel('登录失败', err)
        }
    }
})
