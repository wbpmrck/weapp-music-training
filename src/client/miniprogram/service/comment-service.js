const {invoke} = require('./cloud-invoker');
const db = wx.cloud.database();
module.exports = {

    /**
     *  查询回课记录
     * @param {*} 
     */
    queryComments:function({exerciseId,pager}){
        return invoke('comment/query',{condition:{exerciseId,pager} })
    },

    createComment:function({exerciseId,content,commentId}){
        return invoke('comment/create',{exerciseId,content,commentId})
    }
};