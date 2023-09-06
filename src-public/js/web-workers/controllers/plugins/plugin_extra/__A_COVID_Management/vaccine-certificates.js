
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events) {
            super(
                    events,
                    {singular: "Employee Vaccine Certificate", plural: "Employees Vaccine Certificates"},
                    "plugin_sheq_assist/COVID_Management/vaccine-certificates/"
                    );

            this.collectionGroup = "employee_vaccine_list";
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
//                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Vaccinated', key: 'Vaccinated', width: 25},
                    {header: 'Document', key: 'Document', width: 35}
                ];
                
                const {
                    fname, lname, 

                    employee_vaccine_list, sub_collection_keys: {
                        employee_vaccine_list: {latest, id: ids}
                    }
                }  = employee.data;
                
                let list = Object.keys(employee_vaccine_list).map(id => {
                    return {id, created_at: employee_vaccine_list[id].created_at || null};
                });
                list.sortBy('created_at', 'desc');
                list = list.map(({id, created_at}) => {
                    return {id, data: employee_vaccine_list[id]};
                });

                console.log(evt, list)
                
                const rows = list.map(({id, data: {
                    created_at, vaccinated, doc  
                }}) => {
                    console.log('test vaccine certificates export doc', doc)
                    const res = {
//                        "Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "Vaccinated": vaccinated,
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + " " + fname;
                const folder = "Vaccine Certificates";
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
        
        sub_collection_keys({vaccinated}) {
            return {vaccinated: FBSettings.FieldValue.arrayUnion(vaccinated)};
        }

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                return q;
            });
        }
        // </editor-fold>

        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {vaccinated} = filterData;
                if (vaccinated) {
                    const col = 'sub_collection_keys.' + this.collectionGroup;
                    q = q.where(col + '.vaccinated', 'array-contains', vaccinated);
                }
                return q;
            });
        }

    }

    new Controller(events);
})();