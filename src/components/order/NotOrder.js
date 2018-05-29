

export default class NotOrder extends React.Component{
	render(){
		let list1 = [
			'您还没开始经营',
			'没用订单哦'
		]
		let list2 = [
			'请输入订单编号，如没有',
			'您还可以通过筛选查找'
		]
		return(
			<div className="not-order-list">
				<div>
					{list2.map((item,index)=><p key={index}>{item}</p>)}
				</div>
			</div>
		)
	}
}