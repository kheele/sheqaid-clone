// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from '../../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../../utils/Utils';

import {AEditDialog} from '../../../../../../components/dialogs';
import {ClearableInput, RowOrgs} from '../../../../../../components/inputs';
import {NewApplicableRegulationListTable, NewJobTaskListTable} from '../../../../../../components/FormTableComponents';
import {FormControls, Row} from '../../../../../../components/FormComponents';

import style from "./EditComplianceRequirementDialog.lazy.css";
import {findByIdComplianceRequirement} from "../../../../../../mutations/findById";
import {updateComplianceRequirement} from "../../../../../../mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditComplianceRequirementDialog";
    title = "Edit Compliance Requirement";
    findById = findByIdComplianceRequirement;
    removeById = updateComplianceRequirement;
    onUpdate = updateComplianceRequirement;

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
                infoDialog.open('Compliance Requirement is required');
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
                infoDialog.open('Compliance Requirement is required');
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
                    name,
                    desc,
                    applicable_regulation_list = [],
                    job_task_list = [],
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                client={client}
                project={project}
                site={site}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Compliance Requirement Details"
                >
                    <ClearableInput name="name" type="text" placeholder="Compliance Requirement" defaultValue={name}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="text" placeholder="Description" defaultValue={desc}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Applicable Regulations"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewApplicableRegulationListTable name="applicable_regulation_list" title="Applicable Regulations"
                                                  defaultValue={[...applicable_regulation_list, null]}
                                                  onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Job Tasks"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewJobTaskListTable name="job_task_list" defaultValue={[...job_task_list, null]} title="Job Tasks"
                                     onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
