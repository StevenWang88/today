






class Evant {

    constructor(name) {
        this.event = [];
        this.name = name;
    }



    add() {

    }

    get() {

    }

    fire() {

    }


    del() {

    }

}



class subScribeEvent {

    constructor() {
        this.event = [];
    }

    on(name, fn) {
        let eventer = find

        eventer.fire()
        return () => {
            eventer.del(fn)
        }
    }

    emit(name, fn) {

        let aa = new Evant();
        aa.add(fn)

    }

    once() {

    }

}