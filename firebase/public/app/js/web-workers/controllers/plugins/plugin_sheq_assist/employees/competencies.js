
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events, db) {
            super(
                    events,
                    db,
                    {singular: "Employee Competency", plural: "Employees Competencies"},
                    "plugin_sheq_assist/employees/competencies/"
                    );

            this.collectionGroup = "employee_competency_list";
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Competency Type', key: 'Warning Type', width: 25},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Document', key: 'Document', width: 35}
                ];

                const {
                    fname, lname,
                    employee_competency_list, sub_collection_keys: {
                        employee_competency_list: {latest, id: ids}
                    }
                } = employee.data;

                let list = Object.keys(employee_competency_list).map(id => {
                    return {id, expiry_date: employee_competency_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_competency_list[id]};
                });

                console.log(evt, list)

                const rows = list.map(({id, data: {
                created_at, competency_type, expiry_date, doc
                }}) => {
                    console.log('test competencies export doc', doc)
                    const res = {
                        "Competency Type": competency_type || "N/A",
                        "Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + " " + fname;
                const folder = "Competency Certificates";
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

        sub_collection_keys( {competency_type}) {
            return competency_type ? {competency_type: this.getDB().FieldValue.arrayUnion(competency_type)} : null;
        }

        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {competency_type} = filterData;
                if (competency_type) {
                    const col = 'sub_collection_keys.' + this.collectionGroup;
                    q = q.where(col + '.competency_type', 'array-contains', competency_type);
                }
                return q;
            });
        }

    }

    new Controller(events, db);
})();