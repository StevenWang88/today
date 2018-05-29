import {
	HashRouter,
	Router,
	Route
} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

import createComponent from './Bundle';
import SaleStream from 'bundle-loader?lazy&name=SaleStream!../container/SaleStream';//销售
import Order from 'bundle-loader?lazy&name=Order!../container/Order';//订单查询
import Census from 'bundle-loader?lazy&name=Census!../container/Census';//销售统计
import Spgl from 'bundle-loader?lazy&name=Spgl!../container/Spgl';//商品管理
import Test from 'bundle-loader?lazy&name=Test!../container/Test/index';//测试

export default class App extends React.Component{
	render(){
		return(
			<HashRouter >
				<Router  history={history} baseName="/">
					<div className="root-box">
						<Route path="/salehome" component={createComponent(SaleStream)}></Route>
						<Route path="/orderhome" component={createComponent(Order)}></Route>
						<Route path="/censushome" component={createComponent(Census)}></Route>
						<Route path="/spglhome" component={createComponent(Spgl)}></Route>
						<Route path="/test" component={createComponent(Test)}></Route>
					</div>
				</Router>
			</HashRouter>
		)
	}
}