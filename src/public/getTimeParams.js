

export default function getTimeParams({beginTime,endTime,flag},space=30) {
	let min = moment('2000-01-01');
	let max = moment();
	
	let isBeginTime = flag === 0;
	let curDay = isBeginTime ? beginTime : endTime;
	let preDay = isBeginTime ? endTime : beginTime;
	
	
	//如果是选择开始时间
	if(isBeginTime){
		if(endTime){//如果有结束时间  那么最大时间就是结束时间
			max = moment(endTime);
			let min2 = moment(endTime).subtract(space, 'day');
			min = min.diff(min2) > 0 ? min : min2;
		}
	}else{
		//如果是选择结束时间
		if(beginTime){
			min = moment(beginTime);
			let max2 =  moment(beginTime).add(space, 'day');
			max = max.diff(max2) > 0 ? max2 : max;
		}
	}
	
	return {
		min : min.format('YYYY-MM-DD'),//最大时间
		max : max.format('YYYY-MM-DD'),//最小时间
		curDay,//当前选择的时间
		preDay,//前一次选择的时间
	}
}