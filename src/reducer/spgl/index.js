


/**
 *  商品管理
 * */
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

//商品管理 商品查询筛选条件

let _defaultFilter = {
	itemTypeId: '',//	String	n	商品类型
	itemNameOrUpc: '',//	String	n	商品名称或upc
	itemQtyGt: '',//	String	n	qty>
	itemQtyLt: '',//	String	n	qty<
	timeFrame: '',//	String	n	时间范围
	usrOnlyId: '',//	String	y	用户唯一id
	villageNo: '',//	String	y	村油站编号
	pageNum: 1,//	String	y	页码
	pageSize: '20',//	String	y	分页大小
	itemQtyType: '',// String 库存数量比较（1大于2小于0等于）
	expirationId: '',//String 保质期（1将过期2已过期）
	itemQty: ''//String 库存数量
}


export function g1SearchGoodsFilter(state = _defaultFilter, { type, payload }) {
	switch (type) {
		case G1_FILTER_RESET:
			return { ..._defaultFilter, ...payload.filter };
		case G1_FILTER_ASSGIN:
			return { ...state, ...payload.filter }
		case G1_FILTER_NEXT:
			let { pageNum } = state;
			state.pageNum=Number(state.pageNum)
			state.pageNum+=1
			return { ...state}
		default:
			return state;
	}
}

let _defaultGoods = [];
//商品列表
export function g1Goods(state = _defaultGoods, { type, payload }) {
	switch (type) {
		case G1_RESET_ADD_GOODS:
			return [...payload.list];
		case G1_CONCAT_GOODS:
			return [...state, ...payload.list];
		default:
			return state;
	}
}

let _defaultClassifyList = [];
//左侧分类
export function g1GoodsNavMenu(state = _defaultClassifyList, { type, payload }) {
	switch (type) {
		case G1_RESET_CLASSIFY:
			return [...payload.list];
		default:
			return state;
	}
}


let _defaultShowGoodInfo = {show:false,curIndex:null};
//是否显示商品信息
export function g1ShowGoodInfo(state = _defaultShowGoodInfo, { type, payload }) {
	switch (type) {
		case G1_SHOW_GOODINFO:
			payload.curIndex = payload.curIndex || '0'
			return payload
		default:
			return state;
	}
}


let _defaultGoodInfo = {
	upc: '',           //商品编码
	itemName: '',      //商品名称
	itemTypeName: '',  //商品类型
	salePrice: '',     //商品销售价格
	purPrice: '',      //商品进货价格
	standart: '',     //商品规格
	unitName: '',     //商品单位
	qualityPeriod: '',//保质期
	qualityPeriodUnit: '',//保质期单位
	purNum: '',      //进货数量
	manufactureTime: '',//生产日期
	imageUrl: '',        //商品图片
	unitId: 0,          //商品唯一标识
	intFlag: ''         //小数点标记
}
//单个商品信息
export function g1GoodInfo(state = _defaultGoodInfo, { type, payload }) {
	switch (type) {
		case G1_GOOD_INFO:
			return { ..._defaultGoodInfo, ...payload.item }
		default:
			return state;
	}
}
//单个商品库存批次列表
let _defaultStockList = [];
export function g1GoodStockList(state = _defaultStockList, { type, payload }) {
	switch (type) {
		case G1_GET_STOCK_LIST:
			return [..._defaultStockList, ...payload.list]
		default:
			return state;
	}
}
// 批次是否加载完
let _defaultLoad={stockMax:false}
export function g1StockLoad(state = _defaultLoad, { type, payload }) {
	switch (type) {
		case G1_GET_STOCK_LOAD:
			return {...state,...payload}
		default:
			return state;
	}
}

