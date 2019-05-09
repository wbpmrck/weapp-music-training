
const {invoke} = require('./cloud-invoker');
const db = wx.cloud.database();
module.exports = {

    /**
     *  查询回课记录
     * @param {*} 
     */
    queryRecord:function({id,pager}){
        return invoke('exercise/query',{condition:{id,pager} })
    },
    queryTeacherOwnRecord:function({id,pager}){
        return invoke('exercise/query-teacher-own',{condition:{id,pager} })
    },
    deleteRecord:function({id}){
        return invoke('exercise/delete',{id })
    },

    createRecord:function({staffId,selfDesc,videos,teacher_allow}){
        return invoke('exercise/create',{staffId,selfDesc,videos,teacher_allow})
    }
};