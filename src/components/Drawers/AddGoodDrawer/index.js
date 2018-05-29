/*
* 新增商品
* */
import DrawerHead1 from '../DrawerHead1';
import GoodDetail from '../GoodDetail';
const codeImg = require('@/assets/barCode2.png');
import code from 'core/code';
class AA extends React.Component {
    getCode(){
        code.getCode()
    }
    render() {
        return (
            <div className="read-code" onTouchTap={this.getCode.bind(this)}>
                <img src={codeImg} alt="" />
            </div>
        )
    }
}
export default class AddGoodDrawer extends React.Component {
    constructor(props){
        super(props);
        this.state={
            code:''
        }
    }
    render() {
        let {code}=this.state
        // right={<AA />}
        return (
            <div className="good-drawer">
                <DrawerHead1 title="新增商品" />
                <GoodDetail {...this.props}  />
            </div>
        )
    }
}