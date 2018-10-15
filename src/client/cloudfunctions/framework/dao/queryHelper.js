/**
 * Created by kaicui on 17/9/28.
 */
module.exports.pageCondition={
    pageSize:10,
    needTotal:1,
    pageIndex:1,
};


module.exports.removeEmptyCondition=function (conditionObj) {
    for(var key in conditionObj){
        if(conditionObj[key]===undefined||conditionObj[key]===null){
            delete conditionObj[key];
        }
    }
};
module.exports.setLike=function (conditionObj,key) {
        if(conditionObj[key]!==undefined){
            conditionObj[key] = {
                $like: `%${conditionObj[key] }%`
            }
        }
};
module.exports.setIfExist=function (whereObj,condition,colName,clause) {
        if(condition!==undefined && condition!==""){
            whereObj[colName] = clause
        }
};
module.exports.buildPageSQL=function ({pageIndex=1,pageSize=10,needTotal=0}) {
    pageIndex = parseInt(pageIndex);
    pageSize = parseInt(pageSize);
    needTotal = parseInt(needTotal);

    // (1 - 1) * 10 = 0
    // 10

    //(2 - 1) * 10  = 10
    //10 
    return {
        offset:(pageIndex-1) * pageSize,
        limit: pageSize
    }
};