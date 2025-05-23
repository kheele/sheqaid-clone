// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileLeavePolicyDialog.lazy.css";
import {findByIdEmployeeLeavePolicy} from "mutations/findById";
import {updateEmployeeLeavePolicy} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileLeavePolicyDialog";
    findById = findByIdEmployeeLeavePolicy;
    removeById = updateEmployeeLeavePolicy;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Leave Policy";
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    client,
                    leave_type,
                    default_days_allowed,
                    max_carryover_years,
                    accrual_period_start,
                    accrual_period_end,
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;
        return <FormControls>
            {!isNoProjects && <Row
                activeAlways
                rendered
                idx={0}
                title="Company"
            >
                <ProfileField title="Company" value={client} renderer={v => v.name}
                              className="col-lg-12"/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="Leave Policy Details"
            >
                <ProfileField title="Leave Type" value={leave_type} renderer={v => v.name} className="col-lg-12"/>
                <ProfileField title="Default Days Allocated" value={default_days_allowed} className="col-lg-12"/>
                <ProfileField title="Max. Years To Carry Over" value={max_carryover_years} className="col-lg-12"/>
                <ProfileField type="date" title="Accrual Period Start Date" value={accrual_period_start}
                              className="col-lg-12"/>
                <ProfileField type="date" title="Accrual Period End Date" value={accrual_period_end}
                              className="col-lg-12"/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
