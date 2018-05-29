import {
	G1_RESET_ADD_GOODS,
	G1_CONCAT_GOODS,
	G1_FILTER_ASSGIN,
	G1_FILTER_RESET,
	G1_FILTER_NEXT,
	G1_RESET_CLASSIFY,
	G1_SHOW_GOODINFO,
	G1_GOOD_INFO,
	G1_GET_STOCK_LIST,
	G1_GET_STOCK_LOAD,
} from 'types';

export function g1ShowGoodInfo(show, curIndex) {
	return {
		type: G1_SHOW_GOODINFO,
		payload: {
			show, curIndex
		}
	}
}

export function g1RsestClassifyList(list) {
	return {
		type: G1_RESET_CLASSIFY,
		payload: {
			list
		}
	}
}


const _g1ResetGoods = (list) => {
	return {
		type: G1_RESET_ADD_GOODS,
		payload: {
			list
		}
	}
}
export const g1ResetGoods = _g1ResetGoods;

//添加商品
function g1ConcatList(list) {
	return {
		type: G1_CONCAT_GOODS,
		payload: {
			list
		}
	}
}


//查询下一页
const g1NextFilter = () => {
	return {
		type: G1_FILTER_NEXT
	}
}

//合并查询条件
export function g1FilterMerge(filter) {
	return {
		type: G1_FILTER_ASSGIN,
		payload: {
			filter
		}
	}
}
//重置搜索条件
export function g1RestFilterMerge(filter) {
	return {
		type: G1_FILTER_RESET,
		payload: {
			filter
		}
	}
}
// 
export function g1StockLoad(payload) {
	return {

		type: G1_GET_STOCK_LOAD,
		payload
	}
}
//查询商品

let isMax = false;
var filImg = (url) => {
	var curl = ''
	if (url && url.indexOf(';') > 0) {
		curl = url.split(';')[0]
	} else {
		curl = url
	}
	return curl
}

export function g1StartRequireGoods(options = {}) {
	return (dispatch, getState) => {
		let state = getState();
		let { type } = options;
		if (type === 'reset') {
			// isMax = false;
			dispatch(g1FilterMerge({ hasMore: true }))
			dispatch(_g1ResetGoods([]))
		}
		// if (isMax) {
		// 	return Promise.resolve(111);
		// }
		if (type === 'next') {
			dispatch(g1NextFilter())
		}
		let params = state.g1SearchGoodsFilter;
		console.log('搜索商品参数', JSON.stringify(params))
		return apiMap.itemList.send(params).then(result => {
			console.log('商品列表数据', result)
		
			let { returnCode, pageCount, pageNum, retList } = result;
			if (result.pageNum >= result.pageCount) {
				dispatch(g1FilterMerge({ hasMore: false }))
			}
			if (returnCode === '0000') {
				retList = retList.map((data) => {
					console.log('packageType',data.packageType)
					data.imageUrl = filImg(data.imageUrl)
					var isBeta=false
					if (data.packageType == 2) {
						// packageType!=2
						// 拼接散货图片
						var img_upc = data.upc.substr(0, data.upc.length - 2)
						var sh_img = '//i1.' + (isBeta ? 'beta.' : '') + 'ule.com' + '/app/yzg/onlinePay/home/i/sanhuo/' + img_upc + '.jpg';
						data.imageUrl = sh_img
					}
					return data
				})
				dispatch(g1ConcatList(retList))
			}

			// isMax = pageNum >= pageCount;
			// return true;
		})
	}
}

//单个商品信息
export function g1GoodInfo(item) {
	return {
		type: G1_GOOD_INFO,
		payload: {
			item
		}
	}
}
//加载更多获取单个商品批次列表
const getStockList = (list) => {
	return {
		type: G1_GET_STOCK_LIST,
		payload: {
			list
		}
	}
}
let list = []
let stockMax = false;
let pageNum = 1
export function g1GoodStockList(option = {}, type) {
	return (dispatch, getState) => {
		if (type && type == "reset") {
			pageNum = 1
			option.pageNum = pageNum
			stockMax = false
			list = []
			dispatch(getStockList(list))
			dispatch(g1StockLoad({ stockMax: false }))
		}
		// if (stockMax) {
		// 	return Promise.resolve(111);
		// }
		if (type == "next") {
			pageNum += 1
			option.pageNum = pageNum
		}
		console.log('获取批次列表参数', option)
		return apiMap.getItemQtyHenList.send(option).then(res => {
			console.log('批次请求结果', res)
			if (res) {
				if (res.total <= option.pageNum * 5) {
					dispatch(g1StockLoad({ stockMax: true }))
					stockMax = true
				}
				if (option.pageNum == 1) {
					list = res.itemQtyList
				} else {
					list = [...list, ...res.itemQtyList]
				}
				dispatch(getStockList(list))
			}
			// return true;
		})
	}
}
//更新商品详情信息
export function changGoodInfo(option = {}) {
	return (dispatch, getState) => {
		let state = getState();
		let goodInfo = state.g1GoodInfo;
		return apiMap.queryItem.send({ upc: goodInfo.upc }).then((res) => {
			console.log("更新商品详情", res)
			if (res && res.returnCode == "0000") {
				let item = res.item
			    	var isBeta=false
					if (item.packageType == 2) {
						// packageType!=2
						// 拼接散货图片
						var img_upc = item.upc.substr(0, item.upc.length - 2)
						var sh_img = '//i1.' + (isBeta ? 'beta.' : '') + 'ule.com' + '/app/yzg/onlinePay/home/i/sanhuo/' + img_upc + '.jpg';
						item.imageUrl = sh_img
					}
				if (option && option.itemTypeName) {
					item.itemTypeName = option.itemTypeName
				} else {
					if (goodInfo && goodInfo.itemTypeName) {
						item.itemTypeName = goodInfo.itemTypeName
					}

				}

				// item.qty = item.itemQty
				// item.unitName = res.sysUnitName
				dispatch(g1GoodInfo(res.item))
			} else {
				toast.info('操作失败！')
			}
		})
	}
}



