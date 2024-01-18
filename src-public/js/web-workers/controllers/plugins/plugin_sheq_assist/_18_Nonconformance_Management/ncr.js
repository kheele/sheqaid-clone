
(() => {
    class Controller extends AControllerAid {
        //date, type, auditor, company, representative, scope, definition_list, list
        //<editor-fold desc="constructor">
        constructor(events) {
            super(events, {
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
        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, {
            client: _client, project: _project, site: _site,
            list,
        }) {
            return Events.whenLoggedIn(async loggedUser => {
                if (isArray(list)) {
                    const rows = list.map((item, idx) => {
                        let {
                            id,
                            data: {
                                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                                company, client, project, site,
                                //1 done
                                type,
                                priority,
                                allocation,
                                desc, process,
                                due_date,
                                responsible_party_list,
                                assigned_job_position_list,
                                assigned_person_list,
                                approving_person,
                                document_list,
                                document_proof_list,
                                comments, remarks,
                                progress_list,
                                status_acceptance,
                                status_progress,
                                result,
                                completed_date,
                                additional_notes,
                            }
                        } = item;
                        
                        client = client || company;
                        
                        return {
                            idx: idx + 1,
                            
                            project: project && project.name,
                            site: site && site.name,
                            
                            id,
                            type,
                            priority,
                            allocation,
                            desc, process,
                            due_date: Dates.formatDateSQL(due_date),
                            responsible_party_list: (responsible_party_list || []).map(({value}) => value).join(', '),
                            assigned_job_position_list:  (assigned_job_position_list || []).map(({job_position}) => job_position.name).join(', '),
                            assigned_person_list:  (assigned_person_list || []).map(({employee}) => (employee.full_name)).join(','),
                            approving_person,
                            document_list:  (document_list || []).map(({doc}) => doc.dlUrls[0]).join(', '),
                            document_proof_list :  (document_proof_list || []).map(({doc}) => doc.dlUrls[0]).join(', '),
                            comments,
                            remarks,
                            progress_list:  (progress_list || []).map(({date}) => Dates.formatDateSQL(date)).join(', '),
                            status_acceptance,
                            status_progress,
                            result,
                            completed_date:Dates.formatDateSQL(completed_date),
                            additional_notes,
                            status,
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/ncr/Template-List-NCR.xlsx`.replace('//', '/')
                    );
                    const arrayBuffer = await response.arrayBuffer();
                    const data = new Map();
                    
                    data.set('date', new Date().formatDate());
                    
                    data.set('company', _client ? _client.name || _client.data.name : "ANY");
                    data.set('project', _project ? _project.name || _project.data.name : "ANY");
                    data.set('site', _site ? _site.name || _site.data.name : "ANY");
                    
                    data.set("rows", rows);
                    return await Events.emit("excelTemplate", {arrayBuffer, data});
                    // return await this.export_excel_impl(loggedUser, "Training-Toolbox-Talks-Docs", "Attendance-Register", "Attendance-Register List", cols, rows);
                }
                return list;
            });
        }
        
        // </editor-fold>

        // </editor-fold>

    }

    new Controller(events);
})();
