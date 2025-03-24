// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfilePPERequisitionDialog.lazy.css";
import {findByIdPPERequisition} from "mutations/findById";
import {updatePPERequisition} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPERequisitionDialog";
    findById = findByIdPPERequisition;
    removeById = updatePPERequisition;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "PPE Requisition";
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
                    site,
                    project,
                    client,
                    auto_reorder_trigger,
                    approval_status,
                    quantity,
                    reason,
                    ppe_type,
                    employee,
                }
            }
        } = this;

        return <FormControls>
            <RowOrgs
                readonly
                client={client}
                project={project}
                site={site}
                active
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Requisition Details"
                    onFormNext={null}
                >
                    <ProfileField title="Employee" value={employee} renderer={v => v.full_name} className="col-lg-12"/>
                    <ProfileField title="PPE Type" value={ppe_type} renderer={v => v.name} className="col-lg-12"/>
                    <ProfileField title="Quantity" value={quantity} className="col-lg-12"/>
                    <ProfileField title="Reason" value={reason} className="col-lg-12"/>
                    <ProfileField title="Date" type="date" value={created_at} className="col-lg-12"/>
                    <ProfileField title="Approval Status" value={approval_status} className="col-lg-12"/>
                    <ProfileField title="Reorder Type" value={auto_reorder_trigger} className="col-lg-12"/>
                </Row>
            </RowOrgs>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
