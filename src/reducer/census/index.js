/*
* 销售统计
* **/

import {
	C1_TIME_CHOOSE
} from 'types';

//统计查询时间范围值
let _defaultTime = {
	beginTime : '',
	endTime : '',
	onlyTime :'',
}

export function cTimeFilter(state = _defaultTime,{type,payload}) {
	switch (type){
		case C1_TIME_CHOOSE :
			return {..._defaultTime,...payload}
		default:
			return state;
	}
}