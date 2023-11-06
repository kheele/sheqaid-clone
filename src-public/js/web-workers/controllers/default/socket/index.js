(function () {
    class Controller extends AControllerRead {
        constructor(events) {
            super(events, {}, "socket/");

            const {addAction} = this;
            addAction('emit', this.emit.bind(this));
            addAction('on', this.on.bind(this));
            addAction('once', this.once.bind(this));
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

        // <editor-fold defaultstate="collapsed" desc="on">
        // eslint-disable-next-line class-methods-use-this
        async on(_, evt) {
            if (!evt) return null;

            // return new Promise((resolve, reject) => {
            socket.on(evt, (...res) => {
                console.log('on res', res)
                Events.emit.apply(Events, [evt, ...res]);
                // resolve(res);
            });
            // });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="once">
        // eslint-disable-next-line class-methods-use-this
        async once(_, evt) {
            if (!evt) return null;

            let fn;
            socket.on(evt, fn = (...res) => {
                console.log('once res', res)
                Events.emit.call(null, [evt, ...res]);
                socket.off(evt, fn);
            });
        }

        // </editor-fold>

    }

    // eslint-disable-next-line no-new
    new Controller(events);
})();
