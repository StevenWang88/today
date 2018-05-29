import DrawerHead1 from '../DrawerHead1';
import { CellLine, SelectPopover } from 'temps';
import dateBox from 'core/dateBox';
import EventCreators from 'core/Subscriber';
import drawer from 'core/drawer';
import { bindActionCreators } from 'redux';
import * as spglActions from 'action/spgl';
import { connect } from 'react-redux';
import uleCheck from 'core/uleCheck';
class EditStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockInfo: {
                itemName: '',
                purTime: "",
                qty: '',
                purPrice: '',
                ext8: '',//进货时间
                itemQtyId: ''
            },
        }
        this.defauleStockInfo = {}
        this.fixQty = 0 //最新库存可调整为
    }

    componentWillMount() {
        let { goodInfos, config } = this.props

        let { stockInfo } = this.state
        let stockItem = config.stockItem
        stockInfo.ext8 = stockItem.ext8
        stockInfo.qty = stockItem.qty
        stockInfo.purPrice = stockItem.purPrice
        stockInfo.itemQtyId = stockItem.seqId
        stockInfo.itemName = goodInfos.itemName
          //添加包装类型
         stockInfo.packageType = goodInfos.packageType
        this.setState({ stockInfo: stockInfo })
        this.props.config.check(() => (
            this.check()
        ));
        this.defauleStockInfo = { ...stockInfo }
    }
    check() {
        let { stockInfo } = this.state;
        let defauleStockInfo = this.defauleStockInfo
        let index = 0;
        Object.keys(stockInfo).forEach((key) => {
            if (stockInfo[key] !== defauleStockInfo[key]) {
                index++;
            }
        })
        return index ? {} : null;
    }
    editStock() {
        let { stockInfo } = this.state
        let { goodInfos } = this.props
        let errMsg = ""
        this.setState({ stockInfo: stockInfo })
        let ck = this.check()
        let option = { pageNum: 1, upc: goodInfos.upc }
        let { stockList, g1GoodStockList, changGoodInfo } = this.props //批次列表
        
        if (!ck) {
            drawer.pop({ showBack: true })
        } else {
            if (!stockInfo.qty) {
                errMsg = "请填写商品数量！"
            } else if (!stockInfo.purPrice) {
                errMsg = "请填写进货单价！"
            }
            if (errMsg && errMsg.length > 0) {
                toast.info(errMsg)
            } else {
                //修改了信息再执行修改
                apiMap.updataItemQty.send(stockInfo).then((res) => {
                    if (res.returnCode == '0000') {
                        changGoodInfo()
                        g1GoodStockList(option, "reset")
                        drawer.pop({ showBack: true })
                    }
                    toast.info(res.message)
                })
            }
        }

    }
    change(item, value) {
        let { stockInfo } = this.state
        value = uleCheck.price(value)
        switch (item) {
            case "qty":
            console.log('stockInfo',stockInfo)
            console.log('stockInfo.qty',stockInfo.qty)
            if(stockInfo.packageType != "2"){
                value=String(value)
                stockInfo.qty = uleCheck.quantityCheck(value)
            }else{
                stockInfo.qty = value
            }
                // stockInfo.qty = value
                break;
            case "purPrice":
                stockInfo.purPrice = value
                break;
            default:
                break;
        }
        this.setState({ stockInfo: stockInfo })

    }
    render() {
        let { stockInfo } = this.state
        return (
            <div className="good-drawer stock-drawer edit-drawer">
                <DrawerHead1 title="修改库存" />
                <div className="ule-cell-group good-list addGood_box">
                    <CellLine
                        label="商品名称 :"
                        placeHolder="请在商品信息页填写商品名称"
                        disabled
                        className="ule-bb"
                        value={stockInfo.itemName}
                    />
                    <CellLine
                        label="进货日期 :"
                        placeHolder="请选择进货日期"
                        disabled
                        className="ule-bb"
                        value={stockInfo.ext8}
                    />
                    <CellLine
                        label="商品数量 :"
                        placeHolder="请输入商品数量"
                        value={stockInfo.qty}
                        onChange={this.change.bind(this, 'qty')}
                        type="tel"
                        isRequired="true"
                    />
                    <CellLine
                        label="进货单价 :"
                        placeHolder="请输入进货单价"
                        value={stockInfo.purPrice}
                        onChange={this.change.bind(this, 'purPrice')}
                        type="tel"
                        isRequired="true"
                    />
                </div>
                <div className="footer hide_btn">
                    <div className="ule-btn-group font-btn" onTouchTap={this.editStock.bind(this)}>
                        <div className="ule-btn ule-btn-sure">
                            确认修改
						</div>
                    </div>
                </div>
            </div>
        )
    }
}
EditStock.contextTypes = {
    config: PropTypes.object
}
export default connect(
    state => ({ goodInfos: state.g1GoodInfo, stockList: state.g1GoodStockList }),
    dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(EditStock)
