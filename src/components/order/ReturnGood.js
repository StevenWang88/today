export default class ReturnGood extends React.Component {
    
    render(){
        let {number, orderid, handleChange} = this.props;
        return (
            <div className="return-box">
                <div className="left" onTouchTap={handleChange(orderid, "left")}>-</div><span>{number}</span><div className="right" onTouchTap={handleChange(orderid, "right")}>+</div>
            </div>
        )
    }
}

ReturnGood.propTypes = {
    number: PropTypes.number.isRequired
}
