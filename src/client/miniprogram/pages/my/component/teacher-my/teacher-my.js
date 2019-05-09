const {redirectToPage,navigateToPage,navigateBack} = require('../../../../framework/wechat/router');
const {getStaffImagePath} = require('../../../../business/file-store-rule');
var {createStaff} = require('../../../../service/staff-service');
const regeneratorRuntime = require('../../../../lib/regenerator-runtime/runtime');
const { $Message } = require('../../../../framework/wechat/ui/base/index');
const validate = require("../../../../framework/onelib/OneLib.Validation").targetWrapper;
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
    showTip:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inDev:function(){
      $Message({
        content: "此功能开发中，敬请期待",
        duration: 2,
        type: 'error'
      });
    },
    /**
     * 跳转到老师详情
     */
    teacherDetail:function(){
      // 如果当前还没有设置详情信息，则给出显示提示，直接跳转到设置界面
      if(!app.globalData.userInfo.teacher_detail.realName){
        this.setData({
          showTip:true
        })
      }else{
        navigateToPage("teacher-detail",{teacher:JSON.stringify(app.globalData.userInfo)});
      }
      // 否则先跳转到展示界面 TODO:编辑功能以后再做
    },

    cancel:function(){

      this.setData({
        showTip:false
      });
    },

    goCreateDetail:function(){
      this.setData({
        showTip:false
      });
      navigateToPage("teacher-detail-edit",{mode:'create'});
    },

    /**
     * 邀请学生
     */
    invite:function(){
      navigateToPage("teacher-invite");
    }
  }
})
