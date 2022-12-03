
(() => {
    class Controller extends AEmployeeDocsController {
        //date, expiry_date, type, notes, employee, department
        constructor(events, db) {
            super(
                    events,
                    db,
                    {singular: "Employee Warning", plural: "Employees Warnings"},
                    "plugin_sheq_assist/employees/warnings/"
                    );

            this.collectionGroup = "employee_warning_list";
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Issued By', key: 'Issued By', width: 25},
                    {header: 'Warning Type', key: 'Warning Type', width: 25},
                    {header: 'Warning Date', key: 'Warning Date', width: 25},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Details Of Misconduct', key: 'Details Of Misconduct', width: 35},
                    {header: "Employee's Comments", key: "Employee's Comments", width: 35},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Document', key: 'Document', width: 35}
                ];
                
                const {
                    fname, lname,
                    employee_warning_list, sub_collection_keys: {
                            employee_warning_list: {latest, id: ids}
                        }
                }  = employee.data;
                
                let list = Object.keys(employee_warning_list).map(id => {
                    return {id, expiry_date: employee_warning_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_warning_list[id]};
                });

                console.log(evt, list)
                
                const rows = list.map(({id, data: {
                    created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, doc    
                }}) => {
                    console.log('test wargings export doc', doc)
                    const res = {
                        "Issued By": issued_by ? (issued_by.lname + ' ' + issued_by.fname) : 'N/A',
                        "Warning Type": type,
                        "Warning Date": date ? new Date(date) : "N/A",
                        "Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "Details Of Misconduct": details || "N/A",
                        "Employee's Comments": employee_comments || "N/A",
                        "Notes": notes || "N/A",
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + " " + fname;
                const folder = "Warnings";
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
        
        sub_collection_keys({type}) {
            return type ? {type: this.getDB().FieldValue.arrayUnion(type)} : null;
        }

        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {type} = filterData;
                if (type) {
                    const col = 'sub_collection_keys.' + this.collectionGroup;
                    q = q.where(col + '.type', 'array-contains', type);
                }
                return q;
            });
        }

    }

    new Controller(events, db);
})();