


import { Icon } from 'antd';
import { CellLine } from 'temps';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { G1_CHECK_STOCK, G1_ADD_STOCK, G1_EDIT_STOCK, G1_GOOD_EDIT_DRA, G1_UPDATE_TIME } from 'drawerTypes';
import PullRefresh from 'reactjs-pull-refresh';
import drawer from 'core/drawer';
const columns = ['进货时间', '类型', '进货数量', '进货价格', '剩余库存', '保质期', '操作']
class EditBtn extends React.Component {
	render() {
		let { isEdit } = this.props
		return (
			// isEdit 可修改 unEdit不可修改样式
			<div onTouchTap={() => { this.props.showDrawer() }} className={`${isEdit ? 'isEdit' : 'unEdit'}`}>修改库存</div>
		)
	}
}
export default class StorageInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			goodInfo: {},
			option: { pageNum: 1, upc: '' }
		}
		this.list = []
	}

	componentWillMount() {
		// 保质期状态 expired 0 未填写  1 将过期  2 已过期  3 正常  4  库存为0
		// 1拆包 0进货 2盘盈 3负库销售 4退货
		//loss为 -1 可以调整库存 其他不可以
		this.load('reset')
	}
	componentDidMount() {
		let { stockList, goodInfo } = this.props;
		let unitId = goodInfo.unitId;
		let sysUnits = stockList.sysUnits;
		// let objet = sysUnits.filter(item => {
		// 	return item.id == unitId;
		// })
	}
	loadMoreAction() {
		let { option } = this.state
		this.setState({ option: option })
		this.load('next')
		return Promise.resolve()
	}
	load(type) {
		let { goodInfo } = this.props
		let { option } = this.state
		option.upc = goodInfo.upc
		let { g1GoodStockList } = this.props
		// 获取批次列表
		g1GoodStockList(option, type)
	}
	//显示选择抽屉
	showDrawer(item) {
		let box = G1_EDIT_STOCK
		// if (item.expired != 2) {} 
		drawer.push({ show: true, showPopover: true, box: box, config: { stockItem: item } })
	}
	//goEditGood
	goEditGood() {
		console.log('修改商品信息')
		let option = { show: true, showPopover: true, box: G1_UPDATE_TIME, config: {} }
		drawer.push(option)
	}
	fType(item) {
		console.log('item', item)
		// this.setState({  
		//     inputText: inputText,  
		//     showPassingOnly: showPassingOnly  
		// })
		// 1拆包 0进货 2 盘盈 3 负库销售 4 退货
		var name='进货'
		item=Number(item)
		switch (item) {
			case 0:
			name='进货'
				break;
			case 1:
			name='拆包'
				break;
			case 2:
			name='盘点'
				break;
			case 3:
			name='负库销售'
				break;
			case 4:
            name="退货"
				break;
			default:
				break;
		}
		return name
	}
	render() {
		let { goodInfo, stockList, stockHasMore } = this.props
		console.log('stockList',stockList)
		return (

			<div className="table-1 storeage-info">
				<div className="mb-20">
					<div className="ule-cell-group">
						<CellLine
							label="商品名称 :"
							textAlgin="right"
							disabled
							value={goodInfo.itemName}
							placeHolder="请在商品信息填写商品名称"
						/>
						<CellLine
							label="剩余库存 :"
							value={String(goodInfo.qty ? parseFloat(goodInfo.qty).toFixed(2) : '')}
							disabled
							textAlgin="right"
						/>
					</div>
				</div>
				<div className="table-warp">
					{/* <Table pagination={null} columns={columns} dataSource={data} /> */}
					<div className="table-warp-box">
						<div className="table-th table-tr">
							{columns.map((item, index) => {
								return (
									<div className="table-td" key={index}>{item}</div>
								)
							})}
						</div>
						<div className="table-body">
							<PullRefresh {...{
								maxAmplitude: 80,
								debounceTime: 30,
								throttleTime: 100,
								deceleration: 0.001,
								refresh: false,
								loadMoreCallback: this.loadMoreAction.bind(this),
								hasMore: !stockHasMore.stockMax,
							}}>
								{stockList.map((item, index) => {
									return (
										<div key={index} className="table-tr">
											<div className="table-td">{item.ext8}</div>
											<div className="table-td">{this.fType(item.fromType)}</div>
											<div className="table-td">{item.purNum}</div>
											<div className="table-td">
												{'¥ ' + String(item.purPrice >= 0 ? parseFloat(item.purPrice).toFixed(2) : '')}
											</div>
											<div className="table-td">{item.qty}</div>
											<div className="table-td">
												{item.expired == 2 ? (<span className="ex-past">已过期</span>) : ''}
												{item.expired == 1 ? (<span className="ex-last">剩余{item.ext9}天</span>) : ''}
												{item.expired == 3 ? '' : ''}
												{item.expired == 0 && item.expired != 4 ? (<span className="isEdit" onTouchTap={this.goEditGood.bind(this, item)}>去填写</span>) : ''}
											</div>
											<div className="table-td">
												{item.fromType == 0&&item.loss == (-1) ? (<EditBtn showDrawer={this.showDrawer.bind(this, item)} isEdit={(item.expired == 2) ? true : true} />) : ''}
											</div>
										</div>
									)
								})}
							</PullRefresh>
						</div>
					</div>
					<div className="ule-btn-group-2 ule-btn-group font-btn">
						<div className="ule-btn ule-btn-reset" onTouchTap={() => { this.props.setDrawer(0) }}>盘库</div>
						<div className="ule-btn ule-btn-sure" onTouchTap={() => { this.props.setDrawer(1) }}>新增入库</div>
					</div>
				</div>
			</div>
		)
	}
}

