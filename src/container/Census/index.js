

import Head from 'temp/census/Head';
import SaleInfo from 'temp/census/SaleInfo';
import './index.scss';

export default class Census extends React.Component{
	
	constructor(props, context) {
		super(props, context);
	}
	goBack(){
		console.log("返回")
		this.context.router.history.goBack()
	}
	render(){
		return(
			<div className="census-page full-page">
				<Head goBack={this.goBack.bind(this)}/>
				<SaleInfo/>
			</div>
		)
	}
}
Census.contextTypes = {
	router: React.PropTypes.object.isRequired
};