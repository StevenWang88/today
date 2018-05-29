/*
* 商品列表
* goods-item  class  ygq  已过期  jgq 将过期
* */

const img1 = require('@/assets/no_good.png');




export default class GoodItem extends React.Component{
	handleImageErrored(item) {
		this.refs.itemImg.src=img1
    }
	render(){
		let {item,iClick} = this.props;
		return(
			<li className={`goods-item ${item.qualityPeriodStatus==2?'ygq':''} ${item.qualityPeriodStatus==1?'jgq':''?'ygq':''} `} onTouchTap={iClick}>
				<div className={`pic-box animated fadeIn ${item.imageUrl?'':'no_image'}`} >
					{item.imageUrl?<img 
						  onError={this.handleImageErrored.bind(this,item)}
						 src={item.imageUrl || img1} ref="itemImg" alt=""/>:<span className="no_imageName">{(item.itemName?(item.itemName).substring(0,1):'')}</span>}
					{item.qualityPeriodStatus==2?<span className="status">已过期</span>:''}
					{item.qualityPeriodStatus==1?<span className="status">将过期</span>:''}
				</div>
				<div className="des-box ule_ellipsis">
					<p className="name ule_ellipsis">{item.itemName}</p>
					<p className="price ule-bb"><span>定价 : &yen;{item.salePrice?parseFloat(item.salePrice).toFixed(2):""}</span> 
					<span>剩 { item.packageType == 2 && item.qty?parseFloat(item.qty).toFixed(2): parseInt(item.qty)} {item.unitName}</span></p>
				</div>
			</li>
		)
	}
	
}
GoodItem.propTypes = {
	item : PropTypes.object.isRequired,
	iClick : PropTypes.func.isRequired,
}