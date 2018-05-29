


class ClassifyManage {
	constructor(dispatch) {
		this.dispatch = dispatch;
		this.list = [];
		this.serverList = [];
		this.localName = 'SSSSSSSS';
		this.send = false;
	}

	change() {
		let { list } = this;
		this.dispatch(list);
		local.set(this.localName, JSON.stringify(list.map(({ seqId }) => seqId)));
	}
	sort() {
		let { serverList } = this;
		let backupsList = [...serverList];
		let localClassify = local.get(this.localName);
		if (localClassify) {
			localClassify = JSON.parse(localClassify);
		} else {
			localClassify = serverList.map(({ seqId }) => seqId);
		}
		localClassify.forEach((id, index) => {
			let arr = serverList.filter(({ seqId }) => (seqId === id));
			if (arr.length) {
				this.list.push(...arr);
				backupsList.splice(_.findIndex(backupsList, ({ seqId }) => (seqId === id)), 1);
			}
		})
		this.list.push(...backupsList);
		this.list = this.list.map(item => ({ ...item, ...{ active: false } }))
		this.change();
	}

	//上移
	prevMove(index) {
		if (!index) return;
		this.move(index, -1);
	}
	move(index, n) {
		let item = this.list.splice(index, 1)[0];
		this.list.splice(index + n, 0, item);
		this.change();
	}
	//下移
	nextMove(index) {
		if (index === this.list.length - 1) return;
		this.move(index, 1);
	}
	active(index) {
		// let scrollBox = document.querySelector(".left-layout-contnet .rc-scroll")
		// let h = 64
		// if (this.list && scrollBox && (this.list.length - index) >= 9) {
		// 	scrollBox.style.transform = 'translate3d(0,-' + h * (index) + 'px,0)'
		// }
		this.list = this.list.map((item, i) => ({ ...item, ...{ active: index === i } }));
		this.change();
	}
	cleanActive() {
		this.list = this.list.map(item => ({ ...item, ...{ active: false } }));
		this.change();
	}
	//新增分类
	add(item, isChangClass) {
		this.list.unshift(item);
		this.change();
		if (isChangClass) {
			this.active(0)
		}
	}
	// 修改分类
	update(index, name) {
		this.list[index].typeName = name
		this.change()

	}


	init() {
		if (this.send) return;
		this.send = true;
		return apiMap.itemTypeList.send().then(({ returnCode, retList, sysUnits }) => {
			if (returnCode === '0000') {
				// console.log('分类列表',retList)
				this.serverList = [...retList];
				// 本地存储单位列表
				local.set('unitList', JSON.stringify(sysUnits))
				this.sort();
			}
		})
	}
}
let initClassifyManage;
export default {
	get(dispatch) {
		if (!initClassifyManage) {
			initClassifyManage = new ClassifyManage(dispatch);
		}
		return initClassifyManage;
	}
}