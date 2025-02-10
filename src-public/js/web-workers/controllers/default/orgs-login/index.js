(function () {
    class Controller extends AControllerRead {
        constructor(events) {
            super(events, {}, "orgs/");

            const {addAction} = this;
            addAction('login', this.login.bind(this));
        }

        // <editor-fold defaultstate="collapsed" desc="login">
        // eslint-disable-next-line class-methods-use-this
        async login(evt, data) {
            // return Events.whenLoggedIn(async (loggedUser) => {
            // console.log("relay/send", data);
            if (!data) return null;
            const {query, variables} = data;

            if (!socket.connected) {

            }

            let token;
            try {
                token = await self.session.getIdToken();
            } catch (e) {
            }

            return socket.emit('emit', {
                path: 'orgs/login',
                data,
            });
        }

        // </editor-fold>

    }

    // eslint-disable-next-line no-new
    new Controller(events);
})();
