

import RrghtEmpty from './RrghtEmpty';
import OrderInfo from './OrderInfo';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as orderActions from 'action/order';
@connect(
	state => ({ ...state.getSelectedRand }),
	dispatch => ({...bindActionCreators({...orderActions}, dispatch)})
)
export default class RightLayout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isEmpty: true,
			emptyFlag: 2
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.rand) {
			this.setState({ isEmpty: false });
		} else {
			this.setState({ isEmpty: true });
		}
	}

	render() {
		let { isEmpty, emptyFlag } = this.state;
		let [RAND_ID, SALE_TYPE, PAY_TYPE,CUSTOMER_ID, rand] = ['', '', '','', this.props.rand]
		if(rand)
		{
			RAND_ID = rand.RAND_ID
			SALE_TYPE = rand.SALE_TYPE
			PAY_TYPE = rand.PAY_TYPE
			CUSTOMER_ID=rand.CUSTOMER_ID
		}
	
		return (
			<div className="right-layout sub-layout">
				{isEmpty && !RAND_ID ? <RrghtEmpty {...{ emptyFlag }} /> : <OrderInfo customerId={CUSTOMER_ID}  refreshOrderList={this.props.sendListRequest} randId={RAND_ID} saleType={SALE_TYPE} payType={PAY_TYPE} />}
			</div>
		)
	}
}