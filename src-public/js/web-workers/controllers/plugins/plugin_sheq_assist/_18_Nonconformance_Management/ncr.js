
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
                        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
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
                                    NOTE: This non-conformance expires on ${Dates.formatDate(due_date)}, in (${moment(Dates.parse(due_date)).fromNow()})}.
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

                    await Utils.sendEmail(opts);
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
                    {header: 'Allocation', key: 'Allocation', width: 10},
                    {header: 'Source', key: 'Source', width: 20},

                    {header: 'Finding / NCR Description', key: 'Finding / NCR Description', width: 50},
                    {header: 'Process', key: 'Process', width: 40},

                    {header: 'Responsible Party', key: 'Responsible Party', width: 25},
                    {header: 'Assigned To', key: 'Assigned To', width: 25},
                    {header: 'Approving Person', key: 'Approving Person', width: 25},

                    {header: 'Document(s) / Photo(s)', key: 'Document(s) / Photo(s)', width: 30},
                    {header: 'Document(s) (Proof of Correction)', key: 'Document(s) (Proof of Correction)', width: 30},

                    {header: 'Comments', key: 'Comments', width: 40},
                    {header: 'Remarks', key: 'Remarks', width: 40},

                    {header: 'Outstanding', key: 'Outstanding', width: 40},

                    {header: 'Acceptance Status', key: 'Acceptance Status', width: 13},
                    {header: 'Progress Status', key: 'Progress Status', width: 13},
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
                        type, priority, allocation,
                        source, selected_source_id, selected_source_ref, selected_source_item,
                        //2
                        desc, process,
                        //3
                        due_date,
                        responsible_party_list,
                        assigned_job_position_list,
                        assigned_person_list,
                        approving_person,
                        //4
                        document_list, document_proof_list,
                        //5
                        comments, remarks,
                        //6
                        status_acceptance, status_progress, result, progress_date, completed_date, outstanding, additional_notes
                    }
                                       }) => {

                    const assigned_to_list = [
                        ...(assigned_job_position_list ? assigned_job_position_list.map(({job_position: {name}}) => name) : []),
                        ...(assigned_person_list ? assigned_person_list.map(({employee: {full_name}}) => full_name) : []),
                    ];

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        "Type": type || '',
                        "Priority": priority || '',
                        "Allocation": allocation || '',
                        "Source": source || "",

                        "Finding / NCR Description": desc || "",
                        Process: process || '',

                        "Responsible Party": responsible_party_list ? responsible_party_list.map(({value}) => value).join(', ') : "",
                        "Assigned To": assigned_to_list ? assigned_to_list.join(', ') : "",
                        "Approving Person": approving_person ? (approving_person.full_name) : "",

                        "Document(s) / Photo(s)": "",
                        "Document(s) (Proof of Correction)": "",

                        "Comments": comments || "",
                        "Remarks": remarks || "",

                        "Outstanding": outstanding || "",

                        "Acceptance Status": status_acceptance || "",
                        "Progress Status": status_progress || "",
                        "Result": result || "",

                        "Due Date": (due_date && Dates.formatDate(due_date)) || '',
                        "Progress Date": (progress_date && Dates.formatDate(progress_date)) || '',
                        "Completed Date": (completed_date && Dates.formatDate(completed_date)) || '',

                        "Additional Notes": additional_notes || ""
                    };

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Non-Conformance-Docs", "Non-Conformances-Active", "Non-Conformance Data", cols, rows);
            });
        }

        // </editor-fold>

    }

    new Controller(events, db);
})();