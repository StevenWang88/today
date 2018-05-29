

import { Icon, Popover } from 'antd';

export default class ChassifyItem extends React.Component {
	
	constructor(props) {
		super(props);
		this.list = [
			// { iconType: 'icon', iconName: 'to-top', name: '上移一层' },
			// { iconType: 'icon bottom', iconName: 'to-top', name: '下移一层' },
			{ iconType: 'icon editName', iconName: '', name: '修改名称' },
		],
		this.state = {
			visible: false,
		}
	}

	handleVisibleChange(visible){
		this.setState({ visible });
	}
	popoverClick(i){
		this.setState({ visible:false });
		this.props.popoverClick(i);
	}
	render() {
		let { list } = this;
		let { label, edit, iClick,active} = this.props;
		return (
			<div className={`rect-item ${active && 'cur'}`} >
				<div className="sub-rect-item">
					<div className="text" onTouchTap={iClick}>
						{label}
					</div>
					{edit && <Popover
						placement="right"
						overlayClassName="popover-type1 popover-type2"
						visible={this.state.visible}
						onVisibleChange={this.handleVisibleChange.bind(this)}
						content={(
							<div>
								{list.map(({ iconType, iconName, name }, index) => (
									<p className='line-text' key={index} onTouchTap={() => { this.popoverClick(index) }}>
										<span className={iconType}>
										<Icon type={iconName}/>
										</span> {name}
									</p>
								))}
							</div>
						)}
						trigger="click">
						<span className="ope"><Icon type="ellipsis" /></span>
					</Popover>}
				</div>
			</div>
		)

	}
}
ChassifyItem.propTypes = {
	label: PropTypes.string.isRequired,
	index: PropTypes.number,
	edit: PropTypes.bool.isRequired,
	iClick: PropTypes.func.isRequired,
	popoverClick: PropTypes.func
}