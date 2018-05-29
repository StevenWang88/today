let code = {};

/*
*   code.push()
*  @params : {
 *      box : xxxx,//哪一个盒子
 *  }
* **/
code._init=function({getUpcName,getCode}){
    code.getUpcName=getUpcName
    code.getCode = getCode;
}
export default code;