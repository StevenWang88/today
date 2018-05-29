/*工具*/
import axios from "axios"
import qs from "qs"
import APP from "./apiConfig"
const baseParam={
    jsonpCallback:"jsonpCallback",
    usrOnlyId: "",
    villageNo: ""
}
// 基础配置
axios.defaults.baseURL =  APP.DOMAIN
axios.defaults.timeout = 8000;
//Get请求
function GET(url, params) {
    url = url + fiterParams(params);
    return axios.get(url, params).then(reqResult).catch(reqErr);
}
/* POST请求 */
function POST(url, params, contentType = 'application/json') {
    baseParam.usrOnlyId=local.get('usrOnlyId')||10000024742
    // baseParam.usrOnlyId=local.get('usrOnlyId')||9999999901
    baseParam.villageNo=local.get('villageNo')||'ceshi888'
    toast.loading()
    return axios.post(url, { ...baseParam, ...params }, { headers: { 'Content-Type': contentType } }).then(reqResult).catch(reqErr);;
}
var uleUrl=APP.DOMAIN
function JsonpPost(url, params, hasLoad = true) {
    return $.ajax({
     url: uleUrl+url,
     type: "post",
     data:{...params},
    crossDomain:true,
   }).then((res)=>{
     return res
   }).catch((err)=>{
     return err
   })
  }
  function JSONP(url, params, hasLoad = true,jsoncallback='jsonpCallback') {
    baseParam.usrOnlyId=local.get('usrOnlyId')||10000024742
    baseParam.villageNo=local.get('villageNo')||'ceshi888'
    return $.ajax({
      url: uleUrl + url,
      type: "get",
      dataType: "jsonp",
      data: { ...baseParam, ...params },
      jsonp: jsoncallback,
    }).then((res) => {
      return res
    }).catch((err) => {
      return err
    })
  }
function fiterParams(params) {
    let urlmix = '';
    if (params) {
        let paramstr = '';
        if (typeof params === 'string') urlmix = '/' + params;
        if (typeof params === 'object') {
            paramstr = qs.stringify(params);
            urlmix = '?' + paramstr;
        }
    }
    return urlmix;
}
function reqResult(res) {
    let data = null;
    if (res.status === 200) {
        data=res.data
        return data
    }
    toast.hide()
}
function reqErr(e) {
    toast.hide()
    throw e;
}

export {
    GET, POST,JsonpPost,JSONP
}
