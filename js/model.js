/*
    Modelo de datos

    API:
    * Crear amigo
    * Devolver lista amigos

 */

class Friends {
    constructor() {
        this.friends = JSON.parse(localStorage.getItem("friends")) || []
        this.wereChangesEvent = new Event();
    }

    newFriend(data) {
        this.friends.push(new Friend(data.name, data.date, data.importance, data.periodicity, data.note))
        localStorage.setItem("friends", JSON.stringify(this.friends))
        this.wereChangesEvent.trigger(this.getAll())
    }
//----------------------------------------------------------------------------------
    deleteFriend(name) {
        alert(this.friends.length)
        for (let i = 0; i < 10; i++) {
            if (name === this.friends[i].name){

                this.friends.splice(i, 1)
                this.wereChangesEvent.trigger(this.getAll())
                break
            }
        }


    }

//-------------------------------------------------------------------------------------

    getAll() {
        return this.friends
    }
}

// ---------------------------------------------------------------------------------

class Friend {
    constructor(name, date, importance, periodicity, note) {
        this.name = name
        this.date = date
        this.importance = importance
        this.periodicity = periodicity
        this.note = note
        this.history = new History()
    }
}

// ---------------------------------------------------------------------------------

class History {
    constructor() {
        this.history = []
    }

    /*
        add = function(date, note, state) {
            this.history.push(new HistoryNote(date, note, state))
        }

        delete = (date) => {
            for (const [i, histNote] of this.history) {
                if (histNote.date === date) {
                    this.history.splice(i, 1)
                    break
                }
            }
        }
    */
}

// --------------------------------------------------------------------------------

/*
class HistoryNote {
    constructor(date, note, state) {
        this.date = date
        this.note = note
        this.state = state
    }
}*/