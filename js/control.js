class Controller {
    constructor() {
        this.model = new Friends()
        this.view = new View(document.getElementById("root"))

        this.model.wereChangesEvent.addListener(function(friendsList) {
                this.view.redraw(friendsList)
        })
        this.view.newFriendAddedEvent.addListener( (friendObject) => {
            this.model.newFriend(friendObject)
        })

        this.mnuNewFriend = document.getElementById("mnuNewFriend")
        this.mnuNewFriend.addEventListener("click", () => {
            this.view.newFriendFormShow()
        })
    }

    run() {
        this.view.redraw(this.model.getAll())
    }
}