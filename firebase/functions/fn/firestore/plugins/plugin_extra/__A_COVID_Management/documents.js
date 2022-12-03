
exports.onCreate = functions.firestore.document('plugin_sheq_assist_COVID_Management_documents/{doc}').onCreate(async (snapshot, ctx) => {
    return onDriver().then(drive => {
        const {id} = snapshot;
        const {doc} = snapshot.data();
        
        return DriveUtils.updateDocFirestoreId(drive, doc, id);
    });
});