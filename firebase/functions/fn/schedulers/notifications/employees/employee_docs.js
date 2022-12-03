const {createNotif} = require('../funs.js');
const {
    getEmployeesByCompanyAll, getEmployeesByCompanyOnly, getEmployeesByClientOnly, getEmployeesByProjectOnly, getEmployeesBySiteOnly,
    getUsersByCompanyAll, getUsersByCompanyOnly, getUsersByClientOnly, getUsersByProjectOnly, getUsersBySiteOnly,
    getSending
} = require('./get.js');
const {groupEmployeesByCompany} = require('./group_by.js');

//sub_collection_keys.employee_contract_list.latest.expiry_date
const createList = (key, plural, singular) => {
    return {
        group: "Employees",
        tbl: "employees",
        collectionGroup: `${key}_list`,
        name: {plural, singular}
    };
};
const employee_lists = [
//    createList("contract", "Contracts", "Contract"), //7
    createList("warning", "Warnings", "Warning"), //0
//    createList("medical", "Medical Certificates", "Medical Certificate"), //1
//    createList("competency", "Competency Certificates", "Competency Certificate"), //1
//    createList("leave", "Leaves", "Leave"),
//    createList("counselling", "Counselings", "Counseling"),
//    createList("work_permit", "Work Permits", "Work Permit"),
//    createList("licence", "Licences", "Licence")
];

exports.sendExpiryEmails = async (ctx) => {
    await authorize();
    console.log('sendExpiryEmails local', JSON.stringify(ctx))

    const now = admin.firestore.Timestamp.now();
    const month = now.toDate().addMonths(1).getTime();

    const executor = async (_group, tbl, collectionGroup, name) => {
        let q = db.collection(collectionGroup);
        q = q.where(`expiry_date`, '<=', month);
        // q = q.where(`docs.${collectionGroup}.latest.expiry_date`, '<=', month);
        // q = q.where(`sub_collection_keys.${collectionGroup}.latest.expiry_date`, '<=', month);
//        q = q.where(`sub_collection_keys.${collectionGroup}.latest.expiry_notif_level`, '<=', month);
        q = q.where('removed', '==', false);
        const snapshot = await q.get();
        const employeeList = snapshot.docs.map(doc => {
            return {id: doc.id, data: doc.data()};
        });
        
        console.log('*********************************************')
        console.log('sendExpiryEmails employeeList', collectionGroup, month, employeeList.length)
        console.log('*********************************************')
        await Promise.all(groupEmployeesByCompany(employeeList).map(async ({company_id, client_list}, n) => {
            if (company_id !== '4hKU3CF7tder8OhqoGrf') {
//                return;
            }
            if (company_id !== 'qPFSzXKRmPBUwUztZ379') {
                return;
            }

            const allUsersByCompanyAll = await getUsersByCompanyAll(company_id, client_list);
            const allUsersByCompanyOnly = getUsersByCompanyOnly(allUsersByCompanyAll);
            const allUsersByClientOnly = getUsersByClientOnly(allUsersByCompanyAll);
            const allUsersByProjectOnly = getUsersByProjectOnly(allUsersByCompanyAll);
            const allUsersBySiteOnly = getUsersBySiteOnly(allUsersByCompanyAll);

            const employeesByCompany = getEmployeesByCompanyAll(client_list);
            const employeesByCompanyOnly = getEmployeesByCompanyOnly(client_list);
            const employeesByClientOnly = getEmployeesByClientOnly(client_list);
            const employeesByProjectOnly = getEmployeesByProjectOnly(client_list);
            const employeesBySiteOnly = getEmployeesBySiteOnly(client_list)

            const sendingByCompanyOnly = await getSending(tbl, _group, collectionGroup, employeesByCompanyOnly, name);
            const sendingByClientOnly = await getSending(tbl, _group, collectionGroup, employeesByClientOnly, name);
            const sendingByProjectOnly = await getSending(tbl, _group, collectionGroup, employeesByProjectOnly, name);
            const sendingBySiteOnly = await getSending(tbl, _group, collectionGroup, employeesBySiteOnly, name);

            console.log(n, company_id, 'start######################################')
            {
                console.log('Employees', company_id, '--------------',
                        collectionGroup, name.singular,
                        employeesByCompany.length, '=',
                        employeesByCompanyOnly.length, employeesByClientOnly.length, employeesByProjectOnly.length, employeesBySiteOnly.length)

                employeesByCompanyOnly.forEach(({id, data: {fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--CompanyOnly',
                            collectionGroup, name.singular,
                            fname, lname, company_id, client_id, project_id, site_id
                            )
                });
                employeesByClientOnly.forEach(({id, data: {fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--ClientOnly',
                            collectionGroup, name.singular,
                            fname, lname, company_id, client_id, project_id, site_id
                            )
                });
                employeesByProjectOnly.forEach(({id, data: {fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--ProjectOnly',
                            collectionGroup, name.singular,
                            fname, lname, company_id, client_id, project_id, site_id
                            )
                });
                employeesBySiteOnly.forEach(({id, data: {fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--SiteOnly',
                            collectionGroup, name.singular,
                            fname, lname, company_id, client_id, project_id, site_id
                            )
                });
            }

            console.log('------------------------------')
            {
                console.log('Users', company_id, '--------------',
                        collectionGroup, name.singular,
                        allUsersByCompanyAll.length, '=',
                        allUsersByCompanyOnly.length, allUsersByClientOnly.length, allUsersByProjectOnly.length, allUsersBySiteOnly.length)

                allUsersByCompanyOnly.forEach(({id, data: {username, fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--CompanyOnly',
                            collectionGroup, name.singular,
                            username, fname, lname, company_id, client_id, project_id, site_id
                            )
                });
                allUsersByClientOnly.forEach(({id, data: {username, fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--ClientOnly',
                            collectionGroup, name.singular,
                            username, fname, lname, company_id, client_id, project_id, site_id
                            )
                });
                allUsersByProjectOnly.forEach(({id, data: {username, fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--ProjectOnly',
                            collectionGroup, name.singular,
                            username, fname, lname, company_id, client_id, project_id, site_id
                            )
                });
                allUsersBySiteOnly.forEach(({id, data: {username, fname, lname, company_id, client_id, project_id, site_id}}) => {
                    console.log(
                            '--SiteOnly',
                            collectionGroup, name.singular,
                            username, fname, lname, company_id, client_id, project_id, site_id
                            )
                });
            }

            console.log('------------------------------')
            {
                console.log('sendingByXOnly', company_id, '--------------',
                        collectionGroup, name.singular,
                        !!sendingByCompanyOnly)

                if (sendingByCompanyOnly) {
                    const {sendingList, resendingList} = sendingByCompanyOnly;
                    if (sendingList) {
                        const {expiry_date__none, expiry_date__expired, expiry_date__future_expiry} = sendingList;
                        {
                            const {notifMsg, list} = expiry_date__none;
                            console.log(
                                    '--CompanyOnly sendingList -- expiry_date__none',
                                    collectionGroup, name.singular,
                                    notifMsg, list.length
                                    )
                        }
                        {
                            const {notifMsg, list} = expiry_date__expired;
                            console.log(
                                    '--CompanyOnly sendingList -- expiry_date__expired',
                                    collectionGroup, name.singular,
                                    notifMsg, list.length
                                    )
                        }
                        {
                            const {notifMsg, list} = expiry_date__future_expiry;
                            console.log(
                                    '--CompanyOnly sendingList -- expiry_date__future_expiry',
                                    collectionGroup, name.singular,
                                    notifMsg, list.length
                                    )
                        }
                    }
                }
            }
            console.log(n, company_id, 'end########################################\n')

//            console.log('client_list1', collectionGroup, name.singular, allUsersByCompany.length)

            /*
             * 1. get users
             * 2. group users by site, project, client
             * 3. get sendingList
             * 4.1 expiry_date__none, 
             * 4.2 expiry_date__expired, 
             * 4.3 expiry_date__future_expiry, 
             * 5. genearate email list of list[employee_item] and expiry date of any
             */

            /*
             * 1. Sonet -> All
             * 2. Willie -> Mzilazembe -> All
             * 3. Loui -> Gobonzela -> All
             * 4. Nompi -> Mzilazembe -> SAPPI -> All
             * 5. Gift -> Gobonzela -> SAPPI -> All
             * 6. Edward -> Mzilazembe -> SAPPI -> SiteX
             * 
             * -
             * Employee1 = Mzilazembe, SAPPI & SiteX
             * Employee2 = Mzilazembe, SAPPI & SiteY
             * Employee3 = Mzilazembe, SAPPI & All
             */

            /*sendingList = [{expiry_date__none, expiry_date__expired, expiry_date__future_expiry}]
             //expiry_date__none = [employee_item] 
             //-> groupby by site 
             //-> on each site group
             //- Add users
             //- Add 1.
             //- Add 2. 
             //expiry_date__expired = [{employee_item, expiry_date}]
             //expiry_date__future_expiry = [{employee_item, expiry_date}]
             */
        }));
    };

    return await Promise.all(employee_lists.map(async ({group, tbl, collectionGroup, name}) => {
        return await executor(group, tbl, collectionGroup, name);
    }));
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