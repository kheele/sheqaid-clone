
class Cntr extends ACntr {
    constructor(eventManager) {
        super(eventManager, 'default/docs/');

        const {addAction} = this;
        addAction('new', this.newDoc.bind(this));
        addAction('edit', this.editDoc.bind(this));
        addAction('edit-title', this.editDocTitle.bind(this));
        addAction('update-upload', this.updateDocUpload.bind(this));
        addAction('remove', this.removeDoc.bind(this));
        addAction('view', this.viewDoc.bind(this));
    }

    async newDoc(ctx, title) {
        return authorize().then(auth => {
            const drive = google.drive({auth, version: 'v3'});
            return DriveUtils.createDoc(drive, title);
        });
    }

    async editDoc(ctx, path) {
        return authorize().then(auth => {
            console.log("Step 1: editFile", path);
            const drive = google.drive({auth, version: 'v3'});
//
//            drive.files.list({
////              q: "mimeType = 'application/msword'",
////              pageSize: 100,
//                fields: 'nextPageToken, files(id, name)',
//            }, (err, res) => {
//                if (err) {
//                    return console.log('The API returned an error: ' + err);
//                }
//                const files = res.data.files;
//                console.log('publishDriveFile files', JSON.stringify(files))
//                if (files.length) {
//                    files.forEach(f => {
//                        drive.files.delete({
//                            fileId: f.id,
//                            fields: 'nextPageToken, files(id, name)',
//                        }, (err, res) => {
//                            if (err) {
//                                return console.log('The API returned an error: ' + err);
//                            }
//                            console.log('publishDriveFile deleted', JSON.stringify(res.data))
//                        });
//                    });
//                } else {
//                    console.log('No files found.');
//                }
//            });
//            return null;
            return DriveUtils.getDriveFileByPath(drive, path);
        });
    }

    async editDocTitle(ctx, fileId, title) {
        return authorize().then(auth => {
            console.log("Step 1: editDocTitle", fileId, title);
            const drive = google.drive({auth, version: 'v3'});

            return DriveUtils.updateDocTitle(drive, fileId, title);
        });
    }

    async updateDocUpload(ctx, fileId, gcsUri, type) {
        return authorize().then(auth => {
            console.log("Step 1: updateDocUpload", fileId, gcsUri, type);
            const drive = google.drive({auth, version: 'v3'});
            return DriveUtils.updateRemotePathToDrive(drive, fileId, gcsUri, type);
        });
    }

    async removeDoc(ctx, id) {
        return authorize().then(auth => {
            const drive = google.drive({auth, version: 'v3'});
            return DriveUtils.removeDoc(drive, id);
        });
    }

    async viewDoc(ctx, path) {
        return authorize().then(auth => {
            const drive = google.drive({auth, version: 'v3'});
            return DriveUtils.getDriveFileByPath(drive, path);
        });
    }

}

exports.run = (eventManager) => {
    new Cntr(eventManager);
};