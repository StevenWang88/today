
import OrderGoods from './OrderGoods';
import ReturnGood from './ReturnGood';
import ReturnModal from './ReturnModal';
import { Modal } from 'antd';
import { accAdd, accMul } from '../../public/utils';
export default class OrderInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			orderInfo: [],
			hasReturn: false, //true 可以退货 false 不可以退货
			modalVisible: false,
			itemInfo: {},
			isOne: false,//true 单件 false整单,
			hasVip:false,//true有会员信息并且有会员定单  false没有
			customerInfo:{}
		}
		if (props.randId) this.searchSaleOrderForPad(props.randId);
		// if (props.customerId) this.searchCustomerInfo(props.customerId);
	}


	componentWillReceiveProps(nextProps) {
		console.log('nextProps',nextProps)
		if (nextProps.randId && nextProps.randId != this.props.randId) {
			this.searchSaleOrderForPad(nextProps.randId);
			this.setState({ orderInfo: [] });
			// if(nextProps.customerId){
			// 	this.searchCustomerInfo(nextProps.customerId)
			// }else{
			// 	this.setState({hasVip:false,customerInfo:{}})
			// }
		}
	}
	searchCustomerInfo(customerId){
		console.log('查询会员信息')
		let {customerInfo,hasVip}=this.state
		apiMap["searchCustomerInfo"].send({ customerId  }).then((res)=>{
			console.log('查询会员信息返回',res)
			if(res&&res.returnCode=='0000'){
				customerInfo.customerName=res.customerName||'会员无姓名'
				customerInfo.customerCardNum=res.customerCardNum||res.customerMobile
				this.setState({hasVip:true,customerInfo:customerInfo})
			}else{
				this.setState({hasVip:false,customerInfo:{}})
			}

		}).catch((err)=>{
			console.log('err',err)
		})		
	}
	 searchSaleOrderForPad(randId) {
		let self = this;
		// let {orderInfo}=this.state
		// self.setState({ orderInfo: [] });
		apiMap["searchSaleOrderForPad"].send({ randId }).then((json)=>{
			if (json && json.returnCode == "0000") {
				let arr = []
				let n = 0
				let OrderList = json.saleOrderList.map(function (item) {
					//ISCREDITS = false是销售商品，true是非销售商品
					item.ISCREDITS = (item.SALE_TYPE != 1 && item.SALE_TYPE != 2 && item.SALE_TYPE != 3 && item.SALE_TYPE != 5 && item.SALE_TYPE != 6 && item.SALE_TYPE != 7) ? false : true;
					if (!item.ISCREDITS && item.RETURN_FLAG != 2) {
						n++
						// 可以退货
					}
					// RETURN_FLAG==2  已结退货了
					// 
					item.NUMBER = 0;
					item.SALEID = "";
					item.CHECKRETURN = false;
					item.ISRETURN = "";
					
					return item;
				})
	
				if (n > 0) {
					// 还有商品可以退
					this.setState({ hasReturn: true });
				} else {
					this.setState({ hasReturn: false });
				}
				this.setState({ orderInfo: OrderList });
			} else {
				this.setState({ orderInfo: [] });
			}

		}).catch((err)=>{
			toast.info('网络繁忙请稍后再试！')
		})
		
	}

	getPayTypeName(payType) {
		if (payType == 0||payType == null) {
			return "现金支付"
		} else {
			return "扫码付"
		}
	}

	getSaleTypeName(saleType) {
		if (saleType == 0) {
			return "商品销售";
		} else if (saleType == 1) {
			return "积分兑换";
		} else if (saleType == 2) {
			return "退货";
		} else {
			return "其他";
		}
	}
	getGoodName(item) {
		var itemName = '商品销售'
		var saleType= Number(item.SALE_TYPE)
		switch (saleType) {
			case 0:
				itemName = '商品销售'
				break;
			case 1:
				itemName = '积分兑换'
				break;
			case 2:
				itemName = '赊账'
				break;
			case 3:
				itemName = '还款'
				break;
			case 4:
				itemName = '会员价销售'
				break;
			case 5:
				itemName = '零头减免'
				break;
			case 6:
				itemName = '邮政积分抵扣'
				break;
			case 7:
			itemName = '退货';
			if(item.RETURN_TYPE==3)itemName = '冲抵赊账';
			if(item.RETURN_TYPE==5)itemName = '冲抵零头减免';
				break;
			default:
				break;
		}
		console.log('itemName',itemName)
		return itemName
	}
	showModal(n, item) {
		console.log('n', n)
		// isOne: false,//true 单件 false整单
		let { isOne } = this.state
		if (n == 1) {
			// 整单
			isOne = false
		} else {
			// 单件
			isOne = true
		}
		console.log(isOne)
		this.setState({ modalVisible: true, itemInfo: item, isOne: isOne })
	}
	onChildChanged(modalVisible) {
		this.setState({ modalVisible: modalVisible })
		// itemInfo
	}
	showPrice(item){
		var type=item.SALE_TYPE
		var num=''
		if(type==0||type==1||type==4||type==7){
			if(item.SALE_PRICE||item.INTEGRAL_NUM){
				num=item.SALE_PRICE||item.INTEGRAL_NUM
			}
		}
		if(num){
			return '￥'+num
		}else{
			return ''
		}

	}

	render() {
		let { orderInfo, hasReturn, modalVisible, itemInfo, isOne,hasVip ,customerInfo} = this.state;
		let totalSalePrice = 0, totalProfit = 0, saleType, payType, returnAmount = 0;
		orderInfo.forEach(item => {
			if (item.SALE_NUM) {
				totalSalePrice = accAdd(totalSalePrice, item.TOTAL_PRICE);
				let templ = accMul(item.NUMBER, item.SALE_PRICE);
				returnAmount = accAdd(returnAmount, templ);
				totalProfit = accAdd(totalProfit, item.SALE_PROFIT);
			}
		});
		console.log('orderInfo',orderInfo)
		console.log('re', hasReturn)
		return (
			<div className="order-info-warp">
				{modalVisible ? <ReturnModal
					className="Image-box"
					modalVisible={modalVisible}
					itemInfo={itemInfo}
					isOne={isOne}
					callbackParent={this.onChildChanged.bind(this)}
					{...this.props}

				/> : ''}
				<h2 className="number">{this.props.randId}</h2>
				<div className="order-des rect-fff">
					<div className="row">
						<div className="row-sub">
							<span>销售额</span>
							<span className="number">￥{totalSalePrice}</span>
						</div>
						<span className="line"></span>
						<div className="row-sub">
							<span>利润额</span>
							<span className="number">￥{totalProfit}</span>
						</div>
					</div>
					<div className="row">
						<div className="row-sub">
							<span > 支付类型</span>
							<span className="number">{this.getPayTypeName(this.props.payType)}</span>
						</div>
						<span className="line"></span>
						<div className="row-sub">
							<span>交易类型</span>
							<span className="number">{this.getSaleTypeName(this.props.saleType)}</span>
						</div>
					</div>
					{hasVip?
						<div className="row">
						<div className="row-sub">
							<span > 会员姓名</span>
							<span className="number">{customerInfo.customerName}</span>
						</div>
						<span className="line"></span>
						<div className="row-sub">
							<span>会员卡号</span>
							<span className="number">{customerInfo.customerCardNum}</span>
						</div>
					</div>:''
					}
					
				</div>
				<OrderGoods>
					{orderInfo.map(item => (
						<div className="row" key={item.UPC}>
							<span className="row-1 name number"> {item.ITEM_NAME || this.getGoodName(item)}</span>
							<span className="row-1 name number">{item.UPC}</span>
							<span className="row-100 ">{this.showPrice(item)}</span>
							<span className="row-100">{item.SALE_TYPE == 7 ? item.RETURN_SALE_NUM : item.SALE_NUM}</span>
							<span className="row-100 number">&yen;{item.TOTAL_PRICE}</span>
							<span className="row-100 row-right">
								{
									(item.RETURN_FLAG == 2 && (item.SALE_TYPE == 0 || item.SALE_TYPE == 4)) || item.SALE_TYPE == 7 ? <button className="returnCheck" ref="goodIn">已退</button> : ''
								}
								{
									item.RETURN_FLAG != 2 && !item.ISCREDITS ? <button className="returnCheck"
										ref="goodIn" onTouchTap={this.showModal.bind(this, 2, item)}>退货</button> : ''

								}
							</span>
						</div>
					))}
				</OrderGoods>
				{hasReturn ?
					<div className="return-button">
						<div className="left-button" onTouchTap={this.showModal.bind(this, 1)}>整单退货</div>
					</div> : ''}

			</div>
		)
	}
}