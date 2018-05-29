import {PropTypes} from 'react';
import {connect} from 'react-redux';
import {SELECT_TIME_TJ} from 'drawerTypes';
import drawer from 'core/drawer';
import uleHistory from 'core/uleHistory';
@connect(
	state=>({filterTime : state.cTimeFilter})
)
export default class Head extends React.PureComponent{
	static propTypes = {
		filterTime : PropTypes.object
	}
	
	constructor(props){
		super(props);
	}
	componentDidMount() {
		uleHistory.push({'name':'cenhome'})
	}
	componentWillUnmount(){
		uleHistory.pop()
	}
	selectTime(){
		drawer.push({
			box : SELECT_TIME_TJ
		})
	}
	//获取显示日期格式
	getShowTimeText(){
		let text = '';
		let _d = moment(),
			today = _d.format('YYYY-MM-DD');
		let {beginTime,endTime,onlyTime} = this.props.filterTime;
         if(!beginTime&&!endTime&&!onlyTime){
			text = `今日 ${_d.format('MM月DD日')}`
		 }
		if(onlyTime){
			if(onlyTime === today){
				text = `今日 ${_d.format('MM月DD日')}`
			}else{
				text = `${moment(onlyTime).format('YYYY年MM月DD日')}`
			}
		}else{
			if(beginTime && endTime){
				text = `${moment(beginTime).format('YYYY年MM月DD日')} - ${moment(endTime).format('YYYY年MM月DD日')}`
			}
		}
		return text;
	}
	render(){
		let showTime = this.getShowTimeText();
		let {goBack}=this.props
		return(
			<div className="census-top">
				<h1 className="page-title">
			<i className="ule-icon icon-left"   onTouchTap={() => { this.props.goBack() }}></i>
					<span className="title">销售统计</span>
				</h1>
				<div className="rect-fff">
					<div className="row time-select" onTouchTap={this.selectTime.bind(this)}>
						<span>选择时间</span>{showTime && <span>&nbsp; ( {showTime} ) </span>}
					</div>
				</div>
			</div>
		)
	}
	
}