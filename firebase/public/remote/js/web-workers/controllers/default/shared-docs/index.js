
(() => {
    class Controller extends AController {
        //fname, lname, id_num, passport_num
        constructor(events, db) {
            super(events, db, {singular: "Shared Document", plural: "Shared Documents"}, "default/shared-docs/", "sheqassist_shared_docs");

            const {addAction} = this;
            addAction("edit/file", this.editFile.bind(this));

//            addAction("list/filter", this.filter.bind(this));
        }

        async create(evt, data) {
            if (!data.status) {
                data.status = 'Pending';
            }
            return this.createAndUploadIfFile(evt, data, ["proof_of_payment", "proof_of_residence", "identity_copy"]);
        }

        async editFile(evt, ...args) {
            return db.whenLoggedIn(async loggedUser => {
                const execFun = functions.httpsCallable('execFun');
                const param = {path: "plugin_sheq_assist/Documents/edit/file", data: args};
                console.log('editFile', param)
                const res = await execFun(param);
                return res;
            });
        }

        async list(evt) {
            return db.whenLoggedIn(async loggedUser => {
                const now = new Date().getTime();
                console.log('loggedUser', loggedUser);
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    return q.where('doc_expiry_date', '>', now).where('email', '==', loggedUser.email);
                });
                list = await Promise.all(list.map(async item => {
                    item = {...item};
                    let document = await item.data.doc_ref.get();
                    item.data.doc_ref = {id: document.id, data: document.data()};
                    return item;
                }));
                return list;
            });
        }

        sortBy() {
            return 'doc_expiry_date';
        }

    }

    new Controller(events, db);
})();