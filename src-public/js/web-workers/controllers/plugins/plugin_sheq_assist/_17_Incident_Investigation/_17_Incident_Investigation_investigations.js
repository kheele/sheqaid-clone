
(() => {
    class Controller extends AControllerAid {

        constructor(events) {
            super(events, {singular: "Incident Investigation", plural: "Incident Investigations"}, "plugin_sheq_assist/17_Incident_Investigation/investigations/");

            this.tbl = 'plugin_sheq_assist_17_Incident_Investigation';

            this.filter = this.filter.bind(this);
            const {addAction} = this;
            
            addAction("add-status", this.addStatus.bind(this));
            addAction("remove-status", this.removeStatus.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("stats", this.stats.bind(this));
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