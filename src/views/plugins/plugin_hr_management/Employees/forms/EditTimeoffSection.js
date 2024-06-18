import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {Dates, toDataURI} from 'utils/Utils';

import {LeaveControls} from "../../Leaves/forms/ProfileDialog";
import Settings from "../../../../../utils/Settings";

@observer
class EditTimeoffSection extends React.Component {
    static isValid = Settings.isEmployeeTimeOffViewers;
    pageKey = "EditTimeoffSection";

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    //</editor-fold>

    //<editor-fold desc="formData">
    get formData() {
        const {form, form: {data}} = this;
        let {
            leave_list,
        } = data;
        //

        return new Promise(async (resolve, reject) => {
            resolve({
                leave_list: {
                    data: await Promise.all((leave_list || []).map(async (
                        {
                            doc,
                            date,
                            days_booked,
                            due_to,
                            employee_comments,
                            expiry_date,
                            notes,
                            reason,
                            type,
                        }
                    ) => ({
                        doc: doc && {path: await toDataURI(doc.path)},
                        date: Dates.formatTimestampSQL(date),
                        days_booked,
                        due_to: !form.isValid('due_to') ? 'Occurred Incident' : due_to,
                        employee_comments,
                        expiry_date: Dates.formatTimestampSQL(expiry_date),
                        notes,
                        reason,
                        type,
                    })))
                },
            });
        });
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen, onFormSave, item, idx} = this.props;

        let {
            id,
            // leave_list,
        } = (item && item.data) || {};

        const {form, form: {data}} = this;
        const {
            leave_list,
        } = data;

        const isNewEmployee = !id;

        const props = {
            item,
            formData: data,
            isNewEmployee,
            isEmbedded: true,
            onChange: this.form.onChange,
        };

        return <LeaveControls {...props} defaultValue={leave_list} tabsHeight="530px"/>;
    }

    //</editor-fold>
}

export default EditTimeoffSection;