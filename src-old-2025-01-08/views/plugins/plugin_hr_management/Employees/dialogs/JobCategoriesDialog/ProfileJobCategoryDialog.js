import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileJobCategoryDialog.lazy.css";
import EmployeesDialog from "../EmployeesDialog";
import {CircularProgress} from "@mui/material";
import {findByIdJobCategory} from "mutations/findById";
import {updateJobCategory} from "mutations/update";

@observer
class ProfileJobCategoryDialog extends AProfileDialog {
    pageKey = "ProfileJobCategoryDialog";
    findById = findByIdJobCategory;
    removeById = updateJobCategory;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Job Category";
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
            title: `${name} Job Category Employees`,
            params: {
                filterData: {
                    job_category_id: id,
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
                    created_at,
                    client,
                    name,
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
                    title="Job Category Details"
                >
                    <ProfileField title="Name" name="name" value={name} className="col-lg-12"/>
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

export default ProfileJobCategoryDialog;
