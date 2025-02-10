// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewJobTaskDialog.lazy.css";
import {insertJobTaskCategory} from "mutations/create";
import {
    NewComplianceRequirementListTable,
    NewJobPositionListTable,
    NewJobTaskCategoryListTable,
    NewPPETypeListTable,
} from "components/FormTableComponents";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewJobTaskDialog";
    title = "Create Job Task";

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
                infoDialog.open('Job Task is required');
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
            infoDialog.open('Job Task is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            name,
            desc,
            priority_level,
            estimated_duration,
            //
            job_position_list,
            category_list,
            ppe_type_list,
            compliance_requirement_list,
        } = form.data;
        const data = {
            name,
            desc,
            priority_level,
            estimated_duration,

            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,

            job_position_list: {
                data: (job_position_list || []).map(v => {
                    if (v.job_position) {
                        return {job_position_id: v.job_position.id};
                    } else {
                        return {job_position_id: v.id};
                    }
                }),
            },
            category_list: {
                data: (category_list || []).map(v => {
                    if (v.category) {
                        return {category_id: v.category.id};
                    } else {
                        return {category_id: v.id};
                    }
                }),
            },
            ppe_type_list: {
                data: (ppe_type_list || []).map(v => {
                    if (v.ppe_type) {
                        return {ppe_type_id: v.ppe_type.id};
                    } else {
                        return {ppe_type_id: v.id};
                    }
                }),
            },
            compliance_requirement_list: {
                data: (compliance_requirement_list || []).map(v => {
                    if (v.compliance_requirement) {
                        return {compliance_requirement_id: v.compliance_requirement.id};
                    } else {
                        return {compliance_requirement_id: v.id};
                    }
                }),
            },
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertJobTaskCategory(data).then(res => {
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
                    title="1. Job Task Details"
                >
                    <ClearableInput name="name" type="text" placeholder="Job Task"
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description"
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="priority_level" type="radio" placeholder="Priority Level"
                                    values={this.state.lists.priority_level}
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="estimated_duration" type="text" placeholder="Estimated Duration"
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
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
                <NewJobPositionListTable name="job_position_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Job Task Categories"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewJobTaskCategoryListTable name="category_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. PPE Types"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewPPETypeListTable name="ppe_type_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Compliance Requirements"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewComplianceRequirementListTable name="compliance_requirement_list" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
