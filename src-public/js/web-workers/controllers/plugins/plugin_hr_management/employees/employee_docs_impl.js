class AEmployeeDocsController extends AControllerRead {
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(events, name, root) {
        super(events, name, root);

        const {addAction} = this;
        addAction("update/merge-doc", this.updateMergeDoc.bind(this));
    }

    // </editor-fold>

    getDB() {
        return db_hr;
    }

    // <editor-fold defaultstate="collapsed" desc="export_excel">
    async export_excel(evt, name, getValues, {
        client: _client, project: _project, site: _site,
        department: _department, job_position: _job_position, supervisor: _supervisor,
        list,
    }) {
        return Events.whenLoggedIn(async loggedUser => {
            if (isArray(list)) {
                const rows = list.map((item, idx) => {
                    let {
                        id,
                        data: {
                            created_at,
                            //
                            company,
                            client,
                            project,
                            site,
                            //
                            expiry_date,
                            expiry_updated,
                            doc,
                            employee: {
                                full_name,
                                sex,
                                dob,
                                id_num,
                                passport_num,
                                email,
                                phone,
                                employment_num,
                                employment_date,
                                department,
                                job_position,
                            },

                            removed,
                        }
                    } = item;

                    client = client || company;

                    const otherVals = getValues(item);

                    return {
                        idx: idx + 1,

                        project: project && project.name,
                        site: site && site.name,

                        job_position: job_position && job_position.name,
                        // department: department && department.name,
                        // supervisor: supervisor && supervisor.full_name,

                        id,
                        full_name,
                        id_or_passport: id_num || passport_num,
                        // dob: Dates.formatDate(dob),
                        // sex,
                        // phone,
                        // email,

                        employment_num,
                        employment_date: Dates.formatDateSQL(employment_date),

                        //
                        ...otherVals,
                        expiry_date: Dates.formatDateSQL(expiry_date),
                        // expiry_date: Utils.expiryDateWithDue(expiry_date),
                        // expiry_updated,
                        doc: doc && doc.dlUrls ? doc.dlUrls[0] : '',

                        status: removed ? "Inactive" : "Active",
                    };
                });

                const response = await fetch(
                    `${self.locationRoot}/templates/xlsx/employees/docs/Template-List-Employee-Docs-${name}.xlsx`.replace('//', '/')
                );

                const arrayBuffer = await response.arrayBuffer();
                const data = new Map();

                data.set('date', new Date().formatDate());

                data.set('company', _client ? _client.name || _client.data.name : "ANY");
                data.set('project', _project ? _project.name || _project.data.name : "ANY");
                data.set('site', _site ? _site.name || _site.data.name : "ANY");

                data.set('department', _department ? _department.name || _department.data.name : "ANY");
                data.set('job_position', _job_position ? _job_position.name || _job_position.data.name : "ANY");
                data.set('supervisor', _supervisor ? _supervisor.full_name || _supervisor.data.full_name : "ANY");

                data.set("rows", rows);
                return await Events.emit("excelTemplate", {arrayBuffer, data});
            }
            return list;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="updateMergeDoc">
    async updateMergeDoc(evt, employee_id, id, {doc, base64}) {
        return Events.whenLoggedIn(async loggedUser => {
            const employee_ref = await this.getDB().collection(this.tblTemp).doc(employee_id);
            let employee_snapshot = await employee_ref.get();//Promise < DocumentSnapshot < T > >

            const oldCollectionGroup = employee_snapshot.get(this.collectionGroup);
            let old_data = oldCollectionGroup[id];
            if (!old_data) {
                return "ERROR";
            }

            const gcsUri = await files.update.call(this, doc, base64);
            return true;
        });
    }

    // </editor-fold>

}
