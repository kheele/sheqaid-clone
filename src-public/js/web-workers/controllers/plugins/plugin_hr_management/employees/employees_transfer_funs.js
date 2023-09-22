
class EmployeeTransferFuns {
    // <editor-fold defaultstate="collapsed" desc="run">
    static async run() {
        let {update, fn3, fn, fndel, transfer} = EmployeeTransferFuns;

        update = EmployeeTransferFuns.update.bind(this);
        fn3 = EmployeeTransferFuns.fn3.bind(this);
        fn = EmployeeTransferFuns.fn.bind(this);
        fndel = EmployeeTransferFuns.fndel.bind(this);
        transfer = EmployeeTransferFuns.transfer.bind(this);

//            update();
//            fn3();
//            
//            fn('plugin_sheq_assist_employee_contracts', 'employee_contract_list');
//            fn('plugin_sheq_assist_employee_medicals', 'employee_medical_list');
//            fn('plugin_sheq_assist_employee_warnings', 'employee_warning_list');
//            console.log('employees test');
//            
//            fn('plugin_sheq_assist_employee_competencies', 'employee_competency_list', ({competency_type}) => {
//                return competency_type ? {competency_type: FBSettings.FieldValue.arrayUnion(competency_type)} : null;
//            }).catch(err => {
//                console.error('employees error', err)
//            });
//            fn('plugin_sheq_assist_employee_contracts', 'employee_contract_list').catch(err => {
//                console.error('employees error', err)
//            });
//            fn('plugin_sheq_assist_employee_medicals', 'employee_medical_list', ({annexture_3}) => {
//                return annexture_3 ? {annexture_3: FBSettings.FieldValue.arrayUnion(annexture_3)} : null;
//            }).then(() => {
//                fndel('plugin_sheq_assist_employee_medicals', 'employee_medical_list', ({annexture_3}) => {
//                    return annexture_3 ? {annexture_3: FBSettings.FieldValue.arrayUnion(annexture_3)} : null;
//                }).catch(err => {
//                    console.error('employees error', err)
//                });
//            }).catch(err => {
//                console.error('employees error', err)
//            });
//            fn('plugin_sheq_assist_employee_warnings', 'employee_warning_list', ({type}) => {
//                return type ? {type: FBSettings.FieldValue.arrayUnion(type)} : null;
//            }).catch(err => {
//                console.error('employees error', err)
//            });

        transfer([
            {
                collectionGroup: 'competency_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const {type, competency_type, training, trainer, issued_date} = old_data;
                    const keys = {};
                    if (updateAttrs) {
                        const {type: _type, competency_type: _competency_type, training: _training, trainer: _trainer, issued_date: _issued_date} = updateAttrs;

                        keys.type = sub_collection_keys.type || {};
                        if (type && _type && type !== _type) {
                            keys.type[type] = false;
                        }
                        if (_type) {
                            keys.type[_type] = true;
                        }
                        if (Object.keys(keys.type).isEmpty()) {
                            delete keys.type;
                        }

                        keys.competency_type = sub_collection_keys.competency_type || {};
                        if (competency_type && _competency_type && competency_type !== _competency_type) {
                            keys.competency_type[competency_type] = false;
                        }
                        if (_competency_type) {
                            keys.competency_type[_competency_type] = true;
                        }
                        if (Object.keys(keys.competency_type).isEmpty()) {
                            delete keys.competency_type;
                        }

                        keys.training = sub_collection_keys.training || {};
                        keys.training.type = keys.training.type || {};
                        if (training && _training && (training.type && _training.type && training.type !== _training.type)) {
                            keys.training.type[training.type] = false;
                        }
                        keys.training.course_or_module = keys.training.course_or_module || {};
                        if (training && _training && (training.course_or_module && _training.course_or_module && training.course_or_module.id !== _training.course_or_module.id)) {
                            keys.training.course_or_module[training.course_or_module.id] = false;
                        }
                        keys.training.job_title = keys.training.job_title || {};
                        if (training && _training && (training.job_title && _training.job_title && training.job_title.id !== _training.job_title.id)) {
                            keys.training.job_title[training.job_title.id] = false;
                        }
                        if (_training) {
                            if (_training.type) {
                                keys.training.type[_training.type] = true;
                            }
                            if (_training.course_or_module) {
                                keys.training.course_or_module[_training.course_or_module.id] = true;
                            }
                            if (_training.job_title) {
                                keys.training.job_title[_training.job_title.id] = true;
                            }
                        }
                        if (Object.keys(keys.training.type).isEmpty()) {
                            delete keys.training.type;
                        }
                        if (Object.keys(keys.training.course_or_module).isEmpty()) {
                            delete keys.training.course_or_module;
                        }
                        if (Object.keys(keys.training.job_title).isEmpty()) {
                            delete keys.training.job_title;
                        }
                        if (Object.keys(keys.training).isEmpty()) {
                            delete keys.training;
                        }

                        keys.trainer = sub_collection_keys.trainer || {};
                        keys.trainer.id = keys.trainer.id || {};
                        keys.trainer.name = keys.trainer.name || {};
                        if (trainer) {
                            if (trainer.id && _trainer.id && trainer.id !== _trainer.id) {
                                keys.trainer.id[trainer.id] = false;
                            } else if (trainer.lname && _trainer.lname && (trainer.lname !== _trainer.lname && trainer.fname !== _trainer.fname)) {
                                keys.trainer.name[trainer.lname + trainer.fname] = false;
                            }
                        }
                        if (_trainer) {
                            if (_trainer.id) {
                                keys.trainer.id[_trainer.id] = true;
                            } else {
                                keys.trainer.name[_trainer.lname + _trainer.fname] = true;
                            }
                        }
                        if (Object.keys(keys.trainer.id).isEmpty()) {
                            delete keys.trainer.id;
                        }
                        if (Object.keys(keys.trainer.name).isEmpty()) {
                            delete keys.trainer.name;
                        }
                        if (Object.keys(keys.trainer).isEmpty()) {
                            delete keys.trainer;
                        }

                        keys.issued_date = sub_collection_keys.issued_date || {};
                        if (issued_date && _issued_date && issued_date !== _issued_date) {
                            keys.issued_date[issued_date] = false;
                        }
                        if (_issued_date) {
                            keys.issued_date[_issued_date] = true;
                        }
                        if (Object.keys(keys.issued_date).isEmpty()) {
                            delete keys.issued_date;
                        }
                    } else {
                        if (type) {
                            keys.type = {
                            };
                            keys.type[type] = true;
                        }

                        if (competency_type) {
                            keys.competency_type = {
                            };
                            keys.competency_type[competency_type] = true;
                        }

                        if (training) {
                            keys.training = {
                            };
                            if (training.type) {
                                keys.training.type = {};
                                keys.training.type[training.type] = true;
                            }
                            if (training.course_or_module) {
                                keys.training.course_or_module = {};
                                keys.training.course_or_module[training.course_or_module.id] = true;
                            }
                            if (training.job_title) {
                                keys.training.job_title = {};
                                keys.training.job_title[training.job_title.id] = true;
                            }
                        }

                        if (trainer) {
                            keys.trainer = {
                            };
                            if (trainer.id) {
                                keys.trainer.id = {};
                                keys.trainer.id[trainer.id] = true;
                            } else {
                                keys.trainer.name = {};
                                keys.trainer.name[trainer.lname + trainer.fname] = true;
                            }
                        }

                        if (issued_date) {
                            keys.issued_date = {
                                [issued_date]: true
                            };
                        }
                    }

                    return keys;
                }
            },
            {
                collectionGroup: 'contract_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const {contract_details = {}, salary_info = {}} = old_data;
                    const {start_date, expiry_date, end_of_trial_period, contract_type, daily_working_hours} = contract_details;
                    const {payment_type, salary_interval, salary, wage} = salary_info;
                    const keys = {};
                    if (updateAttrs) {
                        const {contract_details: _contract_details = {}, salary_info: _salary_info = {}} = updateAttrs;
                        const {start_date: _start_date, expiry_date: _expiry_date, end_of_trial_period: _end_of_trial_period, contract_type: _contract_type, daily_working_hours: _daily_working_hours} = _contract_details;
                        const {payment_type: _payment_type, salary_interval: _salary_interval, salary: _salary, wage: _wage} = _salary_info;

                        keys.contract_details = sub_collection_keys.contract_details || {};
                        keys.contract_details.contract_type = keys.contract_details.contract_type || {};
                        if (contract_type && _contract_type && contract_type !== _contract_type) {
                            keys.contract_details.contract_type[contract_type] = false;
                        }
                        if (_contract_type) {
                            keys.contract_details.contract_type[_contract_type] = true;
                        }
                        if (Object.keys(keys.contract_details.contract_type).isEmpty()) {
                            delete keys.contract_details.contract_type;
                        }
                        if (Object.keys(keys.contract_details).isEmpty()) {
                            delete keys.contract_details;
                        }

                        keys.salary_info = sub_collection_keys.salary_info || {};
                        keys.salary_info.payment_type = keys.salary_info.payment_type || {};
                        if (payment_type && _payment_type && payment_type !== _payment_type) {
                            keys.salary_info.payment_type[payment_type] = false;
                        }
                        if (_payment_type) {
                            keys.salary_info.payment_type[_payment_type] = true;
                        }
                        if (Object.keys(keys.salary_info.payment_type).isEmpty()) {
                            delete keys.salary_info.payment_type;
                        }
                        keys.salary_info.salary_interval = keys.salary_info.salary_interval || {};
                        if (salary_interval && _salary_interval && salary_interval !== _salary_interval) {
                            keys.salary_info.salary_interval[salary_interval] = false;
                        }
                        if (_salary_interval) {
                            keys.salary_info.salary_interval[_salary_interval] = true;
                        }
                        if (Object.keys(keys.salary_info.salary_interval).isEmpty()) {
                            delete keys.salary_info.salary_interval;
                        }
                        if (Object.keys(keys.salary_info).isEmpty()) {
                            delete keys.salary_info;
                        }
                    } else {
                        keys.contract_details = {
                        };
                        if (contract_type) {
                            keys.contract_details.contract_type = {};
                            keys.contract_details.contract_type[contract_type] = true;
                        }
                        if (Object.keys(keys.contract_details).isEmpty()) {
                            delete keys.contract_details;
                        }

                        keys.salary_info = {
                        };
                        if (payment_type) {
                            keys.salary_info.payment_type = {};
                            keys.salary_info.payment_type[payment_type] = true;
                        }
                        if (salary_interval) {
                            keys.salary_info.salary_interval = {};
                            keys.salary_info.salary_interval[salary_interval] = true;
                        }
                        if (Object.keys(keys.salary_info).isEmpty()) {
                            delete keys.salary_info;
                        }
                    }

                    return keys;
                }
            },
            {
                collectionGroup: 'counselling_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const {responsible_person, types, reasons} = old_data;
                    const keys = {};
                    if (updateAttrs) {
                        const {responsible_person: _responsible_person, types: _types, reasons: _reasons} = updateAttrs;

                        keys.responsible_person = sub_collection_keys.responsible_person || {};
                        if (responsible_person && _responsible_person && responsible_person.id !== _responsible_person.id) {
                            keys.responsible_person[responsible_person.id] = false;
                        }
                        if (_responsible_person) {
                            keys.responsible_person[_responsible_person.id] = true;
                        }
                        if (Object.keys(keys.responsible_person).isEmpty()) {
                            delete keys.responsible_person;
                        }

                        keys.types = sub_collection_keys.types || {};
                        if (types && _types && types !== _types) {
                            types.forEach(key => {
                                keys.reasons[key] = false;
                            });
                        }
                        if (_types) {
                            _types.forEach(key => {
                                keys.types[key] = true;
                            });
                        }
                        if (Object.keys(keys.types).isEmpty()) {
                            delete keys.types;
                        }

                        keys.reasons = sub_collection_keys.reasons || {};
                        if (reasons && _reasons && reasons !== _reasons) {
                            reasons.forEach(key => {
                                keys.reasons[key] = false;
                            });
                        }
                        if (_reasons) {
                            _reasons.forEach(key => {
                                keys.reasons[key] = true;
                            });
                        }
                        if (Object.keys(keys.reasons).isEmpty()) {
                            delete keys.reasons;
                        }
                    } else {
                        if (responsible_person) {
                            keys.responsible_person = {
                            };
                            keys.responsible_person[responsible_person.id] = true;
                        }
                        if (types) {
                            keys.types = {
                            };
                            types.forEach(key => {
                                keys.types[key] = true;
                            });
                        }
                        if (reasons) {
                            keys.reasons = {
                            };
                            reasons.forEach(key => {
                                keys.reasons[key] = true;
                            });
                        }
                    }

                    return keys;
                }
            },
            {
                collectionGroup: 'leave_list', collectionGroupOld: 'sickleave_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const {type, due_to, date} = old_data;
                    const keys = {};
                    if (updateAttrs) {
                        const {type: _type, due_to: _due_to, date: _date} = updateAttrs;

                        keys.type = sub_collection_keys.type || {};
                        if (type && _type && type !== _type) {
                            keys.type[type] = false;
                        }
                        if (_type) {
                            keys.type[_type] = true;
                        }
                        if (Object.keys(keys.type).isEmpty()) {
                            delete keys.type;
                        }

                        keys.due_to = sub_collection_keys.due_to || {};
                        if (due_to && _due_to && due_to !== _due_to) {
                            keys.due_to[due_to] = false;
                        }
                        if (_due_to) {
                            keys.due_to[_due_to] = true;
                        }
                        if (Object.keys(keys.due_to).isEmpty()) {
                            delete keys.due_to;
                        }

                        keys.date = sub_collection_keys.date || {};
                        if (date && _date && date !== _date) {
                            keys.date[date] = false;
                        }
                        if (_date) {
                            keys.date[_date] = true;
                        }
                        if (Object.keys(keys.date).isEmpty()) {
                            delete keys.date;
                        }
                    } else {
                        if (type) {
                            keys.type = {[type]: true};
                        }
                        if (due_to) {
                            keys.due_to = {[due_to]: true};
                        }
                        if (date) {
                            keys.date = {[date]: true};
                        }
                    }

                    return keys;
                }
            },
            {
                collectionGroup: 'medical_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const {annexture_3} = old_data;
                    const keys = {};
                    if (updateAttrs) {
                        const {annexture_3: _annexture_3} = updateAttrs;

                        keys.annexture_3 = sub_collection_keys.annexture_3 || {};
                        if (annexture_3 && _annexture_3 && annexture_3 !== _annexture_3) {
                            keys.annexture_3[annexture_3] = false;
                        }
                        if (_annexture_3) {
                            keys.annexture_3[_annexture_3] = true;
                        }
                        if (Object.keys(keys.annexture_3).isEmpty()) {
                            delete keys.annexture_3;
                        }
                    } else {
                        if (annexture_3) {
                            keys.annexture_3 = {[annexture_3]: true};
                        }
                    }

                    return keys;
                }
            },
            {
                collectionGroup: 'warning_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const {issued_by, type, date} = old_data;
                    const keys = {};
                    if (updateAttrs) {
                        const {type: _type, issued_by: _issued_by, date: _date} = updateAttrs;

                        keys.issued_by = sub_collection_keys.issued_by || {};
                        if (issued_by && _issued_by && issued_by.id !== _issued_by.id) {
                            keys.issued_by[issued_by.id] = false;
                        }
                        if (_issued_by) {
                            keys.issued_by[_issued_by.id] = true;
                        }
                        if (Object.keys(keys.issued_by).isEmpty()) {
                            delete keys.issued_by;
                        }

                        keys.type = sub_collection_keys.type || {};
                        if (type && _type && type !== _type) {
                            keys.type[type] = false;
                        }
                        if (_type) {
                            keys.type[_type] = true;
                        }
                        if (Object.keys(keys.type).isEmpty()) {
                            delete keys.type;
                        }

                        keys.date = sub_collection_keys.date || {};
                        if (date && _date && date !== _date) {
                            keys.date[date] = false;
                        }
                        if (_date) {
                            keys.date[_date] = true;
                        }
                        if (Object.keys(keys.date).isEmpty()) {
                            delete keys.date;
                        }
                    } else {
                        if (issued_by) {
                            keys.issued_by = {[issued_by.id]: true};
                        }
                        if (type) {
                            keys.type = {[type]: true};
                        }
                        if (date) {
                            keys.date = {[date]: true};
                        }
                    }

                    return keys;
                }
            },
            {
                collectionGroup: 'license_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const keys = {};
                    return keys;
                }
            },
            {
                collectionGroup: 'work_permit_list', sub_collection_keys: (old_data, updateAttrs, sub_collection_keys = {}) => {
                    const keys = {};
                    return keys;
                }
            }
        ]);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="fndel">
    static async fndel(tbl, collectionGroup, sub_collection_keys) {
        const doc_ref = await this.getDB().collection(tbl);//Promise < DocumentReference < T > >
        const querySnapshot = await doc_ref.get();
        console.log('del employees test');

        await Promise.all(querySnapshot.docs.map(async (doc) => {
            const {id: employee_id} = doc.get('employee');
            const employee_ref = await this.getDB().collection(this.tbl).doc(employee_id);
            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >

            const oldCollectionGroup = employee_snapshot.get(collectionGroup);
            if (oldCollectionGroup) {
                console.log('oldCollectionGroup', oldCollectionGroup);
                if (Object.keys(oldCollectionGroup).contains(doc.id)) {
                    await doc.ref.delete();
                    console.log('del doc deleted', doc.id);
                } else {

                }
            }

            console.log('del employees done', employee_id, doc.id);
        }));
        console.log('del employees final');
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="fn">
    static async fn(tbl, collectionGroup, sub_collection_keys) {
        const doc_ref = await this.getDB().collection(tbl);//Promise < DocumentReference < T > >
        const querySnapshot = await doc_ref.get();
        console.log('employees test');

        await Promise.all(querySnapshot.docs.map(async (doc) => {
            const {id: employee_id} = doc.get('employee');
            const employee_ref = await this.getDB().collection(this.tbl).doc(employee_id);
            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >
            const {id} = doc;
            const data = doc.data();
            data.employee_id = employee_id;

            const oldCollectionGroup = employee_snapshot.get(collectionGroup);
            let latest = {id, expiry_date: data.expiry_date || null};
            if (oldCollectionGroup) {
                let oldExpiryDates = Object.keys(oldCollectionGroup).map(id => {
                    return {id, expiry_date: oldCollectionGroup[id].expiry_date || null};
                });
                oldExpiryDates.push(latest);
                oldExpiryDates.sortBy('expiry_date', 'desc');
                console.log('employees', oldExpiryDates.map(({id, expiry_date}) => {
                    return Dates.formatDate(expiry_date);
                }))
                latest = oldExpiryDates.getFirstElement();
            }

//                    try {
//                    await employee_ref.set({
//                        [collectionGroup]: null,
//                        sub_collection_keys: null
//                    }, {merge: true});//Promise < void >
            const updated = await employee_ref.set({
                [collectionGroup]: {[id]: data},
                sub_collection_keys: {
                    [collectionGroup]: {
                        id: FBSettings.FieldValue.arrayUnion(id),
                        employee_id,
                        latest,
                        ...(sub_collection_keys ? sub_collection_keys(data) || {} : {})
                    }
                }
            }, {merge: true});//Promise < void >

            console.log('employees done', employee_id, id);
//                    } catch (err) {
//                        console.error('employees error', doc.data(), err)
//                    }
        }));
        console.log('employees final');
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="fn3">
    static async fn3() {
        const company_id = 'A3RpXSVOhVKnZmmjS0DJ';
        const doc_ref = await this.getDB().collection(this.tbl).
                where('site', '==', null).
                where('site_id', '==', null).
                where('company_id', '==', company_id);//Promise < DocumentReference < T > >
        const querySnapshot = await doc_ref.get();
        const list = [];
        querySnapshot.forEach((doc) => {
            list.push(doc);
        });
        console.log('employees test2');

        await Promise.all(list.map(async (doc) => {
            const employee_ref = await this.getDB().collection(this.tbl).doc(doc.id);
            const {client, project, site, client_id, project_id, site_id, fname, lname} = doc.data();
//                    const updateAttrs = {};
//                    if ((client && client.id) && client.id !== client_id) {
//                        updateAttrs.client_id = client.id;
//                    }
//                    if ((project && project.id) && project.id !== project_id) {
//                        updateAttrs.project_id = project.id;
//                    }
//                    if ((site && site.id) && site.id !== site_id) {
//                        updateAttrs.site_id = site.id;
//                    }
//                    if (!Object.keys(updateAttrs).isEmpty()) {
//                        console.log('employees done', doc.id, JSON.stringify(updateAttrs));
//                        const updated = await employee_ref.set(updateAttrs, {merge: true});//Promise < void >
//                    } else {
//                        console.log('employees already', doc.id);
//                    }
            console.log('employees found', doc.id, lname, fname, client, project, site, client_id, project_id, site_id);
        }));
        console.log('employees final');
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="update">
    static async update() {
        const col_ref = await db.collection(this.tbl).where('company_id', '==', 'qPFSzXKRmPBUwUztZ379');//Promise < DocumentReference < T > >
        const querySnapshot = await col_ref.get();
        await Promise.all(querySnapshot.docs.map(async (doc) => {
            await doc.ref.set({notifications_removed: false}, {merge: true});

            console.log('doc updated', doc.id);
        }));
        console.log(this.tbl, 'final');
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="transfer">
    static async transfer(items) {
        await execWhen(() => session.isLoggedIn);

        await Events.whenLoggedIn(async loggedUser => {
            const {docs} = await (await db.collection('default_companies')).get();
            for (let n = 0; n < docs.length; n++) {
                const doc = docs[n];
//                if (doc.id !== '2sdRn3w1WKWKv1MLQaLs' && doc.id !== '4hKU3CF7tder8OhqoGrf') {
                    console.log('--------------')
                    console.log('default_companies start', doc.id, doc.get('company_name'))
                    const col_ref = await db.collection('plugin_sheq_assist_employees').where('company_id', '==', doc.id);//Promise < DocumentReference < T > >
                    const querySnapshot = await col_ref.get();
//                console.log('transfer size', querySnapshot.docs.length)
                    await Promise.all(querySnapshot.docs.map(async (employee_doc) => {
//                    console.log('-----------employees-----------', employee_doc.id)

                        const employee_ref = await db_hr.collection('employees').doc(employee_doc.id);
//            const employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >
                        const data = employee_doc.data();
                        const {
                            removed = false,
                            lname, fname,
                            optional_info = {},
                            site,
                            project,
                            client,
                            docs = {}
                        } = data;

//                    console.log('data', data)
                        //
                        if (!data.client_id || data.client_id === 'All') {
                            data.client_id = null;
                        }
                        if (!data.client || data.client === 'All') {
                            data.client = null;
                        }
                        //
                        if (!data.project_id || data.project_id === 'All') {
                            data.project_id = null;
                        }
                        if (!data.project || data.project === 'All') {
                            data.project = null;
                        }
                        //
                        if (!data.site_id || data.site_id === 'All') {
                            data.site_id = null;
                        }
                        if (!data.site || data.site === 'All') {
                            data.site = null;
                        }

                        if (!data.sub_collection_keys) {
//                        console.log('doc no sub_collection_keys', employee_doc.id);
                        } else {
                            await Promise.all(items.map(async ({collectionGroup, collectionGroupOld, sub_collection_keys}) => {
                                console.log('-----collectionGroup-----------', collectionGroup, collectionGroupOld)
                                const oldCollectionGroup = data['employee_' + (collectionGroupOld || collectionGroup)];
                                if (!oldCollectionGroup) {
//                                console.log('doc no oldCollectionGroup', oldCollectionGroup, collectionGroup, collectionGroupOld, employee_doc.id);
                                } else {
//                                console.log('doc exist oldCollectionGroup', oldCollectionGroup, collectionGroup, collectionGroupOld, employee_doc.id);
                                    await Promise.all(Object.keys(oldCollectionGroup).
                                            map(id => {
                                                return {id, data: oldCollectionGroup[id]};
                                            }).
                                            filter(v => !!v).
                                            map(async v => {
                                                const {id, data: old_data} = v;
//                                            console.log('-----subcoll-----------', id)

//                            const old_sub_collection_keys = data.sub_collection_keys[collectionGroup];
//                            data.sub_collection_keys[collectionGroup] = {
//                                ...old_sub_collection_keys,
//                                ...sub_collection_keys(old_data, null, old_sub_collection_keys)
//                            };

                                                const collectionGroupRef = employee_ref.collection(collectionGroup).doc(id);
//                                            console.log('collectionGroupRef', collectionGroupRef)
//
                                                this.injectSavable(null, loggedUser, old_data);
//                                            console.log('collectionGroupRef loggedUser', loggedUser)
                                                const {
                                                    doc,
                                                    employee: {id: employee_id},
                                                    expiry_date
                                                } = old_data;
                                                old_data.keywords = this.generateKeywords([lname, fname]);
                                                old_data.removed = removed;

                                                const {department, job_position} = optional_info;
                                                if (department) {
                                                    old_data.department_id = department.id;
                                                } else {
                                                    old_data.department_id = null;
                                                }
                                                if (job_position) {
                                                    old_data.job_position_id = job_position.id;
                                                } else {
                                                    old_data.job_position_id = null;
                                                }

                                                if (!site || site === 'All') {
                                                    old_data.site = null;
                                                    old_data.site_id = null;
                                                } else if (site) {
                                                    old_data.site = site;
                                                    old_data.site_id = site.id;
                                                }
                                                if (!project || project === 'All') {
                                                    old_data.project = null;
                                                    old_data.project_id = null;
                                                } else if (project) {
                                                    old_data.project = project;
                                                    old_data.project_id = project.id;
                                                }
                                                if (!client || client === 'All') {
                                                    old_data.client = null;
                                                    old_data.client_id = null;
                                                } else if (client) {
                                                    old_data.client = client;
                                                    old_data.client_id = client.id;
                                                }
//
//                                            console.log('test 1 old_data', old_data)
                                                await collectionGroupRef.set(old_data, {merge: false});//Promise < void >
//                                            console.log('test 1 old_data', old_data, 'done')
//
                                                const col_query_ref = await db_hr.collectionGroup(collectionGroup).where('employee.id', '==', employee_id);
//                                            console.log('test 2 col_query_ref', col_query_ref)
                                                const colQuerySnapshot = await col_query_ref.get();
                                                const collectionGroupDocs = colQuerySnapshot.docs;
//                                            console.log('test 3 collectionGroupDocs', collectionGroupDocs)
                                                const filterBy = (__expiry_date, docs) => {
                                                    const d = new Date().toDayEndDate();
                                                    return docs.filter(doc => {
                                                        const {expiry_date} = doc.data();
                                                        if (__expiry_date === null) {
                                                            return !expiry_date;
                                                        }
                                                        if (!expiry_date) {
                                                            return false;
                                                        }
                                                        if (__expiry_date === -1) {
                                                            return expiry_date <= d.getTime();
                                                        } else if (__expiry_date === 1) {
                                                            return expiry_date > d.getTime() && expiry_date <= d.addMonths(1).addDays(-1).getTime();
                                                        } else if (__expiry_date === 2) {
                                                            return expiry_date > d.addMonths(1).addDays(-1).getTime() && expiry_date <= d.addMonths(2).getTime();
                                                        } else if (__expiry_date === 3) {
                                                            return expiry_date > d.addMonths(2).getTime() && expiry_date <= d.addMonths(3).getTime();
                                                        } else if (__expiry_date === 4) {
                                                            return expiry_date > d.addMonths(3).getTime();
                                                        }
                                                        return false;
                                                    }).map(doc => doc.id);
                                                };
//
                                                const {[collectionGroup]: oldCollectionGroup = {}} = docs;
//                                            console.log('test 4 oldCollectionGroup', oldCollectionGroup)
                                                let {ids_by_expiry} = oldCollectionGroup;
                                                if (ids_by_expiry) {
                                                    ids_by_expiry.mon = ids_by_expiry.mon || {};
                                                    ids_by_expiry.no_expiry = ids_by_expiry.no_expiry || [];
                                                } else {
                                                    ids_by_expiry = {mon: {}, no_expiry: []};
                                                }
//                                            console.log('test 5 ids_by_expiry', ids_by_expiry)
                                                let {mon, no_expiry} = ids_by_expiry;
                                                mon['-1'] = filterBy(-1, collectionGroupDocs);
                                                mon['1'] = filterBy(1, collectionGroupDocs);
                                                mon['2'] = filterBy(2, collectionGroupDocs);
                                                mon['3'] = filterBy(3, collectionGroupDocs);
                                                mon['4'] = filterBy(4, collectionGroupDocs);
                                                ids_by_expiry.no_expiry = filterBy(null, collectionGroupDocs);
//                                            console.log('test 6 ids_by_expiry', ids_by_expiry)
//
//                                        //collectionGroupDocs
                                                let latest = {id, expiry_date: expiry_date || null};
                                                if (!collectionGroupDocs.isEmpty()) {
                                                    const oldExpiryDates = collectionGroupDocs.map(doc => {
                                                        return {id: doc.id, expiry_date: doc.get('expiry_date') || null};
                                                    });
                                                    oldExpiryDates.sortBy('expiry_date', 'desc');
                                                    oldExpiryDates.push(latest);
                                                    oldExpiryDates.sortBy('expiry_date', 'desc');
                                                    latest = oldExpiryDates.getFirstElement();
                                                }
//
                                                const old_sub_collection_keys = employee_doc.get('sub_collection_keys');

                                                if (!data.docs) {
                                                    data.docs = {};
                                                }
                                                data.docs[collectionGroup] = {
                                                    ids: collectionGroupDocs.map(doc => doc.id),
                                                    ids_by_expiry,
                                                    latest,
                                                    keys: sub_collection_keys(old_data, null, old_sub_collection_keys['employee_' + (collectionGroupOld || collectionGroup)])
                                                };
                                            }));

                                    delete data['employee_' + (collectionGroupOld || collectionGroup)];
                                    delete data.sub_collection_keys['employee_' + (collectionGroupOld || collectionGroup)];
                            }
                            }));
                            if (Object.keys(data.sub_collection_keys).isEmpty()) {
                                delete data.sub_collection_keys;
                            }
                        }

                        await new Promise((resolve) => {
//                setTimeout(() => {
                            employee_ref.set(data, {merge: false}).then(resolve);
//                }, 1000);
                        });

//                    await doc.ref.delete();
//                    console.log('doc deleted', doc.id); 
//                    console.log('doc moved', employee_doc.id);
                    }));
                    console.log('default_companies end', doc.id, doc.get('company_name'))
//                }
            }
            console.log(this.tbl, 'all done')
        });
    }
    // </editor-fold>
}