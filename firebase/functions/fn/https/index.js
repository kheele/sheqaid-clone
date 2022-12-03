const formidable = require('formidable');

exports.getDoc = functions.https.onRequest((req, res) => {
    return authorize().then(auth => {
        const {d: path} = req.query;
        console.log("getDoc", path);
        const drive = google.drive({version: 'v3'});
        DriveUtils.getDriveFileByPath(drive, path).then(driveFile => {
            console.log("getDoc1", !!driveFile);
            return driveFile ? driveFile : DriveUtils.saveRemotePathToDrive(drive, path);
        }).then(driveFile => {
            console.log("getDoc2", !!driveFile);
            DriveUtils.streamDriveHttpResponse(drive, driveFile, res);
            return null;
        }).catch(err => {
//        res.sendStatus(403);
            console.log('getDoc err1', JSON.stringify(err))
//        res.status(500).send(err);
        });
        return null;
    }).catch(err => {
//        res.sendStatus(403);
        console.log('getDoc err2', JSON.stringify(err))
//        res.status(500).send(err);
    });
});

exports.updateDoc = functions.storage.object().onFinalize(async object => {
    return authorize().then(auth => {
        const {bucket: bucketName, name: filePath, contentType, metageneration} = object;
        let fileId = path.basename(filePath);
        console.log('updateDoc', fileId, filePath);
        if (filePath.startsWith('temp') && fileId.contains('.pdf') || fileId.contains('.docx') || fileId.contains('.doc')) {
            fileId = fileId.replace('.pdf', '').replace('.docx', '').replace('.doc', '');
            const bucket = admin.storage().bucket(bucketName);
            const remoteFile = bucket.file(filePath);
            const drive = google.drive({auth, version: 'v3'});
            return DriveUtils.updateDoc(drive, fileId, remoteFile);
        } else {
            return null;
        }
    });
});