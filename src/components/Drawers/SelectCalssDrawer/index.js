/*
*  统一下拉组件
* **/



import DrawerHead1 from "../DrawerHead1"
import { Icon } from 'antd';
import "./selectCalss.scss"
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { G1_ADD_GOOD_CLASSIFY } from 'drawerTypes';
import drawer from 'core/drawer';
import EventCreators from 'core/Subscriber';
import PullRefresh from 'reactjs-pull-refresh';
import { setTimeout } from "timers";

class SelectCalssDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkId: '',
            title: '选择分类',
            list: {}
        }
    }
    back() {
        drawer.pop();
    }
    changSele(event,{ id, typeName: label, seqId }) {
        EventCreators.on('SELECT', { id, label, seqId });
        setTimeout(()=>{
            drawer.pop();
        },0)
    }
    //新建分类
    addClassIfy() {
        let option = {
            show: true,
            box: G1_ADD_GOOD_CLASSIFY,
            config: {
                title: '新建商品分类',
                type: 'add'
            }

        }
        drawer.push(option)
    }
    componentWillMount() {
        let { chassifyList } = this.props
        let unitList = JSON.parse(local.get('unitList'))
        let { type, seqId } = this.props.config
        let reList = []
        if (type == 'class') {
            reList = chassifyList
            this.setState({ list: chassifyList })
        } else {
            reList = unitList
            unitList = unitList.map((data) => {
                data.typeName = data.name
                data.seqId = data.id
                return data
            })
            this.setState({ list: unitList })
        }

        this.setState({ checkId: seqId })

    }
    componentDidMount(){
        let {list,checkId}=this.state
        let scrollBox = document.querySelector('.chassifyBox .rc-scroll')
        let index= _.findIndex(list, { seqId:checkId });
        let h = 64
        if (list && scrollBox && (list.length - index) >= 9) {
            scrollBox.style.transform = 'translate3d(0,-' + h * (index) + 'px,0)'
        }

    }
    render() {
        let { checkId, list } = this.state;
        let { chassifyList } = this.props;
        let { type } = this.props.config
        return (
            <div className="good-drawer select-drawer animated slideInRight">
                <DrawerHead1 title={type == 'class' ? '选择分类' : '选择单位'}
                    left={
                        <i className="ule-icon icon-left"></i>
                    }
                    back={this.back.bind(this)}
                />
                {type == 'class' ? <div className="ule-flex flex-between ule-group head-group">
                    <div className="ule-row flex-center" onTouchTap={this.addClassIfy.bind(this)}>
                        <i className="ule-icon icon-add"></i>
                        <span>新建商品分类</span>
                    </div>
                </div>
                    : ''}
                <div className="chassifyBox">
                    <PullRefresh {...{
                        maxAmplitude: 80,
                        debounceTime: 30,
                        throttleTime: 100,
                        deceleration: 0.001,
                        loadMore: false,
                        refresh: false,
                        hasMore: false
                    }}>

                        {(type == 'class' ? chassifyList : list).map((item, index) =>
                            <div className={`ule-flex flex-between ule-group  font-bold ${checkId === item.seqId ? 'checked' : ''}`}
                                key={index}
                                onTouchTap={this.changSele.bind(this,event, item)}>
                                <div className="ule-row flex-between ">
                                    <span>{item.typeName}</span>
                                    {checkId == item.seqId ?
                                        <i className="ule-icon icon-checked"></i>
                                        : ''
                                    }
                                </div>
                            </div>
                        )}
                    </PullRefresh>
                </div>

            </div>
        )

    }
}
SelectCalssDrawer.contextTypes = {
    hide: PropTypes.func,
    config: PropTypes.object,
    drawerBack2: PropTypes.func,
};
export default connect(
    state => ({ drawer: state.drawer, drawer2: state.drawer2, chassifyList: state.g1GoodsNavMenu }),
)(SelectCalssDrawer)