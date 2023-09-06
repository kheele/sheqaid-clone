
(() => {
    class Controller extends AControllerRead {
        constructor(events) {
            super(events, {singular: "Document", plural: "Documents"}, "default/docs/");

            const {addAction} = this;

            addAction('doc/new', this.newDoc.bind(this));
            addAction('doc/edit', this.editDoc.bind(this));
            addAction('doc/edit-title', this.editDocTitle.bind(this));
            addAction('doc/update-upload', this.updateDocUpload.bind(this));
            addAction('doc/remove', this.removeDoc.bind(this));
            addAction('doc/view', this.viewDoc.bind(this));
            addAction('doc/word-preview-url', this.wordPreviewUrl.bind(this));
            addAction('doc/excel-preview-url', this.excelPreviewUrl.bind(this));
        }

        async sendReqImpl(path, data) {
            return Events.whenLoggedIn(async (loggedUser, auth) => {
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

        async editDocTitle(evt, fileId, title) {
            console.log('editDocTitle', fileId, title)
            return this.sendReqImpl('edit-title', {fileId, title});
        }

        async updateDocUpload(evt, fileId, filePath, type) {
            return Events.whenLoggedIn(async loggedUser => {
                const gcsUri = await files.upload.call(this, filePath, async bucketFile => {
                    console.log('updateDocUpload', bucketFile)
                    return 'temp/' + fileId + '.' + fileUtils.getExtension(bucketFile.name);
                });
                return this.sendReqImpl('update-upload', {fileId, gcsUri, type});
            });
        }

        async removeDoc(evt, id) {
            return this.sendReqImpl('remove', id);
        }

        async viewDoc(evt, path) {
            return this.sendReqImpl('view', path);
        }

        async wordPreviewUrl(evt, dataUrl) {
            return this.sendReqImpl('word-preview-url', dataUrl);
        }

        async excelPreviewUrl(evt, dataUrl) {
            return this.sendReqImpl('excel-preview-url', dataUrl);
        }

    }

    new Controller(events);
})();