/*
* 右侧抽屉
* */



import CSSTransitionGroup from 'react-addons-css-transition-group';
import DrawerView from './DrawerView';
import cache from 'core/cache';
import drawer from 'core/drawer';
import uleHistory from 'core/uleHistory';
import "./right-drawer.scss"
import { Modal } from 'antd';
import { DatePickerBox } from 'temps';
import createHashHistory from 'history/createHashHistory';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as spglActions from 'action/spgl';
const history = createHashHistory();
class Drawers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			moreDrawerList: [],
			historyList: []
		}
		this.drawerCheck = [];
	}
	pushMoreDrawer(data) {
		let { moreDrawerList } = this.state;
		let index = moreDrawerList.length;
		let _default = {
			config: {
				check: (fn) => {
					this.drawerCheck[index] = fn;
				}
			}
		}
		this.drawerCheck.push(null);
		moreDrawerList.push(_.defaultsDeep(data, _default));
		this.setState({ moreDrawerList });
	}
	pop(moreDrawerList) {
		let { historyList } = this.state
		console.log('historyList', historyList)
		moreDrawerList.pop();
		this.setState({ moreDrawerList });
		this.drawerCheck.pop();
		log('this.drawerCheck', this.drawerCheck)
		if (moreDrawerList.length <= 0) {
			cache.clear();//清楚开始时间与结束时间
		}

	}

	popDrawer(showBox) {
		let { moreDrawerList } = this.state
		let index = moreDrawerList.length - 1;
		if (index < 0) return;
		let checkFn = this.drawerCheck[index];
		if (showBox && showBox.showBack) {
			this.pop(moreDrawerList)
			return
		}
		if (checkFn) {
			let checkResult = checkFn();
			if (checkResult) {
				Modal.confirm({
					content: checkResult.content || '修改的信息还未保存，确认现在返回？',
					onOk: () => {
						this.pop(moreDrawerList);
					},
					maskClosable: true,
				})
				return;
			}
		}
		this.pop(moreDrawerList);
	}
	pushHistory(option) {
		let { historyList } = this.state;
		if (historyList.length >= 1 && historyList) {
			for (var i = 0; i < historyList.length; i++) {

				if (historyList[i].name != option.name) {
					historyList.push(option)
				}
			}
		} else {
			historyList.push(option)
		}
	}
	popHistory() {
		let { historyList } = this.state;
		historyList.pop()
	}
	componentWillMount() {
		drawer._init({
			push: this.pushMoreDrawer.bind(this),
			pop: this.popDrawer.bind(this),
			clean: this.popDrawer.bind(this),
		})
		uleHistory._init({
			push: this.pushHistory.bind(this),
			pop: this.popHistory.bind(this),
			clean: this.popHistory.bind(this),
		})
		Yzg.addEventListener('onBack', (data) => {
			let { moreDrawerList, historyList } = this.state
			if (moreDrawerList && moreDrawerList.length > 0) {
				this.popDrawer()
			} else {
				let { showGoodInfo, g1ShowGoodInfo } = this.props
				if (showGoodInfo.show) {
					g1ShowGoodInfo(false);
				} else {
					if (historyList && historyList.length > 1) {
						history.goBack(-1)
					} else {
						// 关闭app
						if (location.href.indexOf('spglhome') > 0) {
							Yzg.exec('onNavBack');
						} else {
							Yzg.exec('onNavBack');
						}
					}
				}
			}
		})
	}
	render() {
		let { moreDrawerList } = this.state
		return (

			<CSSTransitionGroup
				component="div"
				transitionEnterTimeout={200}
				transitionLeaveTimeout={200}
				transitionName="right-drawer-root"
			>
				{
					moreDrawerList.length > 0 ? (
						<div className="right-drawer-root">
							<div className="right-drawer-mask"
								onTouchTap={this.popDrawer.bind(this)}
							>
							</div>
							<div className="right-drawer-box">
								<DatePickerBox />
								{moreDrawerList.map((item, index) => (
									<DrawerView
										{...item}
										key={index}
									/>
								))}
							</div>
						</div>
					) : false
				}
			</CSSTransitionGroup>
		)
	}

}
export default connect(
	state => ({ showGoodInfo: state.g1ShowGoodInfo }),
	dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(Drawers)