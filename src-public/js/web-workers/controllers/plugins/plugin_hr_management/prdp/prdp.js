
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events) {
            super(
                    events,
                    {singular: "Employee PrDP", plural: "Employees PrDP"},
                    "plugin_sheq_assist/employees/prdp/"
                    );

            this.collectionGroup = "prdp_list";
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, {
            client, project, site,
            department, job_position, supervisor,
            list,
        }) {
            return AEmployeeDocsController.prototype.export_excel(
              evt,
              'PrDP',
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