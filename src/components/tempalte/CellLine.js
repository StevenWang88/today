

import { Icon } from 'antd';
import { InputBox } from 'temps';
const lastBorderBottom = { 'border-bottom': 'none' }
export default class CellLine extends React.PureComponent {
	render() {
		let { label, labelStyle, isLink, type,className,rightLabel, disabled, textAlgin, content, value, placeHolder, last, handleClick, onChange, isRequired } = this.props;
		return (
			<div
				className={`ule-cellline ${className}`}
				style={last && lastBorderBottom}
				onTouchTap={(e) => { handleClick && handleClick(e) }}
			>
				<div style={labelStyle} className="label">{ isRequired==="true" && <em style={{"color":"red"}}>*&nbsp;</em> } {label}</div>
				<div className={`cell-body text-${textAlgin}`}>
					{content ? content :
						<InputBox {...{ disabled, value, onChange, placeHolder, type }} />}
				</div>
				<div className="right">
					{isLink && <i className="ule-icon icon-right"></i>}
					{rightLabel}
				</div>
			</div>
		)
	}
}
CellLine.defaultProps = {
	labelStyle: {},
	rightLabelStyle: {},
	edit: false,
	textAlgin: 'left'
}
CellLine.propTypes = {
	//左边文字
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]),
	//左边文字样式
	labelStyle: PropTypes.object,
	//是否要右侧箭头
	isLink: PropTypes.bool,
	//右侧文字或元素
	rightLabel: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]),
	//右侧样式
	rightLabelStyle: PropTypes.object,
	//输入框是否不可编辑
	disabled: 　PropTypes.bool,
	//中间内容怎么显示
	textAlgin: PropTypes.string,
	//中间容器 不传默认是input
	content: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]),
	//输入框值
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	//输入框提示文案
	placeHolder: PropTypes.string,
	//是否是最后一个   是的话就不要下横线了
	last: PropTypes.bool,
	//点击事件处理  行元素点击
	handleClick: PropTypes.func,
	//输入框值变化通知函数
	onChange: PropTypes.func,
}