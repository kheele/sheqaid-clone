
(() => {
    self.TBL_EMPLOYEES = "employees";
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Employee", plural: "Employees"}, "plugin_sheq_assist/employees/", TBL_EMPLOYEES);

            this.filter_by_notification_key = this.filter_by_notification_key.bind(this);

            const {addAction} = this;

            addAction("import/file", this.importFile.bind(this));
            addAction("import/create", this.createImported.bind(this));
            addAction("send-app-link", this.send_app_link.bind(this));

            addAction("active/dashboard/count", this.active_dashboard_count.bind(this));
            addAction("removed/dashboard/count", this.removed_dashboard_count.bind(this));

            addAction("transfer", this.transfer.bind(this));
            addAction("select/filter", this.filter_select.bind(this));

            addAction("list/search_by_name", this.search_by_name.bind(this));

            addAction("list/filter", this.filter.bind(this));

            addAction("remove/bulk", this.bulk_remove.bind(this));
            addAction("removed/re-instead", this.re_instead.bind(this));
            addAction("removed/list", this.list_removed.bind(this));
            addAction("removed/list/filter", this.list_removed_filter.bind(this));

//            EmployeeTransferFuns.run.call(this);
        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

        // <editor-fold defaultstate="collapsed" desc="importFile, createImported">
        async importFile(evt, path) {
            const validHeaderNames = [
                {key: 'fname', value: ['First Name', 'Name'], required: true},
                {key: 'lname', value: ['Last Name', 'Surname'], required: true},
                {
                    key: 'id_num',
                    value: [
                        'Identity Number', 'Identity No', 'Identity No.', 'Identity #',
                        'ID', 'ID Number', 'ID No', 'ID No.', 'ID #'
                    ]
                },
                {
                    key: 'passport_num',
                    value: [
                        'Passport Number', 'Passport', 'Passport No', 'Passport No.', 'Passport #'
                    ]
                },
                {
                    key: 'id_or_pass_num',
                    value: [
                        'Identity/Passport Number', 'Identity/Passport No', 'Identity/Passport No.', 'Identity/Passport #',
                        'Passport/Identity Number', 'Passport/Identity No', 'Passport/Identity No.', 'Passport/Identity #',
                        'ID/Passport Number', 'ID/Passport No', 'ID/Passport No.', 'ID/Passport #',
                        'Passport/ID Number', 'Passport/ID No', 'Passport/ID No.', 'Passport/ID #'
                    ]
                },
                {key: 'sex', value: ['Gender', 'Sex']},
                {key: 'dob', value: ['Date Of Birth', 'Birth Date', 'DOB', 'D.O.B', 'D.O.B.']},
                {
                    key: 'phone',
                    value: [
                        'Phone', 'Phone Number', 'Phone No', 'Phone No.', 'Phone #',
                        'Contact Number', 'Contact No', 'Contact No.', 'Contact #',
                        'Cell', 'Cell Number', 'Cell No', 'Cell No.', 'Cell #'
                    ]
                },
                {key: 'email', value: ['Email Address', 'Email']},
                {
                    key: 'employee_num',
                    value: [
                        'Employee Number', 'Employee No', 'Employee No.', 'Employee #',
                        'Company Number', 'Company No', 'Company No.', 'Company #'
                    ]
                },
                {
                    key: 'employment_date',
                    value: [
                        'Date Engaged', 'Date Employed',
                        'Date of Employment', 'Date of Engagement',
                        'Engagement Date', 'Employment Date'
                    ]
                },
                {key: 'job_position', value: ['Job Position', 'Job Title']},
                {key: 'job_category', value: ['Job Category', 'Occupational Level']},
                {key: 'department', value: ['Department', 'Department Title', 'Department Name']}
            ];
            const res = await excelUtils.read(path, validHeaderNames);
            if (res.errors)
                return res;

            res.sortBy('lname');
            return res.distinct();
        }

        async createImported(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const emails = list.filter(({email}) => !!email).map(({email}) => email.toLowerCase());
                if (!emails.isEmpty()) {
                    let snapshot = await this.getDB().collection(this.tbl).where('email', 'in', emails).get();
                    if (!snapshot.empty) {
                        let dups = [];
                        snapshot.forEach((doc) => {
                            dups.push(doc.data().email);
                        });
                        dups = dups.map(email => list.find(v => v.email === email));
                        return {dups};
                    }
                }

                return await Promise.all(list.map(async data => {
                    return await this.create(evt, data);
                }));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                if (data.email) {
                    data.email = data.email.toLowerCase();
                }
                const {email, phone} = data;
                data.access_type = "Staff";
                data.removed = false;
                data.notifications_removed = false;

                const getDBUser = async (uid) => {
                    const doc_ref = await this.getDB().collection('default_users').doc(uid);
                    const snapshot = await doc_ref.get();
                    return {snapshot, doc_ref};
                };
                const getAuthUid = async (key, value, returnDup, fn) => {
                    const snapshot = await this.getDB().collection(this.tbl).where(key, '==', value).limit(1).get();
                    if (!snapshot.empty) {
                        return returnDup;
                    }

                    const getUserUidByFN = functions.httpsCallable(`callables-${fn}`);
                    const res = await getUserUidByFN(email);
                    if (res && res.data) {
                        return res.data;
                    }
                };

                if (email) {
                    const res = await getAuthUid('email', email, 'EMAIL_DUP', 'getUserUidByEmail');
                    if (res === "EMAIL_DUP") {
                        return res;
                    } else if (res) {
                        data.auth_uid = res;
                    }
                }
                if (phone) {
                    const res = await getAuthUid('phone', phone, 'PHONE_DUP', 'getUserUidByPhone');
                    if (res === "PHONE_DUP") {
                        return res;
                    } else if (res) {
                        data.auth_uid = res;
                    }
                }

                this.injectSavable(evt, loggedUser, data);
                const {user_id, company_id, created_at} = data;

                const {
                    site,
                    project,
                    client,
                    optional_info,
                    documents,
                    profile_pic,

                    fname, lname,
                    permissions_modules, permissions_other
                } = data;
                if (profile_pic) {
                    delete data.profile_pic;
                }

                let living_addr_doc, banking_doc;
                if (optional_info) {
                    if (optional_info.living_addr_doc) {
                        living_addr_doc = optional_info.living_addr_doc;
                        delete optional_info.living_addr_doc;
                    }
                    if (optional_info.banking_doc) {
                        banking_doc = optional_info.banking_doc;
                        delete optional_info.banking_doc;
                    }
                }
                let doc_id_or_passport, doc_driver_or_operator_licence, doc_pdrp, doc_work_permit;
                if (documents) {
                    if (documents.doc_id_or_passport) {
                        doc_id_or_passport = documents.doc_id_or_passport;
                        delete documents.doc_id_or_passport;
                    }
                    if (documents.doc_driver_or_operator_licence) {
                        doc_driver_or_operator_licence = documents.doc_driver_or_operator_licence;
                        delete documents.doc_driver_or_operator_licence;
                    }
                    if (documents.doc_pdrp) {
                        doc_pdrp = documents.doc_pdrp;
                        delete documents.doc_pdrp;
                    }
                    if (documents.doc_work_permit) {
                        doc_work_permit = documents.doc_work_permit;
                        delete documents.doc_work_permit;
                    }
                }

                if (!site || site === 'All') {
                    data.site = null;
                    data.site_id = null;
                } else if (site) {
                    data.site_id = site.id;
                }
                if (!project || project === 'All') {
                    data.project = null;
                    data.project_id = null;
                } else if (project) {
                    data.project_id = project.id;
                }
                if (!client || client === 'All') {
                    data.client = null;
                    data.client_id = null;
                } else if (client) {
                    data.client_id = client.id;
                }
                if (optional_info) {
                    const {department, job_position} = optional_info;
                    if (department && typeof department === 'string') {
                        let val = await Events.get('plugin_sheq_assist/employees/departments/').then(departments => {
                            return departments.search_by_name(evt, department);
                        });
                        if (val && !val.isEmpty()) {
                            val = val[0];
                            optional_info.department = {id: val.id, name: val.data.name};
                        } else {
                            const _data = {name: department, user_id, company_id, created_at};
                            const department_doc_ref = await this.getDB().collection('plugin_sheq_assist_departments').add(_data);//Promise < DocumentReference < T > >
                            const department_doc_snapshot = await department_doc_ref.get();//Promise < DocumentSnapshot < T > >
                            optional_info.department = {id: department_doc_snapshot.id, name: department_doc_snapshot.data().name};
                        }
                    }
                    if (job_position && (typeof job_position === 'string' || !job_position.id)) {
                        let val = await Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions => {
                            return job_positions.search_by_name(evt, job_position.name || job_position);
                        });
                        if (val && !val.isEmpty()) {
                            val = val[0];
                            optional_info.job_position = {id: val.id, name: val.data.name};
                        } else {
                            const _data = {name: job_position.name || job_position, user_id, company_id, created_at};
                            if (job_position.job_category) {
                                _data.job_category = job_position.job_category;
                            }
                            const job_position_doc_ref = await this.getDB().collection('plugin_sheq_assist_job_positions').add(_data);//Promise < DocumentReference < T > >
                            const job_position_doc_snapshot = await job_position_doc_ref.get();//Promise < DocumentSnapshot < T > >
                            optional_info.job_position = {id: job_position_doc_snapshot.id, name: job_position_doc_snapshot.data().name};
                        }
                    }
                }

                data.keywords = this.generateKeywords([data.lname, data.fname]);
                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                const updateAttrs = {};
                if (data.auth_uid) {
                    const {snapshot, doc_ref} = await getDBUser(data.auth_uid);
                    if (snapshot.exists) {
                        updateAttrs.linked_user_id = snapshot.id;
                        const updated = await doc_ref.set({linked_employee_id: doc_snapshot.id}, {merge: true});//Promise < void >
                    }
                }

                if (profile_pic) {
                    const gcsUri = await files.upload.call(this, profile_pic, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    updateAttrs.profile_pic = gcsUri;
                }

                if (living_addr_doc) {
                    const gcsUri = await files.upload.call(this, living_addr_doc, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/optional_info/living_addr_doc.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    optional_info.living_addr_doc = gcsUri;
                    updateAttrs.optional_info = optional_info;
                }
                if (banking_doc) {
                    const gcsUri = await files.upload.call(this, banking_doc, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/optional_info/banking_doc.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    optional_info.banking_doc = gcsUri;
                    updateAttrs.optional_info = optional_info;
                }

                if (doc_id_or_passport) {
                    const gcsUri = await files.upload.call(this, doc_id_or_passport, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/documents/doc_id_or_passport.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    documents.doc_id_or_passport = gcsUri;
                    updateAttrs.documents = documents;
                }
                if (doc_driver_or_operator_licence) {
                    const gcsUri = await files.upload.call(this, doc_driver_or_operator_licence, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/documents/doc_driver_or_operator_licence.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    documents.doc_driver_or_operator_licence = gcsUri;
                    updateAttrs.documents = documents;
                }
                if (doc_pdrp) {
                    const gcsUri = await files.upload.call(this, doc_pdrp, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/documents/doc_pdrp.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    documents.doc_pdrp = gcsUri;
                    updateAttrs.documents = documents;
                }
                if (doc_work_permit) {
                    const gcsUri = await files.upload.call(this, doc_work_permit, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/documents/doc_work_permit.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    documents.doc_work_permit = gcsUri;
                    updateAttrs.documents = documents;
                }

                const updated = await doc_ref.update(updateAttrs);//Promise <void>
                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                if (email) {
                    const opts = {
                        from: '"SHEQ Aid" <support@sheqsolve.com>',
                        to: email,
                        subject: 'Welcome to SHEQ Aid',
                        html: '<h3><b>Dear ' + data.fname + ' ' + data.lname + '</b></h3>\n\
                                <p>Your account was recently created on SHEQ Aid.</p>\n\
                                <p>Your SHEQ Aid Username is <b>' + email + '</b>, Please login the App to setup your Password</p>\n\
                                ' + Utils.getAppDownloadOptionMsg(true)
                    };
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)
                }

                let auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                auditData = await EmployeeFuns.mapResults.call(this, auditData);
                return auditData;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const col = this.getDB().collection(this.tbl);
                if (updateAttrs.email) {
                    updateAttrs.email = updateAttrs.email.toLowerCase();
                }

                const {email, phone} = updateAttrs;
                if (email || phone) {
                    const docIdKey = firebase.firestore.FieldPath.documentId();
                    if (email) {
                        let snapshot = await col.where(docIdKey, '!=', id).where('email', '==', email).limit(1).get();
                        if (!snapshot.empty) {
                            return "EMAIL_DUP";
                        }
                    }
                    if (phone) {
                        let snapshot = await col.where(docIdKey, '!=', id).where('phone', '==', phone).limit(1).get();
                        if (!snapshot.empty) {
                            return "PHONE_DUP";
                        }
                    }
                }

                const doc_ref = await col.doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                let {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

//                this.injectSavable(evt, loggedUser, data);
                const {user: {id: user_id}, company_id} = loggedUser;
                created_at = FBSettings.FieldValue.serverTimestamp();

                const {
                    site,
                    project,
                    client,
                    optional_info,
                    documents,
                    profile_pic,

                    fname, lname,
                    permissions_modules, permissions_other
                } = updateAttrs;

                if (typeof site === 'string') {
                    delete updateAttrs.site;
                    if (site !== 'All') {
                        const _data = {name: site, user_id, company_id, created_at};
                        const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                        const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        updateAttrs.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                        updateAttrs.site_id = site_doc_snapshot.id;
                    } else {
//                        updateAttrs.site = null;
                        updateAttrs.site_id = null;
                    }
                } else if (site) {
                    updateAttrs.site_id = site.id;
                }
                if (typeof project === 'string') {
                    delete updateAttrs.project;
                    if (project !== 'All') {
                        const _data = {name: project, user_id, company_id, created_at};
                        const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                        const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        updateAttrs.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                        updateAttrs.project_id = project_doc_snapshot.id;
                    } else {
//                        updateAttrs.project = null;
                        updateAttrs.project_id = null;
                    }
                } else if (project) {
                    updateAttrs.project_id = project.id;
                }
                if (typeof client === 'string') {
                    delete updateAttrs.client;
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        updateAttrs.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        updateAttrs.client_id = client_doc_snapshot.id;
                    } else {
//                        updateAttrs.client = null;
                        updateAttrs.client_id = null;
                    }
                } else if (client) {
                    updateAttrs.client_id = client.id;
                }
                if (optional_info) {
                    const {department, job_position} = optional_info;
                    if (department && (typeof department === 'string' || !department.id)) {
                        delete optional_info.department;
                        let val = await Events.get('plugin_sheq_assist/employees/departments/').then(departments => {
                            return departments.search_by_name(evt, department.name || department);
                        });
                        if (val) {
                            val = val[0];
                            optional_info.department = {id: val.id, name: val.data.name};
                        } else {
                            const _data = {name: department.name || department, user_id, company_id, created_at};
                            const department_doc_ref = await this.getDB().collection('plugin_sheq_assist_departments').add(_data);//Promise < DocumentReference < T > >
                            const department_doc_snapshot = await department_doc_ref.get();//Promise < DocumentSnapshot < T > >
                            optional_info.department = {id: department_doc_snapshot.id, name: department_doc_snapshot.data().name};
                        }
                    }
                    if (job_position && (typeof job_position === 'string' || !job_position.id)) {
                        delete optional_info.job_position;
                        let val = await Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions => {
                            return job_positions.search_by_name(evt, job_position.name || job_position);
                        });
                        if (val && !val.isEmpty()) {
                            val = val[0];
                            optional_info.job_position = {id: val.id, name: val.data.name};
                        } else {
                            const _data = {name: job_position.name || job_position, user_id, company_id, created_at};
                            if (job_position.job_category) {
                                _data.job_category = job_position.job_category;
                            }
                            const job_position_doc_ref = await this.getDB().collection('plugin_sheq_assist_job_positions').add(_data);//Promise < DocumentReference < T > >
                            const job_position_doc_snapshot = await job_position_doc_ref.get();//Promise < DocumentSnapshot < T > >
                            optional_info.job_position = {id: job_position_doc_snapshot.id, name: job_position_doc_snapshot.data().name};
                        }
                    }
                }

                if (fname && lname) {
                    updateAttrs.keywords = this.generateKeywords([lname, fname]);
                } else if (fname && !lname) {
                    updateAttrs.keywords = this.generateKeywords([snapshot.get('lname'), fname]);
                } else if (!fname && lname) {
                    updateAttrs.keywords = this.generateKeywords([lname, snapshot.get('fname')]);
                }
//                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
//                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                if (profile_pic) {
                    const gcsUri = await files.upload.call(this, profile_pic, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.profile_pic = gcsUri;
                }

                if (optional_info && optional_info.living_addr_doc) {
                    const gcsUri = await files.upload.call(this, optional_info.living_addr_doc, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/optional_info/living_addr_doc.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    optional_info.living_addr_doc = gcsUri;
                    updateAttrs.optional_info = optional_info;
                }
                if (optional_info && optional_info.banking_doc) {
                    const gcsUri = await files.upload.call(this, optional_info.banking_doc, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/optional_info/banking_doc.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    optional_info.banking_doc = gcsUri;
                    updateAttrs.optional_info = optional_info;
                }

                if (documents && documents.doc_id_or_passport) {
                    const gcsUri = await files.upload.call(this, documents.doc_id_or_passport, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/documents/doc_id_or_passport.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    documents.doc_id_or_passport = gcsUri;
                    updateAttrs.documents = documents;
                }
                if (documents && documents.doc_driver_or_operator_licence) {
                    const gcsUri = await files.upload.call(this, documents.doc_driver_or_operator_licence, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/documents/doc_driver_or_operator_licence.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    documents.doc_driver_or_operator_licence = gcsUri;
                    updateAttrs.documents = documents;
                }
                if (documents && documents.doc_pdrp) {
                    const gcsUri = await files.upload.call(this, documents.doc_pdrp, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/documents/doc_pdrp.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    documents.doc_pdrp = gcsUri;
                    updateAttrs.documents = documents;
                }
                if (documents && documents.doc_work_permit) {
                    const gcsUri = await files.upload.call(this, documents.doc_work_permit, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/documents/doc_work_permit.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    documents.doc_work_permit = gcsUri;
                    updateAttrs.documents = documents;
                }

                const updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >
                snapshot = await doc_ref.get();

                let data = snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                let updatedItem = {id: snapshot.id, data};
                updatedItem = await EmployeeFuns.mapResults.call(this, updatedItem);

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

//                console.log('update', data, updatedItem)
                return updatedItem.data;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="bulk_remove">
        async bulk_remove(evt, ids) {
            return Events.whenLoggedIn(async loggedUser => {
                const resList = await Promise.all(ids.map(async id => {
                    const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    const snapshot = await doc_ref.get();
                    if (!snapshot.exists) {
                        return null;
                    }

                    const data = snapshot.data();
                    const {created_at} = data;
                    if (created_at && created_at.toDate) {
                        data.created_at = created_at.toDate();
                    }

                    const auditData = {id: snapshot.id, data};

                    const updated = await doc_ref.set({removed: true}, {merge: true});//Promise < void >

                    this.removeAudit(loggedUser, new Date().getTime(), auditData);

                    //console.log(this.tbl, 'remove', res)
                    return true;
                }));
                return resList;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const data = snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }

                const auditData = {id: snapshot.id, data};

                const updated = await doc_ref.set({removed: true}, {merge: true});//Promise < void >

                this.removeAudit(loggedUser, new Date().getTime(), auditData);

                //console.log(this.tbl, 'remove', res)
                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="re_instead">
        async re_instead(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const data = snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }

                const auditData = {id: snapshot.id, data};

                const updated = await doc_ref.set({removed: false, notifications_removed: false}, {merge: true});//Promise < void >

                this.editAudit(loggedUser, new Date().getTime(), auditData);
                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Company', key: 'Company', width: 30},
                    {header: 'Project', key: 'Project', width: 30},
                    {header: 'Site', key: 'Site', width: 30},

                    {header: 'First Name', key: 'First Name', width: 25},
                    {header: 'Last Name', key: 'Last Name', width: 25},
                    {header: 'Identity No.', key: 'Identity No.', width: 25},
                    {header: 'Passport No.', key: 'Passport No.', width: 20},
                    {header: 'Gender', key: 'Gender', width: 15},
                    {header: 'Date Of Birth', key: 'Date Of Birth', width: 15},
                    {header: 'Phone No.', key: 'Phone No.', width: 15},
                    {header: 'Email Address', key: 'Email Address', width: 25},

                    {header: 'Date of Employment', key: 'Date of Employment', width: 20},
                    {header: 'Company/Employee No.', key: 'Company/Employee No.', width: 25},
                    {header: 'Department', key: 'Department', width: 30},
                    {header: 'Job Position', key: 'Job Position', width: 30},
                    {header: 'Job Category', key: 'Job Category', width: 30},

                    {header: 'Supervisor Name', key: 'Supervisor Name', width: 25},
                    {header: 'Supervisor Phone No.', key: 'Supervisor Phone No.', width: 22},
                    {header: 'Supervisor Email Address', key: 'Supervisor Email Address', width: 25},

                    {header: 'Street Address', key: 'Street Address', width: 35},
                    {header: 'Local Area', key: 'Local Area', width: 35},
                    {header: 'City', key: 'City', width: 35},
                    {header: 'Province', key: 'Province', width: 20},
                    {header: 'Address (PDF/Image)', key: 'Address (PDF/Image)', width: 35},

                    {header: 'Bank Name', key: 'Bank Name', width: 20},
                    {header: 'Branch', key: 'Branch', width: 25},
                    {header: 'Branch Code', key: 'Branch Code', width: 25},
                    {header: 'Account No.', key: 'Account No.', width: 30},
                    {header: 'Banking Details (PDF/Image)', key: 'Banking Details (PDF/Image)', width: 35},

                    {header: 'ID/Passport Copy (PDF/Image)', key: 'ID/Passport Copy (PDF/Image)', width: 35},
                    {header: 'ID/Passport Expiry Date', key: 'ID/Passport Expiry Date', width: 20},
                    {header: 'Driver/Operator License Copy (PDF/Image)', key: 'Driver/Operator License Copy (PDF/Image)', width: 40},
                    {header: 'Driver/Operator License Expiry Date', key: 'Driver/Operator License Expiry Date', width: 45},
                    {header: 'PDrP Copy (PDF/Image)', key: 'PDrP Copy (PDF/Image)', width: 35},
                    {header: 'PDrP Expiry Date', key: 'PDrP Expiry Date', width: 20},
                    {header: 'Work Permit Copy (PDF/Image)', key: 'Work Permit Copy (PDF/Image)', width: 35},
                    {header: 'Work Permit Expiry Date', key: 'Work Permit Expiry Date', width: 20},

                    {header: 'Next Of Kin #1', key: 'Next Of Kin #1', width: 40},
                    {header: 'Next Of Kin #2', key: 'Next Of Kin #2', width: 40},
                    {header: 'Dependants', key: 'Dependants', width: 20},

                    //
                    {header: 'Contract Expiry Date', key: 'Contract Expiry Date', width: 20},
                    {header: 'Contract End Of Trial Period', key: 'Contract End Of Trial Period', width: 25},
                    {header: 'Contract Start Date', key: 'Contract Start Date', width: 25},
                    {header: 'Contract Type', key: 'Contract Type', width: 25},
                    {header: 'Contract Working Schedule Start Time', key: 'Contract Working Schedule Start Time', width: 25},
                    {header: 'Contract Working Schedule End Time', key: 'Contract Working Schedule End Time', width: 25},
                    {header: 'Contract Working Schedule Daily Working Hours', key: 'Contract Working Schedule Daily Working Hours', width: 25},
                    {header: 'Contract Notes', key: 'Contract Notes', width: 25},
                    {header: 'Contract Salary Payment Type', key: 'Contract Salary Payment Type', width: 25},
                    {header: 'Contract Salary Interval', key: 'Contract Salary Interval', width: 25},
                    {header: 'Contract Salary', key: 'Contract Salary', width: 25},
                    {header: 'Contract Wage', key: 'Contract Wage', width: 25},
                    //
                    {header: 'Competency Certificate Expiry Date', key: 'Competency Certificate Expiry Date', width: 25},
                    {header: 'Competency Certificate Type', key: 'Competency Certificate Type', width: 25},
                    //
                    {header: 'Medical Fitness Certificate Expiry Date', key: 'Medical Fitness Certificate Expiry Date', width: 25},
                    {header: 'Medical Fitness Certificate Annexture 3?', key: 'Medical Fitness Certificate Annexture 3?', width: 25},
                    {header: 'Medical Fitness Certificate Restrictions', key: 'Medical Fitness Certificate Restrictions', width: 25},
                    //
                    {header: 'Warning Expiry Date', key: 'Warning Expiry Date', width: 20},
                    {header: 'Warning Date', key: 'Warning Date', width: 20},
                    {header: 'Warning Issued By', key: 'Warning Issued By', width: 20},
                    {header: 'Warning Type', key: 'Warning Type', width: 20},
                    {header: 'Warning Details Of Misconduct', key: 'Warning Details Of Misconduct', width: 20},
                    {header: "Warning Employee's Comments", key: "Warning Employee's Comments", width: 20},
                    {header: 'Warning Notes', key: 'Warning Notes', width: 20},
                    //
                    {header: 'Sick Leave Due To', key: 'Sick Leave Due To', width: 20},
                    {header: 'Sick Leave Type', key: 'Sick Leave Type', width: 20},
                    {header: 'Sick Leave Start Date', key: 'Sick Leave Start Date', width: 20},
                    {header: 'Sick Leave Expiry Date', key: 'Sick Leave Expiry Date', width: 20},
                    {header: 'No. Of Days Booked', key: 'No. Of Days Booked', width: 20},
                    {header: "Reason Of Sick Leave", key: "Reason Of Sick Leave", width: 20},
                    {header: "Employee's Comments", key: "Employee's Comments", width: 20},
                    {header: 'Notes', key: 'Notes', width: 20},
                    {header: 'Proof Of Sick Note', key: 'Proof Of Sick Note', width: 20},

                    {header: 'Trainings', key: 'Trainings', width: 20},
                    {header: 'PPE Issue', key: 'PPE Issue', width: 20},
                    {header: 'Compliance', key: 'Compliance', width: 20},
                ];

//                console.log('employeeList', list)

                const rows = await Promise.all(list.map(async employee => {
                    const {id, data: {
                            created_at,
                            profile_pic,
                            fname, lname, id_num, passport_num, dob, sex,
                            client, project, site, phone, email,
                            //
                            optional_info,
                            documents,
                            next_of_kin_1, next_of_kin_2, dependants,
                            //
                            employee_contract_list = {},
                            employee_competency_list = {},
                            employee_medical_list = {},
                            employee_warning_list = {},
                            employee_leave_list = {},
                            //
                            training_certificate_list = []
                        }} = employee;

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        "Last Name": lname,
                        "First Name": fname,
                        "Identity No.": id_num ? String(id_num) : "",
                        "Passport No.": passport_num || "",
                        Gender: sex || sex,
                        "Date Of Birth": Dates.formatDate(dob) || "",
                        "Phone No.": phone ? String(phone) : "",
                        "Email Address": email || ""
                    };

                    if (optional_info) {
                        const {
                            employment_date, employee_num,
                            department, job_position,
                            supervisor_name, supervisor_phone, supervisor_email,
                            living_addr_street, living_addr_local_area, living_addr_city, living_addr_province, living_addr_doc,
                            banking_name, banking_branch, banking_branch_code, banking_account_num, banking_doc
                        } = optional_info;
                        if (employment_date) {
                            res["Date of Employment"] = Dates.formatDate(employment_date) || "";
                        }
                        res["Company/Employee No."] = employee_num;
                        if (department) {
                            const {name, data: _data} = department;
                            res["Department"] = name || (_data ? _data.name : 'N/A');
                        }
                        if (job_position) {
                            const {name, category, data: _data} = job_position;
                            res["Job Position"] = name || (_data ? _data.name : 'N/A');
                            res["Job Category"] = category || (_data ? _data.category : 'N/A');
                        }

                        if (supervisor_name) {
                            if (isString(supervisor_name)) {
                                res["Supervisor Name"] = supervisor_name;
                            } else {
                                let {lname, fname, data: _data} = supervisor_name;
                                if (_data) {
                                    lname = _data.lname;
                                    fname = _data.fname;
                                }
                                res["Supervisor Name"] = lname + " " + fname;
                            }
                        }
                        res["Supervisor Phone No."] = supervisor_phone;
                        res["Supervisor Email Address"] = supervisor_email;

                        res["Street Address"] = living_addr_street;
                        res["Local Area"] = living_addr_local_area;
                        res["City"] = living_addr_city;
                        res["Province"] = living_addr_province;
//                        if (living_addr_doc) {
//                            const {dlUrls} = living_addr_doc;
//                            const key = "Address (PDF/Image)";
//                            res[key] = {
//                                addImage: () => {
//                                    return {file: dlUrls[0], col: key};
//                                }
//                            };
//                        }

                        res["Bank Name"] = banking_name;
                        res["Branch"] = banking_branch;
                        res["Branch Code"] = banking_branch_code;
                        res["Account No."] = banking_account_num;
//                        if (banking_doc) {
//                            const {dlUrls} = banking_doc;
//                            const key = "Banking Details (PDF/Image)";
//                            res[key] = {
//                                addImage: () => {
//                                    return {file: dlUrls[0], col: key};
//                                }
//                            };
//                        }
                    }

                    if (documents) {
                        const {
                            doc_id_or_passport, doc_id_or_passport_expiry,
                            doc_driver_or_operator_licence, doc_driver_or_operator_licence_expiry,
                            doc_pdrp, doc_pdrp_expiry,
                            doc_work_permit, doc_work_permit_expiry
                        } = documents;
//                        if (doc_id_or_passport) {
//                            const {dlUrls} = doc_id_or_passport;
//                            const key = "ID/Passport Copy (PDF/Image)";
//                            res[key] = {
//                                addImage: () => {
//                                    return {file: dlUrls[0], col: key};
//                                }
//                            };
//                        }
                        if (doc_id_or_passport_expiry) {
                            res["ID/Passport Expiry Date"] = Dates.formatDate(doc_id_or_passport_expiry) || "";
                        }

//                        if (doc_driver_or_operator_licence) {
//                            const {dlUrls} = doc_driver_or_operator_licence;
//                            const key = "Driver/Operator License Copy (PDF/Image)";
//                            res[key] = {
//                                addImage: () => {
//                                    return {file: dlUrls[0], col: key};
//                                }
//                            };
//                        }
                        if (doc_driver_or_operator_licence_expiry) {
                            res["Driver/Operator License Expiry Date"] = Dates.formatDate(doc_driver_or_operator_licence_expiry) || "";
                        }

//                        if (doc_pdrp) {
//                            const {dlUrls} = doc_pdrp;
//                            const key = "PDrP Copy (PDF/Image)";
//                            res[key] = {
//                                addImage: () => {
//                                    return {file: dlUrls[0], col: key};
//                                }
//                            };
//                        }
                        if (doc_pdrp_expiry) {
                            res["PDrP Expiry Date"] = Dates.formatDate(doc_pdrp_expiry) || "";
                        }

//                        if (doc_work_permit) {
//                            const {dlUrls} = doc_work_permit;
//                            const key = "Work Permit Copy (PDF/Image)";
//                            res[key] = {
//                                addImage: () => {
//                                    return {file: dlUrls[0], col: key};
//                                }
//                            };
//                        }
                        if (doc_work_permit_expiry) {
                            res["Work Permit Expiry Date"] = Dates.formatDate(doc_work_permit_expiry) || "";
                        }
                    }

                    if (next_of_kin_1) {
                        const {lname, fname, phone1, phone2, relationship} = next_of_kin_1;
                        res["Next Of Kin #1"] = lname + " " + fname + " (" + relationship + ")";
                    }
                    if (next_of_kin_2) {
                        const {lname, fname, phone1, phone2, relationship} = next_of_kin_2;
                        res["Next Of Kin #2"] = lname + " " + fname + " (" + relationship + ")";
                    }
                    if (dependants) {

                    }

                    {
//                        const employee_contracts_path = await Events.get('plugin_sheq_assist/employees/contracts/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Contracts"] = employee_contracts_path;
                        let list = Object.keys(employee_contract_list).map(id => {
                            return {id, expiry_date: employee_contract_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_contract_list[id]};
                        });

                        const item = list[0];
                        if (item) {
                            const {data: {created_at, salary_info = {}, contract_details = {}, doc, job_profile_doc}} = item;
                            let {contract_type, start_date, expiry_date, end_of_trial_period, start_time, end_time, daily_working_hours, notes} = contract_details;
                            let {payment_type, salary_interval, salary = "N/A", wage, deductible = {}} = salary_info;
                            if (salary !== "N/A") {
                                salary = salary.toCurrency('R');
                            }
                            res["Contract Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            res["Contract End Of Trial Period"] = Dates.formatDate(end_of_trial_period) || "";
                            res["Contract Start Date"] = Dates.formatDate(start_date) || "";
                            res["Contract Type"] = contract_type;
                            res["Contract Working Schedule Start Time"] = start_time;
                            res["Contract Working Schedule End Time"] = end_time;
                            res["Contract Working Schedule Daily Working Hours"] = daily_working_hours;
                            res["Contract Notes"] = notes;

                            res["Contract Salary Payment Type"] = payment_type;
                            if (payment_type === "Salary") {
                                res["Contract Salary Interval"] = salary_interval;
                                res["Contract Salary"] = salary;
                            }
                            if (payment_type === "Wage") {
                                res["Contract Wage"] = wage;
                            }
                        }
                    }

                    {
//                        const employee_competencies_path = Events.get('plugin_sheq_assist/employees/competencies/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Competency Certificates"] = employee_competencies_path;

                        let list = Object.keys(employee_competency_list).map(id => {
                            return {id, expiry_date: employee_competency_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_competency_list[id]};
                        });

                        const item = list[0];
                        if (item) {
                            const {data: {competency_type, expiry_date, doc}} = item;
                            res["Competency Certificate Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            res["Competency Certificate Type"] = competency_type;
                        }
                    }

                    {
//                        const employee_medicals_path = await Events.get('plugin_sheq_assist/employees/medicals/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Medicals Fitness Certificates"] = employee_medicals_path;

                        let list = Object.keys(employee_medical_list).map(id => {
                            return {id, expiry_date: employee_medical_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_medical_list[id]};
                        });

                        const item = list[0];

                        if (item) {
                            const {data: {annexture_3, restrictions, expiry_date, doc}} = item;
                            res["Medical Fitness Certificate Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            res["Medical Fitness Certificate Annexture 3?"] = annexture_3;
                            res["Medical Fitness Certificate Restrictions"] = restrictions;
                        }
                    }

                    {
//                        const employee_warnings_path = await Events.get('plugin_sheq_assist/employees/warnings/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Warnings"] = employee_warnings_path;

                        let list = Object.keys(employee_warning_list).map(id => {
                            return {id, expiry_date: employee_warning_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_warning_list[id]};
                        });

                        const item = list[0];
                        if (item) {
                            const {data: {issued_by, type, date, expiry_date, details, employee_comments, notes, doc}} = item;
                            res["Warning Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            res["Warning Date"] = Dates.formatDate(date) || "";
                            res["Warning Issued By"] = issued_by ? (issued_by.lname + ' ' + issued_by.fname) : "";
                            res["Warning Type"] = type;
                            res["Warning Details Of Misconduct"] = details;
                            res["Warning Employee's Comments"] = employee_comments;
                            res["Warning Notes"] = notes;
                        }
                    }

                    {
//                        const employee_leaves_path = await Events.get('plugin_sheq_assist/employees/leaves/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Leaves"] = employee_leaves_path;

                        let list = Object.keys(employee_leave_list).map(id => {
                            return {id, expiry_date: employee_leave_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_leave_list[id]};
                        });

                        const item = list[0];
                        if (item) {
                            const {data: {doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes}} = item;
                            res["Sick Leave Due To"] = due_to || "";
                            res["Sick Leave Type"] = type;
                            res["Sick Leave Start Date"] = Dates.formatDate(date) || "";
                            res["Sick Leave Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            res["Sick Leave No. Of Days Booked"] = days_booked;
                            res["Sick Leave Reason"] = reason;
                            res["Sick Leave Employee's Comments"] = employee_comments;
                            res["Sick Leave Notes"] = notes;
                        }
                    }

                    return res;
                }));

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Employees Data", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="send_app_link">
        async send_app_link(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const item = await this.find_by_id(null, id);
                if (item) {
                    let {id, data: {password, email, fname, lname}} = item;
                    if (email) {
//                        if (!password) {
//                            password = uuidv4();
//                            password = password.substring(0, password.indexOf('-'));
//
//                            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
//                            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
//                            if (!doc_snapshot.exists) {
//                                return null;
//                            }
//
//                            const updated = await doc_ref.update({password});//Promise < void >
//                        }
//                        const opts = {
//                            from: '"SHEQ Aid" <support@sheqsolve.com>',
//                            to: email,
//                            subject: 'SHEQ Aid Application Link',
//                            html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
//                                <p>If you have not yet used SHEQ Aid Application, please use the link below to download the application.</p>\n\
//                                <p>Your SHEQ Aid Username is <b>' + email + '</b>, Password is <b>' + password + '</b></p>\n\
//                                ' + Utils.getAppDownloadOptionMsg()
//                        };
//                        const sendEmail = functions.httpsCallable('callables-sendEmail');
//                        const mailRes = await sendEmail(opts);
//                        console.log('mailRes', mailRes)

                        return true;
                    }
                    return "NO_EMAIL";
                }

                return "NOT_FOUND";
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async active_dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    company: {id: company_id},
                    client_id, project_id, site_id
                } = loggedUser;

                let q = this.getDB().collection(`${TBL_EMPLOYEES}_active_counters`);

                let key;
                site_id = my_site ? my_site.id : site_id;
                if (site_id) {
                    q = q.doc(`site`);
                    key = site_id;
                } else {
                    project_id = my_project ? my_project.id : project_id;
                    if (project_id) {
                        q = q.doc(`project`);
                        key = project_id;
                    } else {
                        client_id = my_client ? my_client.id : client_id;
                        if (client_id) {
                            q = q.doc(`client`);
                            key = client_id;
                        } else {
                            q = q.doc(`company`);
                            key = company_id;
                        }
                    }
                }

                const snapshot = await q.get();
                if (snapshot.exists) {
                    return snapshot.get(key);
                }
                return 'N/A';
            });
        }

        async removed_dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    company: {id: company_id},
                    client_id, project_id, site_id
                } = loggedUser;

                let q = this.getDB().collection(`${TBL_EMPLOYEES}_removed_counters`);

                let key;
                site_id = my_site ? my_site.id : site_id;
                if (site_id) {
                    q = q.doc(`site`);
                    key = site_id;
                } else {
                    project_id = my_project ? my_project.id : project_id;
                    if (project_id) {
                        q = q.doc(`project`);
                        key = project_id;
                    } else {
                        client_id = my_client ? my_client.id : client_id;
                        if (client_id) {
                            q = q.doc(`client`);
                            key = client_id;
                        } else {
                            q = q.doc(`company`);
                            key = company_id;
                        }
                    }
                }

                const snapshot = await q.get();
                if (snapshot.exists) {
                    return snapshot.get(key);
                }
                return 'N/A';
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="transfer">
        async transfer(evt, employeeListData) {
            return Events.whenLoggedIn(async loggedUser => {
                const res = await Promise.all(employeeListData.map(async ({id, data}) => {
                    this.injectSavable(evt, loggedUser, data, true);
                    const res = await this.update(evt, id, data);
                    return res;
                }));

                console.log('transfer', res);

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {name = "", client_id, project_id, site_id, department_id, job_position_id, isNew} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1}, q => {
                    q = q.where('removed', '==', false);
                    if (my_client) {
                        q = q.where('client_id', '==', my_client.id);
                    } else if (client_id) {
                        q = q.where('client_id', '==', client_id);
                    }
                    if (my_project) {
                        q = q.where('project_id', '==', my_project.id);
                    } else if (project_id) {
                        q = q.where('project_id', '==', project_id);
                    }
                    if (my_site) {
                        q = q.where('site_id', '==', my_site.id);
                    } else if (site_id) {
                        q = q.where('site_id', '==', site_id);
                    }

                    if (job_position_id) {
                        q = q.where('optional_info.job_position.id', '==', job_position_id);
                    }
                    if (department_id) {
                        q = q.where('optional_info.department.id', '==', department_id);
                    }
                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id, actions) {
            // console.log('find_by_id', this, evt, id, actions)
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                let item = {id: doc_snapshot.id, data: doc_snapshot.data()};
                item = await EmployeeFuns.mapResults.call(this, item, actions);
                return item;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name, list, list_removed, filter, list_removed_filter">
        async search_by_name(evt, searchText) {
            return await this.list(evt, {searchText});
        }

        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    q = q.where('removed', '==', false);
                    const filter = EmployeeFuns.createDbFilter.call(this, searchText);
                    return filter(q);
                });
//                console.log('emp', list)
                list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
                return list;
            });
        }

        async list_removed(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    q = q.where('removed', '==', true);
                    const filter = EmployeeFuns.createDbFilter.call(this, searchText);
                    return filter(q);
                });
                list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
                return list;
            });
        }

        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", identity_num, job_position: job_position_id, department: department_id} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    q = q.where('removed', '==', false);
                    if (identity_num) {
                        q = q.where('id_num', '==', identity_num);
                    }
                    if (job_position_id) {
                        q = q.where('optional_info.job_position.id', '==', job_position_id);
                    }
                    if (department_id) {
                        q = q.where('optional_info.department.id', '==', department_id);
                    }
                    const filter = EmployeeFuns.createDbFilter.call(this, name);
                    return filter(q);
                });
                list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
                return list;
            });
        }

        async list_removed_filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", identity_num, job_position: job_position_id, department: department_id} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    q = q.where('removed', '==', true);
                    if (identity_num) {
                        q = q.where('id_num', '==', identity_num);
                    }
                    if (job_position_id) {
                        q = q.where('optional_info.job_position.id', '==', job_position_id);
                    }
                    if (department_id) {
                        q = q.where('optional_info.department.id', '==', department_id);
                    }
                    const filter = EmployeeFuns.createDbFilter.call(this, name);
                    return filter(q);
                });
                list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_by_notification_key">
        async filter_by_notification_key(evt, key, value) {
            return Events.whenLoggedIn(async loggedUser => {
                const name = "";
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    q = q.where('removed', '==', false);
                    if (key) {
                        q = q.where(key, '==', value);
                    }
                    const filter = EmployeeFuns.createDbFilter.call(this, name);
                    return filter(q);
                });
                list = await Promise.all(list.map(EmployeeFuns.mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>

//        sortBy(list) {
//            list.sortBy("data.lname");
//        }
        sortBy() {
            return "lname";
        }
    }

    self.employeesCntr = new Controller(events, db);
})();