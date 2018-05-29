/*



*编辑商品详情



*/
import { CellLine, ImageBox, SelectPopover } from 'temps';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as spglActions from 'action/spgl';
import cache from 'core/cache';
import { G1_SELECT_MORE, STARTANDEND_TIME } from 'drawerTypes';
import drawer from 'core/drawer';
import EventCreators from 'core/Subscriber';
import spglApi from "../../../api/spglApi"
import uleCheck from 'core/uleCheck';
const { PropTypes } = React;
import { Switch } from 'antd';
class EditGood extends React.Component {
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
                standart: '',     //商品规格
                unitName: '',     //商品单位
                qualityPeriod: '',//保质期
                purNum: '', //进货数量
                qualityPeriodUnit: '',
                manufactureTime: '',
                image: '',
                imageUrl: '',
                memPrice:'',//会员价格，
                packageType:'1'
            },
            unitName: '',
            defaultChecked: { name: '天', qualityPeriodUnit: 'D' },
            showN:0
        }
        this.list = [
            { name: '天', qualityPeriodUnit: 'D' },// "qualityPeriodUnit": "D",//保质期天数单位 Y年M月 D天
            { name: '月', qualityPeriodUnit: 'M' },
            { name: '年', qualityPeriodUnit: 'Y' }
        ]
        this.defaultInfo = {}
    }

    static propTypes = {
        config: PropTypes.object,
    }

    check() {
        let { goodInfo } = this.state;
        let defaultInfo = this.defaultInfo
        let index = 0;
        Object.keys(goodInfo).forEach((key) => {
            if (goodInfo[key] !== defaultInfo[key]) index++;
        })
        return index ? {} : null;
    }

    componentWillMount() {
        console.log('编辑')
        // 获取详情详情
        console.log('this.props',this.props)
        let { goodInfos,infoData} = this.props
        let list = this.list
        if(infoData){
			goodInfos.upc=infoData.UPC?infoData.UPC:''
			goodInfos.standart=infoData.SPEC?infoData.SPEC:'' 
			goodInfos.itemName=infoData.STANDARD_NAME?infoData.STANDARD_NAME:''
            goodInfos.imageUrl=infoData.IMAGES?infoData.IMAGES:''
			goodInfos.salePrice=infoData.PRICE?infoData.PRICE:''
		}
        for (var i = 0; i < list.length; i++) {
            if (list[i].qualityPeriodUnit == goodInfos.qualityPeriodUnit) {
                this.setState({ defaultChecked: list[i] })
            }
        }
        this.setState({ goodInfo: { ...goodInfos }, classify: goodInfos.itemTypeName })
        this.props.config.check(() => (
            this.check()
        ));
        this.defaultInfo = { ...goodInfos }
    }
    saveGood(item) {
        let isEdit = this.check()
        let { goodInfo,showN } = this.state
        let {infoData} = this.props
        let errMsg = ""
        if(infoData){
            // 如果是收银台过来默认修改过
            isEdit={}
        }
        //isEdit null 就是没有修改 {}就是修改过
        if (isEdit) {
            if (!goodInfo.itemName) {
                errMsg = "请填写商品名称！"
            } else if (!goodInfo.itemTypeName) {
                errMsg = "请选择商品分类！"
            } else if (!goodInfo.salePrice) {
                errMsg = "请填写商品销售价格！"
            } else if (!goodInfo.unitName) {
                errMsg = "请选择商品单位！"
            }
            if (errMsg && errMsg.length > 0) {
                toast.info(errMsg)
            } else {
                let {memPrice,salePrice}=goodInfo
                if(memPrice&&salePrice&&memPrice>salePrice){
                  toast.info('会员价大于销售价')
                  showN++
                this.setState({showN:showN})
                if(showN<=1){
                    return
                }
                }
                this.updateGood(item)
            }
        } else {
            //  没有修改过，直接返回
            drawer.pop({ showBack: true })
        }
    }
    updateGood(item) {
        console.log('aaa1',item)
        
        let { goodInfos, changGoodInfo } = this.props
        let { goodInfo, defaultChecked } = this.state
        let src = goodInfo.image || goodInfo.imageUrl
        let ab;
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = src;
        let  option={}
        console.log('src', img.src )
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
            this.setState({ goodInfo: goodInfo })
             option = {
                upc: goodInfo.upc, //编码
                itemName: goodInfo.itemName || '', //名称
                salePrice: goodInfo.salePrice || '', //销售价格
                itemTypeId: goodInfo.itemTypeId || '',//商品分类id
                standart: goodInfo.standart || '',//商品规格
                packageType: goodInfo.packageType, //
                unitId: goodInfo.unitId ,//商品单位id 
                qualityPeriodUnit: defaultChecked.qualityPeriodUnit || '',//保质期单位
                qualityPeriod: goodInfo.qualityPeriod || '', //保质期,
                image: ab || '',
                imageUrl: ab ? '' : goodInfo.imageUrl,   //图片
                memPrice:goodInfo.memPrice,
            }
            goodInfo.qualityPeriodUnit = defaultChecked.qualityPeriodUnit
            this.changGood(option)
        }
        img.onerror = () => {
            src=''
            option = {
                upc: goodInfo.upc, //编码
                itemName: goodInfo.itemName || '', //名称
                salePrice: goodInfo.salePrice || '', //销售价格
                itemTypeId: goodInfo.itemTypeId || '',//商品分类id
                standart: goodInfo.standart || '',//商品规格
                packageType:  goodInfo.packageType, //
                unitId: goodInfo.unitId ,//商品单位id 
                qualityPeriodUnit: defaultChecked.qualityPeriodUnit || '',//保质期单位
                qualityPeriod: goodInfo.qualityPeriod || '', //保质期,
                image: ab || '',
                imageUrl: ab ? '' : goodInfo.imageUrl,   //图片
                memPrice:goodInfo.memPrice,  
            }
            goodInfo.qualityPeriodUnit = defaultChecked.qualityPeriodUnit
            this.changGood(option)
        }
        if(!src){
             option = {
                upc: goodInfo.upc, //编码
                itemName: goodInfo.itemName || '', //名称
                salePrice: goodInfo.salePrice || '', //销售价格
                itemTypeId: goodInfo.itemTypeId || '',//商品分类id
                standart: goodInfo.standart || '',//商品规格
                packageType:  goodInfo.packageType, //
                unitId: goodInfo.unitId ,//商品单位id 
                qualityPeriodUnit: defaultChecked.qualityPeriodUnit || '',//保质期单位
                qualityPeriod: goodInfo.qualityPeriod || '', //保质期,
                image: ab || '',
                imageUrl: ab ? '' : goodInfo.imageUrl,   //图片
                memPrice:goodInfo.memPrice,  
            }
            goodInfo.qualityPeriodUnit = defaultChecked.qualityPeriodUnit
            this.changGood(option)
        }
    }
    changGood(option){
        let { goodInfos, changGoodInfo } = this.props
        let { goodInfo, defaultChecked } = this.state
        console.log('修改参数',option)
        spglApi.UpdateItem(option).then((res) => {
            console.log('res',res)
            if (res.returnCode == "0000") {
                drawer.pop({ showBack: true })
                let { g1GoodInfo } = this.props
                changGoodInfo({ itemTypeName: goodInfo.itemTypeName })
                console.log('goodInfo.upc',goodInfo.upc)
                this.upDateUpc(goodInfo.upc)
                toast.info('更新成功')
            } else {
                toast.info('更新失败')
            }
        }).catch((err) => {
            console.log('err', err)
            toast.info('更新失败!')
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
        // value = String(value)
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
                goodInfo.purNum = uleCheck.price(value)
            default:
                break;
        }
        this.setState({ goodInfo: goodInfo })
    }
    //选择保质期单位
    checkUnit(list) {
        let {goodInfo}=this.state
        goodInfo.qualityPeriodUnit=list.qualityPeriodUnit
        this.setState({ defaultChecked: list,goodInfo:goodInfo })
    }
    //打开相册
    openPhoto() {
        // 原生的方法打开相册
        let { goodInfo } = this.state
        console.log('编辑商品打开相册',goodInfo)
        if(goodInfo.packageType==2){
            toast.info('散货不能修改图片!')
            return
        }
        Yzg.exec('toAlbumPage', (url) => {
            console.log(url)
            goodInfo.image = url
            this.setState({ goodInfo: goodInfo })
        })
    }
    // 打开相机
    takePhoto() {
        console.log('编辑商品打开相机')
        // 原生的方法打开相机
        let { goodInfo } = this.state
        if(goodInfo.packageType==2){
            toast.info('散货不能修改图片!')
            return
        }
        Yzg.exec('toCameraPage', (url) => {
            console.log(url)
            goodInfo.image = url
            this.setState({ goodInfo: goodInfo })
        })
    }
     onChange(checked) {
        console.log(`switch to ${checked}`);
      }
      
    render() {
        let { defaultChecked, goodInfo } = this.state
        let list = this.list
        return (
            <div className="addGood_box">
                <div className="ule-flex">
                    <ImageBox className="Image-box"
                        imageUrl={goodInfo.image || goodInfo.imageUrl}
                        openPhoto={this.openPhoto.bind(this)}
                        takePhoto={this.takePhoto.bind(this)}
                    />
                    <div className="good-list good-head ule-cell-group">
                        <CellLine
                            label="商品编码 :"
                            textAlgin="center"
                            value={goodInfo.upc}
                            placeHolder="可点击右上按钮扫码获取"
                            onChange={this.change.bind(this, 'upc')}
                            disabled
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
                            // value={goodInfo.itemTypeName}
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
                    
                    <div className="ule-cell-group-more  ule-cell-group-last">

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
                    
                </div>
                {/* 进货数量 */}
                <div className="footer hide_btn">
                    <div className="ule-btn-group font-btn" onTouchTap={this.saveGood.bind(this, goodInfo)}>
                        <div className="ule-btn ule-btn-sure">
                            确认修改
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({ goodInfos: state.g1GoodInfo }),
    dispatch => ({ ...bindActionCreators({ ...spglActions }, dispatch) })
)(EditGood);
