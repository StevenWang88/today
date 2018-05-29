import DrawerHead1 from '../DrawerHead1';
import { CellLine, SelectPopover } from 'temps';
import dateBox from 'core/dateBox';
import EventCreators from 'core/Subscriber';
import drawer from 'core/drawer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as spglActions from 'action/spgl';
import uleCheck from 'core/uleCheck';
class CheckStockDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodInfo: {
                upc: '',
                itemName: '',
                // manufactureTime: '2017-1-12',
                purPrice: '', //进货单价
                qty: '',//库存
            },
            defaultChecked: { name: '天', qualityPeriodUnit: 'D' }
        };
        this.stockInfo = {}
        this.list = [
            { name: '天', qualityPeriodUnit: 'D' },// "qualityPeriodUnit": "D",//保质期天数单位 Y年M月 D天
            { name: '月', qualityPeriodUnit: 'M' },
            { name: '年', qualityPeriodUnit: 'Y' },
        ]
    }
    componentWillMount() {
        // 盘库
        let { goodInfo } = this.props
        if(goodInfo.packageType != "2"){
        }else{
        goodInfo.qty = Number(goodInfo.qty).toFixed(2)
            
        }
        this.setState({ goodInfo: { ...goodInfo } })
        this.props.config.check(() => (
            this.check()
        ));
        let list = this.list
        for (var i = 0; i < list.length; i++) {
            if (list[i].qualityPeriodUnit == goodInfo.qualityPeriodUnit) {
                this.setState({ defaultChecked: list[i] })
            }
        }
        this.stockInfo = { ...goodInfo }
    }
    check() {
        let { goodInfo, defaultChecked } = this.state;
        goodInfo.qualityPeriodUnit = defaultChecked.qualityPeriodUnit
        let stockInfo = this.stockInfo
        let index = 0;
        Object.keys(goodInfo).forEach((key) => {
            if (goodInfo[key] !== stockInfo[key]) index++;
        })
        return index ? {} : null;

    }
    updateStock() {
        let ck = this.check()
        //如果修改了就执行保存库存，没有修改过直接返回
        if (ck) {
            let { goodInfo, defaultChecked } = this.state
            let validate = true
            let errMsg = ""
            if (!goodInfo.qty) {
                errMsg = "请填写库存总量！"
                validate = false
            } else if (!goodInfo.purPrice) {
                errMsg = "请填写进货单价！"
                validate = false
            }
            if (goodInfo.manufactureTime) {
                if (!goodInfo.qualityPeriod) {
                    validate = false
                    errMsg = "请填写保质期！"
                }
            }
            if (validate) {
                let option = {
                    upc: goodInfo.upc,
                    itemName: goodInfo.itemName,
                    manufactureTime: goodInfo.manufactureTime,
                    adjustPurPrice: goodInfo.purPrice, //进货单价
                    adjustQty: goodInfo.qty,//库存
                    fixQty: '0',//最低可调整库存量
                    qualityPeriod: goodInfo.qualityPeriod,
                    qualityPeriodUnit: defaultChecked.qualityPeriodUnit
                }
                console.log('更新库存的参数', option)
                let { changGoodInfo } = this.props
                apiMap.itemAdjust.send(option).then((res) => {
                    drawer.pop({ showBack: true })
                    console.log(res)
                    if (res && res.returnCode == "0000") {
                        console.log('盘库更新res', res)
                        let { g1GoodInfo, g1GoodStockList } = this.props
                        changGoodInfo()
                        let option = { pageNum: 1, upc: goodInfo.upc }
                        g1GoodStockList(option, "reset")
                        this.props.g1ShowGoodInfo(true, '1')
                        toast.info('盘库成功！')
                    }else{
                        toast.info('盘库失败！')
                    }
                })
            } else {
                toast.info(errMsg)
            }
        } else {
            drawer.pop({ showBack: true })
        }
    }
    //选择保质期单位
    checkUnit(list) {
        this.setState({ defaultChecked: list })
    }
    change(item, value) {
        let { goodInfo } = this.state
        switch (item) {
            case "qty":
            if(goodInfo.packageType != "2"){
                goodInfo.qty = uleCheck.quantityCheck(value)
            }else{
                goodInfo.qty = uleCheck.price(value)
            }
                break;
            case "purPrice":
                goodInfo.purPrice = uleCheck.price(value)
                break;
            case "qualityPeriod":
                goodInfo.qualityPeriod = uleCheck.qualityPeriod(value)
                break;
            default:
                break;
        }
        this.setState({ goodInfo: goodInfo })
    }
    //选择生产日期
    chooseTime(e) {
        var list=document.getElementsByClassName("stock-drawer")[0].getElementsByTagName("input");
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
    render() {
        let { goodInfo, defaultChecked } = this.state
        let list = this.list
        return (
            <div className="good-drawer stock-drawer">
                <DrawerHead1 title="盘库" />
                <div className="addGood_box">
                <div className="ule-cell-group">
                    <CellLine
                        label="商品名称 :"
                        placeHolder="请在商品信息页填写商品名称"
                        value={goodInfo.itemName}
                        disabled
                        className="ule-bb"
                    />
                    <CellLine
                        label="库存总量调整为 :"
                        placeHolder="请输入商品数量"
                        value={goodInfo.qty}
                        onChange={this.change.bind(this, 'qty')}
                        type="tel"
                        isRequired="true"
                    />
                    <CellLine
                        label="进货单价调整为 :"
                        placeHolder="请填写进货单价"
                        value={goodInfo.purPrice}
                        onChange={this.change.bind(this, 'purPrice')}
                        type="tel"
                        isRequired="true"
                    />
                    <CellLine
                        label="生产日期调整为 :"
                        placeHolder="请选择生产日期"
                        value={goodInfo.manufactureTime}
                        handleClick={this.chooseTime.bind(this)}
                        isLink
                    />
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
                </div>
                <p className="ule-bb tip">盘库是仓储整体清点处理后的操作，将覆盖该商品所有批次库存数据，请谨慎操作</p>
                </div>
                <div className="footer hide_btn">
                    <div className="ule-btn-group font-btn" onTouchTap={this.updateStock.bind(this)}>
                        <div className="ule-btn ule-btn-sure">
                            确认修改
						</div>
                    </div>
                </div>
            </div>
        )
    }
}
CheckStockDrawer.contextTypes = {
    config: PropTypes.object
}
export default connect(
    state => ({ data: state.data, goodInfo: state.g1GoodInfo }),
    dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(CheckStockDrawer);
