// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from '../../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../../utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditJobTaskDialog.lazy.css";
import {findByIdJobTaskCategory} from "mutations/findById";
import {updateJobTaskCategory} from "mutations/update";
import {
    NewComplianceRequirementListTable,
    NewJobPositionListTable,
    NewJobTaskCategoryListTable,
    NewPPETypeListTable,
} from "components/FormTableComponents";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditJobTaskDialog";
    title = "Edit Job Task";
    findById = findByIdJobTaskCategory;
    removeById = updateJobTaskCategory;
    onUpdate = updateJobTaskCategory;

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

    state = {
        lists: {
            priority_level: ['Low', 'Medium', 'High'].map(value => {
                return {value, text: value, checked: false};
            }),
        }
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        this.onFormSave = this.onFormSave.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
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
                infoDialog.open('Job Task is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
            props: {dialog: {onProcessUpdateOrgs, onUpdateSave}},
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            onUpdateSave(data, btn, onSaved);
        };

        const {idx} = btn.props;
        if (idx === 0) {
            return onProcessUpdateOrgs(btn);
        }

        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Job Task is required');
                return;
            }

            const {
                site, project, client,
                name, desc,
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, name, 'name');
            ShouldUpdate.check(data, old_data, desc, 'desc');

            onSubmit(data);
            return;
        }

        return true;
    }

    // </editor-fold>

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
                    name, desc, priority_level, estimated_duration,
                    job_position_list = [],
                    category_list = [],
                    ppe_type_list = [],
                    compliance_requirement_list = [],
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                client={client}
                project={project}
                site={site}
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Job Task Details"
                >
                    <ClearableInput name="name" type="text" placeholder="Job Task" defaultValue={name}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description" defaultValue={desc}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="priority_level" type="radio" placeholder="Priority Level"
                                    defaultValue={priority_level}
                                    values={this.state.lists.priority_level}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="estimated_duration" type="text" placeholder="Estimated Duration"
                                    defaultValue={estimated_duration}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Job Positions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewJobPositionListTable name="job_position_list" defaultValue={[...job_position_list, null]}
                                         onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Job Task Categories"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewJobTaskCategoryListTable name="category_list" defaultValue={[...category_list, null]}
                                             onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. PPE Types"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewPPETypeListTable name="ppe_type_list" defaultValue={[...ppe_type_list, null]}
                                     onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Compliance Requirements"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewComplianceRequirementListTable name="compliance_requirement_list"
                                                   defaultValue={[...compliance_requirement_list, null]}
                                                   onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
