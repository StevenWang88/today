
import {Link} from 'react-router-dom';

export default class CzColumn extends React.Component{
	render(){
		return(
			<div className="cz-column">
				
				<div className="cz-sub">
					<Link to="/orderhome">
						<span className="ule-icon search-icon"></span>
						<strong>订单查询</strong>
					</Link>
				</div>
				
				<div className="cz-sub">
					<Link to="/censushome" >
						<span className="ule-icon sale-tj-icon"></span>
						<strong>销售统计</strong>
					</Link>
				</div>
				
				
			</div>
		)
	}
}