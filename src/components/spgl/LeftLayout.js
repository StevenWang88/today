
import { LeftMenuIcon } from 'temps';
import { Icon } from 'antd';
import ChassifyItem from './ChassifyItem';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as shglActions from 'action/spgl';
import { G1_ADD_GOOD_CLASSIFY } from 'drawerTypes';
import ClassifyManage from './ClassifyManage';
import PullRefresh from 'reactjs-pull-refresh';
import drawer from 'core/drawer';
import uleHistory from 'core/uleHistory';
@connect(
	state => ({ chassifyList: state.g1GoodsNavMenu, g1SearchGoodsFilter: state.g1SearchGoodsFilter }),
	dispatch => ({ ...bindActionCreators({ ...shglActions }, dispatch) })
)
export default class LeftLayout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			allActive: true
		}

		this.ClassifyManage = null;
	}
	//新建分类
	addClassIfy() {
		let { setDrawer } = this.props;
		let option = {
			show: true,
			showPopover: true,
			box: G1_ADD_GOOD_CLASSIFY,
			config: {
				title: '新建商品分类',
				type: 'add',
				isHome: true //首页新建分类完成后需要到选择该分类下
			}
		}
		// setDrawer(option)
		drawer.push(option)
	}
	classifyChange(index, active) {
		if (active) return;
		let { allActive } = this.state;
		// 获取到dispatch actions中的drawer,spgl定义的方法
		// console.log('this.prorp',this.props)
		let { g1FilterMerge, g1StartRequireGoods, g1RestFilterMerge, g1SearchGoodsFilter, chassifyList } = this.props;
		let option = { pageNum: 1, itemTypeId: '' }
		if (index === 'all') {
			g1RestFilterMerge(option)
			g1FilterMerge(option);
			this.ClassifyManage.cleanActive();
			this.setState({ allActive: true });
		} else {
			let item = chassifyList[index];
			this.ClassifyManage.active(index);
			allActive && this.setState({ allActive: false });
			g1RestFilterMerge(option)
			option.itemTypeId = item.seqId
			g1FilterMerge(option)

		}
		g1StartRequireGoods({ type: 'reset' })
		this.props.g1ShowGoodInfo(false);
	
	}
	//气泡点击
	popoverClick(index, flag) {
		  console.log('flag',flag)
		let { chassifyList } = this.props;
		let item = chassifyList[index]
		//上
		// if (flag === 0) {
		// 	this.ClassifyManage.prevMove(index);
		// }
		// //下
		// if (flag === 1) {
		// 	this.ClassifyManage.nextMove(index);
		// }
		// if (flag === 2) {
			let { setDrawer } = this.props;
			let option = {
				show: true,
				showPopover: true,
				box: G1_ADD_GOOD_CLASSIFY,
				config: {
					title: '修改商品分类',
					type: 'edit',
					item: item,
					index: index
				}
			}
			drawer.push(option)
		// }
	}

	componentDidMount() {
			let { g1RsestClassifyList } = this.props;
			this.ClassifyManage = ClassifyManage.get(g1RsestClassifyList);
			this.ClassifyManage.init();
			uleHistory.push({'name':'spglhome'})

	}
	componentWillUnmount(){
		uleHistory.pop()
	}
	showDrwer() {
		//原生打开左侧菜单的方法
		Yzg.exec('drawer');
	}
	render() {
		let { chassifyList, g1SearchGoodsFilter } = this.props;
		let { allActive } = this.state;
		return (
			<div className="sub-layout left-layout">
				<div className="left-layout-top">
					<div>
						<LeftMenuIcon iClick={() => { this.showDrwer() }} colorStyle={{ background: '#ef3b3b' }} />
					</div>
					<span>商品管理</span>
				</div>
				<div className="left-layout-contnet">
					<ChassifyItem
						label='全部商品'
						edit={false}
						active={g1SearchGoodsFilter.itemTypeId ? false : true}
						iClick={() => { this.classifyChange('all', allActive) }}
					/>
					<div className="chassify-warp">
						<PullRefresh {...{
							maxAmplitude: 80,
							debounceTime: 30,
							throttleTime: 100,
							deceleration: 0.001,
							loadMore: false,
							refresh: false,
							hasMore: false,
						}}>
							{chassifyList.map(({ seqId, typeName, active }, index) => {
								return (
									<ChassifyItem
										popoverClick={(i) => { this.popoverClick(index, i) }}
										iClick={() => { this.classifyChange(index, active) }}
										active={active}
										key={seqId}
										label={typeName}
										index={index}
										edit={true}
									/>
								)
							})}
						</PullRefresh>
					</div>
				</div>
				<div className="left-layout-bottom" onTouchTap={this.addClassIfy.bind(this)}>
					<i className="ule-icon icon-add"></i>
					新建商品分类</div>
			</div>
		)
	}
}