class View {
    constructor(parent) {
        this.root = parent
        this.newFriendAddedEvent = new Event()
        this.deleteFriendEvent = new Event()
        this.confirmDateEvent = new Event()
    }

    newFriendFormShow(update_data = undefined) {
        const form = document.createElement("div")
        form.className = "new-friend"

        let name = "", date = "", importance = "", periodicity = "", note = "", type="new"

        if (update_data) {
            name = update_data.name
            date = update_data.date
            importance = update_data.importance
            periodicity = update_data.periodicity
            note = update_data.note
            type = update_data.type
        }

        // Necesito input boxes para name, date, importance, periodicity, note
        form.innerHTML = `
        <label>Nombre: <input type="text" id="name" ${type !== "new"? "disabled": ""} value="${name}"></label>
        <label>Prox. cita: <input type="date" id="date" value="${date}"></label>
        <label>Importancia: <input type="range" min="0" max="100" id="importance" value="${importance}"></label>
        <label>Periodicidad: <input type="number" min="1" id="periodicity" value=" value="${periodicity || 7}""></label>
        <label>Notas: <textarea id="note">${note}</textarea></label>
        <button id="accept">Aceptar</button>
        <button id="cancel">Cancelar</button>
        `
        this.root.prepend(form)

        const btnAccept = document.getElementById("accept")
        btnAccept.addEventListener("click", () => {
            const data = {
                name: document.getElementById("name").value,
                date: document.getElementById("date").value,
                importance: document.getElementById("importance").value,
                periodicity: document.getElementById("periodicity").value,
                note: document.getElementById("note").value
            }
            this.root.removeChild(form)
            this.newFriendAddedEvent.trigger(data)
        })
        const btnCancel = document.getElementById("cancel")
        btnCancel.addEventListener("click", () => {
            this.root.removeChild(form)
            // newFriendModelCallback({})
        })
    }

    #today() {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        return hoy
    }

    redraw(friends) {
        // Eliminar todos los nodos
        while (this.root.firstChild) {
            this.root.removeChild(this.root.lastChild);
        }

        let evenBool = false

        for (const f of friends) {

            const elem = document.createElement("div")
            elem.className = "container"
            if (evenBool) {
                elem.classList.add("even")
            }
            evenBool = !evenBool

            const elemData = document.createElement("div")
            elemData.className = "dataBox"
            const elemBtns = document.createElement("div")
            elemBtns.className = "buttonsBox"

            const name = document.createElement("div")
            name.textContent = "Nombre: " + f.name
            const date = document.createElement("div")
            date.textContent = "Cita: " + f.date
            const importance = document.createElement("div")
            importance.textContent = "Importancia: " + f.importance
            const periodicity = document.createElement("div")
            periodicity.textContent = "Periodicidad: " + f.periodicity
            const note = document.createElement("div")
            note.textContent = "Nota: " + f.note
            const historyBox = document.createElement("div")
            //history.textContent = "Historia: " + f.history

            //----------------------------------------------------------------------------------- update btn
            const btnUpdate = document.createElement("button")
            btnUpdate.id = "btnUpdate"
            btnUpdate.className = "friendButton"
            btnUpdate.textContent = "update"

            btnUpdate.addEventListener('click', () => {
                this.newFriendFormShow({
                    type: "update",
                    name: f.name,
                    date: f.date,
                    importance: f.importance,
                    periodicity: f.periodicity,
                    note: f.note
                })
            })

            //----------------------------------------------------------------------------------- delete btn

            const btnDelete = document.createElement("button")
            btnDelete.id = "btnDelete"
            btnDelete.className = "friendButton"
            btnDelete.textContent = "delete"

            btnDelete.addEventListener('click', () => {
                if (window.confirm("do you want to delete friend?")) {
                    this.deleteFriendEvent.trigger(f.name)
                }
            })

            //------------------------------------------------------------------------------------- confirm btn

            let btnConfirm = null

            if (new Date(f.date) <= this.#today()) {
                btnConfirm = document.createElement("button")
                btnConfirm.id = "btnConfirm"
                btnConfirm.className = "friendButton"
                btnConfirm.textContent = "confirm date"

                elemBtns.appendChild(btnConfirm)

                btnConfirm.addEventListener("click", () => {
                    if (window.confirm("do you want to confirm?")) {
                        const params = {
                            name: f.name,
                            date: f.date,
                            note: f.note
                        }
                        this.confirmDateEvent.trigger(params)
                    }
                })
            }

            //------------------------------------------------------------------------------------- show history

            let btnShowHistory = null

            // El botón de history solo si hay historial
            if (f.history.history.length > 0) {

                btnShowHistory = document.createElement("button")
                btnShowHistory.id = "showHistory"
                btnShowHistory.className = "showBtn"
                btnShowHistory.textContent = "show history"

                elemBtns.appendChild(btnShowHistory)

                btnShowHistory.addEventListener('click', () => {

                    if (btnShowHistory.className === "showBtn") {

                        /*if (f.history.history.length === 0) {
                            return
                        }*/

                        let booleanToggler = true

                        for (const h of f.history.history) {

                            const {date, note, state} = h

                            const elem = document.createElement("div")
                            elem.className = "containerHistory"
                            if (booleanToggler) {
                                elem.classList.add("evenRow")
                            }

                            booleanToggler = !booleanToggler

                            const dateBox = document.createElement("div")
                            dateBox.textContent = "date" + date
                            const noteBox = document.createElement("div")
                            noteBox.textContent = "note" + note


//TODO add delete btn for elem


                            historyBox.appendChild(elem)

                            elem.appendChild(dateBox)
                            elem.appendChild(noteBox)
                        }
                        btnShowHistory.textContent = "hide history"
                        btnShowHistory.className = "hideBtn"
                    } else {

                        historyBox.innerHTML = ""
                        btnShowHistory.textContent = "show history"
                        btnShowHistory.className = "showBtn"

                    }
                })
            }

//-------------------------------------------------------------------------------------

            elemData.appendChild(name)
            elemData.appendChild(date)
            elemData.appendChild(importance)
            elemData.appendChild(periodicity)
            elemData.appendChild(note)
            elemData.appendChild(historyBox)

            elemBtns.appendChild(btnUpdate)
            elemBtns.appendChild(btnDelete)
            if (btnConfirm) elemBtns.appendChild(btnConfirm)
            if (btnShowHistory) elemBtns.appendChild(btnShowHistory) //Lo añado opcionalmente - solo si hay historia

            elem.appendChild(elemData)
            elem.appendChild(elemBtns)

            this.root.appendChild(elem)
        }
    }
}