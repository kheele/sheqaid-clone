
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events) {
            super(
                    events,
                    {singular: "Employee ID/Passport", plural: "Employees ID/Passport"},
                    "plugin_sheq_assist/employees/id-or-passports/"
                    );

            this.collectionGroup = "id_or_passport_list";
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, {
            client, project, site,
            department, job_position, supervisor,
            list,
        }) {
            return AEmployeeDocsController.prototype.export_excel(
              evt,
              'IDOrPassport',
              ({
                   id,
                   data: {
                       type,
                   },
               }) => {
                  return {
                      type,
                  };
              },
              {
                  client, project, site,
                  department, job_position, supervisor,
                  list,
              },
            );
        }

        // </editor-fold>

    }

    new Controller(events);
})();