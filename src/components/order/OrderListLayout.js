/*
* 商品列表模块  包括空状态和有数据的时候
* */

import NotOrder from './NotOrder';
import OrderList from './OrderList';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as orderActions from 'action/order';
@connect(
	state => ({list :　state.searchPageList}),
	dispatch => ({...bindActionCreators({...orderActions},dispatch)})
)
export default class OrderListLayout extends React.Component{
	
	componentWillMount() {
		let {list,sendListRequest} = this.props;
		// if(!list.length){
			sendListRequest({type:'reset'});
		// }

	}
	render(){
		let {list} = this.props;
		return(
			<div className="left-slide">
				{
					list.length > 0 ?
					<OrderList list={list}/> :
					<NotOrder/>
				}
			</div>
		)
	}
}