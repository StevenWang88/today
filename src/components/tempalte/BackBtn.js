/*
* 商品管理
* */
const home_img = require('@/assets/goHome.png');
// import './index.scss';
// 对话弹框
export default class BackBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			styleList: { 'left': '20px', bottom: '80px' }
		}
	}
	goHome() {
		console.log('返回首页')
		Yzg.exec('backCashier');
	}
	componentDidMount() {
		let btn = this.refs.tap
		btn.addEventListener('touchstart', (event) => {
			event.preventDefault();
			this.touchstart(event)
		}, false)
		btn.addEventListener('touchmove', (event) => {
            event.preventDefault();
			this.touchmove(event)
		}, false)
	}
	touchstart(event) {
		// console.log('开始')
		// var touch = event.touches[0]; //获取第一个触点
		// var x = Number(touch.pageX); //页面触点X坐标
		// var y = Number(touch.pageY); //页面触点Y坐标
		// let btn = this.refs.tap
	}
	touchmove(event) {
		let btn = this.refs.tap
		var docX = document.documentElement.clientWidth || document.body.clientWidth;
		var docY = document.documentElement.clientHeight || document.body.clientHeight;
		var touch = event.touches[0]; //获取第一个触点
		var x = Number(touch.pageX-40); //页面触点X坐标
		var y = Number(touch.pageY-40); //页面触点Y坐标
		//记录触点初始位置
		let { styleList } = this.state
		if(x<=0){
			x=0
		}
		if(y<=0){
			y=0
		}
		if(x>=docX-80){
			x=docX-80
		}
		if(y>=docY-80){
			y=docY-80
		}
		styleList = { left: x, top:y }
		this.setState({ styleList: styleList })
	}
	render() {
		let { styleList } = this.state
		return (
				<div className="backBtn" style={styleList}
					onTouchTap={this.goHome.bind(this)}
					ref="tap"
				>
					<img src={home_img} alt="" />
				</div>
		)
	}
}