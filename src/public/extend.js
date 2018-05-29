import apiMap from '../api/apiSend';
import Toast from 'antd-mobile/lib/Toast';
require('antd-mobile/lib/Toast/style/css');


const log = (...agu) => { console.log(...agu); }
const info = (...agu) => { console.info(...agu); }
const warn = (...agu) => { console.warn(...agu); }

const local = (function () {
	return {
		get(name) {
			return window.localStorage[name];
		},
		set(name, val) {
			window.localStorage.setItem(name, val)
		},
		del(name) {
			delete window.localStorage[name];
		}
	}
}())
const toast = (function () {
	return {
		info(msg) {
			Toast.info(msg, 1.5, null, false);
		},
		loading() {
			Toast.loading('Loading...', 1.5, () => {
				console.log('Load complete !!!');
			});
		},
		hide() {
			Toast.hide()
		}

	}
}())
Object.assign(window, {
	log, info, warn, apiMap, local, toast
})
