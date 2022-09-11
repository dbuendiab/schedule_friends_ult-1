class Controller {
    constructor() {
        this.model = new Friends()
        this.view = new View(document.getElementById("root"))

        //funcion callback model
        this.model.wereChangesEvent.addListener(function(friendsList) {
                this.view.redraw(friendsList)
        })
        //funciones callback view
        this.view.newFriendAddedEvent.addListener( (friendObject) => {
            this.model.newFriend(friendObject)
        })
        this.view.deleteFriendEvent.addListener(this.model.deleteFriend)



        this.mnuNewFriend = document.getElementById("mnuNewFriend")
        this.mnuNewFriend.addEventListener("click", () => {
            this.view.newFriendFormShow()
        })
    }

    run() {
        this.view.redraw(this.model.getAll())
    }
}