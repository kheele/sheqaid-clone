
exports.onCreate = functions.firestore.document('plugin_sheq_assist_COVID_Management_screening/{doc}').onCreate(async (snapshot, ctx) => {
    console.log('snapshot', snapshot.id)
//    const old_doc = change.before;
//    const new_doc = change.after;
//    if(old_doc && new_doc) {
//        const new_data = new_doc.data();
//    }
});