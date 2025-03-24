import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {CounselingControls} from "../../Counselings/forms/ProfileDialog";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";

@observer
class EditCounselingSection extends React.Component {
    static isValid = EmployeeProfileSettings.isEmployeeCounselingViewers;
    pageKey = "EditCounselingSection";

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    //</editor-fold>

    //<editor-fold desc="formData">
    get formData() {
        return this.form.data;
        // const {form, form: {data}} = this;
        // let {
        //     counselling_list,
        // } = data;
        // //
        //
        // return new Promise(async (resolve, reject) => {
        //     resolve({
        //         counselling_list: {
        //             data: await Promise.all((counselling_list || []).map(async (
        //                 {
        //                     doc,
        //                     responsible_person,
        //                     corrective_actions,
        //                     counselling_hrs_to_complete,
        //                     expiry_date,
        //                     incident_desc,
        //                     reasons,
        //                     types,
        //                     witness_list,
        //                 }
        //             ) => ({
        //                 doc,//: doc && {path: await toDataURI(doc.path)},
        //                 responsible_person_id: responsible_person && responsible_person.id,
        //                 corrective_actions,
        //                 counselling_hrs_to_complete,
        //                 expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                 incident_desc,
        //                 reasons,
        //                 types,
        //                 witness_list: {
        //                     data: witness_list ? witness_list.map(v => {
        //                         if (v.id) {
        //                             return {witness_id: v.id};
        //                         }
        //                         const {job_position} = v;
        //                         if (job_position) {
        //                             delete v.job_position;
        //                             v.job_position_id = job_position.id;
        //                         }
        //                         return {witness_external: {data: v}};
        //                     }) : []
        //                 },
        //             })))
        //         },
        //     });
        // });
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen, onFormSave, item, idx} = this.props;

        let {
            id,
            // counselling_list,
        } = (item && item.data) || {};

        const {form, form: {data}} = this;
        const {
            counselling_list,
        } = data;

        const isNewEmployee = !id;

        const props = {
            item,
            formData: data,
            isNewEmployee,
            isEmbedded: true,
            onChange: this.form.onChange,
        };

        return <CounselingControls {...props} defaultValue={counselling_list} tabsHeight="530px"/>;
    }

    //</editor-fold>
}

export default EditCounselingSection;