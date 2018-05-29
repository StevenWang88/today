/*
* *选择时间
* */
import DrawerHead1 from '../DrawerHead1';
import { PadCalendar } from 'temps';
import { Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SELECT_TIME_TJ, STARTANDEND_TIME } from 'drawerTypes';
import Subscriber from 'core/Subscriber';
import getTimeParams from '@/public/getTimeParams';
import drawer from 'core/drawer';
import * as cencusActions from 'action/cencus'
@connect(
	state => ({ filterTime: state.cTimeFilter }),
	dispatch => ({ ...bindActionCreators({ ...cencusActions }, dispatch) })
)
export default class ChooseTime extends React.Component {

	constructor(props) {
		super(props);
		let { beginTime, endTime, onlyTime } = this.props.filterTime;
		this.state = {
			tabIndex: 0,
			beginTime,
			endTime,
		}
		this.tabNav = ['按日期查询', '按时间段查询'];
		this.onlyTime = onlyTime;
	}
	toChangeTime(flag) {
		let { beginTime, endTime } = this.state;
		drawer.push({
			box: STARTANDEND_TIME,
			config: {
				beginTime, endTime, flag,
			}
		});
		Subscriber.once(['BEGIN-TIME-SELECT', 'END-TIME-SELECT'][flag], (time) => {
			this.setState({
				[['beginTime', 'endTime'][flag]]: time
			})
		})
	}
	search() {
		let { tabIndex } = this.state;
		let { beginTime, endTime } = this.state;
		let { onlyTime, } = this;
		let obj = {},
			warnText = '';
		if (tabIndex === 0) {
			if (!onlyTime) {
				warnText = '请选择时间';
			}
			obj.onlyTime = onlyTime;
		} else {
			if (!beginTime || !endTime && !(!beginTime && !endTime)) {
				!endTime && (warnText = '请选择结束时间')
				!beginTime && (warnText = '请选择开始时间');
			}
			obj.beginTime = beginTime;
			obj.endTime = endTime;
		}
		if (warnText) {
			toast.info(warnText)
			return;
		}

		this.props.c1ChooseTime(obj);
		drawer.pop();
	}
	changeDate(time) {
		this.onlyTime = time;
		this.search()
	}
	//选项卡事件
	tab(index) {
		let { tabIndex } = this.state;
		if (index === tabIndex) return;
		this.setState({ tabIndex: index })
	}
	render() {
		let { tabIndex, beginTime, endTime } = this.state;
		let { onlyTime } = this;
		let { tabNav } = this;
		return (
			<div className="choose-time-drawer">
				<DrawerHead1 title="选择时间" />
				<div className="time-warp">
					<div className="tab-head">
						{tabNav.map((item, index) => (
							<div key={index} className={`tab-head-item ${tabIndex === index ? 'cur' : ''}`}
								onTouchTap={() => { this.tab(index) }}
							>{item}</div>
						))}
					</div>
					<div className="tab-body">
						<div className={`tab-body-item ${tabIndex === 0 ? 'cur' : ''}`}>
							<PadCalendar
								curDay={onlyTime}
								max={moment().format('YYYY-MM-DD')}
								changeDate={this.changeDate.bind(this)}
							/>
						</div>
						<div className={`tab-body-item ${tabIndex === 1 ? 'cur' : ''}`}>
							<div className="cell">
								<div className="cell-line" onTouchTap={() => { this.toChangeTime(0) }}>
									<span>{beginTime || '请选择开始时间'}</span>
									<Icon type="right" />
								</div>
								<div className="cell-line" onTouchTap={() => { this.toChangeTime(1) }}>
									<span>{endTime || '请选择结束时间'}</span>
									<Icon type="right" />
								</div>
								<p className="cell-tips">时间段跨度最多仅能为30天</p>
							</div>
						</div>
					</div>
				</div>
				{tabIndex == 1 ? (<div className="ule-btn-group">
					<div className="ule-btn ule-btn-sure font-btn" onTouchTap={this.search.bind(this)}>查询</div>
				</div>) : ''}

			</div>
		)
	}
}

