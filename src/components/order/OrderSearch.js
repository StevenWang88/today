/*
* 订单搜索盒子
* **/
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as orderActions from "action/order";
import { CHOOSE_SEARCG_FILTER } from 'drawerTypes';
import drawer from 'core/drawer';
import uleCheck from 'core/uleCheck';
class OrderSearch extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			isFocus: false,
		}
		this.prevGodds = null;//前一个过滤条件
		this.prevFilter = null;//后一个过滤条件
	}
	//显示选择抽屉
	showDrawer() {
		drawer.push({
			box: CHOOSE_SEARCG_FILTER
		})
	}
	//输入框聚焦失焦事件
	changeFcous(isFocus) {
		let { randId } = this.props
		if (!isFocus && randId && randId.length > 0) {
			return;
		}
		this.setState({ isFocus })

		if (!isFocus) return;
		let { store } = this.context;
		let state = store.getState();
		this.prevGodds = state.searchPageList;
		this.prevFilter = state.searchPageFilter;

	}
	//输入框输入事件
	inputChange(e) {
		let inputBox = e.currentTarget;
	   let aId=uleCheck.orderId(inputBox.value)
		if(aId){
		this.props.switchFilter({ randId: inputBox.value });
		}else{
			toast.info("请输入0到25位纯数字的订单号！")
		}
	}
	searchTextChange(e) {
		let { randId } = this.props
		// 验证订单号0到25位订单号
		 let isChecked= uleCheck.orderId(randId)
		 if(isChecked){
			this.props.sendListRequest({ type: "reset" });
		 }else{
			toast.info("请输入0到25位纯数字的订单号！")
		 }
	}

	clearText() {
		this.props.switchFilter({ randId: '' });
		this.props.sendListRequest({ type: "reset" });
		this.setState({ isFocus: false });
	}

	render() {
		let { isFocus} = this.state;
		// log('进来了啊啊啊啊')
		// className="ule-icon term-icon"
		let { randId,searchPageFilter } = this.props;
		let {beginTime,endTime,payType}=searchPageFilter
		return (
			<div className={`search-box ${isFocus ? 'focus' : ''}`}>
				<div className="search-icon" onTouchTap={this.searchTextChange.bind(this)}>
					<Icon style={{ color: '#aaaaaa', fontWeight: 'bold', fontSize: '18px' }} type="search" />
				</div>
				<div className="input-box">
					<div className="from-warp">
						<input
							onFocus={() => this.changeFcous(true)}
							onBlur={() => this.changeFcous(false)}
							onInput={this.inputChange.bind(this)}
							placeholder="输入完整订单号"
							type="tel"
							value={randId} //这个要和onChange一起用
						/>
						<div className="clear-input" onTouchTap={this.clearText.bind(this)}>
							<i className="ule-icon clean-icon"></i>
						</div>
					</div>
				</div>
				<div className="search-term" onTouchTap={this.showDrawer.bind(this)}>
					<i  className={`ule-icon ${(beginTime||endTime||payType!=null) ? 'term-icon2' : 'term-icon'}`}></i>

				</div>
			</div>
		)
	}
}
export default connect(
	state => ({ randId: state.searchPageFilter.randId,searchPageFilter:state.searchPageFilter }),
	dispatch => ({ ...bindActionCreators({ ...orderActions }, dispatch) })
)(OrderSearch)
OrderSearch.contextTypes = {
	store: PropTypes.object
}