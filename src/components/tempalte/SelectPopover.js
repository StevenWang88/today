import { Icon, Popover } from 'antd';
export default class SelectPopover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }
    // 气泡控制显示应酬
    handleVisibleChange(visible) {
        this.setState({ visible });
    }
    hide(item) {
        this.setState({
            visible: false,
            checkItem: item
        })
        this.props.iClick(item)
    }
    render() {
        let { visible, checkItem} = this.state
        let {list,defaultChecked}=this.props
        return (
            <div>
                <Popover
                    placement="bottom"
                    overlayClassName="popover-type1 popover-type2"
                    content={(
                        <div>
                            {list.map((item, index) => (
                                <p
                                    className="line-text"
                                    onTouchTap={() => { this.hide(item) }}
                                    key={index}
                                >
                                    {item.name}
                                </p>
                            ))
                            }
                        </div>
                    )}
                    visible={visible}
                    onVisibleChange={this.handleVisibleChange.bind(this)}
                    trigger="click">
                    <div >
                        {defaultChecked.name}
                        <i  className={`ule-icon icon-run icon-${!visible? 'down':'up'}`}></i>
                    </div>
                </Popover>

            </div>
        )
    }
}