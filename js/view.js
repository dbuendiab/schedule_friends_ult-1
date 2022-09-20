class View {
    constructor(parent) {
        this.root = parent
        this.newFriendAddedEvent = new Event()
        this.deleteFriendEvent = new Event()
        this.confirmDateEvent = new Event()
    }

    newFriendFormShow(update_data = undefined) {
        
        alert("We go!")

        // Salir si ya tienes un formulario abierto
        if (document.getElementsByClassName("new-friend").length > 0) return
        if (document.getElementsByClassName("update-friend").length > 0) return

        const form = document.createElement("div")
        form.className = (update_data? "update-friend": "new-friend")
        form.classList.add("container-form")

        let name = "",
            //date = "",
            importance = 50,
            periodicity = 7,
            note = "",
            type="new",
            parent=null

        // Por defecto cargo una fecha a 7 días vista
        let date = this.#todayPlusDays(periodicity)

        if (update_data) {
            name = update_data.name
            date = update_data.date
            importance = update_data.importance
            periodicity = update_data.periodicity
            note = update_data.note
            type = update_data.type
            parent = update_data.parent
        }

        // Necesito input boxes para name, date, importance, periodicity, note
        form.innerHTML = `

            <div class="dataBox">
                <div><input type="text" id="name" ${type !== "new"? "disabled": ""} value="${name}"></div>
                <div><label>Prox. cita: <input type="date" id="date" value="${date}"></label></div>
                <div><label>Importancia: <input type="range" min="0" max="100" id="importance" value="${importance}"></label></div>
                <div><label>Periodicidad: <input type="number" min="1" id="periodicity" value="${periodicity}" style="width: 4rem;"></label></div>
            </div>
            <div class="dataBox">
                <div>Notas:</div>
                <div><textarea id="note" style="height: 100%">${note}</textarea></div>
            </div>
            <div class="buttonsBox">
                <button id="accept" class="friendButton">Aceptar</button>
                <button id="cancel" class="friendButton">Cancelar</button>
            </div>

        `
        if (parent) {
            parent.before(form)
            parent.style.display = "None"
        } else {
            this.root.prepend(form)
        }
        const btnAccept = document.getElementById("accept")
        btnAccept.addEventListener("click", () => {
            const data = {
                name: document.getElementById("name").value,
                date: document.getElementById("date").value,
                importance: parseInt(document.getElementById("importance").value),
                periodicity: parseInt(document.getElementById("periodicity").value),
                note: document.getElementById("note").value
            }
            this.root.removeChild(form)
            this.newFriendAddedEvent.trigger(data)
        })
        const btnCancel = document.getElementById("cancel")
        btnCancel.addEventListener("click", () => {
            this.root.removeChild(form)
            if (parent) parent.style.display = ""
        })
    }

    #todayPlusDays(nDays) {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        hoy.setDate(hoy.getDate() + nDays)
        return hoy.toISOString().substring(0, 10)
    }

    #today() {
        return this.#getGoodDate(new Date())
    }

    #getGoodDate(date) {
        const goodDate = new Date(date)
        goodDate.setHours(0, 0, 0, 0)
        return goodDate.toISOString().substring(0, 10)
    }

    #daysRemaining(date) {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const cita = new Date(date)
        cita.setHours(0, 0, 0, 0)
        return (cita.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    }

    #remainingColor(date) {
        // Debe devolver un valor entre 0 y 100, con 50 correspondiendo al día de hoy
        const diasPastMax = -3
        const diasFutMax = 7

        let remainingDays = this.#daysRemaining(date)
        if (remainingDays >= diasFutMax) return 100
        if (remainingDays <= diasPastMax) return 0
        if (remainingDays === 0) return 50

        if (remainingDays < 0) return (-remainingDays / diasPastMax + 1) * 50
        // remainingDays > 0
        return (remainingDays / diasFutMax + 1) * 50
    }

    redraw(friends) {
        // Eliminar todos los nodos
        while (this.root.firstChild) {
            this.root.removeChild(this.root.lastChild);
        }

        const today = this.#today()

        for (const f of friends) {

            const elem = document.createElement("div")
            elem.className = "container"

            const elemData = document.createElement("div")
            elemData.className = "dataBox"
            elemData.appendChild(this.#createElemData(f))

            const elemBtns = document.createElement("div")
            elemBtns.className = "buttonsBox"

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
                    note: f.note,
                    parent: elem
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

            if (this.#getGoodDate(f.date) <= today) {
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

                        for (const h of f.history.history) {

                            const {date, note, state} = h

                            const elem = document.createElement("div")
                            elem.className = "containerHistory"

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

    #createElemData(friend) {
        const {name, date, importance, periodicity, note} = friend

        // font-size entre 1 y 3; importance entre 0 y 100
        const fontSize = (1.2 + (3 - 1.2) * importance / 100)
        const daysRemain = this.#daysRemaining(date)

        const divName = document.createElement("div")
        divName.style.fontSize = fontSize + "rem"
        //divName.style.marginBottom = ".3rem"
        divName.textContent = name

        let text
        if (daysRemain < -1) {
            text = "La cita fue hace " + -daysRemain + " días, el " + date + "."
        }
        if (daysRemain === -1) {
            text = "La cita fue AYER."
        }
        if (daysRemain === 0) {
            text = "La cita es HOY."
        }
        if (daysRemain === 1) {
            text = "La cita es MAÑANA."
        }
        if (daysRemain > 1)  {
            text = "La cita es dentro de " + daysRemain + " días, el " + date + "."
        }

        const divDay = document.createElement("span")
        divDay.classList.add("remaining")
        divDay.style.cssText = `--remaining: ${this.#remainingColor(date)};`
        //divDay.style.padding = ".3rem"
        divDay.title = "La periodicidad es cada " + periodicity + " días"
        divDay.textContent = text

        const divNote = document.createElement("div")
        divNote.style.backgroundColor = "white"
        //divNote.style.marginTop = ".3rem"
        //divNote.style.padding = ".3rem"
        divNote.textContent = note

        const elem = document.createElement("div")
        elem.className = "friend-list"
        elem.appendChild(divName)
        elem.appendChild(divDay)
        elem.appendChild(divNote)

        return elem
    }
}
