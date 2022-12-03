
const onSuccess = (state, key, displayTitle) => {
    return res => {
        state.list.push(...res.map(item => {
            const {id, data: {
                    created_at,
                    fname, lname, email, doc_expiry_date, allow_doc_editing, notes,
                    doc_tbl, doc_name, doc_id, doc_ref = {},
                    edited_doc, edited_doc_approved
                }
            } = item;
            const {type, desc, internal_or_external, responsible_department, responsible_person, expiry, company, title, doc_num, doc} = doc_ref;
            return {
                start: new Date(doc_expiry_date),
                end: new Date(doc_expiry_date),
                title: displayTitle + " Expiry Date (" + title + ')',
                displayTitle,
                item,
                key
            };
        }));
        state.dataError = false;
        state.dataLoaded = true;
    };
};

const onFailure = (state) => {
    return e => {
        console.log(e);
        state.dataError = true;
        state.dataLoaded = true;
    };
};

const _01_Project_Plan = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/01_Project_Plan/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "01_Project_Plan", "Project Plan")).catch(onFailure(state));
};

const _01_Project_Plan_documents = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/01_Project_Plan/documents/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "CompanyDocument", "Company Document")).catch(onFailure(state));
};

const _02_IMS_Policies = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/02_IMS_Policies/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "02_IMS_Policies", "IMS Policy")).catch(onFailure(state));
};

const _05_Training_toolbox_talks = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/05_Trainings/toolbox-talks/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "05_Training_ToolboxTalks", "Training Toolbox Talks")).catch(onFailure(state));
};

const _08_Environmental_Aspects_checklist = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/08_Environmental_Aspects/checklist/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "08_Environmental_Aspects_Checklist", "Environmental Checklist")).catch(onFailure(state));
};

const _08_Environmental_Aspects_qap = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/08_Environmental_Aspects/qap/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "08_Environmental_Aspects_QAP", "Environmental Quality Assurance Plan")).catch(onFailure(state));
};

const _08_Environmental_Aspects_emp = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/08_Environmental_Aspects/emp/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "08_Environmental_Aspects_EMP", "Environmental Management Plan")).catch(onFailure(state));
};

const _16_Emergency_Preparedness_emergency_procedure = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/16_Emergency_Preparedness/emergency-procedure/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "16_Emergency_Preparedness_Emergency_Procedure", "Emergency Procedure")).catch(onFailure(state));
};

const COVID_Management_documents = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/COVID_Management/documents/shared/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "COVID_Management_Document", "COVID Management Document")).catch(onFailure(state));
};

const load = (state, selectedDate, selectedView) => {
    state.list.clear();
    _01_Project_Plan(state, selectedDate, selectedView);
    _01_Project_Plan_documents(state, selectedDate, selectedView);
    _02_IMS_Policies(state, selectedDate, selectedView);
    _05_Training_toolbox_talks(state, selectedDate, selectedView);
    _08_Environmental_Aspects_checklist(state, selectedDate, selectedView);
    _08_Environmental_Aspects_qap(state, selectedDate, selectedView);
    _08_Environmental_Aspects_emp(state, selectedDate, selectedView);
    _16_Emergency_Preparedness_emergency_procedure(state, selectedDate, selectedView);
    COVID_Management_documents(state, selectedDate, selectedView);
};

export default {load};