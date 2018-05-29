


import DrawerHead1 from '../DrawerHead1';
import {PadCalendar} from 'temps';
import {Icon} from 'antd';
import getTimeParams from '@/public/getTimeParams';
import Subscriber from 'core/Subscriber';
import drawer from 'core/drawer';
const arr1 = ['选择开始时间','选择结束时间'];
const arr2 = ['beginTime','endTime'];

export default class TimeSelect extends React.Component{
	
	constructor(props){
		super(props);
		let {beginTime,endTime,flag} = props.config || {};
		this.flag = flag;
		this.beginTime = beginTime;
		this.endTime = endTime;
		this.selectTime = [beginTime,endTime][flag];
	}
	//日期选择
	changeDate(text){
		this.selectTime = text;
		this.sure()
	}
	sure(){
		//确认事件
		let {selectTime,flag} = this;
		if(selectTime){
			drawer.pop();
			Subscriber.on(['BEGIN-TIME-SELECT','END-TIME-SELECT'][flag],selectTime);
		}else{
			toast.info('请' + arr1[flag])
		}
		
	}
	render(){
		let {flag,beginTime,endTime} = this;
		let dateParams = getTimeParams({beginTime,endTime,flag});
		return(
			<div className="choose-time-drawer select-time-drawer animated slideInRight">
				<DrawerHead1
					title={arr1[flag]} left={<Icon type="left" />}
				/>
				<div className="time-warp">
					<PadCalendar
						{...dateParams}
						changeDate={this.changeDate.bind(this)}
					/>
				</div>
				{/* <div className="ule-btn-group">
					<div className="ule-btn ule-btn-sure" onTouchTap={this.sure.bind(this)}>确定</div>
				</div> */}
			</div>
		)
	}
}

TimeSelect.propTypes = {
	beginTime : PropTypes.string,
	endTime : PropTypes.string,
	flag : PropTypes.number,
}