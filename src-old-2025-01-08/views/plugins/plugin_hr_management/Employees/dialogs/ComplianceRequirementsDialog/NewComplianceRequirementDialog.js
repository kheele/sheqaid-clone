// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from '../../../../../../utils/Form';

import {ANewDialog} from '../../../../../../components/dialogs';
import {ClearableInput, RowOrgs} from '../../../../../../components/inputs';
import {NewApplicableRegulationListTable} from '../../../../../../components/FormTableComponents';
import {FormControls, Row} from '../../../../../../components/FormComponents';

import style from "./NewComplianceRequirementDialog.lazy.css";
import {insertComplianceRequirement} from "../../../../../../mutations/create";
import NewJobTaskListTable from "../../../../../../components/FormTableComponents/NewJobTaskListTable";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewComplianceRequirementDialog";
    title = "Create Compliance Requirement";

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

        this.form = new Form();
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

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        //1
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }

        //2
        if (!form.isValid('name')) {
            infoDialog.open('Compliance Requirement is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            name,
            desc,
            //
            applicable_regulation_list,
            job_task_list,
        } = form.data;
        const data = {
            name,
            desc,

            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,

            applicable_regulation_list: {
                data: (applicable_regulation_list || []).map(v => {
                    if (v.regulation) {
                        return {regulation_id: v.regulation.id};
                    } else {
                        return {regulation_id: v.id};
                    }
                }),
            },
            job_task_list: {
                data: (job_task_list || []).map(v => {
                    if (v.job_task) {
                        return {job_task_id: v.job_task.id};
                    } else {
                        return {job_task_id: v.id};
                    }
                }),
            },
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertComplianceRequirement(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
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
                    title="1. Compliance Requirement Details"
                >
                    <ClearableInput name="name" type="text" placeholder="Compliance Requirement"
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description"
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
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
                                                  onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Job Tasks"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewJobTaskListTable name="job_task_list" title="Job Tasks" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
