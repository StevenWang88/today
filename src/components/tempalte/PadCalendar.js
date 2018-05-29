
/*
* *pad 日历公用插件    依赖moment.js
*
*
* */




import {Icon} from 'antd';

export default class PadCalendar extends React.Component{
	constructor(props){
		super(props);
		this.currentDate = moment(props.curDay || props.preDay || undefined);//当前时间
		this.activeDay = props.curDay || '';//当前激活的时间
		this.state = {
			viewDayList : [],
			titleTime : ''
		}
	}
	
	//获取本月的第一天
	_getFirstDay(d){
		let date = moment(d);
		date._d.setDate(1);
		return date;
	}
	//获取本月的第最后一天
	_getLastDay(d){
		let date = moment(d);
		date._d.setDate(1);
		date.add(1, 'months');
		date._d.setDate(0);
		return date;
	}
	//获取视图间隔天数
	_getViewSpaceDay(){
		let date = moment(this.currentDate);
		let firstDay = this._getFirstDay(date).isoWeekday(1);
		let lastDay = this._getLastDay(date);
		lastDay.weekday() && lastDay.weekday(7);
		return {
			firstDay,
			lastDay,
			curMouth : date.month()
		}
	}
	//跟新视图天数依赖的天数列表
	reloadViewDayList(){
		let spaceDay = this._getViewSpaceDay();
		let _this = this;
		let {firstDay,lastDay,curMouth} = spaceDay;
		
		let viewDayList = [];
		function pushDay() {
			let text = firstDay.format('YYYY-MM-DD');
			viewDayList.push({...firstDay.toObject(),...{
				isCurMouth : curMouth === firstDay.month(),
				text,
				active : _this.activeDay ? (_this.activeDay === text) : false,
				..._this.otherConfig(text)
			}})
		}
		pushDay();
		while (firstDay.format('YYYY-MM-DD') !== lastDay.format('YYYY-MM-DD')){
			firstDay.add(1,'days');
			pushDay();
		}
		this.setState({
			viewDayList,
			titleTime : this.currentDate.format('YYYY 年 MM 月')
		})
	}
	//配置
	otherConfig(date){
		let configObj = {};
		let {preDay,max,min} = this.props;
		let curDay = moment(date);
		//如果时间限制有的话
		if(max || min){
			let prevValidDay = moment(min || undefined),
				nextValidDay = moment(max || undefined);
			
			let disabledPrevDay = curDay.diff(prevValidDay) < 0;//是否比最小的还要小
			let disabledNextDay = curDay.diff(nextValidDay) > 0;//是否比最大的还要大
			
			if(max){
				configObj.disabled = disabledNextDay;
			}
			if(min){
				configObj.disabled = max && disabledNextDay || disabledPrevDay
			}
		}
		
		
		configObj.prevCurDay = preDay === date;
		return configObj;
	}
	//设置年月
	setTime(n,type){
		this.currentDate.add(n,type)
		this.reloadViewDayList();
	}

	//日期点击事件
	dayTouch(ids){
		let {viewDayList} = this.state;
		let item = viewDayList[ids];
		let {changeDate} = this.props;
		let {disabled,startActive,active} = item;
		if(disabled || startActive)return;
		this.activeDay = item.text;
		this.setState({
			viewDayList : viewDayList.map((item,index)=>({
				...item, ...{active : ids === index ? !item.active : false}
			}))
		})
		changeDate && changeDate(active ? '' : item.text);
	}
	componentWillMount() {
		this.reloadViewDayList();
	}
	render(){
		const {weekList} = this.props;//星期头部
		let {viewDayList,titleTime} = this.state;
		return(
			<div className="time-container">
				<header>
					<span onTouchTap={()=>{this.setTime(-1,'years')}}><Icon type="double-left"/></span>
					<span className="w40"></span>
					<span onTouchTap={()=>{this.setTime(-1,'months')}}><Icon type="left" /></span>
					<span className="time-text">{titleTime}</span>
					<span onTouchTap={()=>{this.setTime(1,'months')}}><Icon type="right" /></span>
					<span className="w40"></span>
					<span onTouchTap={()=>{this.setTime(1,'years')}}><Icon type="double-right" /></span>
				</header>
				<ol className="week-rect">
					{weekList.map((text,i)=>(<li key={i}>{text}</li>))}
				</ol>
				
				<ul className="day-rect">
					{viewDayList.map((item,index)=>{
						return (
							<li key={index}
							    className={`${item.active ? 'active' : ''} ${item.disabled ? 'disabled' : ''} ${item.prevCurDay ? 'prev-cur-day' : ''}`}>
								{item.isCurMouth ?
									<div className="day-item"
								        onTouchTap={()=>{this.dayTouch(index)}}>
									<span className="number">{item.date}</span>
									</div> : false}
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}
//默认属性
PadCalendar.defaultProps = {
	weekList : ['周一','周二','周三','周四','周五','周六','周日'],
	startDay : '',//默认是没有开始时间的,
}
//属性校验
PadCalendar.propTypes = {
	weekList : PropTypes.array,
	preDay : PropTypes.string,//前一个被选中的时间
	curDay : PropTypes.string,//当前被选中的时间
	max : PropTypes.string,//最大时间限制
	min : PropTypes.string,//最小时间限制
	changeDate : PropTypes.func,//选择时间回调
}