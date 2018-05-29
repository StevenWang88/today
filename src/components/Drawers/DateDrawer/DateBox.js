
import { Datepicker } from "react"
import { DatePicker } from 'antd';
import './dateBox.scss'
export default class DateBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            showToday:false
		}
    }
    componentDidMount(){
        // console.log(document.querySelectorAll('.ant-calendar-column-header-inner'))
        let t=document.querySelectorAll('.ant-calendar-column-header-inner')
        if(t){
            // console.log(t[0].innerText)
            for(var i=0;i<t.length;i++){
                if(t[i].innerText.indexOf('周')<0){
                    t[i].innerText='周'+ t[i].innerText
                }
                t[i].style.cloor='#999'
            }
        }
    }
    render() {
        const { MonthPicker, RangePicker } = DatePicker;
        let {isOpen,showToday}=this.state
        return (
            <div className="date-box">
                <DatePicker  
                showToday={showToday}
                open={isOpen}
                />
                <div className="footer">

                </div>
            </div>
        )
    }

}
