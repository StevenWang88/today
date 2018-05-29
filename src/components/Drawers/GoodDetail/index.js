/*



* 新增加商品



*/
import { Icon, Popover ,Switch} from 'antd';
import { CellLine, ImageBox, SelectPopover } from 'temps';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as spglActions from 'action/spgl';
import cache from 'core/cache';
import { G1_SELECT_MORE, STARTANDEND_TIME } from 'drawerTypes';
import drawer from 'core/drawer';
import EventCreators from 'core/Subscriber';
import dateBox from 'core/dateBox';
import code from 'core/code';
import uleCheck from 'core/uleCheck';
import spglApi from "../../../api/spglApi"
const { PropTypes } = React;
const defaultImg = require('@/assets/no_good.png');

class GoodDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			classify: '',
			goodInfo: {
				upc: '',
				itemName: '',
				itemTypeName: '',
				salePrice: '',
				purPrice: '',
				memPrice: '',     //会员价
				standart: '',     //商品规格
				unitName: '',     //商品单位
				qualityPeriod: '',//保质期
				purNum: '', //进货数量
				qualityPeriodUnit: '',
				manufactureTime: '',
				image: '',
				imageUrl: '',
				packageType:1
			},
			imgeUrl: '',
			unitName: '',
			defaultChecked: { name: '天', qualityPeriodUnit: 'D' },
			isClick: true,
			showN:0
		}


		this.list = [
			{ name: '天', qualityPeriodUnit: 'D' },// "qualityPeriodUnit": "D",//保质期天数单位 Y年M月 D天
			{ name: '月', qualityPeriodUnit: 'M' },
			{ name: '年', qualityPeriodUnit: 'Y' }
		]
	}

	static propTypes = {
		config: PropTypes.object,
	}

	check() {
		let { goodInfo } = this.state
		let index = 0;
		Object.keys(goodInfo).forEach((key) => {
			if (goodInfo[key]) index++;
		})
		return index ? {} : null;
	}
	//扫描生成编码
	getCode() {
		//原生获取商品编码
		let { goodInfo } = this.state
		console.log('扫码录入detail')
		Yzg.exec('openQRCode', (data) => {
			//处理返回的数据得到编码
			if (data && data.status) {
				goodInfo.upc = data.qrResult
				this.setState({ goodInfo: goodInfo })
			}
		});

	}
	//自动生成编码
	changCode() {
		//100001 随机组合
		let { goodInfo } = this.state
		var num = Math.random() * 100001 + 100000;
		num = parseInt(num, 10);
		goodInfo.upc = num
		this.setState({ goodInfo: goodInfo })
		console.log('自动生成')
	}
	componentWillMount() {
		// 获取详情详情
		let { g1SearchGoodsFilter, chassifyList,infoData } = this.props
		let { goodInfo } = this.state
		let activeTypeIndex = _.findIndex(chassifyList, { seqId: g1SearchGoodsFilter.itemTypeId });
		// rn出现的弹窗
		if(infoData){
			goodInfo.upc=infoData.UPC?infoData.UPC:''
			goodInfo.standart=infoData.SPEC?infoData.SPEC:'' 
			goodInfo.itemName=infoData.STANDARD_NAME?infoData.STANDARD_NAME:''
			goodInfo.imageUrl=infoData.IMAGES?infoData.IMAGES:''
			goodInfo.salePrice=infoData.PRICE?infoData.PRICE:''
		}
		if (activeTypeIndex >= 0) {
			let name = chassifyList[activeTypeIndex].typeName
			goodInfo.itemTypeName = name
			goodInfo.itemTypeId = g1SearchGoodsFilter.itemTypeId
			this.setState({ goodInfo: goodInfo, classify: chassifyList[activeTypeIndex].typeName })
		}

		this.props.config.check(() => (
			this.check()
		));
		code.getCode = this.getCode.bind(this)
	}
	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (this.state != nextState)
	// 	  return true
	// }
	saveGood(item) {
		let { goodInfo, defaultChecked } = this.state
		let validate = true
		let errMsg = ""
		Object.keys(goodInfo).forEach((key) => {
			if (!goodInfo[key] && key != 'qualityPeriodUnit' && key != "image"&&key != "imageUrl" && key != "standart"
				&& key != 'qualityPeriod' && key != 'manufactureTime'
				&& key != 'memPrice' 
			) {
				validate = false
				if (!goodInfo.upc) {
					errMsg = "请填写商品编码！"
				} else if (!goodInfo.itemName) {
					errMsg = "请填写商品名称！"
				} else if (!goodInfo.itemTypeName) {
					errMsg = "请选择商品分类！"
				} else if (!goodInfo.salePrice) {
					errMsg = "请填写商品销售价格！"
				} else if (!goodInfo.purPrice) {
					errMsg = "请填写商品进货价格！"
				} else if (!goodInfo.unitName) {
					errMsg = "请选择商品单位！"
				} else if (!goodInfo.purNum) {
					errMsg = "请填写进货数量！"
				}
			}
			if (goodInfo[key] && key == 'manufactureTime') {
				if (!goodInfo.qualityPeriod) {
			    	validate = false
					errMsg = "请填写保质期！"
				}
			}

		})
		if (validate) this.addGood(item);
		else {
			toast.info(errMsg)
		}
	}
	addGood(item) {
		
		this.setState({ isClick: false })
		let { goodInfo, defaultChecked,showN } = this.state
		let {memPrice,salePrice}=goodInfo
		showN+=1
		this.setState({showN:showN})
		if(memPrice&&salePrice&&memPrice>salePrice){
			toast.info('会员价大于销售价')
			showN++
			this.setState({showN:showN})
			if(showN<=1){
				return
			}
		  }
		var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext('2d');
		var img = new Image();
		let src = goodInfo.image || defaultImg
		let ab;
		if (src.indexOf("base64") > -1) {
			img.src = src;
			img.onload = () => {
				var width = img.width;
				var height = img.height;
				var rate = (width < height ? width / height : height / width);
				canvas.width = 300;
				canvas.height = 300;
				if (src.indexOf("base64") > -1) {
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					ab = canvas.toDataURL("image/jpeg", 0.7).split(",")[1]
					goodInfo.image = ab
				}
				goodInfo.qualityPeriodUnit = defaultChecked.qualityPeriodUnit
				this.setState({ goodInfo: goodInfo })
				this.upGood(goodInfo)
			}
		} else {
			goodInfo.qualityPeriodUnit = defaultChecked.qualityPeriodUnit
			this.setState({ goodInfo: goodInfo })
			this.upGood(goodInfo)
		}
	}
	upGood(option) {
		if(!option.qualityPeriod){
			option.qualityPeriodUnit=''
		}
		console.log('新增商品参数option',option)
		spglApi.AddItem(option).then((res) => {
			console.log('新增商品返回结果', res)
			if (res && res.returnCode == "0000") {
				let { g1FilterMerge, g1StartRequireGoods } = this.props;
				g1FilterMerge({ ...{ pageNum: '1' } })
				g1StartRequireGoods({ type: 'reset' })
				toast.info("添加成功")
				console.log('option.upc',option.upc)
				this.upDateUpc(option.upc)
				drawer.pop({ showBack: true })
			} else {
				toast.info(res.message)
			}
			this.setState({ isClick: true })
		}).catch((err) => {
			console.log('新增商品错误', err)
			this.setState({ isClick: true })
			toast.info("添加失败，请稍后再试！")

		})

	}
	upDateUpc(upc){
		//同步收银台
        Yzg.exec("syncItemByUpc",{upc:upc},(data)=>{
        })
    }
	changClass() {
		let { goodInfo } = this.state
		drawer.push({ box: G1_SELECT_MORE, config: { type: 'class', seqId: goodInfo.itemTypeId } })
		console.log('选择分类', goodInfo)
		let classify = goodInfo.itemTypeName
		EventCreators.once('SELECT', ({ id, label: classify, seqId }) => {
			goodInfo.itemTypeName = classify
			goodInfo.itemTypeId = seqId
			this.setState({ classify: classify, goodInfo: goodInfo })
		})
	}
	chooseUnit() {
		let { goodInfo } = this.state
		drawer.push({ box: G1_SELECT_MORE, config: { type: 'unit', seqId: goodInfo.unitId } })
		EventCreators.once('SELECT', ({ id, label: unitName, seqId }) => {
			goodInfo.unitName = unitName
			goodInfo.unitId = seqId
			this.setState({ goodInfo: goodInfo })
		})
	}
	change(item, value) {
		let { goodInfo } = this.state
		console.log(value)
		switch (item) {
			case "upc":
				goodInfo.upc = uleCheck.upc(value)
				break;
			case "itemName":
				goodInfo.itemName = uleCheck.itemName(value)
				break;
			case "itemTypeName":
				goodInfo.itemTypeName = uleCheck.itemName(value)
				break;
			case "salePrice":
				goodInfo.salePrice = uleCheck.price(value)
				break;
			case "purPrice":
				goodInfo.purPrice = uleCheck.price(value)
				break;
			case "memPrice":
				goodInfo.memPrice = uleCheck.price(value)
				break;
			case "unitName":
				goodInfo.unitName = value
				break;
			case "qualityPeriod":
				goodInfo.qualityPeriod = uleCheck.qualityPeriod(value)
				break;
			case "standart":
				goodInfo.standart = uleCheck.itemName(value)
				break;
			case "purNum":
			if(goodInfo.packageType != "2"){
				goodInfo.purNum = uleCheck.quantityCheck(value)
			}else{
				goodInfo.purNum = uleCheck.price(value)
			}
			default:
				break;
		}
		this.setState({ goodInfo: goodInfo })
	}
	//选择保质期单位
	checkUnit(list) {
		this.setState({ defaultChecked: list })
	}
	//选择生产日期
	chooseTime(e) {
		var list=document.getElementsByClassName("addGood_box")[0].getElementsByTagName("input");
		for(var i=0;i<list.length;i++){
			list[i].blur()
		}
		e.preventDefault()
		let time = ''
		let { goodInfo } = this.state
		EventCreators.once('SELECT', ({ label: time }) => {
			goodInfo.manufactureTime = moment(time).format("YYYY-MM-DD")
			this.setState({ goodInfo: goodInfo })
		})
		dateBox.open()
	}
	//打开相册
	openPhoto() {
		console.log('新增商品打开相册')
		// 原生的方法打开相册
		let { goodInfo, imgeUrl } = this.state
		Yzg.exec('toAlbumPage', (url) => {
			goodInfo.image = url
			imgeUrl = url
			this.setState({ goodInfo: goodInfo, imgeUrl: imgeUrl })
		})
	}
	// 打开相机
	takePhoto() {
		console.log('新增商品打开相机')
		// 原生的方法打开相机
		let { goodInfo, imgeUrl } = this.state
		Yzg.exec( 'toCameraPage', (url) => {
			goodInfo.image = url
			imgeUrl = url
			this.setState({ goodInfo: goodInfo, imgeUrl: imgeUrl })
		})
	}

	render() {
		let { defaultChecked, goodInfo, isClick, imgeUrl, isPeriod } = this.state
		let { code } = this.props
		let list = this.list
		return (
			<div className="addGood_box">
				<div className="ule-flex">
					<ImageBox
						className="Image-box"
						imageUrl={imgeUrl}
						openPhoto={this.openPhoto.bind(this)}
						takePhoto={this.takePhoto.bind(this)}
					/>
					<div className="good-list good-head ule-cell-group">
						<CellLine
							label="商品编码 :"
							rightLabel={<span className="ule-blue" onTouchTap={this.changCode.bind(this)}>自动生成</span>}
							textAlgin="center"
							value={goodInfo.upc}
							placeHolder="请填写商品编码"
							onChange={this.change.bind(this, 'upc')}
							type="tel"
							isRequired="true"
						/>
						<CellLine
							label="商品名称 :"
							placeHolder="请填写商品名称"
							value={goodInfo.itemName}
							onChange={this.change.bind(this, 'itemName')}
							isRequired="true"
						/>
						<CellLine
							label="商品分类 :"
							placeHolder="请选择商品分类"
							value={this.state.classify}
							disabled
							isLink
							handleClick={this.changClass.bind(this, 'itemTypeName')}
							isRequired="true"
						/>
					</div>
				</div>
				{/* 销售价格部分 */}
				<div className="good-list good-content">
					<div className="ule-cell-group-more">
						<CellLine
							label="销售单价 :"
							placeHolder="请填写销售单价"
							value={goodInfo.salePrice}
							onChange={this.change.bind(this, 'salePrice')}
							type="tel"
							isRequired="true"
						/>
						<span className='line'></span>
						<CellLine
							label="会员单价 :"
							placeHolder="请填写会员单价"
							value={goodInfo.memPrice}
							type="tel"
							onChange={this.change.bind(this, 'memPrice')}
						/>
					</div>
					<div className="ule-cell-group-more">
						<CellLine
							label="商品规格 :"
							placeHolder="如灌装，毫升数"
							value={goodInfo.standart}
							onChange={this.change.bind(this, 'standart')}
						/>
						<span className='line'></span>
						<CellLine
							label="商品单位 :"
							placeHolder="请选择商品销售单位"
							value={goodInfo.unitName}
							disabled
							isLink
							onChange={this.change.bind(this, 'unitName')}
							handleClick={this.chooseUnit.bind(this, 'unitName')}
							isRequired="true"
						/>
					</div>
					<div className="ule-cell-group-more ule-cell-group-last">

						<CellLine
							label="保质期 :"
							placeHolder="请填写保质期"
							rightLabel={
								<SelectPopover
									iClick={(i) => { this.checkUnit(i) }} list={list}
									defaultChecked={defaultChecked} />
							}
							value={goodInfo.qualityPeriod}
							onChange={this.change.bind(this, 'qualityPeriod')}
							type="tel"
						/>
						<span className='line'></span>
						<CellLine
							label="生产日期 :"
							placeHolder="请选择生产日期"
							disabled
							isLink
							value={goodInfo.manufactureTime}
							handleClick={this.chooseTime.bind(this)}
						/>
					</div>
				</div>
				{/* 进货数量  ule-cell-group */}
				<div className="ule-cell-group-more  ule-cell-group-last">
					<CellLine
						label="进货数量 :"
						placeHolder="请填写进货数量"
						value={goodInfo.purNum}
						onChange={this.change.bind(this, 'purNum')}
						type="tel"
						isRequired="true"
					/>
					<span className="line"></span>
					<CellLine
						label="进货单价 :"
						placeHolder="请填写进货单价"
						value={goodInfo.purPrice}
						onChange={this.change.bind(this, 'purPrice')}
						type="tel"
						isRequired="true"
					/>
				</div>
				{
					/*
						<div className="ule-cell-group-more ule-cell-group-last">

				<CellLine
					label="推送投屏 :"
					placeHolder=""
					rightLabel={
						<Switch defaultChecked onChange={this.onChange} />
					}
					type="tel"
					disabled
				/>
			</div>

					*/ 
				}
			
				<div className="footer hide_btn">
					<div className="ule-btn-group font-btn" >
						<button type="button" className="ule-btn ule-btn-sure" disabled={!isClick} onTouchTap={this.saveGood.bind(this, goodInfo)}>
							{isClick ? '保  存' : '正在保存'}
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({ chassifyList: state.g1GoodsNavMenu, g1SearchGoodsFilter: state.g1SearchGoodsFilter }),
	dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(GoodDetail);
