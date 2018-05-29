




import { Icon } from 'antd';
import GoodItem from './GoodItem';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as spglActions from 'action/spgl';
import { G1_FILTERS_GOODS, G1_ADD_GOOD } from 'drawerTypes';
import AddShopBtn from './AddShopBtn';
import PullRefresh from 'reactjs-pull-refresh';
import drawer from 'core/drawer';
import code from 'core/code';
const img1 = require('@/assets/kongbaitishi.png');
class GoodsContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isFocus: false
		}
		this.iscrolloptions = {

		}
	}
	getUpcName() {
		let inputItem = this.refs.upcInput
		//原生获取商品编码
		console.log('扫码录入input')
		Yzg.exec( 'openQRCode', (data) => {
			//处理返回的数据得到编码
			if (data && data.status) {
				inputItem.value = data.qrResult
				this.change()
			}
		});
	}
	componentDidMount() {

			this.props.g1StartRequireGoods({ type: 'reset' });
			code._init({
				...{
					getUpcName: this.getUpcName.bind(this)
				}
			})
	}
	//筛选右侧抽屉出来
	toFilterDrawer() {
		let option = {
			show: true,//抽屉默认是不显示的
			box: G1_FILTERS_GOODS,//显示哪一个抽屉内容
		}
		drawer.push(option)
	}
	//新添加商品
	addShop() {
		let option = {
			show: true,//抽屉默认是不显示的
			box: G1_ADD_GOOD,//显示哪一个抽屉内容
		}
		drawer.push(option)
	}
	liHandleClick(item) {
		// 存储商品详情
		// qualityPeriodUnit 保质期单位  Y年M月 D天
		let { g1GoodInfo } = this.props
		g1GoodInfo(item)
		this.props.g1ShowGoodInfo(true);
	}

	loadMoreAction() {
		return this.props.g1StartRequireGoods({ type: 'next' })
	}
	change() {
		let inputItem = this.refs.upcInput
		let avalue = inputItem.value;
		let { g1FilterMerge, g1StartRequireGoods } = this.props;
		if (avalue && avalue.length > 20) {
			toast.info("最多输入20位!")
			return
		};
		_.delay((text) => {
			g1FilterMerge({ ...{ pageNum: '1', itemNameOrUpc: avalue } })
			g1StartRequireGoods({ type: 'reset' })
		}, 500, 'later');
	}
	//清除数据
	clearText() {
		let inputItem = this.refs.upcInput
		inputItem.value = ''
		// this.props.switchFilter({randId:''});
		// this.props.sendListRequest({type:"start"});
		// this.setState({isFocus:false});
		this.change()
		this.changeFcous()

	}
	//输入框聚焦失焦事件
	changeFcous(isFocus) {
		let inputItem = this.refs.upcInput
		if (inputItem) {
			if (!isFocus && inputItem && inputItem.value.length > 0) {
				return;
			}
			this.setState({ isFocus })

		}

	}
	componentWillReceiveProps(nextProps) {
		let { filData } = nextProps
		let val = filData.itemNameOrUpc
		if (!val || val.length == 0) {
			this.setState({ isFocus: false })
		} else {
			this.setState({ isFocus: true })
		}
	}
	render() {
		let { list, filData } = this.props;
		let { isFocus } = this.state;
		let showNo = false
		const sorollprops = {
			maxAmplitude: 80,
			debounceTime: 30,
			throttleTime: 100,
			deceleration: 0.001,
			refresh: false,
			loadMoreCallback: this.loadMoreAction.bind(this),
			hasMore: filData.hasMore,
		};
		Object.keys(filData).forEach((key) => {
			// 	console.log('key',key)
			// 	// if(key=="itemNameOrUpc") //商品名称或upc
			// 	//timeFrame  //时间范围
			// 	//itemQtyType //库存数量比较（1大于2小于0等于）
			// 	//itemQty: ''//String 库存数量
			// 	//expirationId: '',//String 保质期（1将过期2已过期）
			// 没有筛选条件就是类目没有分类显示图片
			if ((key == "itemNameOrUpc" && filData[key] && filData[key].length > 0) ||
				(key == "timeFrame" && filData[key] && filData[key].length > 0) ||
				(key == "itemQtyType" && filData[key] && filData[key].length > 0) ||
				(key == "itemQty" && filData[key] && filData[key].length > 0) ||
				(key == "expirationId" && filData[key] && filData[key].length > 0)) {
				showNo = true
			}
		})
		return (
			<section className="g-goods sub-container">
				{(list.length > 0 || showNo) ? (
					<div className="search-warp">
						<div className="search-icon-box" onTouchTap={this.change.bind(this)}>
							<Icon type="search" />
						</div>
						<div className={`input-box ${isFocus ? 'focus' : ''}`}>
							<input
								type="text"
								maxLength = "20"
								placeholder="搜索全部商品，请输入商品条码，商品名"
								ref="upcInput"
								onChange={this.change.bind(this)}
								onFocus={() => this.changeFcous(true)}
								onBlur={() => this.changeFcous(false)}
							/>
							{isFocus ? (<div className="clear-input" onTouchTap={this.clearText.bind(this)}>
								<i className="ule-icon clean-icon"></i>
							</div>) : ''}
						</div>
						<div className="ope-box" onTouchTap={this.toFilterDrawer.bind(this)}>
							<i className="ule-icon icon-sxred"></i><span>{showNo ? '已筛选' : '筛选'}</span>
						</div>
					</div>

				) : ''}

				<AddShopBtn iClick={this.addShop.bind(this)} />
				{list.length > 0 ?
					(<div className="goods-box">
						<PullRefresh {...sorollprops} >
							<ul className="goods-list">
								{list.map((item, index) => (
									<GoodItem
										key={index}
										item={item}
										iClick={this.liHandleClick.bind(this, item)}
									/>
								))}
							</ul>
						</PullRefresh>
					</div>) : (<div>
						{showNo ? (<div className="ule-bb empty-tip">未搜索到相关商品</div>) : (<div className="empty-pic"><img src={img1} alt="" /></div>)}
					</div>)
				}


			</section>
		)
	}
}
export default connect(
	state => ({ list: state.g1Goods, filData: state.g1SearchGoodsFilter }),
	dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(GoodsContainer);