/*
* 订单列表
* */
import moment from "moment";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as orderActions from "action/order";
import PullRefresh from 'reactjs-pull-refresh';
@connect(
	state=>({isMax:state.searchPageFilter.isMAX,...state.getSelectedRand}),
	dispatch=>({...bindActionCreators({...orderActions},dispatch)})
)
export default class OrderList extends React.Component{
	constructor(props){
		super(props);
		this.state = {data:[],activeRandId:''}
	}

	showDate(datestr){
		let date = moment(datestr,"YYYY-M-D H:m:s");
		let lastDayStr = date.format("YYYY年MM月DD日 星期") + "日一二三四五六".substr(date.day(),1);
		if(this.lastDayStr!==lastDayStr){
			this.lastDayStr=lastDayStr;
			return <p className="time">{this.lastDayStr}</p>
		}
		return false;
	}

	showTime(datestr){
		let date = moment(datestr,"YYYY-M-D H:m:s");
		return date.format("HH:mm");
	}

	selectAOrder(item,e){
		let {list}=this.props
		let {activeRandId}=this.state
		if(list&&list.length>1){
			this.props.setRand({rand:''});
			let randId = e.currentTarget.getAttribute("data-rand-id");
			let saleType = e.currentTarget.getAttribute("data-sale-type");
			let payType = e.currentTarget.getAttribute("data-pay-type");
			// if(activeRandId!=item.RAND_ID){
			this.setState({activeRandId:item.RAND_ID});
			this.props.setRand({rand:item});
			// }
		}
		
	}
	loadMoreAction(){
		return this.props.sendListRequest({ type: 'next' })
	}
	refreshAction = () => {
		return this.props.sendListRequest({ type: 'reset' })
	};

	componentWillReceiveProps(nextProps){
		this.lastDayStr=''
		let rand=nextProps.rand
		this.setState({activeRandId:rand.RAND_ID});
	}
	render(){
		var {list,isMax} = this.props;
		console.log('isMax',isMax)
		var {activeRandId } = this.state;
		const sorollprops = {
			maxAmplitude: 80,
			debounceTime: 30,
			throttleTime: 100,
			deceleration: 0.001,
			refreshCallback: this.refreshAction,
			loadMoreCallback: this.loadMoreAction.bind(this),
			hasMore: !isMax,
		};
		return(
			<div className="order-list-warp">
			<PullRefresh {...sorollprops} >
				<ul>
					{list.map(item=>(
					<li ref="orderLi" data-rand-id={item.RAND_ID} data-sale-type={item.SALE_TYPE} data-pay-type={item.PAY_TYPE} key={item.RAND_ID} onTouchTap={this.selectAOrder.bind(this,item)}>
						{this.showDate(item.SALE_TIME)}
						<div className={`time-order-item ${activeRandId===item.RAND_ID?'cur':''}`}>
							<div className="order-item-body">
								<p className="order-time">
									<strong className="number">&yen;{item.salePrice.toFixed(2)}</strong>
									<span className="number">{this.showTime(item.SALE_TIME)}</span>
								</p>
								<p className="order-code">
									<span className={`number order-id`}>{item.RAND_ID}</span>
									{(item.SALE_TYPE==2)?(
										<span className="time-order-status">退</span>
									):false}
								</p>
							</div>
						</div>
					</li>
					))}
					
				</ul>
				</PullRefresh>
			</div>
		)
	}
}

