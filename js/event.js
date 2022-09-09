class Event {
    constructor() {
        this.funcs = []
    }

    addListener(func) {
        this.funcs.push(func)
    }

    trigger(params) {
        this.funcs.forEach(function(elem_func_actual) { elem_func_actual(params)})
    }
}