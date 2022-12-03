
(() => {
    class Controller extends AControllerRead {
        constructor(events, db) {
            super(events, db, {singular: "Document", plural: "Documents"}, "default/docs/");

            const {addAction} = this;

            addAction('doc/new', this.newDoc.bind(this));
            addAction('doc/edit', this.editDoc.bind(this));
            addAction('doc/edit-title', this.editDocTitle.bind(this));
            addAction('doc/update-upload', this.updateDocUpload.bind(this));
            addAction('doc/remove', this.removeDoc.bind(this));
            addAction('doc/view', this.viewDoc.bind(this));
        }

        async sendReqImpl(evt, ...args) {
            return Events.whenLoggedIn(async loggedUser => {
                const execFun = functions.httpsCallable('execFun');
                evt = evt.replace("doc/", "");
                const param = {path: evt, data: args};
                console.log('sendReqImpl', evt, param)
                const res = await execFun(param);
                return res;
            });
        }

        async newDoc(evt, ...args) {
            return this.sendReqImpl(evt, ...args);
        }

        async editDoc(evt, ...args) {
            return this.sendReqImpl(evt, ...args);
        }

        async editDocTitle(evt, ...args) {
            return this.sendReqImpl(evt, ...args);
        }

        async updateDocUpload(evt, docId, filePath) {
            return Events.whenLoggedIn(async loggedUser => {
                const gcsUri = await files.upload.call(this, filePath, async bucketFile => {
                    return 'temp/' + docId + '.' + fileUtils.getExtension(bucketFile.name);
                });
                return gcsUri;
            });
        }

        async removeDoc(evt, ...args) {
            return this.sendReqImpl(evt, ...args);
        }

        async viewDoc(evt, ...args) {
            return this.sendReqImpl(evt, ...args);
        }

    }

    new Controller(events, db);
})();