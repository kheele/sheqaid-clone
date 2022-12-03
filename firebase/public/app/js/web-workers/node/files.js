
((self) => {
    const isWebWorker = !!self.require;

    const BUCKET_NAME = "sheqsolve.appspot.com";
    let path, fs, admin, storageBucket;
    if (isWebWorker) {
        path = self.require('path');
        fs = self.require('fs-extra');
        admin = self.require('firebase-admin');

//admin.isStarted = true;
        console.time('admin.initializeApp: storageBucket');
//http=127.0.0.1:8001;https=127.0.0.1:8001;socks=127.0.0.1:8002
        admin.initializeApp({
            credential: admin.credential.cert(self.serviceAccount),
            storageBucket: BUCKET_NAME
//    logging_enabled: true // open logging info
        });
        console.timeEnd('admin.initializeApp: storageBucket');

        storageBucket = admin.storage().bucket();
    } else {
        storageBucket = firebase.storage().ref();
    }

    const upload = async function (pathUpload, getOpts) {
        if (isWebWorker) {
            let bucketFile;
            console.log('upload', pathUpload)
            if (typeof pathUpload === 'object') {
                bucketFile = await new Promise((resolve, reject) => {
                    const file = storageBucket.upload(pathUpload.name);
                    const blobStream = file.createWriteStream({
                        resumable: false
                    });

                    blobStream.on('finish', () => {
                        resolve(file);
                    }).on('error', (e) => {
                        reject(`Unable to upload file, something went wrong${e}`)
                    });

                    blobStream.end(pathUpload.buffer);
                });
            } else {
                if (pathUpload.contains(';base64,')) {
                    const base64Text = pathUpload.split(';base64,').pop();
                    const fileBuffer = Buffer.from(base64Text, 'base64');
                    const contentType = pathUpload.split(';base64,')[0].split(':')[1];
                    const ext = fileUtils.getExtension(contentType);
                    const fileName = new Date().getTime() + '.' + ext;
                    bucketFile = storageBucket.file(fileName);
                    await bucketFile.save(fileBuffer, {
                        public: true,
                        // Support for HTTP requests made with `Accept-Encoding: gzip`
                        gzip: true,
                        // By setting the option `destination`, you can change the name of the
                        // object you are uploading to a bucket.
                        metadata: {
                            contentType,
                            // Enable long-lived HTTP caching headers
                            // Use only if the contents of the file will never change
                            // (If the contents will change, use cacheControl: 'no-cache')
//                    cacheControl: 'public, max-age=31536000'
                            cacheControl: 'no-cache'
                        }
                    });
                    bucketFile = await bucketFile.get().then(data => data[0]);
                } else {
                    const name = fileUtils.getFileName(pathUpload);
                    const ext = fileUtils.getExtension(pathUpload);
                    const pathUpload2 = path.resolve(path.dirname(pathUpload), new Date().getTime() + '.' + ext);
                    fs.copySync(pathUpload, pathUpload2);
                    bucketFile = await storageBucket.upload(pathUpload2, {
                        public: true,
                        // Support for HTTP requests made with `Accept-Encoding: gzip`
                        gzip: true,
                        // By setting the option `destination`, you can change the name of the
                        // object you are uploading to a bucket.
                        metadata: {
                            // Enable long-lived HTTP caching headers
                            // Use only if the contents of the file will never change
                            // (If the contents will change, use cacheControl: 'no-cache')
//                    cacheControl: 'public, max-age=31536000'
                            cacheControl: 'no-cache'
                        }
                    }).then(data => {
                        fs.removeSync(pathUpload2);
                        return data[0];
                    });
                }
            }

            console.log('bucketFile', bucketFile.name)

            const new_name = await getOpts(bucketFile);
            return await move(bucketFile.name, new_name);
        } else {
            let snapshot;
            let new_name;
            if (pathUpload.contains(';base64,')) {
                const contentType = pathUpload.split(';base64,')[0].split(':')[1];
                const ext = fileUtils.getExtension(contentType);
                const fileName = new Date().getTime() + '.' + ext;
                new_name = await getOpts({name: fileName});
                const fileRef = storageBucket.child(new_name);
                snapshot = await fileRef.putString(pathUpload, 'data_url', {
                    cacheControl: 'no-cache'
                });
            } else {
                const uploadFile = pathUpload;
                new_name = await getOpts(uploadFile);
                const fileRef = storageBucket.child(new_name);
                snapshot = await fileRef.put(uploadFile, {
                    cacheControl: 'no-cache'
                });
            }

//        console.log('bucketFile', snapshot.ref.name)

//            "https://storage.googleapis.com/sheqsolve.appspot.com/sheqassist_shared_docs%2FoGuUsGbgE5Zt1zxP6IsY%2Fedited_doc%2FTodo.docx?alt=media&token=a5a73538-f553-41a2-9249-b052326cef39"
//            "gs://sheqsolve.appspot.com/sheqassist_shared_docs/oGuUsGbgE5Zt1zxP6IsY/edited_doc/Todo.docx"
            const gcsUri = "gs://" + snapshot.ref.bucket + "/" + new_name;
            let dlUrls = await snapshot.ref.getDownloadURL();
            dlUrls = dlUrls.replace("https://firebasestorage.googleapis.com/v0/b/", "");
            dlUrls = "https://storage.googleapis.com/" + dlUrls.replace('/o/', '/');
            //The above makes this link public
            return {gcsUri, dlUrls: [dlUrls]};
        }
    };

    const move = async function (name, new_name) {
        let bucketFile = await storageBucket.file(name);
        console.log('move', bucketFile.name, new_name)
        bucketFile = await bucketFile.move(new_name).then(data => data[0]);
        console.log('moved', bucketFile.name, new_name)

        const gcsUri = "gs://" + bucketFile.bucket.name + "/" + new_name;
        const dlUrls = await bucketFile.getSignedUrl({
            action: 'read',
            expires: '03-17-2025'
        });
//    console.log('move', {gcsUri, dlUrls})
        return {gcsUri, dlUrls};
    };

    const remove = async function (obj) {
        if (isWebWorker) {
            let bucketFile = await storageBucket.file(obj.gcsUri.replace("gs://" + BUCKET_NAME + "/", ""));
            return await bucketFile.delete();
        } else {
            try {
                //https://firebasestorage.googleapis.com/v0/b/
//                sheqsolve.appspot.com/sheqassist_shared_docs%2FoGuUsGbgE5Zt1zxP6IsY%2Fedited_doc%2FMedia_Company.docx
                let bucketFile = await storageBucket.child(obj.gcsUri.replace("gs://" + BUCKET_NAME + "/", ""));
                return await bucketFile.delete();
            } catch (e) {
//              //https://firebasestorage.googleapis.com/v0/b/
                let bucketFile = await storageBucket.child(obj.gcsUri.replace("gs://" + BUCKET_NAME + "/", ""));
                return await bucketFile.delete();
            }
        }
    };

    self.files = {upload, move, remove};
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);