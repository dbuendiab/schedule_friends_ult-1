/*
    Modelo de datos

    API:
    * Crear amigo
    * Devolver lista amigos

 */

class Friends {
    constructor() {
        this.friends = this.loadAll()
        this.filterFunc = null
        this.sortFunc = null
        this.searchFunc = null

        this.filterFuncs = {
            "no-past": friend => (friend.date >= this.#today()),
            "past": friend => (friend.date < this.#today())
        }

        this.sortFuncs = {
            "date": (a, b) => { return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0) },
            "name": (a, b) => { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0) },
            "importance": (a, b) => { return (a.importance < b.importance) ? 1 : ((b.importance < a.importance) ? -1 : 0) }
        }

        this.wereChangesEvent = new Event()
        this.filterChangeEvent = new Event()
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

        this.wereChangesEvent.trigger(this.getFriends())
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
                this.wereChangesEvent.trigger(this.getFriends())
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
                this.friends[i].note = ""
                this.saveAll()
                this.wereChangesEvent.trigger(this.getFriends())
                break
            }
        }
    }

    // ------------------------------------------------------------------------

    sortDay() {
    // Los operadores de comparación < hacen el efecto reverse
        this.sortFunc = "date"
        this.wereChangesEvent.trigger(this.getFriends())
    }

    sortImportance() {
        this.sortFunc = "importance"
        this.wereChangesEvent.trigger(this.getFriends())
    }

    sortName() {
        this.sortFunc = "name"
        this.wereChangesEvent.trigger(this.getFriends())
    }

    sortClear() {
        this.sortFunc = null
        this.wereChangesEvent.trigger(this.getFriends())
    }

    // ------------------------------------------------------------------------

    filterNoPast() {
        this.filterFunc = "no-past"
        this.wereChangesEvent.trigger(this.getFriends())
    }

    filterPast() {
        this.filterFunc = "past"
        this.wereChangesEvent.trigger(this.getFriends())
    }

    filterNone() {
        this.filterFunc = null
        this.wereChangesEvent.trigger(this.getFriends())
    }

    // Busca en la nota y en el histórico
    search(text) {
        this.searchFunc = (friend) => {
            const searchText = this.#normalize(text)
            const target = this.#normalize(friend.note)
            if (target.includes(searchText)) {
                return true
            }
            for(const h of friend.history.history) {
                const hTarget = this.#normalize(h.note)
                if (hTarget.includes(searchText)) {
                    return true
                }
            }
            return false
        }
        this.wereChangesEvent.trigger(this.getFriends())
    }

    #normalize(text) {
        return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    }

    reset() {
        this.sortFunc = null
        this.filterFunc = null
        this.wereChangesEvent.trigger(this.getFriends())
    }

    // TODO: llevar esto (y versión en View) a un módulo específico aparte
    #today() {
        const date = new Date()
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    getFriends() {
        let friends = this.friends;
        if (this.searchFunc) {
            friends = friends.filter(this.searchFunc)
            this.searchFunc = null
        }
        if (this.filterFunc) {
            friends = friends.filter(this.filterFuncs[this.filterFunc])
        }
        if (this.sortFunc) {
            friends = friends.sort(this.sortFuncs[this.sortFunc])
        }
        return friends
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