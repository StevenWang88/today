



import GoodsContainer from './GoodsContainer';
import EmptyContainer from './EmptyContainer';
import GoodInfoMain from './GoodInfoMain';
import code from 'core/code';
export default class RightLayout extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		let { list } = this.props;
		return (
			<div className="sub-layout right-layout">
				<header>
					<span>全部商品</span>
				</header>
				<div className="right-container">
					<GoodsContainer/>
				</div>
				<GoodInfoMain />
			</div>
		)
	}
}