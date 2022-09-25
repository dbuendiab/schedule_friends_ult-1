class Controller {
    constructor() {

        // Función que conmuta la visibilidad de NAV (vía class show-menu)
        this.toggleShowMenu = function() {
            const menuList = document.getElementsByTagName("nav")[0]
            menuList.classList.toggle("show-menu")
        }

        // Botón menú (portrait) acción mostrar/ocultar
        this.menuIcon = document.getElementById("menuIcon")
        this.menuIcon.addEventListener("click", this.toggleShowMenu)

        // Función para mostrar/ocultar el submenu Sort
        const toggleSortMenu = function () {
            const submnuSort = document.getElementById("submnuSort")
            submnuSort.classList.toggle("show-menu")
        }

        // Botón para ocultar/mostrar submenu Sort
        this.mnuSort = document.getElementById("mnuSort")
        this.mnuSort.addEventListener("click", toggleSortMenu)

        // Función para mostrar/ocultar el submenu Filter
        this.toggleFilterMenu = function () {
            const submnuFilter = document.getElementById("submnuFilter")
            submnuFilter.classList.toggle("show-menu")
        }

        // Botón para ocultar/mostrar submenu Filter
        this.mnuFilter = document.getElementById("mnuFilter")
        this.mnuFilter.addEventListener("click", this.toggleFilterMenu)

        // Creación de los objetos MODEL y VIEW ----------------------------

        this.model = new Friends()
        this.view = new View(document.getElementById("root"))

        //funcion callback model
        this.model.wereChangesEvent.addListener((friendsList)  => this.view.redraw(friendsList))

        //funciones callback view
        this.view.resetMainMenuEvent.addListener(this.toggleShowMenu)

        this.view.newFriendAddedEvent.addListener( (friendObject) => {
            this.model.newFriend(friendObject)
        })
        this.view.deleteFriendEvent.addListener((name) => {
            this.model.deleteFriend(name)
        })
        this.view.confirmDateEvent.addListener((params)=>{
            this.model.confirmDate(params)
        })
    

        // Acciones botones MENÚ PRINCIPAL ------------------------------------
     
        // Boton NEW FRIEND        
        this.mnuNewFriend = document.getElementById("mnuNewFriend")
        this.mnuNewFriend.addEventListener("click", () => {
            this.view.newFriendFormShow()
        })
/*
        // Botón SORT: debe mostrar submenu con CLICK
        this.mnuSort = document.getElementById("mnuSort")
        this.mnuSort.addEventListener("click", (event) => {
            const submnuSort = event.target.querySelector("#submnuSort")
            submnuSort.classList.toggle("hide-submenu")
            submnuSort.classList.toggle("show-submenu")
        })

        // Botón FILTER: debe mostrar submenu con CLICK
        this.mnuFilter = document.getElementById("mnuFilter")
        this.mnuFilter.addEventListener("click", (event) => {
            const submnuFilter = event.target.querySelector("#submnuFilter")
            submnuFilter.classList.toggle("hide-submenu")
            submnuFilter.classList.toggle("show-submenu")
        })
*/
        this.mnuSortDay = document.getElementById("mnuSortDay")
        this.mnuSortDay.addEventListener("click", () => {
            this.model.sortDay()
            this.toggleShowMenu()
        })

        this.mnuSortImportance = document.getElementById("mnuSortImportance")
        this.mnuSortImportance.addEventListener("click", () => {
            this.model.sortImportance()
            this.toggleShowMenu()
        })

        this.mnuSortName = document.getElementById("mnuSortName")
        this.mnuSortName.addEventListener("click", () => {
            this.model.sortName()
            this.toggleShowMenu()
        })

        this.mnuFilterNoPast = document.getElementById("filterNoPast")
        this.mnuFilterNoPast.addEventListener("click", () => {
            this.model.filterNoPast()
            this.toggleShowMenu()
        })

        this.mnuFilterPast = document.getElementById("filterPast")
        this.mnuFilterPast.addEventListener("click", () => {
            this.model.filterPast()
            this.toggleShowMenu()
        })

        this.mnuFilterNone = document.getElementById("filterNone")
        this.mnuFilterNone.addEventListener("click", () => {
            this.model.filterNone()
            this.toggleShowMenu()
        })

        this.searchStr = document.getElementById("searchStr")
        this.searchStr.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.model.search(this.searchStr.value)
                this.toggleShowMenu()
            }
        })

        this.mnuReset = document.getElementById("mnuReset")
        this.mnuReset.addEventListener("click", () => {
            this.model.reset()
            this.toggleShowMenu()
        })
    }

    run() {
        this.view.redraw(this.model.getFriends())
    }
}