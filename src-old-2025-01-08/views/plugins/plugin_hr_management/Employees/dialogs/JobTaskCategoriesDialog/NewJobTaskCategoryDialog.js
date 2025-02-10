// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewJobTaskCategoryDialog.lazy.css";
import {insertJobTaskCategory} from "mutations/create";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewJobTaskCategoryDialog";
    title = "Create Job Task Category";

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
                infoDialog.open('Job Task Category is required');
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
            infoDialog.open('Job Task Category is required');
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
            job_task_list,
        } = form.data;
        const data = {
            name,
            desc,

            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,

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
                    title="1. Job Task Category Details"
                    onFormNext={null}
                >
                    <ClearableInput name="name" type="text" placeholder="Job Task Category"
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="text" placeholder="Description"
                                    className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
