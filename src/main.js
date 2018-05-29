import ReactDOM from 'react-dom';
import './public/extend';
import FastClick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
FastClick.attach(document.body)

import Container from './redexProvider';
import 'normalize.css';
import './scss/base.scss';
window.onload=()=>{
	let page = ''
	Yzg.addEventListener('onLoad', function () {
		// 获取用户信息
		if (location.href.indexOf('spglhome') > 0) {
			page = "Commodity"
		} else {
			page = 'SalesStream'
		}
		//local就是localStorage
		Yzg.exec('getUserInfo', function (data) {
			if(data&&data.usrOnlyid&&data.orgCode){
				local.set('usrOnlyId',data.usrOnlyid)
				local.set('villageNo',data.orgCode)
			}
		});
	});
	setTimeout(()=>{
		ReactDOM.render(
			<Container/>,
			document.getElementById('rootApp')
		);
	},1500)
}

window.moment = moment;
