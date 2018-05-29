const d3 = require('d3');
import uleHistory from 'core/uleHistory';
import { Popover, Icon } from 'antd';

const _duration = 400;
const maxYlen = 6;
let lowX = 0
let bigX = 0
let Boxw = 80
let Boxh = 40
let seleType = ''
export default class D3LineChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			sevenDayList: [
				{ name: '七日销售额变化', cur: true },
				{ name: '七日利润额变化', cur: false },
				{ name: '七日订单数变化', cur: false }
			],
			visible: false,
		}
		this.$rootDom = null;

		this.d3 = {
			svg: null,
			xScale: null,
			yScale: null,
			yAxis: null,
			yBar: null,
			yInner: null,
			yInnerBar: null,
			line: null,
			path: null,
			$circle: null,
			$circle2: null,
			initialize: false,//初始化
		}

		this.d3list = [
			{ x: 100, y: '星期一' },
			{ x: 200, y: '星期二' },
			{ x: 160, y: '星期三' },
			{ x: 600, y: '星期四' },
			{ x: 480, y: '星期五' },
			{ x: 240, y: '星期六' },
			{ x: 350, y: '星期日' },
		]
		this.d3Type = 0; //0 代表 七日销售额变化  1 七日利润额变化  2 七日订单数变化  //默认是0
	}
	initD3(list) {
		this.getLow(list)
		//sumProfit//利润额
		//sumTotalPrice//销售额
		//saleNum //订单数
		let vis = d3.select("#lineCharts"),
			w = document.body.clientWidth,
			h = this.$rootDom.offsetHeight,
			margins = {
				t: 30,
				r: 20,
				b: 80,
				l: 120
			};

		this.d3.svg = vis.append('g')
			.attr('class', 'content')
			.attr('transform', 'translate(' + margins.l + ',' + margins.t + ')');
		// 定义x轴的比例尺(序数比例尺)
		this.d3.xScale = d3.scale.ordinal()
			.domain(list.map(({ y }) => y))
			.rangeRoundBands([0, w - margins.l - margins.r], 0, 0);
		this.d3.yScale = d3.scale.linear()
			.domain([lowX, bigX])
			.range([h - margins.b, margins.t]);
		this.d3.xAxis = d3.svg.axis()
			.scale(this.d3.xScale)
			.orient('bottom')
			.outerTickSize(0)
		this.d3.yAxis = d3.svg.axis()
			.scale(this.d3.yScale)
			.orient('left')
			.tickFormat((val) => {
				if (seleType == "saleNum") return val;
				else {
					return '￥' + val
				}
			})
			.outerTickSize(0)
			.tickPadding(10)
			.ticks(Math.min(maxYlen, list.length))
		this.d3.svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (h - margins.b) + ')')
			.call(this.d3.xAxis)
		this.d3.yBar = this.d3.svg.append('g')
			.attr('class', 'y axis')
			.call(this.d3.yAxis)
		//定义纵轴网格线
		this.d3.yInner = d3.svg.axis()
			.scale(this.d3.yScale)
			.tickSize([w - margins.l - margins.r])
			.tickFormat('')
			.ticks(Math.min(maxYlen, list.length))
			.orient('right')
		//添加纵轴网格线
		this.d3.yInnerBar = this.d3.svg.append("g")
			.attr({
				'class': 'inner_line',
				'transform': 'translate(' + 0 + ',0)'
			})
			.call(this.d3.yInner);
		this.d3.line = d3.svg.line()
			.x(({ y }) => this.d3.xScale(y) + this.d3.xScale.rangeBand() / 2)
			.y(({ x }) => this.d3.yScale(x))
		this.d3.path = this.d3.svg.append("path")
			.attr("d", this.d3.line(list))
			.style({
				'fill': 'none',
				'stroke-width': 4,
				'stroke': '#e02b2b',
				'stroke-opacity': 0.9
			})

		this.d3.$circle2 = this.d3.svg.selectAll('.circle-big')
			.data(list)
			.enter()
			.append('circle')
			.attr('class', 'circle-big')
			.attr({
				'cx': ({ y }) => (this.d3.xScale(y) + this.d3.xScale.rangeBand() / 2),
				'cy': ({ x }) => (this.d3.yScale(x)),
				'r': 50,
				'fill': '#fff',
				'stroke-width': 30,
				'stroke': 'block',
				'stroke-opacity': '0',
				'fill-opacity': '0'
			}).on('click', (d) => {
				this.showTooltip(d)
			})
		this.d3.$circle = this.d3.svg.selectAll('.circle-small')
			.data(list)
			.enter()
			.append('circle')
			.attr('class', 'circle-small')
			.attr({
				'cx': ({ y }) => (this.d3.xScale(y) + this.d3.xScale.rangeBand() / 2),
				'cy': ({ x }) => (this.d3.yScale(x)),
				'r': 5,
				'fill': '#fff',
				'stroke-width': 3,
				'stroke': '#fb3030'
			}).on('click', (d) => {
				this.showTooltip(d)
			})
		this.d3.svg.append('g')
			.attr('class', 'd3-tooltips')
		this.d3.initialize = true;
	}

	runD3(list) {
		this.getLow(list)
		let { yScale, xScale, yAxis, yBar, yInner, yInnerBar, $circle, $circle2, path } = this.d3;
		yScale.domain([lowX, bigX])
		yAxis.tickFormat(
			(val) => {
				if (seleType == "saleNum") return val;
				else {
					return '￥' + val
				}
			}
		).scale(yScale)
		yBar.transition().duration(_duration).call(yAxis)
		yInner.scale(yScale)
		yInnerBar.transition().duration(_duration).call(yInner);
		$circle.transition().duration(_duration)
			.attr({
				'cx': ({ y }) => (xScale(y) + xScale.rangeBand() / 2),
				'cy': ({ x }) => (yScale(x)),
			})
		$circle2.transition().duration(_duration)
			.attr({
				'cx': ({ y }) => (xScale(y) + xScale.rangeBand() / 2),
				'cy': ({ x }) => (yScale(x)),
			})
		let line = d3.svg.line()
			.x(({ y }) => xScale(y) + xScale.rangeBand() / 2)
			.y(({ x }) => yScale(x))
		path.transition().duration(_duration).attr("d", line(list))

	}
	//条件点击事件
	sevenDaychoose(index) {
		if (index === this.d3Type) {
			return
		};
		this.setState(({ sevenDayList }) => (
			{
				sevenDayList: sevenDayList.map((item, i) => ({ ...item, ...{ cur: index === i } })),
				visible: false
			}
		))
		this.d3Type = index;
		this.formatList()
		this.d3list=this.update(this.d3list)
		this.runD3(this.d3list);
		this.hideTooltip()
	}
	//点击查看当天信息
	showTooltip(d) {
		var tooltips = d3.selectAll('.d3-tooltips');
		var rec = d3.select('rect')[0]
		if (rec[0]) {
			// console.log('存在')
			this.chang(d)
			return
		} else {
			tooltips.append('rect')
				.attr('class', 'd3-tooltip-rect')
			tooltips.append('text')
				.attr('class', 'd3-tooltip-text number ')
			this.chang(d)
		}
	}
	chang(d) {
		// console.log(this.d3list)
		// console.log(d)
		// let test=d3.selectAll('.y .tick text')
		// let dX=Number(d.x)
		if (d && d.x) {
			if (d.x.length > 5) {
				Boxw = d.x.length * 16
			}
			let t = d3.selectAll('.d3-tooltip-rect')
				.attr('width', Boxw)
				.attr('height', Boxh)
				.attr({
					'x': () => (this.d3.xScale(d.y) + this.d3.xScale.rangeBand() / 2 - Boxw / 2),
					'y': () => (this.d3.yScale(d.x) - Boxh),
					'stroke': 'red',
					'rx': 5,
					'ry': 5,
					'fill': '#FB3030',
					"stroke-width": 3,
					// "fill-opacity": 0.9,
					"stroke-opacity": 0.3,
				})
				.transition().duration(_duration)
			let text = d3.selectAll('.d3-tooltip-text')
				.attr('dy', '0.35em')
				.attr('text-anchor', 'middle')
				.text(() => {
					console.log('seleTypeseleTypeseleTypeseleType', seleType)
					if (seleType == "saleNum") return d.x;
					else {
						return "¥ " + d.x;
					}
				})
				.attr({
					'x': () => (this.d3.xScale(d.y) + this.d3.xScale.rangeBand() / 2),
					'y': () => (this.d3.yScale(d.x) - Boxh / 2),
					'fill': '#fff',
				})
		}

	}
	hideTooltip() {
		d3.selectAll('.d3-tooltip-rect').remove()
		d3.selectAll('.d3-tooltip-text').remove()

	}
	//转换下d3折线图需要的格式
	formatList() {
		//sumProfit//利润额
		//sumTotalPrice//销售额
		//saleNum //订单数
		// this.d3Type = 0; //0 代表 七日销售额变化  1 七日利润额变化  2 七日订单数变化  //默认是0
		moment.locale('zh-cn');
		console.log('aaa', moment().format('dddd'))
		let { d3Type, d3list } = this;
		let arr = ['sumTotalPrice', 'sumProfit', 'saleNum'];
		this.returnList.reverse().forEach((item, index) => {
			let { date } = item;
			let day = moment(date).format('dddd')
			this.d3list[index].y = date;//显示日期
			switch (d3Type) {
				case 0:
					this.d3list[index].x = item.sumTotalPrice;
					seleType = 'sumTotalPrice'
					break;
				case 1:
					this.d3list[index].x = item.sumProfit;
					seleType = 'sumProfit'
					break;
				case 2:
					this.d3list[index].x = item.saleNum;
					seleType = 'saleNum'
					break;
				default:
					break;
			}

		})
	}
	handleVisibleChange(visible) {
		this.setState({ visible });
	}
	componentDidMount() {
		this.requireData().then(({ returnCode, listsumMap })=>{
			if (returnCode === '0000') {
				this.returnList = listsumMap;
				this.formatList();
				this.d3list=this.update(this.d3list)
				this.initD3(this.d3list);
			}
		})
	}

	requireData(flag){
		uleHistory.push({ 'name': 'salehome' })
		const today = moment().format('YYYY-MM-DD');
		return apiMap.searchSaleSumQiriChangeForPad.send({
			endTime: today,
			beginTime: today
		})
	}

	componentWillReceiveProps(nextProps) {
		this.requireData().then(({ returnCode, listsumMap })=>{
			if (returnCode === '0000') {
				this.returnList = listsumMap;
				this.formatList();
				this.d3list=this.update(this.d3list)
				this.runD3(this.d3list);
			}
		})
	}
	//获取最低值
	update(list){
		if(list&&list.length>0){
			for (var i = 0; i < list.length; i++) {
				let x=list[i].x
				x=x.replace(/,/g, "")
				list[i].x=x
			}
		}
		return list
	}
	getLow(list) {
		let xr = []
		if (list && list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				let x=list[i].x
				x=x.replace(/,/g, "")
				xr.push(x)
			}
		}
		xr.sort((a, b) => {
			return a - b
		})
		bigX = parseFloat(xr[list.length - 1])
		lowX = parseFloat(xr[0])
	}
	render() {

		let { sevenDayList, visible } = this.state;
		let sevenObj = sevenDayList.filter(({ cur }) => cur)[0];
		const content = (
			<div>
				{sevenDayList.map(({ cur, name }, i) => (
					<p key={i} onTouchTap={() => this.sevenDaychoose(i)} className={`line-text ${cur && 'cur'}`}>{name}</p>
				))}
			</div>
		);
		return (
			<div className="d3line-module" ref={dom => this.$rootDom = dom}>
				<Popover
					visible={visible}
					onVisibleChange={this.handleVisibleChange.bind(this)}
					overlayStyle={{ zIndex: 999 }}
					overlayClassName="popover-type1" placement="bottomRight" content={content} trigger="click">
					<div className="change-d3">
						{sevenObj.name}
						<i className={`ule-icon icon-run icon-${!visible ? 'down' : 'up'}`}></i>
					</div>
				</Popover>
				<svg id="lineCharts">

				</svg>
			</div>
		)
	}
}