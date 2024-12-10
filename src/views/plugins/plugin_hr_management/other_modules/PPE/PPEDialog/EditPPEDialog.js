// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from '../../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../../utils/Utils';

import {AEditDialog} from '../../../../../../components/dialogs';
import {ClearableInput, RowOrgs, UploadButton} from '../../../../../../components/inputs';
import {
    NewDepartmentListTable,
    NewJobPositionListTable,
    NewTeamListTable
} from '../../../../../../components/FormTableComponents';
import {FormControls, Row} from '../../../../../../components/FormComponents';

import style from "./EditPPEDialog.lazy.css";
import findByIdPPE from "mutations/all/PPE/findByIdPPE";
import updatePPE from "mutations/all/PPE/updatePPE";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPEDialog";
    title = "Edit PPE Type";
    findById = findByIdPPE;
    removeById = updatePPE;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/ppe/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            duration_type: [
                {text: "Years", value: "Years", checked: false},
                {text: "Months", value: "Months", checked: false},
                {text: 'Weeks', value: 'Weeks', checked: false},
                {text: 'Days', value: 'Days', checked: false}
            ]
        },
        duration_type: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("duration_type", this.onChangeDurationType.bind(this));
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeDurationType(el, val) {
        this.state.duration_type = val;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('PPE Type is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        //1
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }

        //2
        if (!form.isValid('name')) {
            infoDialog.open('PPE Type is required');
            return;
        }

        const {
            site, project, client,
            //
            name, unit, duration_type, duration_value, notes, profile_pic,
            //
            team_list,
            department_list,
            job_position_list
        } = form.data;

        const data = {};

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, unit, 'unit');
        ShouldUpdate.check(data, old_data, duration_type, 'duration_type');
        ShouldUpdate.check(data, old_data, duration_value, 'duration_value');
        ShouldUpdate.check(data, old_data, notes, 'notes');
        ShouldUpdate.checkFile(data, old_data, profile_pic, 'profile_pic');

        ShouldUpdate.checkTeamList(data, old_data, team_list, 'team_list');
        ShouldUpdate.checkDepartmentList(data, old_data, department_list, 'department_list');
        ShouldUpdate.checkJobPositionList(data, old_data, job_position_list, 'job_position_list');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        updatePPE({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            if (res === "ERROR") {
                infoDialog.open("An error occurred. Please try again.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                this.props.close();
            }
            infoDialog.close(2000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    site, project, client,
                    name, unit, duration_type, duration_value, notes, profile_pic,
                    team_list = [],
                    department_list = [],
                    job_position_list = []
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Type Details"
                >
                    <ClearableInput name="name" type="text" placeholder="PPE Type" defaultValue={name}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="unit" type="text" placeholder="Measurement Unit" defaultValue={unit}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="duration_type" type="radio" placeholder="Duration Type"
                                    defaultValue={duration_type} vertical className="col-lg-12 form-control"
                                    onChange={this.form.onChange} values={this.state.lists.duration_type} returnValue/>
                    <DurationValueWrapper state={this.state} defaultValue={duration_value}
                                          onChange={this.form.onChange}/>
                    <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <UploadButton
                        name="profile_pic"
                        defaultValue={profile_pic}
                        buttonTitle="PPE Type Photo"
                        type={['Photo']}
                        showOnlyIcon
                        className="col-lg-6 col-xs-12 hor-center"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Teams / Departments / Job Positions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewTeamListTable name="team_list" defaultValue={[...team_list, null]} title="Team(s)"
                                  onChange={this.form.onChange}/>
                <hr className="pull-left margin-t-5 margin-b-15"/>
                <NewDepartmentListTable name="department_list" defaultValue={[...department_list, null]}
                                        title="Department(s)" onChange={this.form.onChange}/>
                <hr className="pull-left margin-t-5 margin-b-15"/>
                <NewJobPositionListTable name="job_position_list" defaultValue={[...job_position_list, null]}
                                         title="Job Position(s)" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="DurationValueWrapper">
@observer
class DurationValueWrapper extends React.Component {

    render() {
        const {state, defaultValue, onChange} = this.props;
        if (!state.duration_type) return null;
        return <ClearableInput name="duration_value" type="number" placeholder="Duration Value"
                               defaultValue={defaultValue} required className="col-lg-12 form-control"
                               onChange={onChange}/>;
    }
}

// </editor-fold>

export default EditDialog;
