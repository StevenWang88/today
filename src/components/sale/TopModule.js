
import {LeftMenuIcon} from 'temps';

export default class TopModule extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			eye : 'open',
			saleOrderStatistic: {},
			currentStatisticPeriod:'today',
			list : []
		}
		this.fresh = this.props.fresh;
	}

	componentDidMount(){
		this.loadSaleOrderSummaryCount();
	}

	componentWillReceiveProps(nextProps) {
		let { currentStatisticPeriod } = this.state;
		if(nextProps.fresh) {
			if(currentStatisticPeriod == "today") {
				this.todayButtonTouched();
			}else if(currentStatisticPeriod == "yesterday") {
				this.yesterdayButtonTouched();
			}else{
				this.thisMonthButtonTouched();
			}
		}
	}

	loadSaleOrderSummaryCount(beginTime='',endTime=''){
		apiMap["searchSaleOrderSummaryCountForPad"].send({beginTime,endTime}).then(json=>{
			this.setState(({saleOrderStatistic})=>({saleOrderStatistic:json}));
		});
	}

	eyeChange(){
		this.setState(({eye})=>({eye : eye === 'open' ? 'close' : 'open'}));
	}

	todayButtonTouched(){
		this.setState(({currentStatisticPeriod})=>({currentStatisticPeriod:'today'}));
		let now = new Date();
		let beginTime = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
		this.loadSaleOrderSummaryCount(beginTime,beginTime);
	}

	yesterdayButtonTouched(){
		this.setState(({currentStatisticPeriod})=>({currentStatisticPeriod:'yesterday'}));
		let now = new Date();
		let yesterday = new Date(now.getFullYear(),now.getMonth(),now.getDate()-1);
		let beginTime = yesterday.getFullYear()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getDate();
		this.loadSaleOrderSummaryCount(beginTime,beginTime);
	}

	thisMonthButtonTouched(){
		this.setState(({currentStatisticPeriod})=>({currentStatisticPeriod:'thisMonth'}));
		let now = new Date();
		let beginTime = now.getFullYear()+"-"+(now.getMonth()+1)+"-1";
		let endTime = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
		this.loadSaleOrderSummaryCount(beginTime,endTime);
	}
	RNDRAWER(){
		log('进来的啊');
		try{
			Yzg.exec('drawer')
		}catch (e){
		}
	}
	
	render(){
		let { fresh } = this.props;
		let {saleOrderStatistic,currentStatisticPeriod,eye} = this.state;
		return(
			<div className="top-module">
				<h1 className="top top-sub">
					<LeftMenuIcon iClick={this.RNDRAWER}/>
					<div className="title">
						销售统计
					</div>
					<div className="flex-center ule-flex ule-eye"  onTouchTap={this.eyeChange.bind(this)}>
					<span className={`ule-icon eye eye-icon-${eye === 'open' ? 1 : 2}`}></span>
					</div>
				</h1>
				<div className="top-middle top-sub">
					<div>
						<p className="key">销售额（元）</p>
						<p className="value number">
							{eye === 'close' ? '----' : saleOrderStatistic.sumTotalPrice}
						</p>
					</div>
					<div>
						<p className="key">利润额（元）</p>
						<p className="value number">
							{eye === 'close' ? '----' : saleOrderStatistic.sumProfit}
						</p>
					</div>
					<div>
						<p className="key">订单数</p>
						<p className="value number">
							{eye === 'close' ? '----' : saleOrderStatistic.saleNum}
						</p>
					</div>
				</div>
				<div className="top-bottom top-sub">
					<div>
						<div className={`sub-item ${currentStatisticPeriod=='today'?'cur':''}`} onTouchTap={this.todayButtonTouched.bind(this)}>
							<span className="des">今日</span>
							<span className="line"></span>
						</div>
						<div className={`sub-item ${currentStatisticPeriod=='yesterday'?'cur':''}`} onTouchTap={this.yesterdayButtonTouched.bind(this)}>
							<span className="des">昨日</span>
							<span className="line"></span>
						</div>
						<div className={`sub-item ${currentStatisticPeriod=='thisMonth'?'cur':''}`} onTouchTap={this.thisMonthButtonTouched.bind(this)}>
							<span className="des">本月</span>
							<span className="line"></span>
						</div>
					</div>
				</div>
			</div>
		)
	}
}