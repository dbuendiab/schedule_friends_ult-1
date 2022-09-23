class Controller {
    constructor() {
        this.model = new Friends()
        this.view = new View(document.getElementById("root"))

        //funcion callback model
        this.model.wereChangesEvent.addListener((friendsList)  => this.view.redraw(friendsList))

        // Este evento se trata aquí, no en el view (no tiene nada que ver con el view)
        this.model.filterChangeEvent.addListener(( filterStatus) => {
            document.getElementById("mnuFilterPast").classList.toggle("filter-past")
        })

        //funciones callback view
        this.view.newFriendAddedEvent.addListener( (friendObject) => {
            this.model.newFriend(friendObject)
        })
        this.view.deleteFriendEvent.addListener((name) => {
            this.model.deleteFriend(name)
        })
        this.view.confirmDateEvent.addListener((params)=>{

            this.model.confirmDate(params)
        })

        // Botón menú (portrait) acción mostrar/ocultar
        this.menuIcon = document.getElementById("menuIcon")
        this.menuList = document.getElementById("menuList")
        this.menuIcon.addEventListener("click", () => {
            this.menuList.classList.toggle("show-menu")
        })


        this.mnuNewFriend = document.getElementById("mnuNewFriend")
        this.mnuNewFriend.addEventListener("click", () => {
            this.view.newFriendFormShow()
            this.menuList.classList.toggle("show-menu")
        })

        this.mnuSortDay = document.getElementById("mnuSortDay")
        this.mnuSortDay.addEventListener("click", () => {
            this.model.sortDay()
            this.menuList.classList.toggle("show-menu")
        })

        this.mnuSortImportance = document.getElementById("mnuSortImportance")
        this.mnuSortImportance.addEventListener("click", () => {
            this.model.sortImportance()
            this.menuList.classList.toggle("show-menu")
        })

        this.mnuSortName = document.getElementById("mnuSortName")
        this.mnuSortName.addEventListener("click", () => {
            this.model.sortName()
            this.menuList.classList.toggle("show-menu")
        })

        this.mnuFilterPast = document.getElementById("mnuFilterPast")
        this.mnuFilterPast.addEventListener("click", () => {
            this.model.filterPastToggle()
            this.menuList.classList.toggle("show-menu")
        })


    }

    run() {
        this.view.redraw(this.model.getAll())
    }
}