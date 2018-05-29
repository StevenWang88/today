/*
* 抽屉头部公用右侧样式1
* **/

import { Icon } from 'antd';
import drawer from 'core/drawer';
export default class DrawerHead1 extends React.Component {
	//关闭事件
	close() {
		let { back } = this.props;
		if (back) {
			back();
		} else {
			drawer.pop();
		}
	}
	render() {

		let { left, title, right } = this.props;

		return (
			<h2 className="title">
				<div className="close" onTouchTap={this.close.bind(this)}>
					{!left ? <Icon type="close" /> : left}
				</div>
				<div>
					{title}
				</div>
				<div className="head-right">
					{right}
				</div>
			</h2>
		)
	}

}

DrawerHead1.propTypes = {
	back: PropTypes.func
}
