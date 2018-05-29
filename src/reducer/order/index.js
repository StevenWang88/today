/*
*
*搜索页面的 reducer
* */
import {
	CHANGE_SEARCH_FILTER,ADD_SEARCH_LIST,REAET_SEARCH_LIST,CLEASE_SEARCH_LIST,
	RESET_SEARCH_FILTER,ADDINDEX_SEARCH_FILTER,SWITCH_SEARCH_FILTER,SET_RAND
} from 'types';

let _SearchFilterState = {
	randId:'',//流水号
	beginTime : '',//开始时间
	endTime : '',//结束时间
	firstResult : 1,//默认是1
	maxResults : 10,//默认条是20
	payType : null,//  支付类型  1微信 2支付宝 3邮储 0现金
	isMAX : false,//是否已经到头了
}
//搜索过滤条件
export function searchPageFilter(state = _SearchFilterState,{type,payload}) {
	switch (type){
		case CHANGE_SEARCH_FILTER :
			return {...state,...payload};
		case SWITCH_SEARCH_FILTER ://切换搜索条件 吧之前的重置  在加新的
			return {..._SearchFilterState,...payload};
		case RESET_SEARCH_FILTER ://重置搜索条件
			return _SearchFilterState;
		case ADDINDEX_SEARCH_FILTER ://加载下一页
			let {firstResult} = state;
			return {...state,...{firstResult : ++firstResult}};
		default :
			return state;
	}
}


let _SearchListState = [];//商品搜索列表

export function searchPageList(state = _SearchListState,{type,payload}) {
	switch (type){
		case ADD_SEARCH_LIST ://清除重复的单号
			let list = [...state];
			(payload.list||[]).forEach(function(element) {
				let founded = false;
				list.forEach(ele2=>{
					if(ele2.RAND_ID==element.RAND_ID) {
						founded = true;
					}
				});

				if(!founded) list.push(element);
			});
			return list;
		case REAET_SEARCH_LIST :
			return [...payload.list];
		case CLEASE_SEARCH_LIST:
			return [];
		default :
			return state;
	}
}

//将左侧选中的流水号传到
export function getSelectedRand(state = {},{type,payload}){
	switch(type){
		case SET_RAND:
			return {...payload};
		default:
			return state;
	}
}