//importScripts(self.locationRoot + "/js/web-workers/controllers/plugins/plugin_sheq_assist/_17_Incident_Investigation/stats.js");
//import * as stats from './stats';

(() => {
    class Controller extends AControllerAssist {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        /*type, 
         incident, incident_type, incident_whats_involved, 
         injury_type, health_or_diseases, indicate, 
         witness, person_injured, person_injured_contact_num, 
         incident_date, incident_time, report_date, report_time,
         human_cause, natural_cause, occupational_stressor_classification,
         desc, who_or_what_caused, whats_damaged, 
         suggested_preemptive_action, suggested_preemptive_action_options,
         affected_person_name, form_completed_by, reported_to, 
         supervior_or_manager*/
        constructor(events, db) {
            super(events, db, {singular: "Incident Investigation", plural: "Incident Investigations"}, "plugin_sheq_assist/17_Incident_Investigation/", "plugin_sheq_assist_17_Incident_Investigation");

            this.search_by_name = this.search_by_name.bind(this);
            this.filter = this.filter.bind(this);
            this.stats = this.stats.bind(this);
            const {addAction, search_by_name, filter, stats} = this;

            addAction("classification", this.classification.bind(this));
            addAction("investigation", this.investigation.bind(this));
            addAction("corrective-actions", this.corrective_actions.bind(this));
            addAction("add-status", this.addStatus.bind(this));
            addAction("remove-status", this.removeStatus.bind(this));
            addAction("list/search_by_name", search_by_name);
            addAction("list/filter", filter);
            addAction("stats", stats);

            addAction("select/filter", this.filter_select.bind(this));

            const fn = async () => {
                const doc_ref = await this.getDB().collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });

                await Promise.all(list.map(async (doc) => {
                    const doc_ref = await this.getDB().collection(this.tbl).doc(doc.id);
                    let snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                    const old_data = snapshot.data();
                    if (old_data.sec9_data) {
                        const {
                            sec9_data,
                            sec9_data: {
                                incident_date: incident_date_old,
                                incident_time: incident_time_old,
                                incident_date_split: incident_date_split_old
                            }
                        } = old_data;
                        sec9_data.incident_date_split = incident_date_split_old || {};

                        const {incident_date, incident_time} = sec9_data;
                        if (incident_date) {
                            const __incident_date = Dates.parse(incident_date);
//                            console.log('incident_date', incident_date, __incident_date)
                            sec9_data.incident_date_split.year = __incident_date.getFullYear();
                            sec9_data.incident_date_split.month = __incident_date.getMonth();
                            sec9_data.incident_date_split.date = __incident_date.getDate();
                            sec9_data.incident_date_split.day = __incident_date.getDay();
                        }
                        if (incident_time) {
                            const hours = parseInt(incident_time.split(":")[0]);
                            sec9_data.incident_date_split.am_pm = (hours >= 12) ? "PM" : "AM";
                        }
                    }

                    const updated = await doc_ref.set(old_data, {merge: true});//Promise < void >

                    console.log('incidents dates done', doc.id);
                }));
                console.log('incidents dates final');
            };

//            fn().catch(err => {
//                console.error('incidents dates error', err)
//            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                if (!data.status) {
                    data.status = [];
                }

                const {sec9_data} = data;
                if (sec9_data) {
                    const {incident_date, incident_time} = sec9_data;
                    const __incident_date = Dates.parse(incident_date);
                    const hours = incident_time ? parseInt(incident_time.split(":")[0]) : null;
                    sec9_data.incident_date_split = {
                        year: __incident_date.getFullYear(),
                        month: __incident_date.getMonth(),
                        date: __incident_date.getDate(),
                        day: __incident_date.getDay(),
                        am_pm: hours ? ((hours >= 12) ? "PM" : "AM") : null
                    };
                }
                const savedData = await AControllerAssist.prototype.create.call(this, evt, data);
                if (savedData) {
                    const updateAttrs = {};
                    if (data.sec10_data && data.sec10_data.document_list) {
                        const document_list = await Promise.all(data.sec10_data.document_list.map(async (file, n) => {
                            const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                                const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                                const new_name = this.tbl + '/' + savedData.id + '/sec10_data/document_list/' + n + '/' + name;
                                return new_name;
                            }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                                throw e;
                            });
                            return gcsUri;
                        }));
                        updateAttrs.sec10_data = {document_list};
                    }
                    if (data.sec13_data && data.sec13_data.third_party_document_list) {
                        const third_party_document_list = await Promise.all(data.sec13_data.third_party_document_list.map(async (file, n) => {
                            const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                                const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                                const new_name = this.tbl + '/' + savedData.id + '/sec13_data/third_party_document_list/' + n + '/' + name;
                                return new_name;
                            }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                                throw e;
                            });
                            return gcsUri;
                        }));
                        updateAttrs.sec13_data = {third_party_document_list};
                    }

                    if (!Object.keys(updateAttrs).isEmpty()) {
                        await this.update(evt, savedData.id, updateAttrs);
                        if (updateAttrs.sec10_data && updateAttrs.sec10_data.document_list) {
                            savedData.data.sec10_data.document_list = updateAttrs.sec10_data.document_list;
                        }
                        if (updateAttrs.sec13_data && updateAttrs.sec13_data.third_party_document_list) {
                            savedData.data.sec13_data.third_party_document_list = updateAttrs.sec13_data.third_party_document_list;
                        }
                    }

                    const {contractor_id: logged_contractor_id} = loggedUser;
                    if (logged_contractor_id) {
                        const users_ctrl = await Events.get('users/');
                        const employees_ctrl = await Events.get('plugin_sheq_assist/employees/');
                        const user_list = await users_ctrl.filter_by_notification_key.call(users_ctrl, null, this.notification_key, true);
                        const employee_list = await employees_ctrl.filter_by_notification_key.call(employees_ctrl, null, this.notification_key, true);

                        const emails = [
                            ...user_list.map(val => val.data.username),
                            ...employee_list.filter(val => val.data.email).map(val => val.data.email)
                        ];

                        let {
                            data: {
                                classification = {}, 
                                sec1_data = {}, sec3_data = {}, sec6_data = {}, sec9_data = {}, sec14_data = {},
                                client, project, site
                            }
                        } = savedData;
                        sec1_data = classification.sec1_data || sec1_data;
                        sec3_data = classification.sec3_data || sec3_data;
                        const {category_list = []} = sec1_data;
                        const {type = "N/A"} = sec3_data;
                        const {person_reporting} = sec6_data;
                        const {incident_date, incident_time = "N/A", exact_location = "N/A"} = sec9_data;
                        const {consequence = null, likelihood = null} = sec14_data;
                        let rating;
                        if (isNumber(consequence) && isNumber(likelihood)) {
                            const score = likelihood * consequence;
                            if (score > 15) {
                                rating = "Extreme";
                            } else if (score >= 9 && score <= 15) {
                                rating = "High";
                            } else if (score >= 5 && score <= 8) {
                                rating = "Moderate";
                            } else if (score < 5) {
                                rating = "Low";
                            }
                        } else {
                            rating = 'N/A';
                        }

                        let location = "";
                        if(client) {
                            location = client.name || client.data.name;
                        }
                        if(project) {
                            location += " > " + (project.name || project.data.name);
                        }
                        if(site) {
                            location += " > " + (site.name || site.data.name);
                        }
                        if(location.isEmpty()) {
                            location = "N/A";
                        }
                        const opts = {
                            from: '"SHEQ Assist" <support@sheqsolve.com>',
                            to: emails.join(','),
                            subject: 'New Incident Recorded',
                            html: '<p>This is an automated email from SHEQ Assist.<br />Please do not reply to this email.</p>\n\
                            <p>The following incident has been reported:</p>\n\
                            <p>Location (Company/Project/Site): <b>' + location + '</b></p>\n\
                            <p>ID: <b>' + savedData.id + '</b></p>\n\
                            <p>Incident Exact Location: <b>' + exact_location + '</b></p>\n\
                            <p>Incident Type: <b>' + type + '</b></p>\n\
                            <p>Incident Category: <b>' + (!category_list.isEmpty() ? category_list.map(v => isString(v) ? v : v.value) : 'N/A') + '</b></p>\n\
                            <p>Date Of Incident: <b>' + (Dates.formatDate(incident_date) || 'N/A') + '</b></p>\n\
                            <p>Time Of Incident: <b>' + incident_time + '</b></p>\n\
                            <p>Incident Severity: <b>' + rating + '</b></p>\n\
                            <p>Reported By: <b>' + (person_reporting ? ((person_reporting.fname || person_reporting.data.fname) + ' ' + (person_reporting.lname || person_reporting.data.lname)) : 'N/A') + '</b></p>\n\
                            <p>Kind Regards<br/>SHEQ Assist</p>'
                        };

                        console.log('callables-sendEmail', opts)
                        const sendEmail = functions.httpsCallable('callables-sendEmail');
                        const mailRes = await sendEmail(opts);
                        console.log('mailRes', mailRes)
                    }
                }
                return savedData;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, data) {
            const {sec9_data} = data;
            if (sec9_data && (sec9_data.incident_date || sec9_data.incident_time)) {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                const {
                    incident_date: incident_date_old,
                    incident_time: incident_time_old,
                    incident_date_split: incident_date_split_old
                } = old_data;

                sec9_data.incident_date_split = incident_date_split_old || {};

                const {incident_date, incident_time} = sec9_data;
                if (incident_date) {
                    const __incident_date = Dates.parse(incident_date);
                    sec9_data.incident_date_split.year = __incident_date.getFullYear();
                    sec9_data.incident_date_split.month = __incident_date.getMonth();
                    sec9_data.incident_date_split.date = __incident_date.getDate();
                    sec9_data.incident_date_split.day = __incident_date.getDay();
                }
                if (incident_time) {
                    const hours = parseInt(incident_time.split(":")[0]);
                    sec9_data.incident_date_split.am_pm = (hours >= 12) ? "PM" : "AM";
                }
            }
            return await AControllerAssist.prototype.update.call(this, evt, id, data);
//            return this.updateAndUploadIfManyFiles(evt, id, data, ["document_list", "third_party_document_list"]);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="classification">
        async classification(evt, id, data) {
            return this.update(evt, id, data);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="investigation">
        async investigation(evt, id, data) {
            return this.update(evt, id, data);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="corrective_actions">
        async corrective_actions(evt, id, data) {
            return this.update(evt, id, data);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="updateStatus">
        async updateStatus(evt, id, status, action) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                const updated = await doc_ref.update({status: this.getDB().FieldValue["array" + action](status)});//Promise < void >

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                console.log('update', updated)
                return !!updated;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="addStatus">
        async addStatus(evt, id, status) {
            return this.updateStatus(evt, id, status, "Union");
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="removeStatus">
        async removeStatus(evt, id, status) {
            return this.updateStatus(evt, id, status, "Remove");
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {sec10_data, sec13_data}}) => {
                if (sec10_data && sec10_data.document_list) {
                    await Promise.all(sec10_data.document_list.map(async v => {
                        return await files.remove(v.path);
                    }));
                }
                if (sec13_data && sec13_data.third_party_document_list) {
                    await Promise.all(sec13_data.third_party_document_list.map(async v => {
                        return await files.remove(v.path);
                    }));
            }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'Company', key: 'Company', width: 25},
                    {header: 'Project', key: 'Project', width: 25},
                    {header: 'Site', key: 'Site', width: 25},

                    {header: 'Incident Category', key: 'Incident Category', width: 35},
                    {header: 'Short Description', key: 'Short Description', width: 35},

                    {header: 'Incident Type', key: 'Incident Type', width: 25},

                    {header: 'Person(s) Involved', key: 'Person(s) Involved', width: 35},

                    {header: 'Person Reporting', key: 'Person Reporting', width: 25},

                    {header: 'Reported To', key: 'Reported To', width: 25},

                    {header: 'Witnesses', key: 'Witnesses', width: 35},

                    {header: 'Date Incident Occurred', key: 'Date Incident Occurred', width: 25},
                    {header: 'Time Incident Occurred', key: 'Time Incident Occurred', width: 25},
                    {header: 'Incident Location', key: 'Incident Location', width: 25},

                    {header: 'Incident Description', key: 'Incident Description', width: 35},
                    {header: 'Documents/Files', key: 'Documents/Files', width: 35},

                    {header: 'Person Injured', key: 'Person Injured', width: 25},
                    {header: 'Person Injured Date Of Birth', key: 'Person Injured Date Of Birth', width: 35},
                    {header: 'Person Injured Gender', key: 'Person Injured Gender', width: 25},
                    {header: 'Nature Of Injury', key: 'Nature Of Injury', width: 30},
                    {header: 'Part(s) Of Body Injured', key: 'Part(s) Of Body Injured', width: 30},
                    {header: 'Direct Cause Of Injury', key: 'Direct Cause Of Injury', width: 30},
                    {header: 'Injury Description', key: 'Injury Description', width: 35},

                    {header: 'Was Testing Undertaken?', key: 'Was Testing Undertaken?', width: 35},
                    {header: 'Type Of Test(s) Undertaken', key: 'Type Of Test(s) Undertaken', width: 35},
                    {header: 'Drug Test Result', key: 'Drug Test Result', width: 35},
                    {header: 'Alcohol Test Result', key: 'Alcohol Test Result', width: 35},
                    {header: 'Was a Mobile Device being used?', key: 'Was a Mobile Device being used?', width: 35},

                    {header: 'A Motor Vehicle Incident?', key: 'A Motor Vehicle Incident?', width: 35},
                    {header: 'Driver Details', key: 'Driver Details', width: 35},
                    {header: 'Driver Date Of Birth', key: 'Driver Date Of Birth', width: 35},
                    {header: 'Driver Gender', key: 'Driver Gender', width: 35},
                    {header: 'Driver Address', key: 'Driver Address', width: 35},
                    {header: 'Driver Email Address', key: 'Driver Email Address', width: 35},
                    {header: 'Driver Phone No.', key: 'Driver Phone No.', width: 35},
                    {header: 'Driver Licence No.', key: 'Driver Licence No.', width: 35},
                    {header: 'Driver Licence Expiry Date', key: 'Driver Licence Expiry Date', width: 35},
                    {header: 'Driver Licence Years Held', key: 'Driver Licence Years Held', width: 35},

                    {header: 'Vehicle/Trailer Make', key: 'Vehicle/Trailer Make', width: 35},
                    {header: 'Vehicle/Trailer Model', key: 'Vehicle/Trailer Model', width: 35},
                    {header: 'Vehicle/Trailer Year', key: 'Vehicle/Trailer Year', width: 35},
                    {header: 'Vehicle/Trailer Color', key: 'Vehicle/Trailer Color', width: 35},
                    {header: 'Vehicle/Trailer Registration No.', key: 'Vehicle/Trailer Registration No.', width: 35},
                    {header: 'Vehicle/Trailer Fleet No.', key: 'Vehicle/Trailer Fleet No.', width: 35},
                    {header: 'Vehicle/Trailer Registration Date', key: 'Vehicle/Trailer Registration Date', width: 35},
                    {header: 'Vehicle/Trailer Trip Type', key: 'Vehicle/Trailer Trip Type', width: 35},
                    {header: 'Vehicle/Trailer Load Type', key: 'Vehicle/Trailer Load Type', width: 35},

                    {header: 'Was A Third Party Involved?', key: 'Was A Third Party Involved?', width: 35},
                    {header: 'Third Party Details Available?', key: 'Third Party Details Available?', width: 35},
                    {header: 'Third Party First Name', key: 'Third Party First Name', width: 35},
                    {header: 'Third Party Last Name', key: 'Third Party Last Name', width: 35},
                    {header: 'Third Party Address', key: 'Third Party Address', width: 35},
                    {header: 'Third Party Email Address', key: 'Third Party Email Address', width: 35},
                    {header: 'Third Party Phone No.', key: 'Third Party Phone No.', width: 35},

                    {header: 'Did A Driver Admit Liability To Any Person(s)?', key: 'Did A Driver Admit Liability To Any Person(s)?', width: 35},
                    {header: 'Did Someone Else Admit Liability?', key: 'Did Someone Else Admit Liability?', width: 35},
                    {header: 'Someone Else Who Admitted Liability Name', key: 'Someone Else Who Admitted Liability Name', width: 35},
                    {header: 'Who Was Liability Admitted To?', key: 'Who Was Liability Admitted To?', width: 35},
                    {header: 'In The 3rd Party Opinion, Who Was Responsible For The Collision And Why?', key: 'In The 3rd Party Opinion, Who Was Responsible For The Collision And Why?', width: 35},
                    {header: '3rd Party Documents/Files', key: '3rd Party Documents/Files', width: 35},

                    {header: 'Has Infringement Been Issued?', key: 'Has Infringement Been Issued?', width: 35},
                    {header: 'Infringement Penalty Notice No.', key: 'Infringement Penalty Notice No.', width: 35},
                    {header: 'Infringement Issuing Authority', key: 'Infringement Issuing Authority', width: 35},
                    {header: 'Infringement Issuing Officer', key: 'Infringement Issuing Officer', width: 35},
                    {header: 'Infringement Type Of Breach', key: 'Infringement Type Of Breach', width: 35},

                    {header: 'Infringement Issued To', key: 'Infringement Issued To', width: 35},
                    {header: 'Infringement Name / Entity', key: 'Infringement Name / Entity', width: 35},
                    {header: 'Infringement Amount', key: 'Infringement Amount', width: 35},
                    {header: 'Infringement Due Date', key: 'Infringement Due Date', width: 35},

                    {header: 'Did Police Attend Scene?', key: 'Did Police Attend Scene?', width: 35},
                    {header: 'Ref/Report No.', key: 'Ref/Report No.', width: 35},
                    {header: 'Police Officer Taking Collision Details', key: 'Police Officer Taking Collision Details', width: 35},
                    {header: 'Police Officer Station Taking Collision Details', key: 'Police Officer Station Taking Collision Details', width: 35},

                    {header: 'Collision Reported To Police Station?', key: 'Collision Reported To Police Station?', width: 35},
                    {header: 'Have Charges Been Laid?', key: 'Have Charges Been Laid?', width: 35},
                    {header: 'Nature Of Charges', key: 'Nature Of Charges', width: 35},
                    {header: 'Who Laid Charges?', key: 'Who Laid Charges?', width: 35},
                    {header: 'Who Were Charges Laid Against?', key: 'Who Were Charges Laid Against?', width: 35},

                    {header: 'Consequence / Severity', key: 'Consequence / Severity', width: 20},
                    {header: 'Frequency / Exposure', key: 'Frequency / Exposure', width: 20},
                    {header: 'Risk Rating', key: 'Risk Rating', width: 35},

                    {header: 'Distribution List', key: 'Distribution List', width: 35},

                    {header: 'Weather Conditions', key: 'Weather Conditions', width: 35},
                    {header: 'Protective Equipment Worn', key: 'Protective Equipment Worn', width: 35},
                    {header: 'Class', key: 'Class', width: 35},
                    {header: 'Environment', key: 'Environment', width: 35},

                    {header: 'Estimated Costs (Damages)', key: 'Estimated Costs (Damages)', width: 35},
                    {header: 'Estimated Costs (Medical)', key: 'Estimated Costs (Medical)', width: 35},
                    {header: 'Estimated Costs (Salaries / Wages)', key: 'Estimated Costs (Salaries / Wages)', width: 35},
                    {header: 'Estimated Costs (Investigations)', key: 'Estimated Costs (Investigations)', width: 35},
                    {header: 'Estimated Costs (Others)', key: 'Estimated Costs (Others)', width: 35},
                    {header: 'Estimated Costs (Total)', key: 'Estimated Costs (Total)', width: 35}
                ];

                console.log('print', list)

                const rows = list.map(({id, data: {
                created_at, status,
                        client, project, site,
                        classification,
                        investigation,
                        sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data,
                        sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data
                }}) => {
                    if (classification) {
                        sec1_data = classification.sec1_data || sec1_data;
                        sec2_data = classification.sec2_data || sec2_data;
                        sec3_data = classification.sec3_data || sec3_data;
                        sec4_data = classification.sec4_data || sec4_data;
                    }

                    let investigation_team_list = null;
                    let investigation_due_date = null;
                    if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
                        investigation_team_list = [...investigation.sec1_data.investigation_team_list, null];
                    } else if (classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
                        investigation_team_list = [...classification.sec5_data.investigation_team_list, null];
                    }
                    if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_due_date) {
                        investigation_due_date = investigation.sec1_data.investigation_due_date;
                    } else if (classification && classification.sec5_data && classification.sec5_data.investigation_due_date) {
                        investigation_due_date = classification.sec5_data.investigation_due_date;
                    }

                    const investigation_details = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_details : null;
                    const investigation_findings_list = (investigation && investigation.sec2_data && investigation.sec2_data.investigation_findings_list) ?
                            [...investigation.sec2_data.investigation_findings_list, null] : [null];
                    const investigation_findings_further_desc = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_findings_further_desc : null;
                    const document_list = (investigation && investigation.sec2_data && investigation.sec2_data.document_list) ?
                            investigation.sec2_data.document_list : null;

                    let risk_rating = null;
                    let consequence = null;
                    let likelihood = null;
                    if (investigation && investigation.sec3_data && investigation.sec3_data.risk_rating) {
                        risk_rating = investigation.sec3_data.risk_rating;
                    } else if (sec14_data && sec14_data.risk_rating) {
                        risk_rating = sec14_data.risk_rating;
                    }
                    if (investigation && investigation.sec3_data && investigation.sec3_data.consequence) {
                        consequence = investigation.sec3_data.consequence;
                    } else if (sec14_data && sec14_data.consequence) {
                        consequence = sec14_data.consequence;
                    }
                    if (investigation && investigation.sec3_data && investigation.sec3_data.likelihood) {
                        likelihood = investigation.sec3_data.likelihood;
                    } else if (sec14_data && sec14_data.likelihood) {
                        likelihood = sec14_data.likelihood;
                    }

                    let cause_analysis = null;
                    if (investigation && investigation.sec4_data && investigation.sec4_data.cause_analysis) {
                        cause_analysis = investigation.sec4_data.cause_analysis;
                    }

                    let corrective_actions = null;
                    if (investigation && investigation.sec5_data && investigation.sec5_data.corrective_actions) {
                        corrective_actions = investigation.sec5_data.corrective_actions;
                    }

                    let distribution_list = null;
                    if (investigation && investigation.sec6_data && investigation.sec6_data.distribution_list) {
                        distribution_list = [...investigation.sec6_data.distribution_list];
                    } else if (sec15_data && sec15_data.distribution_list) {
                        distribution_list = [...sec15_data.distribution_list];
                    }

                    let {
                        //7
                        weather_condition_list,
                        //8
                        protective_equipment_worn_list,
                        //9
                        class_list,
                        //10
                        environment_list,
                        //11
                        estimated_costs_damages = 0,
                        estimated_costs_medical = 0,
                        estimated_costs_salaries_wages = 0,
                        estimated_costs_investigations = 0,
                        estimated_costs_others = 0
                    } = investigation || {};

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : "")
                    };

                    const mapPersonDetails = (item) => {
                        let {id, lname, fname, email, data} = item;
                        if (data) {
                            lname = data.lname;
                            fname = data.fname;
                            email = data.email;
                        }
                        return lname + " " + fname + (email ? " (" + email + ")" : "");
                    };

                    const onePersonDetails = (details) => {
                        const {id, lname, fname, email} = details;
                        return lname + " " + fname + (email ? " (" + email + ")" : "");
                    };

                    if (sec1_data) {
                        const {
                            category_list, short_desc
                        } = sec1_data;
                        if (category_list) {
                            res["Incident Category"] = category_list.map(v => isString(v) ? v : v.value).join(', ');
                        }
                        if (short_desc) {
                            res["Short Description"] = short_desc;
                        }
                    }

                    if (sec3_data) {
                        const {
                            type
                        } = sec3_data;
                        if (type) {
                            res["Incident Type"] = type;
                        }
                    }

                    if (sec5_data) {
                        const {
                            person_involved_list
                        } = sec5_data;
                        if (person_involved_list) {
                            res["Person(s) Involved"] = person_involved_list.map(mapPersonDetails).join(', ');
                        }
                    }

                    if (sec6_data) {
                        const {
                            person_reporting
                        } = sec6_data;
                        if (person_reporting) {
                            res["Person Reporting"] = onePersonDetails(person_reporting);
                        }
                    }

                    if (sec7_data) {
                        const {
                            person_reported_to
                        } = sec7_data;
                        if (person_reported_to) {
                            res["Reported To"] = onePersonDetails(person_reported_to);
                        }
                    }

                    if (sec8_data) {
                        const {
                            witness_list
                        } = sec8_data;
                        if (witness_list) {
                            res["Witnesses"] = witness_list.map(mapPersonDetails).join(', ');
                        }
                    }

                    if (sec9_data) {
                        const {
                            incident_date, incident_time, exact_location
                        } = sec9_data;
                        if (incident_date) {
                            res["Date Incident Occurred"] = Dates.parse(incident_date);
                        }
                        if (incident_time) {
                            res["Time Incident Occurred"] = incident_time;
                        }
                        if (exact_location) {
                            res["Incident Location"] = exact_location;
                        }
                    }

                    if (sec10_data) {
                        const {
                            desc, document_list
                        } = sec10_data;
                        if (desc) {
                            res["Incident Description"] = desc;
                        }
                        if (document_list) {
//                            res["Documents/Files"] = document_list;
                        }
                    }

                    if (sec11_data) {
                        const {
                            person_injured, injured_person_dob, injured_person_gender,
                            nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list, injury_desc
                        } = sec11_data;
                        if (person_injured) {
                            res["Person Injured"] = onePersonDetails(person_injured);
                        }
                        if (injured_person_dob) {
                            res["Person Injured Date Of Birth"] = Dates.parse(injured_person_dob);
                        }
                        if (injured_person_gender) {
                            res["Person Injured Gender"] = injured_person_gender;
                        }
                        if (nature_of_injury_list) {
                            res["Nature Of Injury"] = nature_of_injury_list.map(v => isString(v) ? v : v.value).join(', ');
                        }
                        if (bodily_injury_location_list) {
                            res["Part(s) Of Body Injured"] = bodily_injury_location_list.map(v => isString(v) ? v : v.value).join(', ');
                        }
                        if (injury_mechanism_list) {
                            res["Direct Cause Of Injury"] = injury_mechanism_list.map(v => isString(v) ? v : v.value).join(', ');
                        }
                        if (injury_desc) {
                            res["Injury Description"] = injury_desc;
                        }
                    }

                    if (sec12_data) {
                        const {test_undertaken, test_type_list, test_type_drug_undertaken, test_type_alcohol_undertaken, test_type_mobile_device_undertaken} = sec12_data;
                        if (test_undertaken) {
                            res["Was Testing Undertaken?"] = test_undertaken;
                        }
                        if (test_type_list) {
                            res["Type Of Test(s) Undertaken"] = test_type_list.map(v => isString(v) ? v : v.value).join(', ');
                        }
                        if (test_type_drug_undertaken) {
                            res["Drug Test Result"] = test_type_drug_undertaken;
                        }
                        if (test_type_alcohol_undertaken) {
                            res["Alcohol Test Result"] = test_type_alcohol_undertaken;
                        }
                        if (test_type_mobile_device_undertaken) {
                            res["Was a Mobile Device being used?"] = test_type_mobile_device_undertaken;
                        }
                    }

                    if (sec13_data) {
                        const {is_vehicle_incident, driver, driver_dob, driver_gender, address, email, phone, licence_num, licence_expiry, licence_years} = sec13_data;
                        if (is_vehicle_incident) {
                            res["A Motor Vehicle Incident?"] = is_vehicle_incident;
                        }
                        if (driver) {
                            res["Driver Details"] = driver;
                        }
                        if (driver_dob) {
                            res["Driver Date Of Birth"] = Dates.parse(driver_dob);
                        }
                        if (driver_gender) {
                            res["Driver Gender"] = driver_gender;
                        }
                        if (address) {
                            res["Driver Address"] = address;
                        }
                        if (email) {
                            res["Driver Email Address"] = email;
                        }
                        if (phone) {
                            res["Driver Phone No."] = phone;
                        }
                        if (licence_num) {
                            res["Driver Licence No."] = licence_num;
                        }
                        if (licence_expiry) {
                            res["Driver Licence Expiry Date"] = Dates.parse(licence_expiry);
                        }
                        if (licence_years) {
                            res["Driver Licence Years Held"] = licence_years;
                        }

                        const {vehicle_make, vehicle_model, vehicle_year, vehicle_color, vehicle_reg_num, vehicle_fleet_num, vehicle_reg_date, vehicle_trip_type, vehicle_load_type} = sec13_data;
                        if (vehicle_make) {
                            res["Vehicle/Trailer Make"] = vehicle_make;
                        }
                        if (vehicle_model) {
                            res["Vehicle/Trailer Model"] = vehicle_model;
                        }
                        if (vehicle_year) {
                            res["Vehicle/Trailer Year"] = vehicle_year;
                        }
                        if (vehicle_color) {
                            res["Vehicle/Trailer Color"] = vehicle_color;
                        }
                        if (vehicle_reg_num) {
                            res["Vehicle/Trailer Registration No."] = vehicle_reg_num;
                        }
                        if (vehicle_fleet_num) {
                            res["Vehicle/Trailer Fleet No."] = vehicle_fleet_num;
                        }
                        if (vehicle_reg_date) {
                            res["Vehicle/Trailer Registration Date"] = Dates.parse(vehicle_reg_date);
                        }
                        if (vehicle_trip_type) {
                            res["Vehicle/Trailer Trip Type"] = vehicle_trip_type;
                        }
                        if (vehicle_load_type) {
                            res["Vehicle/Trailer Load Type"] = vehicle_load_type;
                        }

                        const {was_3rd_party_involved, are_3rd_party_details_available, third_party_fname, third_party_lname, third_party_address, third_party_email, third_party_phone,
                            did_driver_admit_liability, did_someone_else_admit_liability, someone_else_admit_liability_name, liability_admitted_to_name, third_party_opinion, third_party_document_list} = sec13_data;
                        if (was_3rd_party_involved) {
                            res["Was A Third Party Involved?"] = was_3rd_party_involved;
                        }
                        if (are_3rd_party_details_available) {
                            res["Third Party Details Available?"] = are_3rd_party_details_available;
                        }
                        if (third_party_fname) {
                            res["Third Party First Name"] = third_party_fname;
                        }
                        if (third_party_lname) {
                            res["Third Party Last Name"] = third_party_lname;
                        }
                        if (third_party_address) {
                            res["Third Party Address"] = third_party_address;
                        }
                        if (third_party_email) {
                            res["Third Party Email Address"] = third_party_email;
                        }
                        if (third_party_phone) {
                            res["Third Party Phone No."] = third_party_phone;
                        }

                        if (did_driver_admit_liability) {
                            res["Did A Driver Admit Liability To Any Person(s)?"] = did_driver_admit_liability;
                        }
                        if (did_someone_else_admit_liability) {
                            res["Did Someone Else Admit Liability?"] = did_someone_else_admit_liability;
                        }
                        if (someone_else_admit_liability_name) {
                            res["Someone Else Who Admitted Liability Name"] = someone_else_admit_liability_name;
                        }
                        if (liability_admitted_to_name) {
                            res["Who Was Liability Admitted To?"] = liability_admitted_to_name;
                        }
                        if (third_party_opinion) {
                            res["In The 3rd Party Opinion, Who Was Responsible For The Collision And Why?"] = third_party_opinion;
                        }
                        if (third_party_document_list) {
//                            res["3rd Party Documents/Files"] = third_party_document_list;
                        }

                        const {is_infringement_issued, penalty_num, issuing_authority, issuing_officer, type_of_breach,
                            addressee_issued_to_name, addressee_name_or_entity, addressee_amount, addressee_due_date} = sec13_data;
                        if (is_infringement_issued) {
                            res["Has Infringement Been Issued?"] = is_infringement_issued;
                        }
                        if (penalty_num) {
                            res["Infringement Penalty Notice No."] = penalty_num;
                        }
                        if (issuing_authority) {
                            res["Infringement Issuing Authority"] = issuing_authority;
                        }
                        if (issuing_officer) {
                            res["Infringement Issuing Officer"] = issuing_officer;
                        }
                        if (type_of_breach) {
                            res["Infringement Type Of Breach"] = type_of_breach;
                        }

                        if (addressee_issued_to_name) {
                            res["Infringement Issued To"] = addressee_issued_to_name;
                        }
                        if (addressee_name_or_entity) {
                            res["Infringement Name / Entity"] = addressee_name_or_entity;
                        }
                        if (addressee_amount) {
                            res["Infringement Amount"] = addressee_amount;
                        }
                        if (addressee_due_date) {
                            res["Infringement Due Date"] = addressee_due_date;
                        }

                        const {did_police_attend_scene, ref_or_report_num, officer_name, officer_station,
                            collision_reported_to_police_station, have_charges_been_laid, nature_of_charges, who_laid_charges, who_were_nature_charges_laid_against} = sec13_data;
                        if (did_police_attend_scene) {
                            res["Did Police Attend Scene?"] = did_police_attend_scene;
                        }
                        if (ref_or_report_num) {
                            res["Ref/Report No."] = ref_or_report_num;
                        }
                        if (officer_name) {
                            res["Police Officer Taking Collision Details"] = officer_name;
                        }
                        if (officer_station) {
                            res["Police Officer Station Taking Collision Details"] = officer_station;
                        }

                        if (collision_reported_to_police_station) {
                            res["Collision Reported To Police Station?"] = collision_reported_to_police_station;
                        }
                        if (have_charges_been_laid) {
                            res["Have Charges Been Laid?"] = have_charges_been_laid;
                        }
                        if (nature_of_charges) {
                            res["Nature Of Charges"] = nature_of_charges;
                        }
                        if (who_laid_charges) {
                            res["Who Laid Charges?"] = who_laid_charges;
                        }
                        if (who_were_nature_charges_laid_against) {
                            res["Who Were Charges Laid Against?"] = who_were_nature_charges_laid_against;
                        }
                    }

                    if (consequence) {
                        res["Consequence / Severity"] = consequence.substring(2).trim();
                    }
                    if (likelihood) {
                        res["Frequency / Exposure"] = likelihood.substring(2).trim();
                    }
                    if (risk_rating || (consequence && likelihood)) {
                        let _likelihood, _consequence;
                        if (risk_rating) {
                            _likelihood = risk_rating.likelihood;
                            _consequence = risk_rating.consequence;
                        } else {
                            _likelihood = likelihood.charAt(0);
                            _consequence = parseInt(consequence.charAt(0));
                        }
                        const likelihoodLetters = ['A', 'B', 'C', 'D', 'E'];
                        _likelihood = (likelihoodLetters.indexOf(_likelihood) + 1);
                        res["Risk Rating"] = _likelihood * _consequence;
                    }

                    if (distribution_list) {
                        res["Distribution List"] = distribution_list.map(mapPersonDetails).join(', ');
                    }

                    if (weather_condition_list) {
                        res["Weather Conditions"] = weather_condition_list.join(', ');
                    }
                    if (protective_equipment_worn_list) {
                        res["Protective Equipment Worn"] = protective_equipment_worn_list.join(', ');
                    }
                    if (class_list) {
                        res["Class"] = class_list.join(', ');
                    }
                    if (environment_list) {
                        res["Environment"] = environment_list.join(', ');
                    }

                    res["Estimated Costs (Damages)"] = estimated_costs_damages;
                    res["Estimated Costs (Medical)"] = estimated_costs_medical;
                    res["Estimated Costs (Salaries / Wages)"] = estimated_costs_salaries_wages;
                    res["Estimated Costs (Investigations)"] = estimated_costs_investigations;
                    res["Estimated Costs (Others)"] = estimated_costs_others;

                    const calcTotalCosts = () => {
                        return estimated_costs_damages +
                                estimated_costs_medical +
                                estimated_costs_salaries_wages +
                                estimated_costs_investigations +
                                estimated_costs_others;
                    };
                    res["Estimated Costs (Total)"] = calcTotalCosts();

                    return res;
                });

                return await this.export_excel_impl(loggedUser, "Incident-Investigation-Docs", "Incidents-Active", "Incidents Data", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}} = loggedUser;
                const {client_id, project_id, site_id, isNew} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {isNew, limit: -1, direction: 'desc'}, q => {
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
                    return q;
                });
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {title} = val.data;
                    return title.toLowerCase().startsWith(search_val)
                };
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {direction = 'desc'} = opts;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {...opts, direction});
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {incident_date_range, incident_status, investigation_status, type, category} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {direction: 'desc'}, q => {
                    if (incident_date_range) {
                        if (incident_date_range.start) {
                            q = q.where('sec9_data.incident_date', '>=', incident_date_range.start);
                        }
                        if (incident_date_range.end) {
                            q = q.where('sec9_data.incident_date', '<=', incident_date_range.end);
                        }
                    }
                    if (incident_status) {
                        switch (incident_status) {
                            case 'ApprovedIncident':
                            case 'ClosedIncident':
                                q = q.where('status', 'array-contains', incident_status);
                                break;
//                            case 'AwaitingApproval':
//                                ['ApprovedIncident', 'ClosedIncident']
//                                q = q.where('status', 'array-contains-any', 'ApprovedIncident');
//                                break;
                            case 'AssignedInvestigator':
                                q = q.where('classification.sec5_data.investigation_team_list', '!=', []);
                                break;
                            case 'Investigating':
                                q = q.where('investigation', '!=', null);
                                break;
                            default:
                                break;
                        }
                    }
                    if (investigation_status) {
                        switch (investigation_status) {
                            case 'ApprovedInvestigation':
                                q = q.where('status', 'array-contains', investigation_status);
                                break;
//                            case 'Investigating':
//                                q = q.where('investigation', '!=', null);
//                                ['ApprovedInvestigation', 'ClosedInvestigation']
//                                q = q.where('investigation.status', 'array-contains-any', 'ClosedInvestigation');
//                                break;
                            case 'ClosedInvestigation':
                                q = q.where('investigation.status', 'array-contains', investigation_status);
                                break;
                            default:
                                break;
                        }
                    }
                    if (type) {
                        q = q.where('sec3_data.type', '==', type);
                    }
                    if (category) {
                        q = q.where('sec1_data.category_list', 'array-contains', category);
                    }
                    return q;
                });
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="stats">
        async stats(evt, yr) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: 'desc'}, q => {
                    q = q.where('sec9_data.incident_date_split.year', '==', yr);
                    return q;
                });
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "sec9_data.incident_date";
        }
    }

    new Controller(events, db);
})();