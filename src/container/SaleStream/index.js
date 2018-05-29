import CzColumn from 'temp/sale/CzColumn';
import D3LineChart from 'temp/sale/D3LineChart';
import TopModule from 'temp/sale/TopModule';
import PullRefresh from 'reactjs-pull-refresh';
import './index.scss';
export default class SaleStream extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			hasMore: false
		};
	}

	refreshCallback = () => {
		return new Promise((resolve, reject) => {
		  setTimeout(() => {
			let result = false;
			if (Math.random() > 0.2) {
			  result = true;
			}
			if (result) {
				resolve();
			} else {
			  reject();
			}
		  }, 500);
		}).then(() => {
			this.setState({ hasMore: true })
		}, (error) => {
			this.setState({ hasMore: true })
		  // Promise.error(error);
		});
	  };

	render(){
		let { hasMore } = this.state;

		const sorollprops = {
			maxAmplitude: 60,
			debounceTime: 30,
			throttleTime: 100,
			deceleration: 0.001,
			refreshCallback: this.refreshCallback,
			hasMore:false
		};

		return(
			<div className="sale-statistics-page full-page" id="saleStatisticsPage">
				<PullRefresh {...sorollprops}>
					<TopModule fresh={hasMore}/>
					<CzColumn/>
					<D3LineChart fresh={hasMore}/>
				</PullRefresh>
			</div>
		)
	}
}
