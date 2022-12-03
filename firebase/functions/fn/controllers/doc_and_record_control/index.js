
class Cntr extends ACntr {
    constructor(eventManager) {
        super(eventManager, 'plugin_sheq_assist/Documents/');
    }

    async list(ctx, data) {
//        const _01_Project_Plan_list = await db.get('plugin_sheq_assist/01_Project_Plan/').list(data);
//        const _01_Project_Plan_documents_list = await db.get('plugin_sheq_assist/01_Project_Plan/documents/').list(data);
//        const _02_IMS_Policies_list = await db.get('plugin_sheq_assist/02_IMS_Policies/').list(data);
//        const _05_Training_toolbox_talks_list = await db.get('plugin_sheq_assist/05_Training/toolbox-talks/').list(data);
//        const _08_Environmental_Aspects_checklist_list = await db.get('plugin_sheq_assist/08_Environmental_Aspects/checklist/').list(data);
//        const _08_Environmental_Aspects_qap_list = await db.get('plugin_sheq_assist/08_Environmental_Aspects/qap/').list(data);
//        const _08_Environmental_Aspects_emp_list = await db.get('plugin_sheq_assist/08_Environmental_Aspects/emp/').list(data);
//        const _16_Emergency_Preparedness_emergency_procedure_list = await db.get('plugin_sheq_assist/16_Emergency_Preparedness/emergency-procedure/').list(data);
//        const _21_Internal_Audit_checklist_list = await db.get('plugin_sheq_assist/21_Internal_Audit/checklist/').list(data);
//        const COVID_Management_documents_list = await db.get('plugin_sheq_assist/COVID_Management/documents/').list(data);
//
        const list = [
//            ..._01_Project_Plan_list, ..._01_Project_Plan_documents_list,
//            ..._02_IMS_Policies_list,
//            ..._05_Training_toolbox_talks_list,
//            ..._08_Environmental_Aspects_checklist_list, ..._08_Environmental_Aspects_qap_list, ..._08_Environmental_Aspects_emp_list,
//            ..._16_Emergency_Preparedness_emergency_procedure_list,
//            ..._21_Internal_Audit_checklist_list,
//            ...COVID_Management_documents_list
        ];
        return list;
    }

}

exports.run = (eventManager) => {
    new Cntr(eventManager);
};