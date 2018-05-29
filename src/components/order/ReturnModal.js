const defaultImg = require('@/assets/no_good.png');
import { Modal, Button } from 'antd';
import uleCheck from 'core/uleCheck';
export default class ReturnModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: [
                '原价金额',
                '优惠金额',
                '零头减免',
                '赊账',
                '实收金额',
            ],
            oneTitle: [
                '商品名称',
                '条码',
                '原价金额',
                '优惠金额',
                '销售单价',
                '数量',
                '退货数量',
                '退货金额',
            ],
            realItem: {
                returnNum: 0,
                returnAllPrice: 0,//应退金额
                realPurprice: 0,//整单实收金额
                realSzPrice: 0,//提交的赊账金额
                returnPrice: 0,//退货金额
            },
            hasData: 0,//0在请求 1请求完成 2请求失败
            checkSz: true,  //赊账默认选中
            checkJm: true,//零头减免默认选中
            tipMeg: '正在计算中，请稍等...'
        }
    }
    componentWillMount() {
        let { modalVisible } = this.props
        if (modalVisible) {
            this.checkReturn()
        }
    }
    checkReturn() {
        // 退货验证
        var option = {}
        let { randId, itemInfo, isOne, } = this.props
        let { realItem, hasData } = this.state
        console.log('this.props', this.props)
        console.log('isOne', isOne)
        if (isOne) {
            option = {
                "randId": randId,
                "upc": itemInfo.UPC,
                "groupCode": itemInfo.EXT11,
                "saleItemType": itemInfo.EXT12,
                "activityCode": itemInfo.VILLAGE_ACTIVITY_CODE
            }
            console.log('单件参数退货验证', option)
        } else {
            option = {
                randId: randId
            }
            console.log('整单参数退货验证', option)
        }
        realItem.itemName = itemInfo.ITEM_NAME
        realItem.upc = itemInfo.UPC
        realItem.salePrice = itemInfo.SALE_PRICE
        realItem.salePrice = this.priceFix(realItem.salePrice)
        realItem.saleNum = itemInfo.SALE_NUM
        // PACKAGE_TYPE 2是新散货 1是老散货 退货都不可修改数量 0是包装可以修改
        realItem.packageType = itemInfo.PACKAGE_TYPE

        realItem.returnNum = Number(itemInfo.saleNum)
        this.setState({ realItem: realItem })
        hasData = 0
        // hasData:0//0在请求 1请求完成 2请求失败
        apiMap["padToReturn"].send(option).then((res) => {
            console.log('验证成功', res)
            if (res && res.returnCode == '0000') {
                hasData = 1
                var infoData = {}
                let { customerJawboneSummary } = res

                if (isOne) {
                    //  单件
                    let { saleOrder, resaleOrderSummary } = res
                    infoData = saleOrder
                    realItem.saleId = res.saleId
                    // 赊账金额
                    realItem.debtPrice = this.priceFix(resaleOrderSummary.debtPrice)
                    // 零头减免
                    realItem.reliefPrice = this.priceFix(resaleOrderSummary.reliefPrice)
                } else {
                    //    整单

                    let { saleOrderSummary } = res
                    infoData = saleOrderSummary
                    realItem.reliefPrice = this.priceFix(infoData.reliefPrice)
                    realItem.debtPrice = this.priceFix(infoData.debtPrice)
                    infoData.totalPrice = this.priceFix(infoData.totalPrice)

                    // 实收金额 总的 - 赊账 - 零头减免
                    realItem.realPurprice = infoData.totalPrice - infoData.debtPrice - infoData.reliefPrice

                    realItem.realPurprice = this.priceFix(realItem.realPurprice)

                }
                infoData.discountTotalPrice = Number(infoData.discountTotalPrice)
                infoData.totalPrice = Number(infoData.totalPrice)
                realItem.realPrice = infoData.discountTotalPrice + infoData.totalPrice //原价金额
                realItem.realPrice = this.priceFix(realItem.realPrice)
                realItem.discountTotalPrice = infoData.discountTotalPrice //优惠金额
                realItem.discountTotalPrice = this.priceFix(realItem.discountTotalPrice)
                realItem.totalPrice = infoData.totalPrice //总金额
                realItem.totalPrice = this.priceFix(realItem.totalPrice)
                realItem.returnNum = Number(infoData.saleNum) //退货数量
                realItem.MaxNum = Number(infoData.saleNum)
                realItem.returnPrice = infoData.totalPrice //退货金额
                realItem.allSzPrice = 0 //总的可设置的金额
                // 获取最大可抵扣的设置金额
                var maxSzPrice = realItem.totalPrice
                if (realItem.reliefPrice > 0) {
                    maxSzPrice = realItem.totalPrice
                    realItem.totalPrice = Number(realItem.totalPrice)
                    if (realItem.totalPrice > realItem.reliefPrice) {
                        maxSzPrice = realItem.totalPrice - realItem.reliefPrice
                    }

                }
                //商品 赊账金额
                var dPrice = realItem.debtPrice
                //    用户总的赊账金额
                var userSzPrice = 0
                realItem.jawboneMoney = 0
                if (customerJawboneSummary) {
                    userSzPrice = customerJawboneSummary.jawboneMoney
                    realItem.jawboneMoney = customerJawboneSummary.jawboneMoney
                }
                console.log('realItem.totalPrice', realItem.totalPrice)
                console.log('商品赊账金额', dPrice)
                console.log('用户总赊账金额', userSzPrice)
                console.log('maxSzPrice', maxSzPrice)
                if (dPrice >= userSzPrice) {
                    //商品 赊账的金额 大于 用户赊账金额
                    realItem.allSzPrice = dPrice
                } else {
                    if (maxSzPrice <= userSzPrice) {
                        realItem.allSzPrice = maxSzPrice
                    } else {
                        realItem.allSzPrice = userSzPrice
                    }
                }
                console.log('realItem.allSzPrice', realItem.allSzPrice)
                realItem.realSzPrice = realItem.allSzPrice
                realItem.realSzPrice = this.priceFix(realItem.realSzPrice)
                this.setState({ realItem: realItem })
                this.setPrice()
            } else {
                console.log('在计算利润')
                if (res.returnMessage) {
                    let { tipMeg } = this.state
                    if (res.saleId) {
                        tipMeg = '正在计算利润...'
                    } else {
                        tipMeg = res.returnMessage
                    }
                    this.setState({ tipMeg: tipMeg })
                }
                hasData = 2
            }
            this.setState({ hasData: hasData })
        }).catch((err) => {
            hasData = 2
            console.log('err验证失败', )
            this.setState({ hasData: hasData })
        })
    }
    reload() {
        // 刷新流水
        let { isOne, randId, refreshOrderList } = this.props
        refreshOrderList({ type: 'reset' })
    }
    hideModal() {
        // 关闭对话框
        this.props.callbackParent(false);
    }
    inputChange(type, event) {
        // 输入退货数量发生改变
        let { value } = event.target
        let { realItem } = this.state
        let { itemInfo } = this.props;
        if (type == 'returnNum') {
            if (value >= realItem.MaxNum) {
                value = realItem.MaxNum
            }
            // realItem.returnNum = value
            if (itemInfo.PACKAGE_TYPE != "2") {
                realItem.returnNum = uleCheck.quantityCheck(value)
            } else {
                realItem.returnNum = uleCheck.price(value)
            }
        }
        if (type == 'realSzPrice') {
            console.log('realItem.allSzPrice', realItem.allSzPrice)
            realItem.allSzPrice = this.priceFix(realItem.allSzPrice)
            if (Number(value) > realItem.allSzPrice) {
                value = realItem.allSzPrice
            }
            // realItem.realSzPrice = value
            realItem.realSzPrice = uleCheck.price(value)
        }
        this.setState({ realItem: realItem })
        this.setPrice()
    }
    checkBoxChang(type) {
        let { checkSz, checkJm, realItem } = this.state
        let { isOne } = this.props
        if (type == 'debtPrice') {
            checkSz = !checkSz

        } else {
            checkJm = !checkJm
        }
        var szPrice = 0, jmPrice = 0;
        if (checkSz && realItem.debtPrice > 0) {
            szPrice = realItem.realSzPrice
            szPrice = this.priceFix(szPrice)
        } else {
            szPrice = 0
        }
        if (checkJm && realItem.reliefPrice > 0) {
            jmPrice = realItem.reliefPrice
            jmPrice = this.priceFix(jmPrice)
        } else {
            jmPrice = 0
        }
        jmPrice = Number(jmPrice)
        console.log('realItem.totalPrice ', realItem.totalPrice)
        if (isOne) {
            realItem.returnAllPrice = realItem.returnPrice - szPrice - jmPrice
        } else {
            realItem.returnAllPrice = realItem.totalPrice - szPrice - jmPrice
        }
        realItem.returnAllPrice = this.priceFix(realItem.returnAllPrice)
        this.setState({ checkSz: checkSz, checkJm: checkJm, realItem: realItem })
    }
    setPrice() {
        // 计算应退总金额
        let { realItem, checkSz, checkJm } = this.state
        let { isOne } = this.props
        var szPrice = 0, jmPrice = 0;
        if (checkSz && realItem.debtPrice > 0) {

            szPrice = realItem.realSzPrice
            szPrice = this.priceFix(szPrice)
        } else {
            szPrice = 0
        }
        if (checkJm && realItem.reliefPrice > 0) {
            jmPrice = realItem.reliefPrice
            jmPrice = this.priceFix(jmPrice)
        } else {
            jmPrice = 0
        }
        if (isOne) {
            realItem.returnAllPrice = realItem.returnPrice - szPrice - jmPrice
        } else {
            realItem.returnAllPrice = realItem.totalPrice - szPrice - jmPrice
        }
        realItem.returnAllPrice = this.priceFix(realItem.returnAllPrice)
        this.setState({ realItem: realItem })
    }
    setRealSzPrice() {
        // 设置最大的可赊账的金额
        let { realItem } = this.state
        var maxSzPrice = realItem.returnPrice
        if (realItem.reliefPrice > 0) {
            maxSzPrice = realItem.returnPrice
            realItem.returnPrice = Number(realItem.returnPrice)
            if (realItem.returnPrice > realItem.reliefPrice) {
                maxSzPrice = realItem.returnPrice - realItem.reliefPrice
            }
        }
        //商品 赊账金额
        var dPrice = realItem.debtPrice
        //    用户总的赊账金额
        var userSzPrice = realItem.jawboneMoney
        if (dPrice >= userSzPrice) {
            //商品 赊账的金额 大于 用户赊账金额
            realItem.allSzPrice = dPrice
        } else {
            if (maxSzPrice <= userSzPrice) {
                realItem.allSzPrice = maxSzPrice
            } else {
                realItem.allSzPrice = userSzPrice
            }
        }
        realItem.allSzPrice = this.priceFix(realItem.allSzPrice)
        console.log('realItem.allSzPrice', realItem.allSzPrice)
        realItem.realSzPrice = realItem.allSzPrice
        realItem.realSzPrice = this.priceFix(realItem.realSzPrice)
        this.setState({ realItem: realItem })
        this.setPrice()
    }
    priceFix(num) {
        num = Number(num)
        if (num) {
            return num.toFixed(2)
        } else {
            return 0
        }
    }
    inputBlur(type, event) {
        // 失去焦点
        console.log('失去焦点')
        let { value } = event.target
        let { realItem, hasData } = this.state
        let { isOne } = this.props
        if (!value || value == 0) {
            if (type == 'returnNum') {
                realItem.returnNum = realItem.MaxNum
            }
        }
        if (isOne) {
            realItem.returnPrice = realItem.returnNum * realItem.salePrice
        } else {
            realItem.returnPrice = realItem.totalPrice
        }
        realItem.returnPrice = this.priceFix(realItem.returnPrice)

        this.setState({ realItem: realItem })
        if (isOne) {
            this.setRealSzPrice()
        }

    }
    szBlur(type, event) {
        let { value } = event.target
        let { realItem, hasData } = this.state
        let { isOne } = this.props
        if (!value || value == 0) {
            if (type == 'realSzPrice') {
                console.log(6, realItem.allSzPrice)
                realItem.realSzPrice = realItem.allSzPrice
            }
        }
        this.setState({ realItem: realItem })
        this.setPrice()
    }
    confirmOrder() {
        // 点击确认退货
        let { isOne, randId, refreshOrderList } = this.props
        let option = {}
        let { realItem, hasData, checkSz, checkJm, } = this.state
        if (hasData != 1) {
            this.hideModal()
            return
        }
        var realSzPrice = ''
        var reliefPrice = ''
        if (checkSz && realItem.debtPrice > 0) {
            realSzPrice = realItem.realSzPrice
        } else {
            realSzPrice = ''
        }
        if (checkJm && realItem.reliefPrice > 0) {
            reliefPrice = realItem.reliefPrice
        } else {
            reliefPrice = ''
        }
        if (isOne) {
            // 单件退货
            option = {
                "saleId": realItem.saleId,
                "returnNum": realItem.returnNum,
                "reliefPrice": reliefPrice,//零头减免
                "debtPrice": realSzPrice,// 赊账
            }
            console.log('单件退货参数', option)
        } else {
            // 整单退货
            option = {
                "randId": randId,
                debtPrice: realSzPrice
            }
            console.log('整单退货参数', option)
        }
        apiMap["padDoSaleReturn"].send(option).then((res) => {
            console.log('退货接口返回', res)
            if (res && res.returnCode == '0000') {
                toast.info('退货成功')
                this.reload()
            } else {
                toast.info('退货失败')
            }

        }).catch((err) => {
            console.log('退货失败', err)
        })
        this.props.callbackParent(false);
    }
    render() {
        let { imageUrl, disabled, modalVisible, isOne, itemInfo } = this.props;
        let { title, oneTitle, realItem, hasData, checkSz, checkJm, tipMeg } = this.state;
        return (
            <div>
                <div className="modal_box" >
                    <Modal
                        wrapClassName="vertical-center-modal order-info-modal"
                        visible={disabled ? false : modalVisible}
                        onCancel={this.hideModal.bind(this)}
                        ancelText={false}
                        footer={null}
                        closable={false}
                        mask={true}
                        maskClosable={false}
                    >
                        <div style={{ 'margin': '20px 0' }} className="order-info-table">
                            {hasData == 1 ? <div>
                                {isOne ?
                                    <div>
                                        <div className="order-info-tr order-tb-head">
                                            {oneTitle.map((item, index) => (<div className="flex" key={index}>{item}</div>))}
                                        </div>
                                        <div className="order-info-tr">
                                            <div className="ellipsis">{itemInfo.ITEM_NAME}</div>
                                            <div>{itemInfo.UPC}</div>
                                            <div>&yen;{realItem.realPrice}</div>
                                            <div>&yen;{realItem.discountTotalPrice}</div>
                                            <div>&yen;{this.priceFix(itemInfo.SALE_PRICE)}</div>
                                            <div>{itemInfo.SALE_NUM}</div>
                                            <div>
                                                <input
                                                    placeholder="数量"
                                                    type="tel"
                                                    className="price"
                                                    value={realItem.returnNum}
                                                    style={{ "width": "100%", 'textAlign': 'center' }}
                                                    onChange={this.inputChange.bind(this, 'returnNum')}
                                                    onBlur={this.inputBlur.bind(this, 'returnNum')}
                                                    readOnly={realItem.packageType == 0 ? false : true}

                                                />
                                                {
                                                    // readOnly
                                                    // readOnly={realItem.packageType == 0 ? false : true}
                                                }

                                            </div>
                                            <div className="price">&yen;{realItem.returnPrice}</div>
                                        </div>
                                    </div> :
                                    <div>
                                        <div className="order-info-tr order-tb-head">
                                            {title.map((item, index) => (<div className="flex" key={index}>{item}</div>))}
                                        </div>
                                        <div className="order-info-tr">
                                            <div>&yen;{realItem.realPrice}</div>
                                            <div>&yen;{realItem.discountTotalPrice}</div>
                                            <div>&yen;{realItem.reliefPrice}</div>
                                            <div className="price">&yen;{realItem.debtPrice}</div>
                                            <div className="price">&yen;{realItem.realPurprice}</div>
                                        </div>
                                    </div>}
                                <div className="one-check">
                                    {realItem.debtPrice > 0 ?
                                        <div className="check-g">
                                            <input type="checkbox" id="shezhang"
                                                checked={checkSz ? 'checked' : ''}
                                                onChange={this.checkBoxChang.bind(this, 'debtPrice')}
                                                name="radio1" />
                                            <label htmlFor="shezhang">扣除赊账-&yen;</label>
                                            <input type="tel"
                                                value={realItem.realSzPrice}
                                                className="sz-input"
                                                readOnly={checkSz ? false : true}
                                                onChange={this.inputChange.bind(this, 'realSzPrice')}
                                                onBlur={this.szBlur.bind(this, 'realSzPrice')}

                                            />
                                        </div> : ''}
                                    {
                                        realItem.reliefPrice > 0 && isOne ? <div className="check-g">
                                            <input type="checkbox"
                                                checked={checkJm ? 'checked' : ''}
                                                id="jiemian" name="radio1"
                                                onChange={this.checkBoxChang.bind(this, 'jiemian')}
                                            />
                                            <label htmlFor="jiemian"> 扣除零头减免:<span>-&yen;</span>{realItem.reliefPrice}</label>
                                        </div> : ''
                                    }

                                </div>
                                <div style={{ "margin": "10px 20px", 'textAlign': 'right' }}>
                                    应退金额（现金）：<span className="price" style={{ "fontWeight": "bold", "fontSize": '20px' }}>&yen;{realItem.returnAllPrice}</span>
                                </div>
                            </div> :
                                <div style={{ "fontSize": "20px", 'padding': '15px 150px' }}>
                                    {tipMeg}
                                </div>
                            }

                            <div className="return-btn">
                                <div className="return-cancel" onTouchTap={this.hideModal.bind(this)}>取消</div>
                                <div className="return-confirm"
                                    className={`return-confirm ${hasData != 1 ? 'unbtn' : ''}`}
                                    onTouchTap={this.confirmOrder.bind(this)} >确定</div>
                            </div>
                        </div>

                    </Modal>
                </div>
            </div>
        );
    }
}
