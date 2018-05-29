


export default class RrghtEmpty extends React.Component{
	
	render(){
		let {emptyFlag} = this.props;
		return(
			<div className="empty-box">
				<div>
					<div className={`empt-pic empt-pic-${emptyFlag}`}></div>
					{emptyFlag === 1 && <p><strong>您还没有用过我，当然也不会有订单哦</strong></p>}
				</div>
			</div>
		)
	}
	
}


RrghtEmpty.propTypes = {
	emptyFlag : PropTypes.number.isRequired
}