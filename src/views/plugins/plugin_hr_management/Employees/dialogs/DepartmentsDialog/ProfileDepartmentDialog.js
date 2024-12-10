import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDepartmentDialog.lazy.css";
import EmployeesDialog from "../EmployeesDialog";
import {CircularProgress} from "@mui/material";
import {findByIdDepartment} from "mutations/findById";
import {updateDepartment} from "mutations/update";

@observer
class ProfileDepartmentDialog extends AProfileDialog {
    pageKey = "ProfileDepartmentDialog";
    findById = findByIdDepartment;
    removeById = updateDepartment;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Department";
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    @computed get item() {
        return this.props.state.item;
    }

    onClick(evt, btn) {
        const {id, data: {name}} = this.item;
        this.refs.employeesDialog.open({
            title: `${name} Department Employees`,
            params: {
                filterData: {
                    department_id: id,
                    isNew: true,
                },
            },
        });
    }

    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at, name, client
                }
            }
        } = this;

        return <>
            <FormControls>
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
                    <Button className="btn btn-primary hor-center margin-v-20" onClick={this.onClick}>View
                        Employees</Button>
                </Row>
            </FormControls>
            <EmployeesDialog ref="employeesDialog"/>
        </>;
    }

}

export default ProfileDepartmentDialog;
