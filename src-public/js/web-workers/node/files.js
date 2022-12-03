
((self) => {
    const BUCKET_NAME = "sheqsolve.appspot.com";
    const storageBucket = storage.ref();

    const upload = async function (uploadFile, getOpts) {
        console.log('upload', uploadFile)

        let snapshot;
        let new_name;
        if (isString(uploadFile) && uploadFile.contains(';base64,')) {
            const contentType = uploadFile.split(';base64,')[0].split(':')[1];
            const ext = fileUtils.getExtension(contentType);
            const fileName = new Date().getTime() + '.' + ext;
            new_name = await getOpts({name: fileName});
            const fileRef = storageBucket.child(new_name);
            snapshot = await fileRef.putString(uploadFile, 'data_url', {
                cacheControl: 'no-cache'
            });
        } else {
            if (isString(uploadFile)) {
                uploadFile = fileUtils.toFile(uploadFile);
            }
            new_name = await getOpts(uploadFile);
            const fileRef = storageBucket.child(new_name);
            snapshot = await fileRef.put(uploadFile, {
                cacheControl: 'no-cache'
            });
        }

        console.log('bucketFile', snapshot.ref)

//            "https://storage.googleapis.com/sheqsolve.appspot.com/sheqassist_shared_docs%2FoGuUsGbgE5Zt1zxP6IsY%2Fedited_doc%2FTodo.docx?alt=media&token=a5a73538-f553-41a2-9249-b052326cef39"
//            "gs://sheqsolve.appspot.com/sheqassist_shared_docs/oGuUsGbgE5Zt1zxP6IsY/edited_doc/Todo.docx"
        const gcsUri = "gs://" + snapshot.ref.bucket + "/" + new_name;
        let dlUrls = await snapshot.ref.getDownloadURL();
        dlUrls = dlUrls.replace("https://firebasestorage.googleapis.com/v0/b/", "");
        dlUrls = "https://storage.googleapis.com/" + dlUrls.replace('/o/', '/');
        //The above makes this link public
        return {gcsUri, dlUrls: [dlUrls]};
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
        let bucketFile = await storageBucket.child(obj.gcsUri.replace("gs://" + BUCKET_NAME + "/", ""));
        return await bucketFile.delete();
    };

    const update = async function (obj, datauri) {
        const bucketFile = await storageBucket.child(obj.gcsUri.replace("gs://" + BUCKET_NAME + "/", ""));
//        console.log(obj, datauri)
        const base64 = datauri.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');//data_url
        return await bucketFile.save(buffer);
    };

    self.files = {upload, move, remove, update};
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);