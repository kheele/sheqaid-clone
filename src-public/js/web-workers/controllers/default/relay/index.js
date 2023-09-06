
(function () {
    class Controller extends AControllerRead {
        constructor(events) {
            super(events, {}, "relay/");

            const {addAction} = this;
            addAction("send", this.send.bind(this));
            addAction("get_db_hr_docs", this.get_db_hr_docs.bind(this));
            addAction("get_db_hr", this.get_db_hr.bind(this));
            addAction("get_db2", this.get_db2.bind(this));
            addAction("get_db", this.get_db.bind(this));
        }

        // <editor-fold defaultstate="collapsed" desc="send">
        // eslint-disable-next-line class-methods-use-this
        async send(evt, data) {
            // return Events.whenLoggedIn(async (loggedUser) => {
            // console.log("relay/send", data);
            if (!data) return null;
            const {query, variables} = data;
            let {headers = {}} = data;

            if ("headers" in variables) {
                headers = {...headers, ...variables.headers};
                // eslint-disable-next-line no-param-reassign
                delete variables.headers;
            }

            // Otherwise, fetch data from server
            // const url = `http://localhost:5000/v1beta1/relay`;
            const url = `https://cloud.sheqaid.com:5000/v1beta1/relay`;

            // const url = `http://cloud.sheqaid.com:8080/v1beta1/relay`;
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-hasura-access-key": "rhespo-g",
                    ...headers,
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            }).then((response) => response.json());
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
