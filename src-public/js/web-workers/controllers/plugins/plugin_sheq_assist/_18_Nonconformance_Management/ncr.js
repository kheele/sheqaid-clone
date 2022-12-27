(() => {
    class Controller extends AControllerAid {
        //date, type, auditor, company, representative, scope, definition_list, list
        //<editor-fold desc="constructor">
        constructor(events, db) {
            super(events, db, {
                singular: "Non-Conformance Report",
                plural: "Non-Conformance Reports"
            }, "plugin_sheq_assist/ncr/", "plugin_sheq_assist_18_Nonconformance_Management");

            const {addAction} = this;

            addAction("select/filter", this.filter_select.bind(this));
            addAction("list/filter", this.filter.bind(this));

            addAction("update/approve", this.update_approve.bind(this));
            addAction("update/reject", this.update_reject.bind(this));
            addAction("update/complete", this.update_complete.bind(this));
            addAction("update/progress", this.update_progress.bind(this));

            let transfer = async () => {
                const col_ref = await db.collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await col_ref.get();
                await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    if (!data.due_date) {
                        data.due_date = null;
                    }
                    await doc.ref.set(data, {merge: true});//Promise < DocumentReference < T > >;
                    console.log('end', doc.id)
                }));
                console.log('ncr end')
            };
//            transfer();
        }
        //</editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                    this.injectSavable(evt, loggedUser, data);

                    const {contractor_id} = loggedUser;

                    let {
                        user_id,
                        //
                        client, project, site,
                        //
                        type,
                        priority,
                        desc,
                        //
                        due_date,
                        responsible_person,
                        approving_person,
                        //
                        document_list,
                        source,
                        selected_source_id
                    } = data;
                    if (document_list) {
                        delete data.document_list;
                    }

                    if (typeof site === 'string') {
                        if (site !== 'All') {
                            const _data = {name: site, user_id, company_id, created_at};
                            const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                            const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                            data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                            data.site_id = site_doc_snapshot.id;
                        } else {
                            data.site = null;
                            data.site_id = null;
                        }
                    } else if (site) {
                        data.site_id = site.id;
                    }
                    if (typeof project === 'string') {
                        if (project !== 'All') {
                            const _data = {name: project, user_id, company_id, created_at};
                            const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                            const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                            data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                            data.project_id = project_doc_snapshot.id;
                        } else {
                            data.project = null;
                            data.project_id = null;
                        }
                    } else if (project) {
                        data.project_id = project.id;
                    }
                    if (typeof client === 'string') {
                        if (client !== 'All') {
                            const _data = {name: client, user_id, company_id, created_at};
                            const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                            const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                            data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                            data.client_id = client_doc_snapshot.id;
                        } else {
                            data.client = null;
                            data.client_id = null;
                        }
                    } else if (client) {
                        data.client_id = client.id;
                    }

                    let responsible_person_doc_ref, responsible_person_doc_snapshot;
                    if (responsible_person && responsible_person.id) {
                        responsible_person_doc_ref = await db_hr.collection('employees').doc(responsible_person.id);//Promise < DocumentReference < T > >
                        responsible_person_doc_snapshot = await responsible_person_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                        if (!responsible_person_doc_snapshot.exists) {
                            return 'RESPONSIBLE_PERSON_NOT_EXISTS';
                        }
                    }

                    let approving_person_doc_ref, approving_person_doc_snapshot;
                    if (approving_person && approving_person.id) {
                        approving_person_doc_ref = await db_hr.collection('employees').doc(approving_person.id);//Promise < DocumentReference < T > >
                        approving_person_doc_snapshot = await approving_person_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                        if (!approving_person_doc_snapshot.exists) {
                            return 'APPROVING_PERSON_NOT_EXISTS';
                        }
                    }

                    let contractorUsername;
                    if (contractor_id) {
                        const contractor_doc_ref = await db2.collection('plugin_sheq_assist_contractors').doc(contractor_id);//Promise < DocumentReference < T > >
                        const contractor_doc_snapshot = await contractor_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                        if (!contractor_doc_snapshot.exists) {
                            return 'CONTRACTOR_NOT_EXISTS';
                        }
                        contractorUsername = contractor_doc_snapshot.get('username');
                    } else {
                        contractorUsername = null;
                    }

                    let selected_source_tbl;
                    switch (source) {
                        case 'Compliance Audit':
                            selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_audit';
                            break;
                        case "Checklist":
                            selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_checklist';
                            break;
                        case "Inspection":
                            selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_inspection';
                            break;
                        case "Incident Investigation":
                            selected_source_tbl = 'plugin_sheq_assist_17_Incident_Investigation';
                            break;
                        case "Site Audit":
                            selected_source_tbl = 'plugin_sheq_assist_sites';
                            break;
                        default:
                            return 'SOURCE_UNKNOWN';
                    }

                    let selected_source_snapshot;
                    if (selected_source_tbl && selected_source_id) {
                        const selected_source_ref = await this.getDB().collection(selected_source_tbl).doc(selected_source_id);
                        selected_source_snapshot = await selected_source_ref.get();
                        if (!selected_source_snapshot.exists) {
                            return 'SELECTED_SOURCE_NOT_FOUND';
                        }

                        data.selected_source_ref = selected_source_ref;
                    }

                    if (!due_date) {
                        data.due_date = null;
                    }
                    const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                    let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;

                    if (document_list) {
                        document_list = await Promise.all(document_list.map(async (file, n) => {
                            const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                                const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                                const new_name = this.tbl + '/' + doc_snapshot.id + '/document_list/' + n + '/' + name;
                                return new_name;
                            }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                                throw e;
                            });
                            return gcsUri;
                        }));
                        await doc_ref.set({document_list}, {merge: true});//Promise < void >
                    }

                    doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    data = doc_snapshot.data();
                    const {created_at: created_at_2} = data;
                    if (created_at_2 && created_at_2.toDate) {
                        data.created_at = created_at_2.toDate();
                    }

                    const ccListByCompany = await NCRFuns.getEmailCCReceipientsByCompany.call(this, {
                        loggedUser, user_id
                    });
                    let ccListByContractor;
                    if (contractor_id) {
                        ccListByContractor = await NCRFuns.getEmailCCReceipientsByContractor.call(this, {
                            contractor_id
                        });
                    } else {
                        ccListByContractor = [];
                    }

                    let responsible_personEmail, approving_personEmail;

                    if (!responsible_person || !responsible_person.email) {
                        responsible_personEmail = null;
                    } else {
                        responsible_personEmail = responsible_person.email;
                    }

                    if (!approving_person || !approving_person.email) {
                        approving_personEmail = null;
                    } else {
                        approving_personEmail = approving_person.email;
                    }

                    const emails = [...ccListByCompany, ...ccListByContractor];

                    if (contractorUsername) {
                        emails.push(contractorUsername);
                    }
                    if (responsible_personEmail) {
                        emails.push(responsible_personEmail);
                    }
                    if (approving_personEmail) {
                        emails.push(approving_personEmail);
                    }

                    {
                        //send mail no expiry date set
                        let location = "";
                        if (client) {
                            location = client.name || client.data.name;
                        }
                        if (project) {
                            location += " > " + (project.name || project.data.name);
                        }
                        if (site) {
                            location += " > " + (site.name || site.data.name);
                        }
                        if (location.isEmpty()) {
                            location = "N/A";
                        }

                        const opts = {
                            from: '"SHEQ Aid" <support@sheqsolve.com>',
//                            to: emails.join(','),
                            bcc: emails.join(','),
                            subject: 'Non-Conformance Recorded',
                            html: '<p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>\n\
                            <p>The following non-conformance has been recorded:</p>\n\
                            <p>Location (Company/Project/Site): <b>' + location + '</b></p>\n\
                            <p>ID: <b>' + doc_snapshot.id + '</b></p>\n\
                            <p>Due Date: <b>' + (Dates.formatDate(due_date) || 'N/A') + '</b></p>\n\
                            <p>Source: <b>' + (source || 'N/A') + '</b></p>\n\
                            <p>Type: <b>' + (type || 'N/A') + '</b></p>\n\
                            <p>Priority: <b>' + (priority || 'N/A') + '</b></p>\n\
                            <p>Description: <b>' + (desc || 'N/A') + '</b></p>\n\
                            <p>Responsible Person: <b>' + (responsible_person ? ((responsible_person.fname || responsible_person.data.fname) + ' ' + (responsible_person.lname || responsible_person.data.lname)) : 'N/A') + '</b></p>\n\
                            <p>Approving Person: <b>' + (approving_person ? ((approving_person.fname || approving_person.data.fname) + ' ' + (approving_person.lname || approving_person.data.lname)) : 'N/A') + '</b></p>'
                        };

                        //should create pre-notification
                        if (due_date) {
                            console.log("onCreateNotification 1", responsible_person_doc_ref)

                            await this.onCreateNotification({
                                newId: doc_snapshot.id,
                                module: '_18_Nonconformance_Management',
                                _group: 'Non-Conformance',
                                doc_snapshot,
                                details: {
                                    expiry: due_date,
                                    expiry_date: due_date.toDate(),
                                    responsible_person_id: responsible_person_doc_snapshot ? responsible_person_doc_snapshot.id : null,
                                    approving_person_id: approving_person_doc_snapshot ? approving_person_doc_snapshot.id : null,
                                    source,
                                    selected_source_id,
                                    //
                                    type,
                                    priority,
                                    desc
                                },
                                ccListByCompany,
                                ccListByContractor,
                                contractorUsername,
                                responsible_personEmail,
                                approving_personEmail,
                            });

                            console.log("onCreateNotification 2")

                            const month = data.created_at.addMonths(1).getTime();
                            if (due_date <= month) {
                                if (due_date < new Date().getTime()) {
                                    //send mail expiry expired

                                    opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                        NOTE: This non-conformance expired on ${Dates.formatDate(due_date)}, (${moment(Dates.parse(due_date)).fromNow()})}.
                                    </p>`;
                                } else {
                                    //send mail expiry within month

                                    opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                        NOTE: This non-conformance expires within one month on ${Dates.formatDate(due_date)}, in (${moment(Dates.parse(due_date)).fromNow()})}.
                                    </p>`;
                                }
                            } else {
                                //send mail expiry more than month

                                opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                    NOTE: This non-conformance expires on ${Dates.formatDate(due_date)}, in (${moment(Dates.parse(expiry_date)).fromNow()})}.
                                </p>`;
                            }
                        } else {
                            opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                    NOTE: This non-conformance does not have due date.
                                </p>
                                <p style="background: red; color: #fff; font-weight: bold">
                                    You are recommended to add due date on the non-conformance.
                                </p>`;
                        }
                        opts.html += '<p>Kind Regards<br/>SHEQ Aid</p>';

                        console.log('callables-sendEmail', opts)
                        const sendEmail = functions.httpsCallable('callables-sendEmail');
                        const mailRes = await sendEmail(opts);
                        console.log('mailRes', mailRes)
                    }

                    if (selected_source_snapshot) {
                        data.selected_source_ref = {id: selected_source_snapshot.id, data: selected_source_snapshot.data()};
                    }

                    const auditData = {id: doc_snapshot.id, data};

                    this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                    return NCRFuns.mapResults(auditData);
                }
            );
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {contractor_id} = loggedUser;

                let doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                const old_data = doc_snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                let {
//                    user_id,
                    //
                    client, project, site,
                    //
                    type,
                    priority,
                    desc,
                    //
                    due_date,
                    responsible_person,
                    approving_person,
                    //
                    document_list,
                    source,
                    selected_source_id,
                } = updateAttrs;
                if (document_list) {
                    delete updateAttrs.document_list;
                }

                if ('site' in updateAttrs) {
                    if (updateAttrs.site === 'All' || updateAttrs.site === null) {
                        updateAttrs.site = null;
                        updateAttrs.site_id = null;
                    } else if (updateAttrs.site) {
                        updateAttrs.site_id = updateAttrs.site.id;
                    }
                }
                if ('project' in updateAttrs) {
                    if (updateAttrs.project === 'All' || updateAttrs.project === null) {
                        updateAttrs.project = null;
                        updateAttrs.project_id = null;
                    } else if (updateAttrs.project) {
                        updateAttrs.project_id = updateAttrs.project.id;
                    }
                }
                if ('client' in updateAttrs) {
                    if (updateAttrs.client === 'All' || updateAttrs.client === null) {
                        updateAttrs.client = null;
                        updateAttrs.client_id = null;
                    } else if (updateAttrs.client) {
                        updateAttrs.client_id = updateAttrs.client.id;
                    }
                }

                let responsible_person_doc_ref, responsible_person_doc_snapshot;
                if (responsible_person && responsible_person.id) {
                    responsible_person_doc_ref = await db_hr.collection('employees').doc(responsible_person.id);//Promise < DocumentReference < T > >
                    responsible_person_doc_snapshot = await responsible_person_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    if (!responsible_person_doc_snapshot.exists) {
                        return 'RESPONSIBLE_PERSON_NOT_EXISTS';
                    }
                }

                let approving_person_doc_ref, approving_person_doc_snapshot;
                if (approving_person && approving_person.id) {
                    approving_person_doc_ref = await db_hr.collection('employees').doc(approving_person.id);//Promise < DocumentReference < T > >
                    approving_person_doc_snapshot = await approving_person_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    if (!approving_person_doc_snapshot.exists) {
                        return 'APPROVING_PERSON_NOT_EXISTS';
                    }
                }

                let contractorUsername;
                if (contractor_id) {
                    const contractor_doc_ref = await db2.collection('plugin_sheq_assist_contractors').doc(contractor_id);//Promise < DocumentReference < T > >
                    const contractor_doc_snapshot = await contractor_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    if (!contractor_doc_snapshot.exists) {
                        return 'CONTRACTOR_NOT_EXISTS';
                    }
                    contractorUsername = contractor_doc_snapshot.get('username');
                } else {
                    contractorUsername = null;
                }
//parts cost, labour cost, traveling cost, production loss cost//...
//list of parts//...
//request, approval

//parts
//cost, 
//
//
//
                let selected_source_tbl;
                if (source) {
                    switch (source) {
                        case 'Compliance Audit':
                            selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_audit';
                            break;
                        case "Checklist":
                            selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_checklist';
                            break;
                        case "Inspection":
                            selected_source_tbl = 'plugin_sheq_assist_21_Internal_Audit_inspection';
                            break;
                        case "Incident Investigation":
                            selected_source_tbl = 'plugin_sheq_assist_17_Incident_Investigation';
                            break;
                        case "Site Audit":
                            selected_source_tbl = 'plugin_sheq_assist_sites';
                            break;
                        default:
                            return 'SOURCE_UNKNOWN';
                    }
                }

                let selected_source_snapshot;
                if (selected_source_id) {
                    if (selected_source_tbl) {
                        const selected_source_ref = await this.getDB().collection(selected_source_tbl).doc(selected_source_id);
                        selected_source_snapshot = await selected_source_ref.get();
                        if (!selected_source_snapshot.exists) {
                            return 'SELECTED_SOURCE_NOT_FOUND';
                        }

                        updateAttrs.selected_source_ref = selected_source_ref;
                    }
                }

                if (document_list) {
                    document_list = await Promise.all(document_list.map(async (file, n) => {
                        const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                            const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                            const new_name = this.tbl + '/' + doc_snapshot.id + '/document_list/' + n + '/' + name;
                            return new_name;
                        }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                            throw e;
                        });
                        return gcsUri;
                    }));
                    updateAttrs.document_list = document_list;
                }

                await doc_ref.set(updateAttrs, {merge: true});//Promise < DocumentReference < T > >
                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;
                const data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const ccListByCompany = await NCRFuns.getEmailCCReceipientsByCompany.call(this, {
                    loggedUser, user_id
                });
                let ccListByContractor;
                if (contractor_id) {
                    ccListByContractor = await NCRFuns.getEmailCCReceipientsByContractor.call(this, {
                        contractor_id
                    });
                } else {
                    ccListByContractor = [];
                }

                let responsible_personEmail, approving_personEmail;

                if (!responsible_person || !responsible_person.email) {
                    responsible_personEmail = null;
                } else {
                    responsible_personEmail = responsible_person.email;
                }

                if (!approving_person || !approving_person.email) {
                    approving_personEmail = null;
                } else {
                    approving_personEmail = approving_person.email;
                }

                const emails = [...ccListByCompany, ...ccListByContractor];

                if (contractorUsername) {
                    emails.push(contractorUsername);
                }
                if (responsible_personEmail) {
                    emails.push(responsible_personEmail);
                }
                if (approving_personEmail) {
                    emails.push(approving_personEmail);
                }

                {
                    //send mail no expiry date set
                    let location = "";
                    if (client) {
                        location = client.name || client.data.name;
                    }
                    if (project) {
                        location += " > " + (project.name || project.data.name);
                    }
                    if (site) {
                        location += " > " + (site.name || site.data.name);
                    }
                    if (location.isEmpty()) {
                        location = "N/A";
                    }

                    const opts = {
                        from: '"SHEQ Aid" <support@sheqsolve.com>',
//                            to: emails.join(','),
                        bcc: emails.join(','),
                        subject: 'Non-Conformance Recorded',
                        html: '<p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>\n\
                            <p>The following non-conformance has been updated:</p>\n\
                            <p>Location (Company/Project/Site): <b>' + location + '</b></p>\n\
                            <p>ID: <b>' + doc_snapshot.id + '</b></p>\n\
                            <p>Due Date: <b>' + (Dates.formatDate(due_date) || 'N/A') + '</b></p>\n\
                            <p>Source: <b>' + (source || 'N/A') + '</b></p>\n\
                            <p>Type: <b>' + (type || 'N/A') + '</b></p>\n\
                            <p>Priority: <b>' + (priority || 'N/A') + '</b></p>\n\
                            <p>Description: <b>' + (desc || 'N/A') + '</b></p>\n\
                            <p>Responsible Person: <b>' + (responsible_person ? ((responsible_person.fname || responsible_person.data.fname) + ' ' + (responsible_person.lname || responsible_person.data.lname)) : 'N/A') + '</b></p>\n\
                            <p>Approving Person: <b>' + (approving_person ? ((approving_person.fname || approving_person.data.fname) + ' ' + (approving_person.lname || approving_person.data.lname)) : 'N/A') + '</b></p>'
                    };

                    if (!due_date) {
                        due_date = old_data.due_date;
                    }

                    //should create pre-notification
                    if (due_date) {
                        console.log("onCreateNotification 1", responsible_person_doc_ref)

                        await this.onCreateNotification({
                            newId: doc_snapshot.id,
                            module: '_18_Nonconformance_Management',
                            _group: 'Non-Conformance',
                            doc_snapshot,
                            details: {
                                expiry: due_date,
                                expiry_date: due_date.toDate(),
                                responsible_person_id: responsible_person_doc_snapshot ? responsible_person_doc_snapshot.id : null,
                                approving_person_id: approving_person_doc_snapshot ? approving_person_doc_snapshot.id : null,
                                source,
                                selected_source_id,
                                //
                                type,
                                priority,
                                desc
                            },
                            ccListByCompany,
                            ccListByContractor,
                            contractorUsername,
                            responsible_personEmail,
                            approving_personEmail,
                        });

                        console.log("onCreateNotification 2")

                        const month = data.created_at.addMonths(1).getTime();
                        if (due_date <= month) {
                            if (due_date < new Date().getTime()) {
                                //send mail expiry expired

                                opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                        NOTE: This non-conformance expired on ${Dates.formatDate(due_date)}, (${moment(Dates.parse(due_date)).fromNow()})}.
                                    </p>`;
                            } else {
                                //send mail expiry within month

                                opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                        NOTE: This non-conformance expires within one month on ${Dates.formatDate(due_date)}, in (${moment(Dates.parse(due_date)).fromNow()})}.
                                    </p>`;
                            }
                        } else {
                            //send mail expiry more than month

                            opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                    NOTE: This non-conformance expires on ${Dates.formatDate(due_date)}, in (${moment(Dates.parse(expiry_date)).fromNow()})}.
                                </p>`;
                        }
                    } else {
                        //send mail no expiry date set

                        opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                    NOTE: This non-conformance does not have due date.
                                </p>
                                <p style="background: red; color: #fff; font-weight: bold">
                                    You are recommended to add due date on the non-conformance.
                                </p>`;
                    }

                    opts.html += '<p>Kind Regards<br/>SHEQ Aid</p>';

                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)
                }

                if (selected_source_snapshot) {
                    data.selected_source_ref = {id: selected_source_snapshot.id, data: selected_source_snapshot.data()};
                }

                const auditData = {id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                const updateItem = await NCRFuns.mapResults(auditData);
                if (updateItem) {
                    return updateItem.data;
                }
                return updateItem;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update_impl">
        async update_impl(evt, id, updateAttrs, key) {
            return Events.whenLoggedIn(async loggedUser => {
                const {contractor_id} = loggedUser;

                let doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                const old_data = doc_snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                let {
                    user_id,
                    //
                    client, project, site,
                    //
                    type,
                    priority,
                    desc,
                    //
                    due_date,
                    responsible_person,
                    approving_person,
                    //
                    source,
                    selected_source_id,
                } = old_data;

                let {[key]: status_key} = updateAttrs;

                let contractorUsername;
                if (contractor_id) {
                    const contractor_doc_ref = await db2.collection('plugin_sheq_assist_contractors').doc(contractor_id);//Promise < DocumentReference < T > >
                    const contractor_doc_snapshot = await contractor_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    if (!contractor_doc_snapshot.exists) {
                        return 'CONTRACTOR_NOT_EXISTS';
                    }
                    contractorUsername = contractor_doc_snapshot.get('username');
                } else {
                    contractorUsername = null;
                }

                await doc_ref.set(updateAttrs, {merge: true});//Promise < DocumentReference < T > >
                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;
                const data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const ccListByCompany = await NCRFuns.getEmailCCReceipientsByCompany.call(this, {
                    loggedUser, user_id
                });
                let ccListByContractor;
                if (contractor_id) {
                    ccListByContractor = await NCRFuns.getEmailCCReceipientsByContractor.call(this, {
                        contractor_id
                    });
                } else {
                    ccListByContractor = [];
                }

                let responsible_personEmail, approving_personEmail;

                if (!responsible_person || !responsible_person.email) {
                    responsible_personEmail = null;
                } else {
                    responsible_personEmail = responsible_person.email;
                }

                if (!approving_person || !approving_person.email) {
                    approving_personEmail = null;
                } else {
                    approving_personEmail = approving_person.email;
                }

                const emails = [...ccListByCompany, ...ccListByContractor];

                if (contractorUsername) {
                    emails.push(contractorUsername);
                }
                if (responsible_personEmail) {
                    emails.push(responsible_personEmail);
                }
                if (approving_personEmail) {
                    emails.push(approving_personEmail);
                }

                {
                    //send mail no expiry date set
                    let location = "";
                    if (client) {
                        location = client.name || client.data.name;
                    }
                    if (project) {
                        location += " > " + (project.name || project.data.name);
                    }
                    if (site) {
                        location += " > " + (site.name || site.data.name);
                    }
                    if (location.isEmpty()) {
                        location = "N/A";
                    }

                    const get_status_msg_impl = ({key, status_key}) => {
                        if (key === 'status_acceptance') {
                            return status_key === 'Approved' ? 'Approved' : 'Rejected';
                        }
                        if (key === 'status') {
                            return status_key === 'Completed' ? 'Completed' : 'Progressed';
                        }
                    };
                    const get_status_paragraph_impl = ({key, status_key}) => {
                        if (key === 'status_acceptance') {
                            return '<p>Acceptance Status: <b>' + (!status_key ? 'N/A': (status_key === 'Approved' ?
                                'Approved' : 'Rejected')) + '</b></p>';
                        }
                        if (key === 'status') {
                            return '<p>Status: <b>' + (!status_key ? 'N/A': (status_key === 'Completed' ? 'Completed' :
                                'Progressed')) + '</b></p>';
                        }
                    };

                    const opts = {
                        from: '"SHEQ Aid" <support@sheqsolve.com>',
//                            to: emails.join(','),
                        bcc: emails.join(','),
                        subject: 'Non-Conformance ' + get_status_msg_impl({key, status_key}),
                        html: '<p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>\n\
                            <p style="background: red; color: #fff; font-weight: bold">\
                                The following non-conformance has been ' + get_status_msg_impl({key, status_key}) + ':\
                            </p>\n\
                            <p>Location (Company/Project/Site): <b>' + location + '</b></p>\n\
                            <p>ID: <b>' + doc_snapshot.id + '</b></p>\n\
                            <p>Due Date: <b>' + (Dates.formatDate(due_date) || 'N/A') + '</b></p>\n\
                            ' + get_status_paragraph_impl({key, status_key}) + '\n\
                            <p>Source: <b>' + (source || 'N/A') + '</b></p>\n\
                            <p>Type: <b>' + (type || 'N/A') + '</b></p>\n\
                            <p>Priority: <b>' + (priority || 'N/A') + '</b></p>\n\
                            <p>Description: <b>' + (desc || 'N/A') + '</b></p>\n\
                            <p>Responsible Person: <b>' + (responsible_person ? ((responsible_person.fname || responsible_person.data.fname) + ' ' + (responsible_person.lname || responsible_person.data.lname)) : 'N/A') + '</b></p>\n\
                            <p>Approving Person: <b>' + (approving_person ? ((approving_person.fname || approving_person.data.fname) + ' ' + (approving_person.lname || approving_person.data.lname)) : 'N/A') + '</b></p>'
                    };

                    //should create pre-notification
                    if (due_date) {
                        console.log("onCreateNotification ncr update_impl")

                        const month = data.created_at.addMonths(1).getTime();
                        if (due_date <= month) {
                            if (due_date < new Date().getTime()) {
                                //send mail expiry expired

                                opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                        NOTE: This non-conformance expired on ${Dates.formatDate(due_date)}, (${moment(Dates.parse(due_date)).fromNow()})}.
                                    </p>`;
                            } else {
                                //send mail expiry within month

                                opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                        NOTE: This non-conformance expires within one month on ${Dates.formatDate(due_date)}, in (${moment(Dates.parse(due_date)).fromNow()})}.
                                    </p>`;
                            }
                        } else {
                            //send mail expiry more than month

                            opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                    NOTE: This non-conformance expires on ${Dates.formatDate(due_date)}, in (${moment(Dates.parse(expiry_date)).fromNow()})}.
                                </p>`;
                        }
                    } else {
                        //send mail no expiry date set

                        opts.html += `<p style="background: red; color: #fff; font-weight: bold">
                                    NOTE: This non-conformance does not have due date.
                                </p>
                                <p style="background: red; color: #fff; font-weight: bold">
                                    You are recommended to add due date on the non-conformance.
                                </p>`;
                    }

                    opts.html += '<p>Kind Regards<br/>SHEQ Aid</p>';

                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)
                }

                const auditData = {id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                const updateItem = await NCRFuns.mapResults(auditData);
                if (updateItem) {
                    return updateItem.data;
                }
                return updateItem;
            });
        }

        // <editor-fold defaultstate="collapsed" desc="update_approve_or_reject_impl, update_approve, update_reject">
        async update_approve_or_reject_impl(evt, id, updateAttrs) {
            return this.update_impl(evt, id, updateAttrs, 'status_acceptance');
        }

        async update_approve(evt, id) {
            return this.update_approve_or_reject_impl(evt, id, {status_acceptance: 'Approved'});
        }

        async update_reject(evt, id) {
            return this.update_approve_or_reject_impl(evt, id, {status_acceptance: 'Rejected'});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update_status_impl, update_complete, update_progress">
        async update_status_impl(evt, id, updateAttrs) {
            return this.update_impl(evt, id, updateAttrs, 'status');
        }

        async update_complete(evt, id, updateAttrs) {
            return this.update_status_impl(evt, id, {...updateAttrs, status: 'Completed'});
        }

        async update_progress(evt, id, updateAttrs) {
            return this.update_status_impl(evt, id, {...updateAttrs, status: 'Progressed'});
        }
        // </editor-fold>
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},

                    {header: 'Type', key: 'Type', width: 20},
                    {header: 'Priority', key: 'Priority', width: 10},
                    {header: 'Source', key: 'Source', width: 20},

                    {header: 'Finding / NCR Description', key: 'Finding / NCR Description', width: 50},
                    {header: 'Process', key: 'Process', width: 40},

                    {header: 'Responsible Person', key: 'Responsible Person', width: 25},
                    {header: 'Approving Person', key: 'Approving Person', width: 25},

                    {header: 'Document(s) / Media', key: 'Document(s) / Media', width: 30},

                    {header: 'Comments', key: 'Comments', width: 40},
                    {header: 'Remarks', key: 'Remarks', width: 40},

                    {header: 'Outstanding', key: 'Outstanding', width: 40},

                    {header: 'Status', key: 'Status', width: 13},
                    {header: 'Result', key: 'Result', width: 12},

                    {header: 'Due Date', key: 'Due Date', width: 18},
                    {header: 'Progress Date', key: 'Progress Date', width: 18},
                    {header: 'Completed Date', key: 'Completed Date', width: 18},

                    {header: 'Additional Notes', key: 'Additional Notes', width: 40}
                ];

                const rows = list.map(({
                                           id, data: {
                        created_at,
                        client, project, site,
                        //1
                        type, priority,
                        source, selected_source_id, selected_source_ref, selected_source_item,
                        //2
                        desc, process,
                        //3
                        due_date, responsible_person, approving_person,
                        //4
                        document_list,
                        //5
                        comments, remarks,
                        //6
                        status, result, progress_date, completed_date, outstanding, additional_notes
                    }
                                       }) => {

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        "Type": type && type.value || type || '',
                        "Priority": priority && priority.value || priority || '',
                        "Source": source || "",

                        "Finding / NCR Description": desc || "",
                        Process: process || '',

                        "Responsible Person": responsible_person ? (responsible_person.lname + ' ' + responsible_person.fname) : "",
                        "Approving Person": approving_person ? (approving_person.lname + ' ' + approving_person.fname) : "",

                        "Document(s) / Media": "",

                        "Comments": comments || "",
                        "Remarks": remarks || "",

                        "Outstanding": outstanding || "",

                        "Status": status || "",
                        "Result": result || "",

                        "Due Date": Dates.formatDate(due_date) || '',
                        "Progress Date": Dates.formatDate(progress_date) || '',
                        "Completed Date": Dates.formatDate(completed_date) || '',

                        "Additional Notes": additional_notes || ""
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Non-Conformance-Docs", "Non-Conformances-Active", "Non-Conformance Data", cols, rows);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    return q;
                });
                list = await Promise.all(list.map(NCRFuns.mapResults));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    user: {data: {client: my_client, project: my_project, site: my_site}},

                } = loggedUser;
                let {
                    expiry_date,
                    //
                    client_id,
                    project_id,
                    site_id,
                    isNew,
                    responsible_person_id,
                    approving_person_id,
                    type,
                    priority,
                    source,
                    status,
                    result,
                    due_date_range,
                    progress_date_range,
                    completed_date_range
                } = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1}, q => {
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
                    //
                    if (responsible_person_id) {
                        q = q.where('responsible_person.id', '==', responsible_person_id);
                    }
                    if (approving_person_id) {
                        q = q.where('approving_person.id', '==', approving_person_id);
                    }
                    //
                    if (type) {
                        q = q.where('type', '==', type);
                    }
                    if (priority) {
                        q = q.where('priority', '==', priority);
                    }
                    if (source) {
                        q = q.where('source', '==', source);
                    }
                    //
                    if (status) {
                        q = q.where('status', '==', status);
                    }
                    if (result) {
                        q = q.where('result', '==', result);
                    }
                    //
                    if (due_date_range) {
                        const {start, end} = due_date_range;
                        if (start) {
                            q = q.where(`due_date`, '>=', start);
                        }
                        if (end) {
                            q = q.where(`due_date`, '<=', end);
                        }
                        q = q.orderBy(`due_date`, "asc");
                    } else {
                        if (expiry_date === null || expiry_date === 'null') {
                            q = q.where(`due_date`, '==', null);
                        } else if (expiry_date) {
                            let d = new Date().toDayEndDate();
                            if (expiry_date === -1) {
                                q = q.where(`due_date`, '<=', d.getTime());
                            } else if (expiry_date === 1) {
                                expiry_date = d.addMonths(1).addDays(-1).getTime();
                                q = q.where(`due_date`, '>', d.getTime());
                                q = q.where(`due_date`, '<=', expiry_date);
                            } else if (expiry_date === 2) {
                                expiry_date = d.addMonths(2).getTime();
                                q = q.where(`due_date`, '>', d.addMonths(1).addDays(-1).getTime());
                                q = q.where(`due_date`, '<=', expiry_date);
                            } else if (expiry_date === 3) {
                                expiry_date = d.addMonths(3).getTime();
                                q = q.where(`due_date`, '>', d.addMonths(2).getTime());
                                q = q.where(`due_date`, '<=', expiry_date);
                            } else if (expiry_date === 4) {
                                q = q.where(`due_date`, '>', d.addMonths(3).getTime());
                            }

                            q = q.orderBy(`due_date`, "asc");
                        }
                    }
                    if (progress_date_range) {
                        const {start, end} = progress_date_range;
                        if (start) {
                            q = q.where(`progress_date`, '>=', start);
                        }
                        if (end) {
                            q = q.where(`progress_date`, '<=', end);
                        }
                        q = q.orderBy(`progress_date`, "asc");
                    }
                    if (completed_date_range) {
                        const {start, end} = completed_date_range;
                        if (start) {
                            q = q.where(`completed_date`, '>=', start);
                        }
                        if (end) {
                            q = q.where(`completed_date`, '<=', end);
                        }
                        q = q.orderBy(`completed_date`, "asc");
                    }
                    return q;
                });
                list = await Promise.all(list.map(NCRFuns.mapResults));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                let {
                    expiry_date,
                    //
                    responsible_person,
                    approving_person,
                    type,
                    priority,
                    source,
                    status,
                    result,
                    due_date_range,
                    progress_date_range,
                    completed_date_range
                } = filterData;

//                const {} = extraFilterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    //
                    if (responsible_person) {
                        q = q.where('responsible_person.id', '==', responsible_person.id);
                    }
                    if (approving_person) {
                        q = q.where('approving_person.id', '==', approving_person.id);
                    }
                    //
                    if (type) {
                        q = q.where('type', '==', type);
                    }
                    if (priority) {
                        q = q.where('priority', '==', priority);
                    }
                    if (source) {
                        q = q.where('source', '==', source);
                    }
                    //
                    if (status) {
                        q = q.where('status', '==', status);
                    }
                    if (result) {
                        q = q.where('result', '==', result);
                    }
                    //
                    if (due_date_range) {
                        const {start, end} = due_date_range;
                        if (start) {
                            q = q.where(`due_date`, '>=', start);
                        }
                        if (end) {
                            q = q.where(`due_date`, '<=', end);
                        }
                        q = q.orderBy(`due_date`, "asc");
                    } else {
                        if (expiry_date === null || expiry_date === 'null') {
                            q = q.where(`due_date`, '==', null);
                        } else if (expiry_date) {
                            let d = new Date().toDayEndDate();
                            if (expiry_date === -1) {
                                q = q.where(`due_date`, '<=', d.getTime());
                            } else if (expiry_date === 1) {
                                expiry_date = d.addMonths(1).addDays(-1).getTime();
                                q = q.where(`due_date`, '>', d.getTime());
                                q = q.where(`due_date`, '<=', expiry_date);
                            } else if (expiry_date === 2) {
                                expiry_date = d.addMonths(2).getTime();
                                q = q.where(`due_date`, '>', d.addMonths(1).addDays(-1).getTime());
                                q = q.where(`due_date`, '<=', expiry_date);
                            } else if (expiry_date === 3) {
                                expiry_date = d.addMonths(3).getTime();
                                q = q.where(`due_date`, '>', d.addMonths(2).getTime());
                                q = q.where(`due_date`, '<=', expiry_date);
                            } else if (expiry_date === 4) {
                                q = q.where(`due_date`, '>', d.addMonths(3).getTime());
                            }

                            q = q.orderBy(`due_date`, "asc");
                        }
                    }

                    if (progress_date_range) {
                        const {start, end} = progress_date_range;
                        if (start) {
                            q = q.where(`progress_date`, '>=', start);
                        }
                        if (end) {
                            q = q.where(`progress_date`, '<=', end);
                        }
                        q = q.orderBy(`progress_date`, "asc");
                    }
                    if (completed_date_range) {
                        const {start, end} = completed_date_range;
                        if (start) {
                            q = q.where(`completed_date`, '>=', start);
                        }
                        if (end) {
                            q = q.where(`completed_date`, '<=', end);
                        }
                        q = q.orderBy(`completed_date`, "asc");
                    }
                    return q;
                });
                list = await Promise.all(list.map(NCRFuns.mapResults));
                return list;
            });
        }

        // </editor-fold>

        sortBy() {
            return "created_at";
        }
    }

    new Controller(events, db);
})();