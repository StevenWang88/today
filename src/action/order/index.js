import {
	CHANGE_SEARCH_FILTER, ADD_SEARCH_LIST, REAET_SEARCH_LIST, CLEASE_SEARCH_LIST,
	RESET_SEARCH_FILTER, ADDINDEX_SEARCH_FILTER, SWITCH_SEARCH_FILTER, SET_RAND
} from 'types';

import jsonp from '@/jsonp';
//重置搜索条件
function _resetFilter() {
	return {
		type: REAET_SEARCH_LIST
	}
}


export const resetFilter = _resetFilter;
//切换搜索条件
function _switchFilter(payload) {
	return {
		type: SWITCH_SEARCH_FILTER,
		payload
	}
}
export const switchFilter = _switchFilter;

//跟新搜索条件
function _assignFilter(payload) {
	return {
		type: CHANGE_SEARCH_FILTER,
		payload
	}
}
export const assignFilter = _assignFilter;
//上啦加载下面的数据
function _nextList() {
	return {
		type: ADDINDEX_SEARCH_FILTER
	}
}
export const nextList = _nextList;
//添加订单列表
export function addList(payload) {
	return {
		type: ADD_SEARCH_LIST,
		payload
	}
}

//重置订单列表
function _resetList(payload) {
	return {
		type: REAET_SEARCH_LIST,
		payload
	}
}
export const resetList = _resetList;
// 获取订单详情
export function setRand(payload) {
	return {
		type: SET_RAND,
		payload
	}
}


//清空订单列表
export function clearList() {
	return {
		type: CLEASE_SEARCH_LIST
	}
}

//请求订单列表数据
let isMax = false;
export function sendListRequest(options = {}) {
	return (dispatch, getState) => {
		let { type } = options;
		if (type == "reset") {
			isMax = false;
			dispatch(assignFilter({ isMAX: false }));
		}
		if (type == "next") {
			dispatch(_nextList())
		}
		let state = getState();
		let { searchPageFilter } = state;
		console.log("请求订单列表参数", searchPageFilter)
		return apiMap.searchSaleOrderSummaryForPad.send(searchPageFilter).then(res => {
			console.log("订单列表", res)
			if (res && res.returnCode) {
				let { returnCode, saleList, totalPage } = res;
				if (totalPage == 0 &&saleList&& saleList.length==0) {
					toast.info('没有查询到订单')
					dispatch(setRand({ rand: ''}))
				}
				if(saleList&&saleList.length>0){
					var l=saleList
					l = l.map((item, index) => {
						let t = item.SALE_TYPE
						// 订单金额= 支付金额+赊账 
						item.salePrice = item.PAID_PRICE + item.DEBT_PRICE
						switch (t) {
						  case 0:
							item.typeName = "商品销售"
							break;
						  case 1:
							// INTEGRAL
							item.typeName = "积分兑换"
							break;
						  case 2:
							  item.salePrice = item.TOTAL_PRICE - item.RELIEF_PRICE - item.DEBT_PRICE
							item.typeName = "商品退货"
							break;
						  case 8:
							item.salePrice = item.TOTAL_PRICE
							item.typeName = "扫码转账"
							break;
						  default:
							break;
						}
						return item
					  })
				}
				if (totalPage == 0) totalPage = 1;
				if (searchPageFilter.firstResult >= totalPage) {
					dispatch(assignFilter({ isMAX: true }));
					isMax = true
				}
				if (searchPageFilter.firstResult <= totalPage) {
					if (searchPageFilter.firstResult <= 1) {
						dispatch(_resetList({ list: saleList }));
						if (saleList && saleList.length > 0) {
							dispatch(setRand({ rand: saleList[0] }))
						}
					} else {
						dispatch(addList({ list: saleList }));
					}
				}
			
			}

			// return true;
		})
	}
}