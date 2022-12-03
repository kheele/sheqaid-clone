
(() => {
    class Controller extends AEmployeeDocsController {
        //title, sec1
        constructor(events, db) {
            super(
                    events,
                    db,
                    {singular: "Job Appointment", plural: "Job Appointments"},
                    "plugin_sheq_assist/StructureAndResponsibility/appointments/"
                    );

            this.collectionGroup = "employee_job_appointment_list";
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Date', key: 'Date', width: 25},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Document', key: 'Document', width: 35}
                ];
                
                const {
                    fname, lname,
                    employee_job_appointment_list, sub_collection_keys: {
                            employee_job_appointment_list: {latest, id: ids}
                        }
                }  = employee.data;
                
                let list = Object.keys(employee_job_appointment_list).map(id => {
                    return {id, expiry_date: employee_job_appointment_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_job_appointment_list[id]};
                });

                console.log(evt, list)
                
                const rows = list.map(({id, data: {
                    created_at, employee, date, expiry_date, notes, doc    
                }}) => {
                    console.log('test job appointments export doc', doc)
                    const res = {
                        "Date": date ? Dates.parse(date) : "N/A",
                        "Expiry Date": expiry_date ? Dates.parse(expiry_date) : "N/A",
                        "Notes": notes || "N/A",
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + " " + fname;
                const folder = "Job-Appointments";
                return await this.export_excel_impl(
                        loggedUser,
                        "Employee-Docs/Employees-Active/" + folder.replace(" ", "-"),
                        name.replaceAll(" ", "-"),
                        name + " " + folder,
                        cols,
                        rows);
            });
        }
        // </editor-fold>
        
//        sub_collection_keys(data) {
//            return null;
//        }

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                return q;
            });
        }
        // </editor-fold>

        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData);
        }
    }

    new Controller(events, db);
})();