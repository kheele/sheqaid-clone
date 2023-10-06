
(function () {
	class Controller extends AControllerRead {
		constructor(events) {
			super(events, {}, "graphql/");

			const {addAction} = this;
			addAction('v1beta1/relay', this.relay.bind(this));
			addAction('v1/graphql', this.default.bind(this));
			addAction('api/rest/views', this.views.bind(this));

			addAction("get_db_hr_docs", this.get_db_hr_docs.bind(this));
			addAction("get_db_hr", this.get_db_hr.bind(this));
			addAction("get_db2", this.get_db2.bind(this));
			addAction("get_db", this.get_db.bind(this));
		}

		// <editor-fold defaultstate="collapsed" desc="relay">
		// eslint-disable-next-line class-methods-use-this
		async relay(evt, data) {
			// return Events.whenLoggedIn(async (loggedUser) => {
			// console.log("relay/send", data);
			if (!data) return null;
			const {query, variables} = data;

			if(!socket.connected){

			}

			let token;
			try {
				token = await self.session.getIdToken();
			} catch (e) {
			}

			return new Promise((resolve, reject) => {
				socket.emit('emit', {
					path: 'graphql/v1beta1/relay',
					data: {
						query,
						variables,
						token,
					},
				}, (res, err) => {
					if(err) {
						console.log('relay emit err', err)
						return reject(err);
					}

					// console.log('relay emit res', res)
					resolve(res);
				});
			});
		}
		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="default">
		// eslint-disable-next-line class-methods-use-this
		async default(evt, data) {
			if (!data) return null;
			const {query, variables, multi_queries = false, count = false} = data;

			if(!socket.connected){

			}

			let token;
			try {
				token = await self.session.getIdToken();
			} catch (e) {
			}

			return new Promise((resolve, reject) => {
				socket.emit('emit', {
					path: 'graphql/v1/graphql',
					data: {
						query,
						variables,
						multi_queries,
						count,
						token,
					},
				}, (res, err) => {
					if(err) {
						console.log('default emit err', err)
						return reject(err);
					}

					// console.log('default emit res', res)
					resolve(res);
				});
			});
		}
		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="views">
		// eslint-disable-next-line class-methods-use-this
		async views(evt, path) {
			if (!path) return null;

			if(!socket.connected){

			}

			return new Promise((resolve, reject) => {
				socket.emit('emit', {
					path: 'graphql/api/rest/views',
					data: path,
				}, (res, err) => {
					if(err) {
						console.log('views emit err', err)
						return reject(err);
					}

					// console.log('views emit res', res)
					resolve(res);
				});
			});
		}
		// </editor-fold>

		// <editor-fold defaultstate="collapsed" desc="get_db_hr_docs, get_db_hr, get_db2, get_db">
		async get_db_hr_docs(evt, tbl) {
			let doc_ref = db_hr.collectionGroup(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >

			const querySnapshot = await doc_ref.get();
			return querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
		}

		async get_db_hr(evt, tbl) {
			let doc_ref = db_hr.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >

			const querySnapshot = await doc_ref.get();
			return querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
		}

		async get_db2(evt, tbl) {
			let doc_ref = db2.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >

			const querySnapshot = await doc_ref.get();
			return querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
		}

		async get_db(evt, tbl) {
			let doc_ref = db.collection(tbl);//.where('', '=', '');//Promise < DocumentReference < T > >

			const querySnapshot = await doc_ref.get();
			return querySnapshot.docs.map((doc) => ({id: doc.id, data: doc.data()}));
		}

		// </editor-fold>
	}

	// eslint-disable-next-line no-new
	new Controller(events);
})();
