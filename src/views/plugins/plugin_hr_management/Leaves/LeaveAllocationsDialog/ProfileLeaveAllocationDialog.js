// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileLeaveAllocationDialog.lazy.css";
import {findByIdEmployeeLeaveAllocation} from "mutations/findById";
import {updateEmployeeLeaveAllocation} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileLeaveAllocationDialog";
    findById = findByIdEmployeeLeaveAllocation;
    removeById = updateEmployeeLeaveAllocation;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Leave Allocation";
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
                    client,
                    employee,
                    leave_type,
                    days_allocated,
                    days_used,
                    days_carried_over,
                    days_accrued,
                    last_accrual_date,
                    carryover_expiry_date,
                    year,
                }
            }
        } = this;

        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={1}
                title="1. Employee"
            >
                <ProfileField title="Employee" value={employee} renderer={v => v.full_name}
                              className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
                title="2. Leave Allocation Details"
            >
                <ProfileField title="Leave Type" value={leave_type} renderer={v => v.name} className="col-lg-12"/>
                <ProfileField title="Year" value={year} className="col-lg-12"/>
                <ProfileField title="Days Allocated" value={days_allocated} className="col-lg-12"/>
                <ProfileField title="Days Used" value={days_used} className="col-lg-12"/>
                <ProfileField title="Days Carried Over" value={days_carried_over} className="col-lg-12"/>
                <ProfileField title="Days Accrued" value={days_accrued} className="col-lg-12"/>
                <ProfileField type="date" title="Last Accrual Date" value={last_accrual_date}
                              className="col-lg-12"/>
                <ProfileField type="date" title="Carryover Expiry Date" value={carryover_expiry_date}
                              className="col-lg-12"/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
