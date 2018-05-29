
import * as spglActions from 'action/spgl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { G1_FILTERS_GOODS, G1_ADD_GOOD ,G1_GOOD_EDIT_DRA} from 'drawerTypes';
import drawer from 'core/drawer';
class AddShopBtn extends React.Component {
	addShop(data) {
		// let { setDrawer } = this.props;
		let option={
			show: true,//抽屉默认是不显示的
			box: G1_ADD_GOOD,//显示哪一个抽屉内容
			showPopover:true,
		}
		if(data){
			option.infoData=data
		}
		drawer.push(option)
	}
	editShop(data){
		let option = { show: true, showPopover: true, box: G1_GOOD_EDIT_DRA, config: {},infoData:data }
		drawer.push(option)
	}
	componentWillMount(){
		var _this=this
		var infoData={
			UPC:'1',
			STANDARD_NAME:'1',//商品名称
			SPEC:'1',//规格
			IMAGES:'',//图片地址
			SALES_UNIT:'',//商品单位
		}
		// rn 进来判断是否显示新增弹窗
		Yzg.exec('perfectInfo', function (data) {
			if(data.status&&data.data){
				var hasAdd=data.data
				if(hasAdd.isAddGood){
			     	_this.addShop(data.data)
				}else{
					_this.editShop(data.data)
				}
			}
		});
	}
	render() {
		let { iClick } = this.props;
		return (
			<div className="add-goods" onTouchTap={this.addShop.bind(this)}>
				<i className="ule-icon icon-add"></i>
				<span>新增商品</span>
			</div>
		)
	}
}
// AddShopBtn.propTypes = {
// 	iClick: PropTypes.func
// }
export default connect(
	null,
	dispatch => ({ ...bindActionCreators({...spglActions }, dispatch) })
)(AddShopBtn);