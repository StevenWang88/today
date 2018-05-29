
import LeftLayout from 'temp/order/LeftLayout';
import RightLayout from 'temp/order/RightLayout';

import './index.scss';
import '../scss/order.scss';

export default class Order extends React.Component{
	
	render(){
		
		return(
			<div className="order-page full-page pad-mian">
				<LeftLayout/>
				<RightLayout/>
			</div>
		)
	}
}