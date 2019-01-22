/*
    定义所有文件存储的规则
*/
const {formatDate} = require('../framework/util/time')


/**
 * 获取要上传的视频的上传地址
 * @param {*} openId 
 * @param {*} fid :文件的唯一标识名
 * @param {*} videoExt :视频文件扩展名(不含.)
 * @param {*} thumbExt :视频预览图片文件扩展名(不含.)
 */
const getVideoPath= function(openId,fid,videoExt,thumbExt){

    var date = formatDate(new Date(),'yyyy-MM-dd');

    var fid = (+ new Date() );
    var filename =  fid+'.'+videoExt;
    var thumbfilename = fid + "." + thumbExt;

    var cvpath = 'video/huike/'+openId+'/'+ date+'/'+filename;
    var cvthumbpath = 'video/huike/'+openId+'/'+ date+'/'+thumbfilename;

    return {
        videoPath:cvpath, //视频文件地址
        videoThumbPath:cvthumbpath, //视频预览文件地址
    }
}

const getStaffImagePath= function(openId,fid,ext){

    var date = formatDate(new Date(),'yyyy-MM-dd');

    var fid = (+ new Date() );
    var filename =  fid+'.'+ext;

    var path = 'image/staff/'+openId+'/'+ date+'/'+filename;

    return path;
}
module.exports = {
    getVideoPath,
    getStaffImagePath,
}
