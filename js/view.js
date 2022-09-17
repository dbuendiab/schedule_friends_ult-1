class View {
    constructor(parent) {
        this.root = parent
        this.newFriendAddedEvent = new Event()
        this.deleteFriendEvent = new Event()
        this.confirmDateEvent = new Event()
    }

    newFriendFormShow() {
        const form = document.createElement("div")
        form.className = "new-friend"
        // Necesito input boxes para name, date, importance, periodicity, note
        form.innerHTML = `
        <label>Nombre: <input type="text" id="name"></label>
        <label>Prox. cita: <input type="date" id="date"></label>
        <label>Importancia: <input type="range" min="0" max="100" id="importance"></label>
        <label>Periodicidad: <input type="number" min="1" id="periodicity" value="7"></label>
        <label>Notas: <textarea id="note"></textarea></label>
        <button id="accept">Aceptar</button>
        <button id="cancel">Cancelar</button>
        `
        this.root.appendChild(form)

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

    redraw(friends) {
        // Eliminar todos los nodos
        while (this.root.firstChild) {
            this.root.removeChild(this.root.lastChild);
        }
        for (const f of friends) {
            const elem = document.createElement("div")
            elem.className = "container"

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
            //----------------------------------------------------------------------------------- delete btn
            const btnDelete = document.createElement("button")
            const idAtt = document.createAttribute("id")
            idAtt.value = "btnDelete"
            btnDelete.setAttributeNode(idAtt)
            btnDelete.className = "friendButton"
            btnDelete.textContent = "delete"

            btnDelete.addEventListener('click', () => {
                if (window.confirm("do you want to delete friend?")) {
                    this.deleteFriendEvent.trigger(f.name)
                }
            })
//------------------------------------------------------------------------------------- confirm btn
            const btnConfirm = document.createElement("button")
            btnConfirm.id = "btnConfirm"
            btnConfirm.className = "friendButton"
            btnConfirm.textContent = "confirm date"

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
//-------------------------------------------------------------------------------------

            const btnShowHistory = document.createElement("button")
            btnShowHistory.id = "showHistory"
            btnShowHistory.className = "showBtn"
            btnShowHistory.textContent = "show history"

            btnShowHistory.addEventListener('click', () => {

                if (btnShowHistory.className === "showBtn") {

                    if (f.history.history.length === 0){
                        return
                    }

                    let booleanToggler= true

                    for (const h of f.history.history) {

                        const {date, note, state} = h

                        const elem = document.createElement("div")
                        elem.className = "containerHistory"
                        if (booleanToggler){
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

//-------------------------------------------------------------------------------------

            elem.appendChild(name)
            elem.appendChild(date)
            elem.appendChild(importance)
            elem.appendChild(periodicity)
            elem.appendChild(note)
            elem.appendChild(historyBox)
            elem.appendChild(btnDelete)
            elem.appendChild(btnConfirm)
            elem.appendChild(btnShowHistory)

            this.root.appendChild(elem)
        }
    }
}