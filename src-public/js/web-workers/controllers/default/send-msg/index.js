
(function () {
	class Controller extends AControllerRead {
		constructor(events) {
			super(events, {}, "send-msg/");

			const {addAction} = this;
			addAction('sendEmail', this.sendEmail.bind(this));
		}

		// <editor-fold defaultstate="collapsed" desc="sendEmail">
		// eslint-disable-next-line class-methods-use-this
		async sendEmail(evt, opts) {
			// return Events.whenLoggedIn(async (loggedUser) => {
			// console.log("send-msg/sendEmail", opts);
			if (!opts) return null;

			if(!socket.connected){

			}

			let token;
			try {
				token = await self.session.getIdToken();
			} catch (e) {
			}

			return new Promise((resolve, reject) => {
				socket.emit('emit', {
					path: 'send-msg/sendEmail',
					data: {
						opts,
					},
				}, (res, err) => {
					if(err) {
						err = JSON.parse(err);
						console.log('send-msg sendEmail err', err)
						return reject(err);
					}

					console.log('send-msg sendEmail res', res)
					resolve(res);
				});
			});
		}
		// </editor-fold>

	}

	// eslint-disable-next-line no-new
	new Controller(events);
})();
