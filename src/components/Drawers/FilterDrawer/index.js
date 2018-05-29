
import DrawerHead1 from '../DrawerHead1';
import {Icon} from 'antd';
import Subscriber from 'core/Subscriber';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as orderActions from 'action/order';
import cache from 'core/cache';
import drawer from 'core/drawer';
import {STARTANDEND_TIME,CHOOSE_SEARCG_FILTER} from 'drawerTypes';


@connect(
	state=>({info : state.searchPageFilter}),
	dispatch => ({...bindActionCreators({...orderActions},dispatch)})
)
export default class FilterDrawer extends React.Component{
	
	constructor(props){
		super(props)
		let {info} = props;
		let {beginTime,endTime,payType} = info;
		this.state = {
			beginTime : beginTime,
			endTime : endTime,
			payType : payType
		}
	}
	//选择开始时间  或者是结束时间
	selectTime(flag){
		let {beginTime,endTime} = this.state;
		drawer.push({
			box : STARTANDEND_TIME,
			config : {
				beginTime,endTime,flag
			}
		})
		Subscriber.once(['BEGIN-TIME-SELECT','END-TIME-SELECT'][flag],(time)=>{
			this.setState({
				[['beginTime','endTime'][flag]] : time
			})
		})
	}

	selectPayType(flag){
		this.setState({payType:flag});
	}

	reset(){
		this.setState({
			beginTime:null,
			endTime:null,
			payType:null
		});
	}

	enter(){
		let {beginTime,endTime,payType} = this.state;
		this.props.switchFilter({
			beginTime,endTime,payType
		})
		this.props.sendListRequest({type:"reset"});
		drawer.pop();
	}
	render(){
		let {beginTime,endTime,payType} = this.state;
		return(
			<div className="filter-drawer">
				<DrawerHead1 title="筛选"/>
				<div className="filter-warp">
					<p className="btn-title">订单时间段</p>
					<div className="cell">
						<div className="cell-line" onTouchTap={()=>{this.selectTime(0)}}>
							<span>{beginTime || '请选择开始时间'}</span>
							<Icon type="right" />
						</div>
						<div className="cell-line" onTouchTap={()=>{this.selectTime(1)}}>
							<span>{endTime || '请选择结束时间'}</span>
							<Icon type="right" />
						</div>
						<p className="cell-tips">时间段跨度最多仅能为30天</p>
					</div>
					<p className="btn-title">支付方式</p>
					<div className="ule-btn-group ule-btn-group-2">
						<div className={`ule-btn ule-btn-default ${(payType==0)?'cur':''}`} onTouchTap={()=>{this.selectPayType(0)}}>
							现金
						</div>
						<div className={`ule-btn ule-btn-default ${payType==1?'cur':''}`} onTouchTap={()=>{this.selectPayType(1)}}>
							扫码付
						</div>
					</div>
				</div>
				
				<div className="footer">
					<div className="ule-btn-group ule-btn-group-2">
						<div className="ule-btn ule-btn-reset font-btn" onTouchTap={this.reset.bind(this)}>
							重置
						</div>
						<div className="ule-btn ule-btn-sure font-btn" onTouchTap={this.enter.bind(this)}>
							确认
						</div>
					</div>
				</div>
			</div>
		)
	}
}

