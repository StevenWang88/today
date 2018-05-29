import DatePicker from 'react-mobile-datepicker';
import dateBox from 'core/dateBox';
import EventCreators from 'core/Subscriber';
export default class DatePickerBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moreDrawerList: [],
            isOpen: false,
            time: new Date()
        }
    }
    handleCancel() {
        this.setState({ isOpen: false });
    }
    handleSelect(time) {
        EventCreators.on('SELECT', { label: time });
        this.setState({ time, isOpen: false });
    }
    handOpen(data) {
        let { time } = this.state
        if (data) {
            time = new Date(moment(data).format())
        }
        this.setState({ isOpen: true, time: time });
    }
    componentWillMount() {
        dateBox._init({
            open: this.handOpen.bind(this),
            select: this.handleSelect.bind(this),
            cancel: this.handleCancel.bind(this),
            time: this.state.time
        })
    }
    render() {
        let { isOpen } = this.state
        return (
            <div>
                <DatePicker
                    value={this.state.time}
                    isOpen={isOpen}
                    onSelect={this.handleSelect.bind(this)}
                    theme="ios"
                    dateFormat={['YYYY年', 'MM月', 'DD日']}
                    showFormat='YYYY/MM/DD'
                    onCancel={this.handleCancel.bind(this)} />
            </div>

        );
    }
}
