const {send} = require('./employee_docs-send');

//sub_collection_keys.employee_contract_list.latest.expiry_date
const createList = (key, plural, singular) => {
    return {
        group: "Employees", tbl: "employees", collectionGroup: `${key}_list`, name: {plural, singular}
    };
};
const employee_lists = [
    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("contract", "Contracts", "Contract"), //7

    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("warning", "Warnings", "Warning"), //0

    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("medical", "Medical Certificates", "Medical Certificate"), //1

    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("competency", "Competency Certificates", "Competency Certificate"), //1

    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("leave", "Leaves", "Leave"),

    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("counselling", "Counselings", "Counseling"),

    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("work_permit", "Work Permits", "Work Permit"),

    //hrassistgobonzela@outlook.com, edward2@sheqsolve.com, evan.h888@gmail.com, safety@gobonzela.co.za, louis@gobonzela.co.za, sonet@gobonzela.co.za
    createList("licence", "Licences", "Licence")
];

exports.sendExpiryEmails = async (ctx) => {
    await authorize();
    // console.log('sendExpiryEmails local')
    // console.log('sendExpiryEmails local', JSON.stringify(ctx))

    const now = admin.firestore.Timestamp.now();
    const month = now.toDate().addMonths(1).getTime();

    // let q = db_hr.collectionGroup("licence_list");
    // const snapshot = await q.get();
    // await Promise.all(snapshot.docs.map(async doc => {
    //     const {id} = doc;
    //     const {employee, company_id: old_company_id, client_id: old_client_id, project_id: old_project_id, site_id: old_site_id} = doc.data();
    //
    //     const snapshot = await db_hr.collection('employees').doc(employee.id).get();
    //     if (snapshot.exists) {
    //         const company_id = snapshot.get("company_id");
    //         if(old_company_id !== company_id) {
    //             await doc.ref.set({company_id}, {merge: true});
    //         }
    //         const client_id = snapshot.get("client_id");
    //         if(old_client_id !== client_id) {
    //             await doc.ref.set({client_id}, {merge: true});
    //         }
    //         const project_id = snapshot.get("project_id");
    //         if(old_project_id !== project_id) {
    //             await doc.ref.set({project_id}, {merge: true});
    //         }
    //         const site_id = snapshot.get("site_id");
    //         if(old_site_id !== site_id) {
    //             await doc.ref.set({site_id}, {merge: true});
    //         }
    //         console.log("done", employee.id, employee.lname, employee.fname)
    //     } else {
    //         console.log("---errr", employee.id, employee.lname, employee.fname)
    //     }
    // }));
    //
    // return;

    const executor = async (_group, tbl, collectionGroup, name) => {
        let q = db_hr.collectionGroup(collectionGroup);
        q = q.where(`expiry_date`, '<=', month);
        // q = q.where(`expiry_updated`, '==', false);
//        q = q.where(`sub_collection_keys.${collectionGroup}.latest.expiry_notif_level`, '<=', month);
//         q = q.where(`expiry_notif_status.month`, '!=', true);
//         q = q.where(`expiry_notif_status.week`, '!=', true);
//         q = q.where(`expiry_notif_status.date`, '!=', true);
//         q = q.where(`expiry_notif_status.expired`, '!=', true);
//         q = q.where(`expiry_notif_status.no_expiry`, '!=', true);
        q = q.where('removed', '==', false);
        // q = q.where('company_id', '==', 'qPFSzXKRmPBUwUztZ379');//TODO: comment/remove after testing
        const snapshot = await q.get();
        const list = snapshot.docs.map(doc => {
            return {ref: doc.ref, id: doc.id, data: doc.data()};
        });

        // await Promise.all(list.map(async ({ref}) => {
        //     await ref.set({expiry_updated: false}, {merge: true});
        // }));

        if (!list.isEmpty()) {
            console.log('*********************************************')
            console.log('sendExpiryEmails list', collectionGroup, month, list.length)
            console.log('*********************************************')

            const company_ids = list.map(({data: {company_id}}) => company_id).distinct();
            const company_groups = list.groupBy(({data: {company_id}}) => company_id);

            // console.log('company_ids', company_ids)
            // console.log('company_groups', company_groups)
            await send({company_ids, company_groups, _group, tbl, collectionGroup, name});
        }
    };

    for (let i = 0; i < employee_lists.length; i++) {
        const {group, tbl, collectionGroup, name} = employee_lists[i];
        await executor(group, tbl, collectionGroup, name);
    }
};

exports.removeNotificationOfRemoved = async (ctx) => {
    await authorize();
//    console.log('removeNotificationOfRemoved', JSON.stringify(ctx))

    const now = admin.firestore.Timestamp.now();
    const month = now.toDate().addMonths(1).getTime();

    const executor = async (_group, tbl, collectionGroup, name) => {
        let q = db.collection(tbl);
        q = q.where(`sub_collection_keys.${collectionGroup}.latest.expiry_date`, '<=', month);
        q = q.where('removed', '==', true).where('notifications_removed', '==', false);
        const snapshot = await q.get();
        await Promise.all(snapshot.docs.map(async employee_doc => {
//            if (employee_doc.data().company_id !== 'qPFSzXKRmPBUwUztZ379') {
//                return;
//            }
            console.log('removeNotificationOfRemoved removing', employee_doc.id, JSON.stringify(employee_doc.data()))
            let q = db2.collection('default_notifications');
            q = q.where('_target.id', '==', employee_doc.id);
            const snapshot = await q.get();
            if (!snapshot.empty) {
                await Promise.all(snapshot.docs.map(async notif_doc => {
                    const updated = await notif_doc.ref.set({removed: true}, {merge: true});//Promise < void >
                }));
            }
            const updated = await employee_doc.ref.set({notifications_removed: true}, {merge: true});//Promise < void >
            console.log('removeNotificationOfRemoved removed of ', employee_doc.id)
        }));
    };

    return await Promise.all(employee_lists.map(async ({group, tbl, collectionGroup, name}) => {
        return await executor(group, tbl, collectionGroup, name);
    }));
};
//264