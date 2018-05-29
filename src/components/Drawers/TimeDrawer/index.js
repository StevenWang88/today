import DrawerHead1 from '../DrawerHead1';
import { Icon, Popover } from 'antd';
import "./timeDrawer.scss"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { G1_FILTERS_GOODS } from 'drawerTypes';
import * as shglActions from 'action/spgl';
import drawer from 'core/drawer';
import uleCheck from 'core/uleCheck';
import { SelectPopover } from 'temps';
class TimeDrawer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			time: new Date(),
			isOpen: false,
			timelable: [
				{ timeline: '最近一周', selected: true, timeFrame: '1' },
				{ timeline: '最近一个月', selected: true, timeFrame: '2' },
				{ timeline: '最近三个月', selected: true, timeFrame: '3' }
			],
			checkNum: [
				{ name: '低于', itemQtyType: '2' },
				{ name: '高于', itemQtyType: '1' },
				{ name: '等于', itemQtyType: '0' },
			],
			defaultChecked: { name: '低于', itemQtyType: '' },
			pastList: [
				{ pastName: '将过期', checked: true, expirationId: '1' },
				{ pastName: '已过期', checked: true, expirationId: '2' }
			],
			filterData: { timeFrame: '', itemQtyType: '', itemQty: '', expirationId: '' },
			inputValue:''
		}
	}
	// 选择日期周期 单选 1一周2一个月 3三个月
	seleTime(item, i) {
		let { timelable, filterData } = this.state
		// if (filterData.timeFrame && filterData.timeFrame == timelable[i].timeFrame) {
		// 	timelable[i].selected = !timelable[i].selected
		// } else {
			timelable[i].selected = true
		// }
		this.setState({
			timelable: timelable,
			filterData: { ...filterData, ...{ timeFrame: item.timeFrame } }
		});
	}
	// 重置选择数据
	reaset() {
		console.log('重置')
		let defaultChecked = { name: '低于', itemQtyType: '' }
		this.setState({ 
			inputValue:'',
			filterData: {timeFrame: '', itemQtyType: '', itemQty: '', expirationId: '' },
			defaultChecked 
		})
	}
	// 点击确认筛选
	confirm() {
		console.log('确认')
		let { filterData,inputValue } = this.state
		let { g1FilterMerge, g1StartRequireGoods } = this.props;
		if(inputValue){
			filterData.itemQtyType=filterData.itemQtyType||'2'
		}
		g1FilterMerge({ ...filterData, ...{ pageNum: '1', itemQty: inputValue } })
		g1StartRequireGoods({ type: 'reset' })
		drawer.clean()
	}
	// 选择1大于，2小于 0等于 隐藏气泡 单选
	hide(item) {
		let { filterData } = this.state
		this.setState({
			filterData: { ...filterData, ...{ itemQtyType: item.itemQtyType } },
			defaultChecked: item
		});
	}
	// 选项是否过期单选 1将过期 2已过期 
	pastDate(item, i) {
		let { timelable, filterData, pastList } = this.state
		// let [n, m] = [item.expirationId, filterData.expirationId]
		// if (m && m == n) {
		// 	pastList[i].checked = !pastList[i].checked
		// } else {
			pastList[i].checked = true
		// }
		this.setState({
			pastList: pastList,
			filterData: { ...filterData, ...{ expirationId: item.expirationId } }
		})
	}
	componentDidMount() {
		let { checkFilterData } = this.props
		let { checkNum,inputValue } = this.state
		for (var i = 0; i < checkNum.length; i++) {
			if (checkFilterData.itemQtyType == checkNum[i].itemQtyType) {
				this.setState({ filterData: { ...checkFilterData }, defaultChecked: checkNum[i],inputValue:checkFilterData.itemQty})
			}
		}
		this.setState({ filterData: { ...checkFilterData }})
		
	}
	change(e){
		let value=e.target.value
		value=uleCheck.price(value)
		this.setState({inputValue:value})
	}
	render() {
		let { timea, timelable, filterData, checkNum, pastList, inputValue, expirationId, defaultChecked } = this.state
		return (
			<div className="filter-drawer time-drawer">
				<DrawerHead1 title="筛选" />
				{/* 
			  */}
				{/*  */}
				{timea}
				<div className="filter-warp">
					<p className="btn-title">入库时间</p>
					<div className="ule-btn-group ule-btn-group-2">
						{timelable.map((item, index) => (
							<div
								className={`ule-btn ule-btn-default ${(filterData.timeFrame == item.timeFrame && item.selected) ? 'cur' : ''}`}
								key={index}
								onTouchTap={this.seleTime.bind(this, item, index)}
							>
								{item.timeline}
							</div>
						))

						}
					</div>
					<p className="btn-title">库存量</p>
					<div className="ule-btn-group ule-btn-group-2">
						<div className="ule-btn ule-btn-default">
							<SelectPopover
								iClick={(i) => { this.hide(i) }} list={checkNum}
								defaultChecked={defaultChecked} />
						</div>
						<div className="ule-btn ule-btn-default count-input">
							<input
								value={inputValue}
								placeholder="请输入数量"
								onChange={this.change.bind(this)}
								type="tel"
							/>
						</div>
					</div>
					<p className="btn-title">保质期</p>
					<div className="ule-btn-group ule-btn-group-2 ule-btn-group-1">
						{pastList.map((item, index) => (
							<div
								className={`ule-btn ule-btn-default ${filterData.expirationId == item.expirationId && item.checked ? 'cur' : ''}`}
								onTouchTap={this.pastDate.bind(this, item, index)}
								key={index}
							>
								{item.pastName}
							</div>
						))}
					</div>
				</div>

				<div className="footer hide_btn">
					<div className="ule-btn-group ule-btn-group-2" style={{"fontSize":'20px'}}>
						<div className="ule-btn ule-btn-reset" onTouchTap={this.reaset.bind(this)}>
							重 置
						</div>
						<div className="ule-btn ule-btn-sure" onTouchTap={this.confirm.bind(this)}>
							确 认
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default connect(
	state => ({ info: state.drawer, checkFilterData: state.g1SearchGoodsFilter }),
	dispatch => ({ ...bindActionCreators({ ...shglActions }, dispatch) })
)(TimeDrawer)