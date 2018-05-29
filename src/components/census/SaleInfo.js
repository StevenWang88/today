
import {Icon} from 'antd';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SELECT_TIME_TJ} from 'drawerTypes';
@connect(
	state=>({filterTime : state.cTimeFilter}),
)
export default class SaleInfo extends React.Component{
	
	constructor(props){
		super(props);
		
		this.state = {
			list : [
				{label : '销售额',value : '--',key : 'sumTotalPrice',unit :'￥'},
				{label : '销售商品数',value : '--',key : 'totalCount'},
				{label : '订单数',value : '--',key : 'saleNum'},
				{label : '利润额',value : '--',key : 'sumProfit'},
			],
			goods : [],//商品列表
			lift : 1,//商品排序升降条件 >0  大道小   <0  小到大
			sort : '',//被激活排序条件的 栏目   销售数量 1  销售额 2  利润额 3  默认不按照任何条件
		}
	}
	//请求数据
	requesTjList(props){
		let {beginTime,endTime,onlyTime} = props;
		let params = {beginTime : '',endTime : ''}
		if(beginTime && endTime){
			params.beginTime = beginTime;
			params.endTime = endTime;
		}
		if(onlyTime){
			params.beginTime = onlyTime;
			params.endTime = onlyTime;
		}
		//请求信息  汇总信息  列表信息
		Promise.all([apiMap.searchSaleOrderSummaryCountForPad.send(params),apiMap.searchSaleOrderItemForPad.send(params)]).then(result=>{
			let result1 =  result[0];
			let result2 =  result[1];
			//汇总信息
			let {list,sort,lift} = this.state;
			if(result1.returnCode === '0000'){
				let {saleNum,sumTotalPrice,sumProfit} = result1;
				list[0].value = sumTotalPrice;
				list[2].value = saleNum;
				list[3].value = sumProfit;
			}
			//列表信息
			if(result2.returnCode === '0000'){
				let {num,list : goods} = result2;
				list[1].value = num || 0;
				goods = this.formatGoods(goods.map((item,index)=>({...item,...{ids : index + 'id'}})),sort,lift)
				this.setState({goods})
			}
			this.setState({list});
		})
	}
	formatGoods(list,sort,lift){
		list = list || [];
		let sortArr = ['sale_num','total_price','sale_profit'];
		if(!list.length || !sort)return list;
		let sortName = sortArr[sort - 1];
		list.sort((n1,n2)=>(lift > 0 ? n2[sortName] - n1[sortName] : n1[sortName] - n2[sortName]))
		return list;
	}
	//排序  默认按照降序
	sortGoods(index){
		let {goods,lift,sort} = this.state;
		if(!goods.length)return;
		if(!sort){
			sort = index;
			lift = 1;
		}else{
			if(sort === index){
				lift = 0 - lift
			}else{
				sort = index;
				lift = 1;
			}
		}
		this.setState({
			sort,lift,goods: this.formatGoods(goods,sort,lift)
		})
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.filterTime !== this.props.filterTime){
			let {beginTime,endTime,onlyTime} = nextProps.filterTime;
			let {beginTime : beginTime2,endTime : endTime2,onlyTime : onlyTime2} = this.props.filterTime;
			if(beginTime !== beginTime2 || endTime !== endTime2 || onlyTime !==onlyTime2){
				this.requesTjList(nextProps.filterTime)
			}
		}
	}
	componentWillMount() {
		this.requesTjList(this.props.filterTime);
	}
	render(){
		let {list,goods,sort,lift} = this.state;
		return(
			<div>
				<div className="rect-fff sale-tj">
					{list.map(({label,value,unit},i)=>(
						<div key={i}>
							<span>{label}</span>
							<span className="number">{unit}{value}</span>
						</div>
					))}
				</div>
				
				<div className="rect-fff order-goods">
					<div className="row title">
						<div className="row-1 row-left">
							<span>商品名</span>
						</div>
						<div className={`row-100 r-20 ${sort === 1 ? 'cur' : ''} cur-${lift < 0 ? 'down' : 'up'}`}>
							<div className="sub-sort" onTouchTap={()=>this.sortGoods(1)}>
								<span>销售数量</span>
								<div className="arrow-box">
									<Icon type="up" />
									<Icon type="down" />
								</div>
							</div>
						</div>
						<div className={`row-100 ${sort === 2 ? 'cur' : ''} cur-${lift < 0  ? 'down' : 'up'}`}>
							<div className="sub-sort" onTouchTap={()=>this.sortGoods(2)}>
								<span>销售额</span>
								<div className="arrow-box">
									<Icon type="up" />
									<Icon type="down" />
								</div>
							</div>
						</div>
						<div className={`row-1 row-right ${sort === 3 ? 'cur' : ''} cur-${lift < 0  ? 'down' : 'up'}`}>
							<div className="sub-sort" onTouchTap={()=>this.sortGoods(3)}>
								<span>利润额</span>
								<div className="arrow-box">
									<Icon type="up" />
									<Icon type="down" />
								</div>
							</div>
						</div>
					</div>
					<div className="list">
						{goods.length > 0 ? goods.map(item=>{
							return (
								<div className="row" key={item.ids}>
									<span className="row-1 name number">{item.item_name}</span>
									<span className="row-100 r-20">{item.sale_num}</span>
									<span className="row-100">&yen;{item.total_price}</span>
									<span className="row-1 row-right number">&yen;{item.sale_profit}</span>
								</div>
							)
						}) : (
							<div className="row empty-row">
								您还没开始经营，暂无数据
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}


}