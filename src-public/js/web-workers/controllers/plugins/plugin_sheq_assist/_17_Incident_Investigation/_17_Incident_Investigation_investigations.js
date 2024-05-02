
(() => {
    class Controller extends AControllerAid {

        constructor(events) {
            super(events, {singular: "Incident Investigation", plural: "Incident Investigations"}, "plugin_sheq_assist/17_Incident_Investigation/investigations/");

            this.tbl = 'plugin_sheq_assist_17_Incident_Investigation';

            // this.filter = this.filter.bind(this);
            // const {addAction} = this;
            
            // addAction("add-status", this.addStatus.bind(this));
            // addAction("remove-status", this.removeStatus.bind(this));
            // addAction("list/filter", this.filter.bind(this));
            // addAction("stats", this.stats.bind(this));
        }

        async updateStatus(evt, id, status, action) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                const updated = await doc_ref.update({investigation: {status: FBSettings.FieldValue["array" + action](status)}});//Promise < void >
                snapshot = await doc_ref.get();

                let data = snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

//                console.log('update', updated)
                return data;
            });
        }

        async addStatus(evt, id, status) {
            return this.updateStatus(evt, id, status, "Union");
        }

        async removeStatus(evt, id, status) {
            return this.updateStatus(evt, id, status, "Remove");
        }

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {direction = 'desc'} = opts;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {...opts, direction}, q => {
                    q = q.orderBy('investigation', 'asc');
                    return q;
                });
                list = await Promise.all(list.map(IncidentFuns.mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>
        
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
                                group,
                                short_desc,
                                desc,
                                location,
                                exact_location,
                                document_list,
                                incident_date,
                                incident_time,
                                date_reported,
                                time_reported,
                                time_shift,
                                category_list,
                                sub_category_list,
                                sector_list,
                                activity_list,
                                person_involved_list,
                                person_reporting,
                                person_reported_to,
                                witness_list,
                                distribution_list,
                              
                                person_injured,
                                injured_person_dob,
                                injured_person_gender,
                                nature_of_injury_list,
                                bodily_injury_location_list,
                                injury_mechanism_list,
                                injury_desc,
                                
                                test_undertaken,
                                test_type_list,
                                test_type_drug_undertaken,
                                test_type_alcohol_undertaken,
                                test_type_mobile_device_undertaken,
                                
                                is_vehicle_incident,
                                is_infringement_issued,
                                did_police_attend_scene,
                                collision_reported_to_police_station,
                                have_charges_been_laid,
                                driver,
                                driver_dob,
                                driver_gender,
                                address,
                                email,
                                phone,
                                licence_num,
                                licence_expiry,
                                licence_years,
                                vehicle_make,
                                vehicle_model,
                                vehicle_year,
                                vehicle_color,
                                vehicle_reg_num,
                                vehicle_fleet_num,
                                vehicle_reg_date,
                                vehicle_trip_type,
                                vehicle_load_type,
                                was_3rd_party_involved,
                                are_3rd_party_details_available,
                                third_party_fname,
                                third_party_lname,
                                third_party_address,
                                third_party_email,
                                third_party_phone,
                                did_driver_admit_liability,
                                did_someone_else_admit_liability,
                                someone_else_admit_liability_name,
                                liability_admitted_to_name,
                                third_party_opinion,
                                third_party_document_list,
                                penalty_num,
                                issuing_authority,
                                issuing_officer,
                                type_of_breach,
                                addressee_issued_to_name,
                                addressee_name_or_entity,
                                addressee_amount,
                                addressee_due_date,
                                ref_or_report_num,
                                officer_name,
                                officer_station,
                                nature_of_charges,
                                who_laid_charges,
                                who_were_nature_charges_laid_against,
                                
                                consequence,
                                likelihood,
                                risk_rating,
                            }
                        } = item;
                        
                        client = client || company;
                        
                        return {
                            idx: idx + 1,
                            
                            project: project && project.name,
                            site: site && site.name,
                            
                            group,
                            short_desc,
                            desc,
                            location,
                            exact_location,
                            document_list,
                            incident_date:Dates.formatDateSQL(incident_date),
                            incident_time,
                            date_reported:Dates.formatDateSQL(date_reported),
                            time_reported,
                            time_shift,
                            category_list,
                            sub_category_list,
                            sector_list,
                            activity_list,
                            person_involved_list,
                            person_reporting: person_reporting && person_reporting.full_name,
                            person_reported_to: person_reported_to && person_reported_to.full_name ,
                            witness_list,
                            distribution_list,
                            person_injured: person_injured && person_injured.full_name,
                            injured_person_dob:Dates.formatDateSQL(injured_person_dob),
                            injured_person_gender,
                            nature_of_injury_list,
                            bodily_injury_location_list,
                            injury_mechanism_list,
                            injury_desc,
                            test_undertaken,
                            test_type_list,
                            test_type_drug_undertaken,
                            test_type_alcohol_undertaken,
                            test_type_mobile_device_undertaken,
                            vehicle_make,
                            vehicle_model,
                            vehicle_year,
                            vehicle_color,
                            vehicle_reg_num,
                            vehicle_fleet_num,
                            vehicle_reg_date:Dates.formatDateSQL(vehicle_reg_date),
                            vehicle_trip_type,
                            vehicle_load_type,
                            was_3rd_party_involved,
                            are_3rd_party_details_available,
                            third_party_fname,
                            third_party_lname,
                            third_party_address,
                            third_party_email,
                            third_party_phone,
                            did_driver_admit_liability,
                            did_someone_else_admit_liability,
                            someone_else_admit_liability_name,
                            liability_admitted_to_name,
                            third_party_opinion,
                            third_party_document_list,
                            penalty_num,
                            issuing_authority,
                            issuing_officer,
                            type_of_breach,
                            addressee_issued_to_name,
                            addressee_name_or_entity,
                            addressee_amount,
                            addressee_due_date:Dates.formatDateSQL(addressee_due_date),
                            ref_or_report_num,
                            officer_name,
                            officer_station,
                            nature_of_charges,
                            who_laid_charges : who_laid_charges && who_laid_charges.full_name,
                            who_were_nature_charges_laid_against: who_were_nature_charges_laid_against && who_were_nature_charges_laid_against.full_name,
                            consequence,
                            likelihood,
                            risk_rating,
                            is_vehicle_incident,
                            is_infringement_issued,
                            did_police_attend_scene,
                            collision_reported_to_police_station,
                            have_charges_been_laid,
                            driver,
                            driver_dob:Dates.formatDateSQL(driver_dob),
                            driver_gender,
                            address,
                            email,
                            phone,
                            licence_num,
                            licence_expiry,
                            licence_years,
                            
                        };
                    });
                    
                    const response = await fetch(
                      `${self.locationRoot}/templates/xlsx/incidents/Template-List-Incident-Investigations.xlsx`.replace('//', '/')
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

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {incident_date_range, incident_status, investigation_status, category, sub_category, sector, activity} = filterData;
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
                    if (category) {
                        q = q.where('sec1_data.category_list', 'array-contains', category);
                    }
                    if (sub_category) {
                        q = q.where('sec2_data.sub_category_list', 'array-contains', sub_category);
                    }
                    if (sector) {
                        q = q.where('sec1_data.sector_list', 'array-contains', sector);
                    }
                    if (activity) {
                        q = q.where('sec2_data.activity_list', 'array-contains', activity);
                    }
                    
                    q = q.orderBy('investigation', 'asc');
                    return q;
                });
                list = await Promise.all(list.map(IncidentFuns.mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="stats">
        async stats(evt, yr) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: 'desc'}, q => {
                    q = q.where('sec9_data.incident_date_split.year', '==', yr);
                    q = q.orderBy('investigation', 'asc');
                    return q;
                });
                list = await Promise.all(list.map(IncidentFuns.mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "sec9_data.incident_date";
        }
    }

    new Controller(events);
})();
