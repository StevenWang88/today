/*
* 商品管理
* */
import LeftLayout from 'temp/spgl/LeftLayout'
import RightLayout from 'temp/spgl/RightLayout'
import { BackBtn} from 'temps';
import { Route } from 'react-router-dom'
import './index.scss';
// 对话弹框
export default class Spgl extends React.Component {
	render() {
		return (
			<div className="spgl-page pad-mian">
				<BackBtn/>
				<LeftLayout />
				<RightLayout />
			</div>
		)
	}
}