// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const rp = require('request-promise');

cloud.init();

// const appId='wx615fab173f626152';
// const appSecret='67bab0d2551e8605add9ed328da00e26';

const appId='wx6efd3e54be765d14';
const appSecret='71409d21166140faa9a3fdd93ad44e13';

const accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

// 请求刷新access_token并保存到数据库
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()


  console.log(`access token main`);
  const db = cloud.database();
  const _ = db.command;
  console.log(`request ： ${accessTokenUrl}`);

  try{

    let resp = await rp(accessTokenUrl);
  
    console.log('resp:'); 
    console.log(resp); 

    resp = JSON.parse(resp);

       let dataToCreate ={
      _createTime: new Date(),
      _updateTime: new Date(),
      paramName:'accessToken',
      paramValue:resp.access_token,
      paramDesc:resp,
    };


    let updated= await db.collection('wechat_info').where({
      paramName: 'accessToken'
    })
      .update({
        data: {
          _updateTime: new Date(),
          paramValue:resp.access_token,
          paramDesc:_.set(resp),
        },
      });
      console.log('updated:'); 
      console.log(updated); 
      if(!updated || updated.stats.updated<1){
        let added = await db.collection('wechat_info').add({
          data:dataToCreate
        });
  
        console.log(`added data:`);
        console.log(added);
        if(added._id){
          return {
            success:true
          }
        }else{
          return {
            success:false,
            err:e
          }
        }
      }else{
        return {
          success:true
        }
      }
  }catch(e){
    console.log('error:', e); // Print the error if one occurred
    return {
      success:false,
      err:e
    }
  }
}