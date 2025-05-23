// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileLeaveTypeDialog.lazy.css";
import {findByIdEmployeeLeaveType} from "mutations/findById";
import {updateEmployeeLeaveType} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileLeaveTypeDialog";
    findById = findByIdEmployeeLeaveType;
    removeById = updateEmployeeLeaveType;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Leave Type";
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
                    name,
                    desc,
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
                title="Leave Type Details"
            >
                <ProfileField title="Name" value={name} className="col-lg-12"/>
                <ProfileField title="Description" value={desc} className="col-lg-12"/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
