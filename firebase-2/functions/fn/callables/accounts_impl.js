const {query: loginCompanyQuery} = require('./graphql/loginCompanyQuery');

global.convertIdToBigint = (encodedHasuraRelayID) => {
    const decodedRelayID = atob(encodedHasuraRelayID);
    const relayIdAsArray = JSON.parse(decodedRelayID);
    const actualDatabaseID = relayIdAsArray[3];
    // console.log(decodedRelayID); // "[1, \"lifeplan\", \"status_plan_header\", 1]"
    // console.log(relayIdAsArray); // [1, "lifeplan", "status_plan_header", 1]
    // console.log(actualDatabaseID); // 1  (the actual database ID)!
    return actualDatabaseID;
};

// <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
exports.onSetCustomUserClaims = ({access_type, query, operationName, connection}) => {
    return async (data, ctx) => {
        await authorize();
        if (ctx.auth.uid) {
            const {auth: {uid, token: {name, picture, email, phoneNumber}}} = ctx;

            const item = await getRelayOne({
                query,
                operationName,
                variables: {auth_id: uid},
            });
            if (!item) {
                return null;
            }

            const loggedUser = {user: item};

            const {
                data: user_data,
                data: {
                    company, contractor,
                    client: my_client, project: my_project, site: my_site
                }
            } = loggedUser.user;
            company.id = convertIdToBigint(company.id);

            contractor && (contractor.id = convertIdToBigint(contractor.id));

            my_client && (my_client.id = convertIdToBigint(my_client.id));
            my_project && (my_project.id = convertIdToBigint(my_project.id));
            my_site && (my_site.id = convertIdToBigint(my_site.id));

            my_client && (user_data.client = my_client);
            my_project && (user_data.project = my_project);
            my_site && (user_data.site = my_site);

            loggedUser.company = {id: company.id, data: company};

            if (access_type === 'User') {
                // if (await isDBCOIDProvider(user_access_type, company_id) || (my_client && await isDBCOIDProvider(user_access_type, my_client.id))) {
                //     access_type = 'COID Provider';
                // } else if (await isDBMedicalCenterProvider(user_access_type, company_id) || (my_client && await isDBMedicalCenterProvider(user_access_type, my_client.id))) {
                //     access_type = 'MedicalPractitioner';
                // }
            }

            const currentCustomClaims = {
                access_type,
                company_id: company.id,
                loggedUser: {
                    user: {id: loggedUser.user.id},
                    company: {id: company.id},
                },
            };

            if (access_type === 'ContractorUser' || contractor) {
                currentCustomClaims.contractor_id = contractor.id;
            }

            if (my_client) {
                currentCustomClaims.my_client = {id: my_client.id};
            }
            if (my_project) {
                currentCustomClaims.my_project = {id: my_project.id};
            }
            if (my_site) {
                currentCustomClaims.my_site = {id: my_site.id};
            }

            console.log('currentCustomClaims', JSON.stringify(currentCustomClaims).length, JSON.stringify(currentCustomClaims))
            return setCustomUserClaims(uid, currentCustomClaims).then(async () => {
                try {
                    const token = await admin.auth().createCustomToken(uid, {access_type});
                    return {loggedUser, token};
                } catch (err) {
                    console.error(err)
                    return "ERR_CREATING_TOKEN";
                }
            });
//        return admin.auth().setCustomUserClaims(uid, currentCustomClaims);
        } else {
            return null;
        }
    };
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onLogin">
exports.onLogin = ({funs, access_type, tbl}) => {
    const {getDBUser, isDBCOIDProvider, isDBMedicalCenterProvider} = funs;
    return async (user_access_type, ctx) => {
        await authorize();
        if (ctx.auth.uid) {
            const {auth: {uid, token: {name, picture, email, phoneNumber}}} = ctx;

            let user_res;
            if (access_type === 'ContractorUser') {
                user_res = await getDBUser(tbl, uid);
            } else {
                user_res = await getDBUser(uid);
            }

            if (!user_res) {
                return null;
            }

            const {db_user} = user_res;

            const {company_id, contractor_id, client: my_client, project: my_project, site: my_site} = db_user.data;

            if (access_type === 'User') {
                if (await isDBCOIDProvider(user_access_type, company_id) || (my_client && await isDBCOIDProvider(user_access_type, my_client.id))) {
                    access_type = 'COID Provider';
                } else if (await isDBMedicalCenterProvider(user_access_type, company_id) || (my_client && await isDBMedicalCenterProvider(user_access_type, my_client.id))) {
                    access_type = 'MedicalPractitioner';
                }
            }

            const currentCustomClaims = {
                access_type,
                company_id,
//            p: {//permissions
//                m: permissions_modules,
//                o: permissions_other
//            }
            };

            if (access_type === 'ContractorUser' || contractor_id) {
                currentCustomClaims.contractor_id = contractor_id;
            }

            if (my_client) {
                currentCustomClaims.my_client = my_client;
            }
            if (my_project) {
                currentCustomClaims.my_project = my_project;
            }
            if (my_site) {
                currentCustomClaims.my_site = my_site;
            }

            console.log('currentCustomClaims', JSON.stringify(currentCustomClaims).length, JSON.stringify(currentCustomClaims))
            return setCustomUserClaims(uid, currentCustomClaims);
//        return admin.auth().setCustomUserClaims(uid, currentCustomClaims);
        } else {
            return null;
        }
    };
//     return async (user_access_type, ctx) => {
//         await authorize();
//         if (ctx.auth.uid) {
//             const {auth: {uid, token: {name, picture, email, phoneNumber}}} = ctx;
//
//             let user_res;
//             if (access_type === 'ContractorUser') {
//                 user_res = await getDBUser(tbl, uid);
//             } else {
//                 user_res = await getDBUser(uid);
//             }
//
//             if (!user_res) {
//                 return null;
//             }
//
//             const {db_user} = user_res;
//
//             /*
//              //        let {permissions_modules, permissions_other} = db_user.data;
//              //        permissions_modules = permissions_modules.map(({key, actions: {create, edit, view, remove, share}}) => {
//              //            return {
//              //                [key.substring(0, 3)]: {
//              //                    c: create ? 1 : 0,
//              //                    e: edit ? 1 : 0,
//              //                    v: view ? 1 : 0,
//              //                    r: remove ? 1 : 0,
//              //                    s: share ? 1 : 0
//              //                }
//              //            };
//              //        });
//              //        permissions_other = permissions_other.map(({key, actions: {create, edit, view, remove, share}}) => {
//              //            return {
//              //                [key]: {
//              //                    c: create ? 1 : 0,
//              //                    e: edit ? 1 : 0,
//              //                    v: view ? 1 : 0,
//              //                    r: remove ? 1 : 0,
//              //                    s: share ? 1 : 0
//              //                }
//              //            };
//              //        });
//
//              //        const create = list => list.filter(({key, desc, actions: {create}}) => create).map(({key}) => key);
//              //        const edit = list => list.filter(({key, desc, actions: {edit}}) => edit).map(({key}) => key);
//              //        const view = list => list.filter(({key, desc, actions: {view}}) => view).map(({key}) => key);
//              //        const remove = list => list.filter(({key, desc, actions: {remove}}) => remove).map(({key}) => key);
//              //        const share = list => list.filter(({key, desc, actions: {share}}) => share).map(({key}) => key);
//              */
//
//             const {company_id, contractor_id, client: my_client, project: my_project, site: my_site} = db_user.data;
//
//             if (access_type === 'User') {
//                 if (await isDBCOIDProvider(user_access_type, company_id) || (my_client && await isDBCOIDProvider(user_access_type, my_client.id))) {
//                     access_type = 'COID Provider';
//                 } else if (await isDBMedicalCenterProvider(user_access_type, company_id) || (my_client && await isDBMedicalCenterProvider(user_access_type, my_client.id))) {
//                     access_type = 'MedicalPractitioner';
//                 }
//             }
//
//             const currentCustomClaims = {
//                 access_type,
//                 company_id,
// //            p: {//permissions
// //                m: permissions_modules,
// //                o: permissions_other
// //            }
//             };
//
//             if (access_type === 'ContractorUser' || contractor_id) {
//                 currentCustomClaims.contractor_id = contractor_id;
//             }
//
//             if (my_client) {
//                 currentCustomClaims.my_client = my_client;
//             }
//             if (my_project) {
//                 currentCustomClaims.my_project = my_project;
//             }
//             if (my_site) {
//                 currentCustomClaims.my_site = my_site;
//             }
//
//             console.log('currentCustomClaims', JSON.stringify(currentCustomClaims).length, JSON.stringify(currentCustomClaims))
//             return setCustomUserClaims(uid, currentCustomClaims);
// //        return admin.auth().setCustomUserClaims(uid, currentCustomClaims);
//         } else {
//             return null;
//         }
//     };
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onResetPassword">
exports.onResetPassword = ({access_type, tbl}) => {
    return async (data, ctx) => {
        await authorize();
        if (!data)
            return null;
        if (!isObject(data))
            return null;

        const {id: reset_id, password} = data;
        if (!reset_id)
            return null;
        if (!password)
            return null;

        let col_ref = await db.collection(tbl).where('reset_password_id', '==', reset_id).limit(1);

        const snapshot = await col_ref.get();
        if (snapshot.empty) {
            return "TOKEN_NOT_FOUND";
        } else {
            let promise;
            if (access_type === 'Staff') {
                const {id: uid, data: {phone, email}} = snapshot.docs[0];
                if (phone) {
                    promise = admin.auth().getUserByPhoneNumber(phone);
                } else {
                    promise = admin.auth().getUserByEmail(email);
                }
            } else {
                const {id: uid} = snapshot.docs[0];
                promise = admin.auth().getUser(uid);
            }

            return promise.then(async (userRecord) => {
                const {uid, email, phoneNumber} = userRecord;

                let id = uid;
                if (access_type === 'Staff') {
                    const getId = async (tbl, phoneNumber, email) => {
                        let snapshot;
                        if (phoneNumber) {
                            snapshot = await db.collection(tbl).where('phone', '==', phoneNumber).limit(1).get();
                        } else if (email) {
                            snapshot = await db.collection(tbl).where('email', '==', email).limit(1).get();
                        }

                        if (!snapshot || snapshot.empty) {
                            return null;
                        }
                        snapshot = snapshot.docs[0];
                        return snapshot.id;
                    };
                    id = await getId(tbl, phoneNumber, email);
                }

                if (!id) {
                    return null;
                }

                let doc_ref = await db.collection(tbl).doc(id);

                try {
                    await doc_ref.update({password, reset_password_id: null});
                } catch (err) {
                    return "UDATE_ERROR";
                }
                console.log('onResetPassword', access_type, userRecord.changePassword, userRecord.updatePassword)
                try {
                    await admin.auth().updateUser(uid, {password});
                    console.log('onResetPassword success')
                    return true;
                } catch (err) {
                    console.log('onResetPassword err 2', err.message)
                    await doc_ref.update({password, reset_password_id: reset_id});
                    return "UDATE_ERROR";
                }
            });
        }
    };
};
// </editor-fold>
