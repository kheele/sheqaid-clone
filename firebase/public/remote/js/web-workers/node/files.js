
((self) => {
    const storageBucket = firebase.storage().ref();

    const upload = async function (uploadFile, getOpts) {
        const new_name = await getOpts(uploadFile);
        const fileRef = storageBucket.child(new_name);
        const snapshot = await fileRef.put(uploadFile, {
            cacheControl: 'no-cache'
        });

//        console.log('bucketFile', snapshot.ref.name)

        const gcsUri = "gs://" + snapshot.ref.bucket + "/" + new_name;
        const dlUrls = await snapshot.ref.getDownloadURL();
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
        let bucketFile = await storageBucket.child(obj.gcsUri.replace("gs://trading-ls.appspot.com/", ""));
        return await bucketFile.delete();
    };

    self.files = {upload, move, remove};
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);