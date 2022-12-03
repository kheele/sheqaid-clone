//
//exports.createPDF = async (ctx, id) => {
//    return onDriver().then(async drive => {
//        const item = await this.find_by_id(ctx, id);
//        let {
//            data: {
//                created_at, status,
//                classification,
//                investigation,
//                sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data,
//                sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data,
//
//                client, client_id
//            }
//        } = item;
//
////    const doc_ref = await db.collection("plugin_sheq_assist_clients").doc(client_id);
////    let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
////    if (!doc_snapshot.exists) {
////        return null;
////    }
////    let {profile_pic} = doc_snapshot.data();
////    return profile_pic;
//
//        if (classification) {
//            sec1_data = classification.sec1_data || sec1_data;
//            sec2_data = classification.sec2_data || sec2_data;
//            sec3_data = classification.sec3_data || sec3_data;
//            sec4_data = classification.sec4_data || sec4_data;
//        }
//
//        let incident_date, incident_time, exact_location;
//        if (sec9_data && sec9_data.incident_date) {
//            incident_date = Dates.formatDate(sec9_data.incident_date);
//        }
//        if (sec9_data && sec9_data.incident_time) {
//            incident_time = sec9_data.incident_time;
//        }
//        if (sec9_data && sec9_data.exact_location) {
//            exact_location = sec9_data.exact_location;
//        }
//
//        let date_reported, time_reported, person_reported_to, person_reporting;
//        if (sec7_data && sec7_data.date_reported) {
//            date_reported = Dates.formatDate(sec7_data.date_reported);
//        }
//        if (sec7_data && sec7_data.time_reported) {
//            time_reported = sec7_data.time_reported;
//        }
//        if (sec7_data && sec7_data.person_reported_to) {
//            const {fname, lname} = sec7_data.person_reported_to;
//            person_reported_to = lname + ' ' + fname;
//        }
//        if (sec6_data && sec6_data.person_reporting) {
//            const {fname, lname} = sec6_data.person_reporting;
//            person_reporting = lname + ' ' + fname;
//        }
//
//        let person_injured, injured_person_dob, injured_person_gender;
//        if (sec11_data && sec11_data.person_injured) {
//            const {fname, lname} = sec11_data.person_injured;
//            person_injured = lname + ' ' + fname;
//        }
//        if (sec11_data && sec11_data.injured_person_dob) {
//            injured_person_dob = Dates.formatDate(sec11_data.injured_person_dob);
//        }
//        if (sec11_data && sec11_data.injured_person_gender) {
//            injured_person_gender = sec11_data.injured_person_gender;
//        }
//
//        let investigation_team_list = null;
//        let investigation_due_date = null;
//        if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
//            investigation_team_list = investigation.sec1_data.investigation_team_list;
//        } else if (classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
//            investigation_team_list = classification.sec5_data.investigation_team_list;
//        }
//        if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_due_date) {
//            investigation_due_date = Dates.formatDate(investigation.sec1_data.investigation_due_date);
//        } else if (classification && classification.sec5_data && classification.sec5_data.investigation_due_date) {
//            investigation_due_date = classification.sec5_data.investigation_due_date;
//        }
//
//        const investigation_details = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_details : null;
//        const investigation_findings_list = (investigation && investigation.sec2_data && investigation.sec2_data.investigation_findings_list) ?
//                investigation.sec2_data.investigation_findings_list : [];
//        const investigation_findings_further_desc = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_findings_further_desc : null;
//        const document_list = (investigation && investigation.sec2_data && investigation.sec2_data.document_list) ?
//                investigation.sec2_data.document_list : [];
//
//        let consequence = null;
//        let frequency = null;
//        if (investigation && investigation.sec3_data && investigation.sec3_data.consequence) {
//            consequence = investigation.sec3_data.consequence;
//        } else if (sec14_data && sec14_data.consequence) {
//            consequence = sec14_data.consequence;
//        }
//        if (investigation && investigation.sec3_data && investigation.sec3_data.frequency) {
//            frequency = investigation.sec3_data.frequency;
//        } else if (sec14_data && sec14_data.frequency) {
//            frequency = sec14_data.frequency;
//        }
//
//        let cause_analysis = null;
//        if (investigation && investigation.sec4_data && investigation.sec4_data.cause_analysis) {
//            cause_analysis = investigation.sec4_data.cause_analysis;
//        }
//
//        let corrective_actions = null;
//        if (investigation && investigation.sec5_data && investigation.sec5_data.corrective_actions) {
//            corrective_actions = investigation.sec5_data.corrective_actions;
//        }
//
//        let distribution_list = null;
//        if (investigation && investigation.sec6_data && investigation.sec6_data.distribution_list) {
//            distribution_list = investigation.sec6_data.distribution_list;
//        } else if (sec15_data && sec15_data.distribution_list) {
//            distribution_list = sec15_data.distribution_list;
//        }
//
//        return this.onCreateHTMLImpl(path.join(__dirname + "/report-incident.ejs"), {
//            investigation_team_list,
//            category_list: sec1_data && sec1_data.category_list, sub_category_list: sec2_data && sec2_data.sub_category_list || [],
//            type: sec3_data && sec3_data.type, secondary_type_list: sec4_data && sec4_data.secondary_type_list || [],
//            incident_date, incident_time, exact_location,
//            date_reported, time_reported, person_reported_to, person_reporting,
//            person_involved_list: sec5_data && sec5_data.person_involved_list || [],
//            desc: sec10_data && sec10_data.desc,
//            witness_list: sec8_data && sec8_data.witness_list || [],
//            person_injured, injured_person_dob, injured_person_gender,
//            nature_of_injury_list: sec11_data && sec11_data.nature_of_injury_list || [], bodily_injury_location_list: sec11_data && sec11_data.bodily_injury_location_list || [], injury_mechanism_list: sec11_data && sec11_data.injury_mechanism_list || [], injury_desc: sec11_data && sec11_data.injury_desc,
//            cause_analysis, corrective_actions, distribution_list
//        }).then(data => {
//            return DriveUtils.createDocFromHTML(drive, "Incident-Profile-" + id, data);
//        });
//    });
//};