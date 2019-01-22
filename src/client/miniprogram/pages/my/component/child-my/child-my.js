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
     * 跳转到学生用户中心
     */
    childUserInfo:function(){
      this.inDev();
    },

    /**
     * 回课记录
     */
    exerciseHistory:function(){
      navigateToPage("child-exercise-history");
    },
    childStaff:function(){
      navigateToPage("staff-manage");
    },
     /**
      * 跳转到我的老师页面
      */
    childTeacherInfo:function(){
      navigateToPage("my-teacher",{mode:"normal"}); //mode=choose则表示，老师列表页面仅仅支持选择功能。 normal模式显示的是查看详情功能
    },
    /**
     * 我的账户
     */
    childAccountInfo:function(){
     this.inDev();
   }
  }
})
