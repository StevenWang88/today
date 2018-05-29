

export default class LeftMenuIcon extends React.Component{
	render(){
		let {colorStyle,iClick} = this.props;
		return(
			<div onTouchTap={iClick} style={{ 'padding': '20px 20px 20px 0' }}>
			<div className="left-menu-icon" >
				{[1,2,3].map(item=>(<span key={item} style={colorStyle}></span>))}
			</div>
			</div>
		)
	}
}

LeftMenuIcon.propTypes = {
	color : PropTypes.object,
	iClick : PropTypes.func
}
