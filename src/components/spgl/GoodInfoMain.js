
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import GoodInfo from './GoodInfo'
import StorageInfo from './StorageInfo'
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as spglActions from 'action/spgl';
import drawer from 'core/drawer';
import { G1_CHECK_STOCK, G1_ADD_STOCK, G1_GOOD_EDIT_DRA } from 'drawerTypes';

class GoodInfoMain extends React.Component {
	constructor(props) {
		super(props);
	}
	handleTab(index) {
		this.props.g1ShowGoodInfo(true, String(index));
	}
	close() {
		let { g1FilterMerge, g1StartRequireGoods } = this.props;
		g1FilterMerge({ ...{ pageNum: '1' } })
		g1StartRequireGoods({ type: 'reset' })
		this.props.g1ShowGoodInfo(false);
	}
	showDrawer() {
		let option = { show: true, showPopover: true, box: G1_GOOD_EDIT_DRA, config: {} }
		drawer.push(option)
	}
	StockDrawer(type){
		console.log(type)
		//type 0盘库 1新增入库
		let box = G1_CHECK_STOCK
		if (type == 1) {
			box = G1_ADD_STOCK
		}
		drawer.push({ show: true, showPopover: true, box: box, config: {} })
	}
	render() {
		let { show, curIndex } = this.props.show;
		if (!show) return false;
		return (
			<div className="good-info-main">
				<div className="left-back" onTouchTap={this.close.bind(this)}>
				<i className="ule-icon icon-left"></i>

				</div>
				<Tabs activeKey={curIndex} onChange={this.handleTab.bind(this)}>
					<TabPane tab="商品信息" key="0">
						<GoodInfo {...this.props} handleTab={this.handleTab.bind(this)} setDrawer={this.showDrawer.bind(this)} />
					</TabPane>
					<TabPane tab="库存信息" key="1">
						<StorageInfo  {...this.props} handleTab={this.handleTab.bind(this)} setDrawer={this.StockDrawer.bind(this)} />
					</TabPane>
				</Tabs>
			</div>
		)
	}
}
export default connect(
	state => ({ stockHasMore:state.g1StockLoad,show: state.g1ShowGoodInfo,goodInfo:state.g1GoodInfo,stockList:state.g1GoodStockList}),
	dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(GoodInfoMain)