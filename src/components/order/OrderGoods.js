


export default class OrderGoods extends React.Component{
	render(){
		return(
			<div className="order-goods rect-fff">
				<div className="row title">
					<span className="row-1 row-left">商品名</span>
					<span className="row-1 row-left">商品条码</span>
					<span className="row-100">销售单价</span>
					<span className="row-100">数量</span>
					<span className="row-100">销售额</span>
					<span className="row-100 row-right">操作</span>
				</div>
				<div className="list">
					{this.props.children}
				</div>
			</div>
		)
	}
}