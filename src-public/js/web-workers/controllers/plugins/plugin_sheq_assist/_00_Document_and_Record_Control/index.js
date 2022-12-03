
(() => {
    class Controller extends AControllerAid {
        //title, doc_num, revision_num, compiler, approving_officer, effective_date, revision_date, type, doc
        constructor(events, db) {
            super(events, db, {singular: "Document", plural: "Documents"}, "plugin_sheq_assist/Documents/");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;

            addAction("list/filter", filter);
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {type, doc}}) => {
                (type === "Upload" && doc && await files.remove(doc));
            });
        }

        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const _01_Project_Plan = await Events.get('plugin_sheq_assist/01_Project_Plan/');
                const _01_Project_Plan_list = await _01_Project_Plan.list(evt);
                const _01_Project_Plan_documents = await Events.get('plugin_sheq_assist/01_Project_Plan/documents/');
                const _01_Project_Plan_documents_list = await _01_Project_Plan_documents.list(evt);
                const _02_IMS_Policies = await Events.get('plugin_sheq_assist/02_IMS_Policies/');
                const _02_IMS_Policies_list = await _02_IMS_Policies.list(evt);
                const _05_Training_toolbox_talks = await Events.get('plugin_sheq_assist/05_Training/toolbox-talks/');
                const _05_Training_toolbox_talks_list = await _05_Training_toolbox_talks.list(evt);
                const _08_Environmental_Aspects_checklist = await Events.get('plugin_sheq_assist/08_Environmental_Aspects/checklist/');
                const _08_Environmental_Aspects_checklist_list = await _08_Environmental_Aspects_checklist.list(evt);
                const _08_Environmental_Aspects_qap = await Events.get('plugin_sheq_assist/08_Environmental_Aspects/qap/');
                const _08_Environmental_Aspects_qap_list = await _08_Environmental_Aspects_qap.list(evt);
                const _08_Environmental_Aspects_emp = await Events.get('plugin_sheq_assist/08_Environmental_Aspects/emp/');
                const _08_Environmental_Aspects_emp_list = await _08_Environmental_Aspects_emp.list(evt);
                const _16_Emergency_Preparedness_emergency_procedure = await Events.get('plugin_sheq_assist/16_Emergency_Preparedness/emergency-procedure/');
                const _16_Emergency_Preparedness_emergency_procedure_list = await _16_Emergency_Preparedness_emergency_procedure.list(evt);
                const COVID_Management_documents = await Events.get('plugin_sheq_assist/COVID_Management/documents/');
                const COVID_Management_documents_list = await COVID_Management_documents.list(evt);

                const list = [
                    ..._01_Project_Plan_list, ..._01_Project_Plan_documents_list,
                    ..._02_IMS_Policies_list,
                    ..._05_Training_toolbox_talks_list,
                    ..._08_Environmental_Aspects_checklist_list, ..._08_Environmental_Aspects_qap_list, ..._08_Environmental_Aspects_emp_list,
                    ..._16_Emergency_Preparedness_emergency_procedure_list,
                    ...COVID_Management_documents_list
                ];
                list.sortBy('data.title');
                console.log('Documents: list filtered', list)
                return list;
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {group, title, owner} = search_val;
                let list;
                switch (group) {
                    case '_01_Project_Plan':
                        const _01_Project_Plan = await Events.get('plugin_sheq_assist/01_Project_Plan/');
                        list = await _01_Project_Plan.list(evt);
                        break;
                    case '_01_Project_Plan_documents':
                        const _01_Project_Plan_documents = await Events.get('plugin_sheq_assist/01_Project_Plan/documents/');
                        list = await _01_Project_Plan_documents.list(evt);
                        break;
                    case '_02_IMS_Policies':
                        const _02_IMS_Policies = await Events.get('plugin_sheq_assist/02_IMS_Policies/');
                        list = await _02_IMS_Policies.list(evt);
                        break;
                    case '_05_Training_toolbox_talks':
                        const _05_Training_toolbox_talks = await Events.get('plugin_sheq_assist/05_Training/toolbox-talks/');
                        list = await _05_Training_toolbox_talks.list(evt);
                        break;
                    case '_08_Environmental_Aspects_checklist':
                        const _08_Environmental_Aspects_checklist = await Events.get('plugin_sheq_assist/08_Environmental_Aspects/checklist/');
                        list = await _08_Environmental_Aspects_checklist.list(evt);
                        break;
                    case '_08_Environmental_Aspects_qap':
                        const _08_Environmental_Aspects_qap = await Events.get('plugin_sheq_assist/08_Environmental_Aspects/qap/');
                        list = await _08_Environmental_Aspects_qap.list(evt);
                        break;
                    case '_08_Environmental_Aspects_emp':
                        const _08_Environmental_Aspects_emp = await Events.get('plugin_sheq_assist/08_Environmental_Aspects/emp/');
                        list = await _08_Environmental_Aspects_emp.list(evt);
                        break;
                    case '_16_Emergency_Preparedness_emergency_procedure':
                        const _16_Emergency_Preparedness_emergency_procedure = await Events.get('plugin_sheq_assist/16_Emergency_Preparedness/emergency-procedure/');
                        list = await _16_Emergency_Preparedness_emergency_procedure.list(evt);
                        break;
                    case 'COVID_Management_documents':
                        const COVID_Management_documents = await Events.get('plugin_sheq_assist/COVID_Management/documents/');
                        list = await COVID_Management_documents.list(evt);
                        break;
                    default:
                        list = await this.list(evt);
                        break;
                }
                const q = [
//                    {key: 'type', comp: '=', val: type},
                    {key: 'title', comp: 'LIKE', val: title},
                    {key: 'owner', comp: 'LIKE', val: owner}
                ];
                return this.filter_impl(evt, q, list);
            });
        }
    }

    new Controller(events, db);
})();