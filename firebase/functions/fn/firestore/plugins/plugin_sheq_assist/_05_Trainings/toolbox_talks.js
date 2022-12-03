
exports.onCreateTrainingToolboxTalk = functions.firestore.document('plugin_sheq_assist_05_Training_toolbox_talks/{doc}').onCreate(async (snapshot, ctx) => {
    return authorize().then(auth => {
        const {id} = snapshot;
        const {doc} = snapshot.data();
        
        const drive = google.drive({auth, version: 'v3'});
        return DriveUtils.updateDocFirestoreId(drive, doc, id);
    });
});