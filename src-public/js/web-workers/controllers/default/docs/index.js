
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
            addAction('doc/word-to-pdf', this.wordToPDF.bind(this));
        }

        async sendReqImpl(path, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const res = await Utils.apiCallable({path: `docs/${path}`, data});
                console.log('sendReqImpl', path, res)

                // evt = evt.replace("doc/", "");
                // const param = {path: evt, data: args};
                // console.log('sendReqImpl', evt, param)
                // const res = await execFun(param);
                return res;
            });
        }

        async newDoc(evt, title) {
            return this.sendReqImpl('create', title);
        }

        async editDoc(evt, path) {
            return this.sendReqImpl('edit', path);
        }

        async editDocTitle(evt, doc, val) {
            return this.sendReqImpl('edit-title', {doc, val});
        }

        async updateDocUpload(evt, docId, filePath, type) {
            return Events.whenLoggedIn(async loggedUser => {
                const gcsUri = await files.upload.call(this, filePath, async bucketFile => {
                    console.log('updateDocUpload', bucketFile)
                    return 'temp/' + docId + '.' + fileUtils.getExtension(bucketFile.name);
                });
                return this.sendReqImpl('update-upload', {docId, filePath, type});
            });
        }

        async removeDoc(evt, id) {
            return this.sendReqImpl('remove', id);
        }

        async viewDoc(evt, path) {
            return this.sendReqImpl('view', path);
        }

        async wordToPDF(evt, dataUrl) {
            return this.sendReqImpl('word-to-pdf', dataUrl);
        }

    }

    new Controller(events, db);
})();