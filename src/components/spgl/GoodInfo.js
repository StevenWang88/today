import { ImageBox, CellLine } from 'temps';
import { Switch } from 'antd';
export default class GoodInfo extends React.Component {
	constructor(props) {
		super(props);
		let { goodInfo } = this.props
		console.log('goodinfo',goodInfo)
		if(goodInfo.memPrice){
			goodInfo.memPrice=parseFloat(goodInfo.memPrice).toFixed(2)
		}
		if(goodInfo.memPrice==0){
			goodInfo.memPrice=0
		}
	}
	render() {
		let { goodInfo } = this.props
		return (
			<div className="table-1">
				<div className="ule-flex head-info mb-20">
					<ImageBox 
					className="Image-box" 
					imageUrl={goodInfo.imageUrl} 
					disabled={true}
					/>
					<div className="ule-cell-group">
						<CellLine
							label="商品编码 :"
							textAlgin="right"
							disabled
							value={goodInfo.upc}
							placeHolder="可点击右上按钮扫码获取"
						/>
						<CellLine
							label="商品名称 :"
							placeHolder="请填写商品名称"
							textAlgin="right"
							disabled
							value={goodInfo.itemName}
						/>
						<CellLine
							label="商品分类 :"
							placeHolder="请选择商品分类"
							textAlgin="right"
							disabled
							value={goodInfo.itemTypeName}
						/>
					</div>
				</div>

				{/* 销售价格部分 */}
				<div className="mb-20">
					<div className="ule-cell-group-more">
						<CellLine
							label="销售单价 :"
							placeHolder="请填写销售单价"
							textAlgin="right"
							value={'¥ '+String(goodInfo.salePrice?parseFloat(goodInfo.salePrice).toFixed(2):'')}
							disabled
						/>
						<span className='line'></span>
						<CellLine
							label="会员单价 :"
							textAlgin="right"
							value={goodInfo.memPrice}
							disabled
						/>
					</div>
					<div className="ule-cell-group-more ule-cell-group-last">
						<CellLine
							label="商品规格 :"
							value={goodInfo.standart}
							textAlgin="right"
							placeHolder="如灌装，毫升数"
							disabled
						/>
						<span className='line'></span>
						<CellLine
							label="商品单位 :"
							textAlgin="right"
							value={goodInfo.unitName}
							disabled
						/>
					</div>
				</div>


				<div className="ule-cell-group mb-20">
					<CellLine
						label="保质期 :"
						textAlgin="right"
						content={<div>
							<span>{goodInfo.qualityPeriod} 
							{goodInfo.qualityPeriodUnit=="Y"?"年":''}
							{goodInfo.qualityPeriodUnit=="M"?"月":''}
							{goodInfo.qualityPeriodUnit=="D"?"天":''}
							</span>
						</div>}
						disabled
					/>
				</div>
				<div className="ule-cell-group mb-20">
					<CellLine
						label="库存剩余 :"
						textAlgin="right"
						disabled
						value={String(goodInfo.qty?parseFloat(goodInfo.qty).toFixed(2):'')}
					/>
				</div>
				{
					/*
					<div className="ule-cell-group mb-20">
					<CellLine
						label="库存剩余 :"
						textAlgin="right"
						disabled
						rightLabel={
                            <Switch defaultChecked  />
                        }
					/>
				</div>
				*/ 
				}

				<div className="footer">
					<div className="ule-btn-group font-btn " onTouchTap={() => { this.props.setDrawer() }}>
						<div className="ule-btn ule-btn-sure">
							修改商品信息
						</div>
					</div>
				</div>
			</div>
		)
	}
}