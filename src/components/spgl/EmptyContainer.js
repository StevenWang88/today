
import AddShopBtn from './AddShopBtn';

const img1 = require('@/assets/kongbaitishi2.png');
export default class EmptyContainer extends React.Component{
	render(){
		return(
			<section className="g-empty sub-container">
				<AddShopBtn/>
				<div className="empty-pic">
					<img src={img1} alt=""/>
				</div>
			</section>
		)
	}
}