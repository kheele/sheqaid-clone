const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();
const DEFAULT_BUCKET = 'sheqsolve.appspot.com';
const bucket = storage.bucket(DEFAULT_BUCKET);

class DriveUtils {

    static async createDoc(drive, name) {
        const fileMetadata = {
            name: name || "Untitled",
            mimeType: "application/vnd.google-apps.document"
        };
        return drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        }).then(res => {
            console.log(res);
            return null;//DriveUtils.getDriveFileByPath(drive, remoteFilePath);
        });
    }

    static async removeDoc(drive, fileId) {
        return drive.files.delete({
            fileId,
            fields: 'nextPageToken, files(id, name)',
        }).then(res => {
            console.log('publishDriveFile deleted', JSON.stringify(res.data))
            return fileId;
        });
    }

    static async shareDriveFile(drive, driveFile) {
        console.log("shareDriveFile", driveFile.id);
        return drive.permissions.create({
            resource: {
                'role': 'writer',
                'type': 'anyone',
//                        'type': 'domain',
//                        'domain': "sheqsolve.web.app"
            },
            fileId: driveFile.id,
            sendNotificationEmail: false,
            fields: 'id'
        }).then(res => {
            return driveFile;
        });
    }
//
//    static async publishDriveFile(auth, drive, driveFile) {
//        return drive.revisions.list({
//            auth,
//            fileId: driveFile.id,
//            "pageSize": 1,
////            "fields": "id"
//        }).then(res => {
//            const revision = res.data.revisions[0];
//            console.log('publishDriveFile res.data.revisions', JSON.stringify(res.data.revisions))
//            return drive.revisions.update({
//                auth,
//                resource: {
//                    published: true,
//                    publishAuto: true,
//                    keepForever: true
//                },
//                fileId: driveFile.id,
//                revisionId: revision.id,
//                fields: "id"
//            }).then(res => {
//                console.log('publishDriveFile', JSON.stringify(driveFile), JSON.stringify(res.data))
//                return driveFile;
////          `https://docs.google.com/document/d/${driveFile.id}/pub`;
//            });
//        });
//    }
//
//    static async streamDriveHttpResponse(drive, driveFile, res) {
//        drive.files.export({
//            fileId: driveFile.id,
//            mimeType: 'application/pdf'
//        }).on("end", () => {
////            res.status(200).send();
//            console.log('Done');
//        }).on("error", err => {
////            res.status(500).send(err);
//            console.log('err', err);
//        }).pipe(res);
//    }

//    static async streamDriveFile(drive, driveFile, writeStream) {
//        return new Promise((resolve, reject) => {
//            drive.files.get({fileId: driveFile.id}, {responseType: "stream"}, (err, readStream) => {
//                if (err) {
//                    reject(err);
//                } else {
//                    readStream.data.on("end", () => {
//                        resolve();
//                    }).on("error", err => {
//                        reject(err);
//                    }).pipe(writeStream);
//                }
//            });
//        });
//    }

    //link to cloud storage
    static async getDriveFileByPath(drive, remoteFilePath) {
        let remoteFileName = getFilename(remoteFilePath);
        remoteFileName = remoteFileName.replace(".pdf", "").replace(".docx", "").replace(".doc", "");
        console.log("getDriveFileByPath", remoteFileName);
        return drive.files.list({
            maxResults: 1,
            q: `appProperties has {key='remoteFileName' and value='${remoteFileName}'}`,
            fields: 'files(id, name)'
        }).then(res => {
            const files = res.data.files;
            if (files.length > 0) {
                return files[0];
            } else {
                return DriveUtils.saveRemoteFileToDrive(drive, remoteFilePath);
            }
        }).then(driveFile => {
            console.log('getDriveFileByPath', JSON.stringify(driveFile))
            return DriveUtils.shareDriveFile(drive, driveFile);
        });
    }
//
//    static async saveDriveFileToRemote(drive, driveFile, remoteFilePath) {
//        const remoteFileName = getFilename(remoteFilePath);
//        const remoteFile = bucket.file(remoteFileName);
//        const remoteStream = remoteFile.createWriteStream();
//        return DriveUtils.streamDriveFile(drive, driveFile, remoteStream);
//    }

    static async saveRemoteFileToDrive(drive, remoteFilePath) {
        let remoteFileName = getFilename(remoteFilePath);
        const remoteFile = await bucket.file(remoteFileName);
        remoteFileName = remoteFileName.replace(".pdf", "").replace(".docx", "").replace(".doc", "");

        const name = remoteFile.name.split('\\').pop().split('/').pop();

        console.log("saveRemoteFileToDrive", remoteFile.name, name);
        const fileMetadata = {
            name,
            mimeType: "application/vnd.google-apps.document",
            appProperties: {
                remoteFileName
            }
        };
        return drive.files.create({
            resource: fileMetadata,
            media: {
                body: remoteFile.createReadStream()
            },
            fields: 'id'
        }).then(res => {
            return DriveUtils.getDriveFileByPath(drive, remoteFilePath);
        });
    }

    //watch file then save it to remote storage
}

function getFilename(gcsUri) {
    if (typeof gcsUri === 'object' && gcsUri.gcsUri) {
        gcsUri = gcsUri.gcsUri;
    }
    if (typeof gcsUri === 'string') {
        return gcsUri.replace("gs://" + DEFAULT_BUCKET + "/", "");
    }
}

module.exports = DriveUtils;