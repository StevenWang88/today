
import { Icon } from 'antd';

import OrderSearch from './OrderSearch';
import OrderListLayout from './OrderListLayout';
import uleHistory from 'core/uleHistory';
export default class LeftLayout extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = { noorder: true }
	}
	goBack() {
		this.context.router.history.goBack()
	}
	componentDidMount() {
		uleHistory.push({'name':'orderhome'})
		
	}
	componentWillUnmount(){
		uleHistory.pop()
	}
	render() {
		let { noorder } = this.state;
		return (
			<div className="left-layout sub-layout">
				<Title goBack={this.goBack.bind(this)} />
				<OrderSearch />
				<OrderListLayout />
			</div>
		)
	}
	
}

LeftLayout.contextTypes = {
	router: React.PropTypes.object.isRequired
};

class Title extends React.Component {
	render() {
		return (
			<div className="title order-title">
				<div className="back-icon" onTouchTap={() => { this.props.goBack() }}>
					<i className="ule-icon icon-left"></i>

				</div>
				<p>订单查询</p>
				
		    </div>
		)
	}
}