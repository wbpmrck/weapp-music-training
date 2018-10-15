
const {invoke} = require('./cloud-invoker');
const db = wx.cloud.database();
module.exports = {


    /**
     * 创建一个曲谱
     */
    createStaff:function({name,pictureIds}){
        return invoke('staff/create',{name,pictureIds})
    },

    /**
     * 查询用户自己的曲谱
     */
    queryStaff:function(){
        return invoke('staff/query',{})
    }
};