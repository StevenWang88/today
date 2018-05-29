/*
* 编辑商品
* */
import DrawerHead1 from '../DrawerHead1';
import EditGood from './EditGood';
export default class EditGoodDrawer extends React.Component {

	render() {
		console.log('this.prop',this.props)
		return (
			<div className="good-drawer">
				<DrawerHead1 title="修改商品信息" />
				<EditGood {...this.props} />
			</div>
		)
	}
}