(function () {
    class Controller extends AControllerRead {
        constructor(events) {
            super(events, {}, "socket/");

            const {addAction} = this;
            addAction('emit', this.emit.bind(this));
        }

        // <editor-fold defaultstate="collapsed" desc="emit">
        // eslint-disable-next-line class-methods-use-this
        async emit(evt, path, data) {
            if (!path) return null;
            if (!data) return null;

            return new Promise((resolve, reject) => {
                socket.emit('emit', {
                    path,
                    data,
                }, (res, err) => {
                    if (err) {
                        err = JSON.parse(err);
                        console.log('emit err', err)
                        return reject(err);
                    }

                    // console.log('emit res', res)
                    resolve(res);
                });
            });
        }
        // </editor-fold>

    }

    // eslint-disable-next-line no-new
    new Controller(events);
})();
