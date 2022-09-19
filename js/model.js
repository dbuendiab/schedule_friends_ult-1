/*
    Modelo de datos

    API:
    * Crear amigo
    * Devolver lista amigos

 */

class Friends {
    constructor() {
        this.friends = this.loadAll()
        this.filterPast = false

        this.wereChangesEvent = new Event()
        this.filterChangeEvent = new Event()
        this
    }

    newFriend(data) {
        const {name, date, importance, periodicity, note} = data
        const elem = this.exists(name)
        if (elem) {
            //elem.name = name
            elem.date = date
            elem.importance = importance
            elem.periodicity = periodicity
            elem.note = note
        } else {
            this.friends.push(new Friend(name, date, importance, periodicity, note))
        }
        this.saveAll()

        this.wereChangesEvent.trigger(this.getAll())
    }

    exists(name) {
        for (const f of this.friends) {
            if (f.name === name) {
                return f
            }
        }
        return null
    }

//----------------------------------------------------------------------------------
    deleteFriend(name) {

        for (let i = 0; i < this.friends.length; i++) {
            if (name === this.friends[i].name) {

                this.friends.splice(i, 1)
                this.saveAll()
                this.wereChangesEvent.trigger(this.getAll())
                break
            }
        }
    }

//-------------------------------------------------------------------------------------
    confirmDate(params) {

        function addDays(date, days) {
            let result = new Date(date);
            result.setDate(result.getDate() + parseInt(days));
            return result;
        }

        const {name, date, note} = params
        for (let i = 0; i < this.friends.length; i++) {
            if (name === this.friends[i].name) {
                this.friends[i].history.add(date, note, true)
                const intermediateProcessingDate = addDays(date, this.friends[i].periodicity)
                this.friends[i].date = intermediateProcessingDate.toISOString().substring(0, 10)
                this.saveAll()
                this.wereChangesEvent.trigger(this.getAll())
                break
            }
        }
    }

    sortDay() {
        const getSorted = this.friends.sort((a, b) => { return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0) })
        this.wereChangesEvent.trigger(this.#filterList(getSorted))
    }

    // Los operadores de comparación < hacen el efecto reverse
    sortImportance() {
        const getSorted = this.friends.sort((a, b) => { return (a.importance < b.importance) ? 1 : ((b.importance < a.importance) ? -1 : 0) })
        this.wereChangesEvent.trigger(this.#filterList(getSorted))
    }

    sortName() {
        const getSorted = this.friends.sort((a, b) => { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0) })
        this.wereChangesEvent.trigger(this.#filterList(getSorted))
    }

    #today() {
        const goodDate = new Date()
        goodDate.setHours(0, 0, 0, 0)
        return goodDate.toISOString().substring(0, 10)
    }

    #filterList(listF) {
        const today = this.#today()
        //this.filterPast = !this.filterPast
        let getFiltered
        if (this.filterPast) {
            getFiltered = listF.filter(friend => {
                return friend.date >= today
            })
        } else {
            getFiltered = listF
        }
        return getFiltered
    }

    filterPastToggle() {
        this.filterPast = !this.filterPast
        this.filterChangeEvent.trigger(this.filterPast) // change button status
        this.wereChangesEvent.trigger(this.#filterList(this.friends))  // redraw
    }

//-------------------------------------------------------------------------------------
    loadAll() {

        const hola = JSON.parse(localStorage.getItem("friends")) || []
        const friends = []

        for (const h of hola ) {
            const {name, date, importance, periodicity, note, history} = h
            const friend = new Friend(name, date, importance, periodicity, note)
            for (const hist of history.history){
                const  {date, note, state} = hist
                friend.history.add(date, note, state)
            }
            friends.push(friend)
        }
        return friends;
    }
    saveAll() {
        localStorage.setItem("friends", JSON.stringify(this.friends))
    }
    getAll() {
        return this.friends
    }
}

// ---------------------------------------------------------------------------------

class Friend {
    constructor(name, date, importance, periodicity, note) {
        this.name = name
        this.date = (new Date(date)).toISOString().substring(0, 10)
        this.importance = parseInt(importance)
        this.periodicity =  parseInt(periodicity)
        this.note = note
        this.history = new History()
    }
}

// ---------------------------------------------------------------------------------

class History {
    constructor() {
        this.history = []
    }
    add = function (date, note, state) {
        this.history.push(new HistoryNote(date, note, state))
    }
    delete = function (date) {
        for (const [i, histNote] of this.history) {
            if (histNote.date === date) {
                this.history.splice(i, 1)
                break
            }
        }
    }
}

// --------------------------------------------------------------------------------

class HistoryNote {
    constructor(date, note, state) {
        this.date = date
        this.note = note
        this.state = state
    }
}