import DrawerHead1 from '../DrawerHead1';
import { Icon } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import "./dateDrawer.scss"
import "../AddGoodDrawer/addGood.scss"
import DateBox from "./DateBox"
export default class DateDrawer extends React.Component {
    render() {
        return (
            <div className="filter-drawer date-drawer">
                <DrawerHead1 title="选择时间" />
                <div className="head-bar ule-flex">
                    <div className="date-bar bar-btn curBtn">按日期查询</div>
                    <div className="time-bar bar-btn">按时间段查询</div>
                </div>
                <div  style={{position:'relative'}}>
                    <DateBox/>
                </div>
                <div className="footer">
					<div className="ule-btn-group ">
						<div className="ule-btn ule-btn-sure" style={{color:'#fff'}}>
							查 询
						</div>
					</div>
				</div>
            </div>
        )
    }
}