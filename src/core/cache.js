/*
*  内容缓存
* */

//开始时间  结束时间存放处
let _startAndEnd = {
	beginTime : '',
	endTime : '',
	payType : 0,
}


export default {
	
	get startAndEnd(){
		return _startAndEnd || {};
	},
	set startAndEnd(newVal){
		_startAndEnd = newVal;
	},




	clear(){
		_startAndEnd = null;
	}

}