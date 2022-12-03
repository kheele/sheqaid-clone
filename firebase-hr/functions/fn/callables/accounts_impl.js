
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

            /*
             //        let {permissions_modules, permissions_other} = db_user.data;
             //        permissions_modules = permissions_modules.map(({key, actions: {create, edit, view, remove, share}}) => {
             //            return {
             //                [key.substring(0, 3)]: {
             //                    c: create ? 1 : 0,
             //                    e: edit ? 1 : 0,
             //                    v: view ? 1 : 0,
             //                    r: remove ? 1 : 0,
             //                    s: share ? 1 : 0
             //                }
             //            };
             //        });
             //        permissions_other = permissions_other.map(({key, actions: {create, edit, view, remove, share}}) => {
             //            return {
             //                [key]: {
             //                    c: create ? 1 : 0,
             //                    e: edit ? 1 : 0,
             //                    v: view ? 1 : 0,
             //                    r: remove ? 1 : 0,
             //                    s: share ? 1 : 0
             //                }
             //            };
             //        });
             
             //        const create = list => list.filter(({key, desc, actions: {create}}) => create).map(({key}) => key);
             //        const edit = list => list.filter(({key, desc, actions: {edit}}) => edit).map(({key}) => key);
             //        const view = list => list.filter(({key, desc, actions: {view}}) => view).map(({key}) => key);
             //        const remove = list => list.filter(({key, desc, actions: {remove}}) => remove).map(({key}) => key);
             //        const share = list => list.filter(({key, desc, actions: {share}}) => share).map(({key}) => key);
             */

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
