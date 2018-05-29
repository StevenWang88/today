




export default class InputBox extends React.Component {
	constructor(props) {
		super(props);
		let { value } = props;
		this.state = { value };
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		let { value } = event.target;
		this.setState({ value });
		let { onChange } = this.props;
		onChange && onChange(value)
	}

	componentWillReceiveProps(nextProps) {
		let { value } = nextProps;
		this.setState({ value })
	}
	render() {
		let { type, disabled, placeHolder } = this.props;
		let { value } = this.state;
		return (
			<input
				disabled={disabled}
				type={type}
				placeholder={placeHolder}
				value={value}
				onChange={this.handleChange}
			/>
		)
	}
}
InputBox.defaultProps = {
	type: 'text',
	value: ''
}
InputBox.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	onChange: PropTypes.func,
	type: PropTypes.string,
	disabled: PropTypes.bool,
	placeHolder: PropTypes.string,
}