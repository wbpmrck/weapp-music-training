const {redirectToPage,navigateToPage,navigateBack} = require('../../../../framework/wechat/router');
const {formatDate} = require('../../../../framework/util/time');
const {getStaffImagePath} = require('../../../../business/file-store-rule');
var {queryTeacherOwnRecord,deleteRecord} = require('../../../../service/exercise-service');
const regeneratorRuntime = require('../../../../lib/regenerator-runtime/runtime');
const { $Message,$Toast } = require('../../../../framework/wechat/ui/base/index');
const { pageCondition } = require('../../../../framework/dao/queryHelper');
const validate = require("../../../../framework/onelib/OneLib.Validation").targetWrapper;
const app = getApp();


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    reachBottomCount: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        this.onReachBottom();
      }
    },
    pullDownCount: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
        console.log('teacher pullDownCount')
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        this.onPullDown();
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

    submiting:false,
    currentPlayId:"",
    exerciseList:[
      // {
      //   _createTime:'',
      //   _updateTime:'',
      //   downVote:0,
      //   upVote:0,
      //   enable:1,
      //   commentsCount:135,
      //   teacherCommentsCount:4,
      //   selfDesc:'',
      //   status:0,
      //   staff:{
      //     _id:123,
      //     name:"贝多芬",
      //     pictures:[
      //       'cloud://huike-dev-4090b9.6875-huike-dev-4090b9/image/staff/oTSgl0fcrEy4Kg1UBeNWB3478gEk/2018-10-11/1539221186422.jpg'
      //     ]
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


  lifetimes: {
    async attached() {
      this._state ={
        //分页查询条件
        pager:{
          ...pageCondition //使用扩展运算符复制查询条件。直接引用对象会导致页面之间互相影响
        },
        hasNext:true,
        lastVideo:undefined
      };
      // 在组件实例进入页面节点树时执行
      await this.queryExercise();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show() {
      // 页面被展示
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onPullDown:async function(){
      console.log('teacher hui ke onPullDown')
      await this.queryExercise(true);
    },

    onReachBottom:async function(){

      console.log('teacher hui ke reach bottom')
      await this.queryExercise();
    },
    videoScreenChange:function({detail:{fullScreen, direction}}){
      console.log('videoScreenChange,fullScreen='+fullScreen)
        //如果从全屏模式退回，则停止当前视频
        if(!fullScreen){
          this._state.lastVideo.stop();
        }
    },
    /**
     * 播放当前曲谱的视频
     */
    playVideo: function(event){
      console.log('playVideo')
      console.log(event);

      let self = this;
      if(self._state.lastVideo){
        self._state.lastVideo.stop();
      }
      let videoContext = wx.createVideoContext(event.currentTarget.dataset.videoId,this);
      videoContext.requestFullScreen({
        direction:0
      });
      console.log(' videoContext.play()')
      videoContext.play();
      self._state.lastVideo = videoContext;
      self.setData({
        currentPlayId:event.currentTarget.dataset.videoId
      })
    },


    queryExercise:async function(forceRefresh){

      let self =  this;

      if(forceRefresh){
        this._state ={
          //分页查询条件
          pager:{
            ...pageCondition //使用扩展运算符复制查询条件。直接引用对象会导致页面之间互相影响
          },
          hasNext:true,
          lastVideo:undefined
        };

        this.setData({
          exerciseList:[]
        })
      }

      console.log('self=')
      console.log(self);
      console.log(self._state);
      console.log(self._state.hasNext);

      if(!self._state.hasNext){
        console.log('已经没有下一页了');
        return;
      }

      self.setData({submiting:true});
      try{

        let data = await queryTeacherOwnRecord({pager:self._state.pager});
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
          exerciseList: self.data.exerciseList.concat(data.result.data)
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
     * 查看评论
     * @param {} event 
     */
    viewComments:function(event){
      console.log("viewComments")
      console.log(event)
      navigateToPage("child-view-comments",{exerciseId:event.currentTarget.dataset.recordId})
    },
  }
})
