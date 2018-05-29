import DrawerHead1 from '../DrawerHead1';
import { CellLine, SelectPopover } from 'temps';
import EventCreators from 'core/Subscriber';
import dateBox from 'core/dateBox';
import { connect } from 'react-redux';
import * as spglActions from 'action/spgl';
import { bindActionCreators } from 'redux';
import drawer from 'core/drawer';
import uleCheck from 'core/uleCheck';
class AddStockDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockInfo: {
                itemName: '',
                purNum: '',
                purPrice: '',
                manufactureTime: '',
                qualityPeriodUnit: '',
                packageType: '',//
                upc: '',
                qualityPeriod: ''
            },
            defaultChecked: { name: '天', qualityPeriodUnit: 'D' }

        }
        this.list = [
            { name: '天', qualityPeriodUnit: 'D' },// "qualityPeriodUnit": "D",//保质期天数单位 Y年M月 D天
            { name: '月', qualityPeriodUnit: 'M' },
            { name: '年', qualityPeriodUnit: 'Y' },
        ]
    }
    //选择保质期单位
    checkUnit(list) {
        let { defaultChecked } = this.state
        this.setState({ defaultChecked: list })
    }
    change(item, value) {
        let { stockInfo } = this.state
        switch (item) {
            case "purNum":
                if(stockInfo.packageType != "2"){
                    stockInfo.purNum = uleCheck.quantityCheck(value)
                }else{
                    stockInfo.purNum = uleCheck.price(value)
                }
                break;
            case "purPrice":
                stockInfo.purPrice = uleCheck.price(value)
                break;
            case "qualityPeriod":
                stockInfo.qualityPeriod = uleCheck.qualityPeriod(value)
                break;
            default:
                break;
        }

        this.setState({ stockInfo: stockInfo })
    }
    check() {
        let { stockInfo } = this.state
        let index = 0;
        Object.keys(stockInfo).forEach((key) => {
            if (stockInfo[key] && key != 'itemName' && key != 'packageType' && key != 'upc' && key != "qualityPeriodUnit") index++;
        })
        return index ? {} : null;
    }
    saveStock() {
        let { stockInfo, defaultChecked } = this.state
        stockInfo.qualityPeriodUnit = defaultChecked.qualityPeriodUnit
        this.setState({ stockInfo: stockInfo })
        let ck = this.check()
        if (ck) {
            // 有填写内容然后验证是否都填写完整
            //填写了生产日期一定要填写保质期 
            let { stockInfo } = this.state
            let validate = true
            let errMsg = ""

            if (!stockInfo.purNum) {
                errMsg = "请填写进货数量！"
            } else if (!stockInfo.purPrice) {
                errMsg = "请填写进货价格！"
            }
            
            if (stockInfo.manufactureTime) {
                if (!stockInfo.qualityPeriod) {
                    validate = false
                    errMsg = "请填写保质期！"
                }
            }
            Object.keys(stockInfo).forEach((key) => {
                if (key != 'qualityPeriodUnit' && key != 'qualityPeriod' && key != "manufactureTime"&&key != 'packageType' ) {
                    if (!stockInfo[key]) {
                        validate = false
                    }
                }

            })
            // 都填写了就执行否则不执行
            if (validate) this.addStock();
            else {
                // toast.info('请填写库存相关信息！')
                toast.info(errMsg)
            }
        console.log('errMsg',errMsg)
        } else {
            drawer.pop({ showBack: true })
        }
        
    }
    //新增入库
    addStock() {
        let { stockInfo } = this.state
        let option = { pageNum: 1, upc: stockInfo.upc }
        let { g1GoodStockList,changGoodInfo } = this.props
        apiMap.addItemQtyHen.send(stockInfo).then((res) => {
            if (res.returnCode = "0000") {
                changGoodInfo()
                g1GoodStockList(option, "reset")
                toast.info('新增库成功！')
            }else{
                toast.info('新增库失败!')
            }
        })
        drawer.pop({ showBack: true })
    }
    componentWillMount() {
        let { goodInfos } = this.props
        let { stockInfo } = this.state
        stockInfo.itemName = goodInfos.itemName
        stockInfo.upc = goodInfos.upc
        //添加包装类型
        stockInfo.packageType = goodInfos.packageType
        this.setState({ stockInfo: stockInfo })
        this.props.config.check(() => (
            this.check()
        ));
    }
    //选择生产日期
    chooseTime(e) {
        var list=document.getElementsByClassName("stock-drawer")[0].getElementsByTagName("input");
		for(var i=0;i<list.length;i++){
			list[i].blur()
		}
        e.preventDefault()
        let time = ''
        let { stockInfo } = this.state
        EventCreators.once('SELECT', ({ label: time }) => {
            stockInfo.manufactureTime = moment(time).format("YYYY-MM-DD")
            this.setState({ stockInfo: stockInfo })
        })
        dateBox.open()
    }
    render() {
        let { stockInfo, defaultChecked } = this.state
        let list = this.list
        return (
            <div className="good-drawer stock-drawer">
                <DrawerHead1 title="新增入库" />
                <div className="ule-cell-group good-list addGood_box" >
                    <CellLine
                        label="商品名称 :"
                        placeHolder="请在商品信息页填写商品名称"
                        disabled
                        className="ule-bb"
                        value={stockInfo.itemName}
                    />
                    <CellLine
                        label="进货数量 :"
                        placeHolder="请输入进货数量"
                        value={stockInfo.purNum}
                        onChange={this.change.bind(this, 'purNum')}
                        type="tel"
                        isRequired="true"
                    />
                    <CellLine
                        label="进货价格 :"
                        placeHolder="请输入进货价格"
                        value={stockInfo.purPrice}
                        onChange={this.change.bind(this, 'purPrice')}
                        type="tel"
                        isRequired="true"
                    />
                    <CellLine
                        label="生产日期 :"
                        placeHolder="请选择生产日期"
                        handleClick={this.chooseTime.bind(this)}
                        isLink
                        value={stockInfo.manufactureTime}
                        disabled
                    />
                    <CellLine
                        label="保质期 :"
                        placeHolder="请填写保质期"
                        rightLabel={
                            <SelectPopover
                                iClick={(i) => { this.checkUnit(i) }} list={list}
                                defaultChecked={defaultChecked} />
                        }
                        value={stockInfo.qualityPeriod}
                        onChange={this.change.bind(this, 'qualityPeriod')}
                        type="tel"
                    />
                </div>
                <div className="footer hide_btn">
                    <div className="ule-btn-group font-btn" onTouchTap={this.saveStock.bind(this)}>
                        <div className="ule-btn ule-btn-sure">
                            确认新增
						</div>
                    </div>
                </div>
            </div>
        )
    }
}
AddStockDrawer.contextTypes = {
    config: PropTypes.object
}

export default connect(
    state => ({ goodInfos: state.g1GoodInfo }),
    dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(AddStockDrawer)
