import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDepartmentDialog.lazy.css";
import EmployeesDialog from "./EmployeesDialog";

@observer
class ProfileDepartmentDialog extends AProfileDialog {
    pageKey = "ProfileDepartmentDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Department";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {};

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(evt, btn) {
        this.refs.employeesDialog.open();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at, name, client
                }
            }
        } = this;

        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={0}
                title="Company"
            >
                <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name}
                              className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Department Details"
            >
                <ProfileField title="Department Name" name="name" value={name} className="col-lg-12"/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
                title="Actions"
            >
                <Button className="btn btn-primary hor-center margin-b-20" onClick={this.onClick}>View
                    Employees</Button>
            </Row>
            <EmployeesDialog ref="employeesDialog" />
        </FormControls>;
    }

}

export default ProfileDepartmentDialog;
