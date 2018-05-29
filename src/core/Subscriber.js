class Event {
	constructor(name){
		this.handlers = [];
		this.name = name;
	}
	addHandler(fn){
		this.handlers.push(fn);
	}
	
	removeHander(handler){
		for( let i = 0 ; i < this.handlers.length ; i++ ){
			if(handler === this.handlers[i]){
				this.handlers.splice(i,1);
				break;
			}
		}
	}
	fire(data){
		this.handlers.forEach(fn=>fn(data));
	}
}

class EventCreators{
	constructor(){
		this.events = [];
	}
	
	getEvent(name){
		return this.events.filter(item=>(item.name === name))[0];
	}
	
	on(name,data){
		var event = this.getEvent(name);
		if (!event) {
			event = new Event(name);
			this.events.push(event);
		}
		event.fire(data);
	}
	
	emit(name,handle){
		var event = this.getEvent(name);
		if (!event) {
			event = new Event(name);
			this.events.push(event);
		}
		event.addHandler(handle);
		return ()=>{
			event.removeHander(handle);
		}
	}

	once(name,handle){
		var event = this.getEvent(name);
		if (!event) {
			event = new Event(name);
			this.events.push(event);
		}else{
			event.handlers = [];
		}
		event.addHandler(handle);
		return ()=>{
			event.removeHander(handle);
		}
	}
}

export default new EventCreators();
