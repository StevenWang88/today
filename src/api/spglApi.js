import { POST,JsonpPost,JSONP } from './util'
const url = {
  addItem: "/vpsItemService/itemService/pad/addItem", //新增商品
  updateItem: "/vpsItemService/itemService/pad/updateItem",//更新商品
  padDoSaleReturn:'/vpsShopSaleService/jxc/padDoSaleReturn!padDoSaleReturn.do',//退货接口
}
let spglApi = {}
spglApi.AddItem = function (params = {}) {
  return POST(url.addItem, params);
}
spglApi.UpdateItem = function (params = {}) {
  return POST(url.updateItem, params);
}
spglApi.padDoSaleReturn = function (params = {}) {
  return JSONP(url.padDoSaleReturn, params);
}
export default spglApi
