
import FilterDrawer from './FilterDrawer';
import ChooseTime from './ChooseTime';
import TimeSelect from './TimeSelect';
import EditGoodDrawer from './EditGoodDrawer';
import AddClassDrawer from './AddClassDrawer';
import AddGoodDrawer from './AddGoodDrawer';
import SelectCalssDrawer from './SelectCalssDrawer';
import TimeDrawer from './TimeDrawer';
import CheckStockDrawer from './CheckStockDrawer';
import AddStockDrawer from './AddStockDrawer';
import EditStockDrawer from './EditStockDrawer';
import UpdateTimeDrawer from './UpdateTimeDrawer';
import {
	CHOOSE_SEARCG_FILTER,
	STARTANDEND_TIME,
	SELECT_TIME_TJ,
	G1_GOOD_EDIT_DRA,
	G1_ADD_GOOD_CLASSIFY,
	G1_ADD_GOOD,
	G1_SELECT_MORE,
	G1_FILTERS_GOODS,
	G1_CHECK_STOCK,
	G1_ADD_STOCK,
	G1_EDIT_STOCK,
	G1_UPDATE_TIME,
} from './types';

const configDrawer = {
	// 配置抽屉的类型
	[CHOOSE_SEARCG_FILTER] : FilterDrawer,
	[STARTANDEND_TIME] : TimeSelect,
	[SELECT_TIME_TJ] : ChooseTime,
	[G1_GOOD_EDIT_DRA] : EditGoodDrawer,
	[G1_ADD_GOOD_CLASSIFY] : AddClassDrawer,
	[G1_ADD_GOOD] : AddGoodDrawer,
	[G1_SELECT_MORE] : SelectCalssDrawer,
	[G1_FILTERS_GOODS] : TimeDrawer,
	[G1_CHECK_STOCK]:CheckStockDrawer,
	[G1_ADD_STOCK]:AddStockDrawer,
	[G1_EDIT_STOCK]:EditStockDrawer,
	[G1_UPDATE_TIME]:UpdateTimeDrawer,
}


export default class DrawerView extends React.Component{
	render(){
		const View = configDrawer[this.props.box];
		return(
			<View {...this.props}/>
		)
	}
}
