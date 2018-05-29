/*
* 新建商品分类
* **/


import DrawerHead1 from '../DrawerHead1';
import { CellLine } from 'temps';
import drawer from 'core/drawer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClassifyManage from '../../spgl/ClassifyManage';
import * as shglActions from 'action/spgl';
import uleCheck from 'core/uleCheck';
class AddClassDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.classChange = null
        this.state = {
            itemName: '',
            title: ''
        }
        this.type = ''
        this.defaultName = ''
    }
    saveClass() {
        let { config } = this.props
        let { chassifyList } = this.props
        let { g1RsestClassifyList } = this.props;
        let { itemName } = this.state
        this.classChange = ClassifyManage.get(g1RsestClassifyList);
        //type :edit修改分类名称 add新添加分类
        let option = {
            itemTypeName: itemName
        }
        let checked = this.check()   //弹框的逻辑和点击保存相反
        if (this.type == 'add') {
            if (checked) {
                this.addClass(option)
            } else {
                toast.info('请填写分类名称!')
            }

        } else {
            if (checked) {
                option.itemTypeId = config.item.seqId
                this.upClass(option)
            } else {
                toast.info('还未修改名称!')
            }
        }
    }
    addClass(option) {
        let searchOption = { pageNum: 1, itemTypeId: '' }
        let isChangClass=false
        let { g1FilterMerge, g1StartRequireGoods, g1ShowGoodInfo, config } = this.props
        apiMap.addItemType.send(option).then((res) => {
            // console.log('res',res)
            if (res && res.returnCode == "0000") {
                if (config && config.isHome) {
                    isChangClass=true
                    searchOption.itemTypeId = res.itemType.seqId
                    g1FilterMerge(searchOption)
                    g1StartRequireGoods({ type: 'reset' })
                    this.props.g1ShowGoodInfo(false);
                }
                this.classChange.add(res.itemType,isChangClass)
                drawer.pop({ showBack: true })
                toast.info("添加分类成功!")
                this.homeUpItemType()
            } else {
                toast.info("已有同名分类，请换一个分类名!")
            }
        })

    }
    upClass(option) {
        let { config } = this.props
        let { itemName } = this.state
        apiMap.updataItemType.send(option).then((res) => {
            if (res && res.returnCode == "0000") {
                let index = config.index
                this.classChange.update(index, itemName)
                drawer.pop({ showBack: true })
                toast.info('修改成功!')
                this.homeUpItemType()
            } else {
                toast.info('已有同名分类，请换一个分类名！')
            }
        })
    }
    homeUpItemType(){
      // 同步分类到收银台
      console.log('同步分类到收银')
        Yzg.exec("syncItemTypes")
    }
    change(value) {
        value = uleCheck.itemName(value)
        this.setState({ itemName: value })
    }
    componentWillMount() {
        let { config } = this.props
        let type = this.type = config.type
        let itemName = ''
        if (config && type == 'edit') {
            this.defaultName = config.item.typeName
            itemName = config.item.typeName
        }
        this.setState({ itemName: itemName, title: config.title })

        this.props.config.check(() => (
            this.check()
        ));
    }
    check() {
        let type = this.type
        let defaultName = this.defaultName
        let { itemName } = this.state
        if (type == 'edit') {
            if (defaultName == itemName) {
                return null
            } else {
                return {}
            }
        } else {
            if (itemName && itemName.length > 0 && itemName.length <= 20) {
                return {}
            } else {
                return null
            }
        }

    }
    render() {
        let { itemName, title } = this.state
        return (
            <div className="good-drawer animated slideInRight">
                <DrawerHead1 title={title} />

                <div className="good-list add-class-layout">
                    <div className="ule-cell-group mb-20" style={{ 'width': '100%' }}>
                        <CellLine
                            label="分类名称 :"
                            textAlgin="left"
                            placeHolder="请输入分类名称"
                            value={itemName}
                            onChange={this.change.bind(this)}
                            className="class-input"
                        />
                    </div>
                    <div className="ule-btn-group font-btn hide_btn" onTouchTap={this.saveClass.bind(this)}>
                        <div className="ule-btn ule-btn-sure">保 存</div>
                    </div>
                </div>
            </div>
        )
    }
}

AddClassDrawer.contextTypes = {
    config: PropTypes.object
}
export default connect(
    state => ({ chassifyList: state.g1GoodsNavMenu }),
    dispatch => ({ ...bindActionCreators({ ...shglActions }, dispatch) })
)(AddClassDrawer)