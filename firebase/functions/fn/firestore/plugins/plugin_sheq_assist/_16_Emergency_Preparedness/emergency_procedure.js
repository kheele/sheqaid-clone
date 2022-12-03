
exports.onCreateEmergencyPreparednessEmergencyProcedure = functions.firestore.document('plugin_sheq_assist_16_Emergency_Preparedness_emergency_procedure/{doc}').onCreate(async (snapshot, ctx) => {
    return authorize().then(auth => {
        const {id} = snapshot;
        const {doc} = snapshot.data();
        
        const drive = google.drive({auth, version: 'v3'});
        return DriveUtils.updateDocFirestoreId(drive, doc, id);
    });
});