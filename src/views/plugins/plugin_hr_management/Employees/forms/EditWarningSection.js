import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {WarningControls} from "../../Warnings/forms/ProfileDialog";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class EditWarningSection extends AEmployeeSection {
    static isValid = EmployeeProfileSettings.isEmployeeWarningViewers;
    pageKey = "EditWarningSection";

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
        //     warning_list,
        // } = data;
        // //
        //
        // return new Promise(async (resolve, reject) => {
        //     resolve({
        //         warning_list: {
        //             data: await Promise.all((warning_list || []).map(async (
        //                 {
        //                     doc,
        //                     date,
        //                     details,
        //                     employee_comments,
        //                     expiry_date,
        //                     issued_by,
        //                     notes,
        //                     type,
        //                     witness_list,
        //                 }
        //             ) => ({
        //                 doc,//: doc && {path: await toDataURI(doc.path)},
        //                 date: Dates.formatTimestampSQL(date),
        //                 details,
        //                 employee_comments,
        //                 expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                 issued_by_id: issued_by && issued_by.id,
        //                 notes,
        //                 type,
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
            // warning_list,
        } = (item && item.data) || {};

        const {form, form: {data}} = this;
        const {
            warning_list,
        } = data;

        const isNewEmployee = !id;

        const props = {
            item,
            formData: data,
            isNewEmployee,
            isEmbedded: true,
            onChange: this.form.onChange,
        };

        return <WarningControls {...props} defaultValue={warning_list} tabsHeight="530px"/>;
    }

    //</editor-fold>
}

export default EditWarningSection;