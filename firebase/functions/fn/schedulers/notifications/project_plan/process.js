const {send} = require('./send');

exports.sendEmails = async (ctx) => {
    await authorize();
    // console.log('sendExpiryEmails local')

    const now = admin.firestore.Timestamp.now();
    const month = now.toDate().addMonths(1).getTime();

    const query = async ({eq, val}) => {
        let q = db.collection("plugin_sheq_assist_documents");
        q = q.where(`doc_type_key`, '==', 'plugin_sheq_assist_01_Project_Plan');
        q = q.where(`expiry`, eq, val);
        const snapshot = await q.get();
        return snapshot.docs.filter(doc => !doc.get('removed')).map(doc => {
            return {ref: doc.ref, id: doc.id, data: doc.data()};
        });
    };
    const list = [
        ...(await query({eq: '<=', val: month})),
        ...(await query({eq: '==', val: null})),
    ];

    // await Promise.all(list.map(async ({ref}) => {
    //     await ref.set({expiry_updated: false}, {merge: true});
    // }));

    if (!list.isEmpty()) {
        // console.log('*********************************************')
        // console.log('sendExpiryEmails list', month, list.length)
        // console.log('*********************************************')

        const company_ids = list.map(({data: {company_id}}) => company_id).distinct();
        const company_groups = list.groupBy(({data: {company_id}}) => company_id);

        await send({company_ids, company_groups});
    }
};
