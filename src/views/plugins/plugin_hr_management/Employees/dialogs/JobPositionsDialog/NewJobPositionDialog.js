import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectClientInput, SelectJobCategoryInput, UploadButton} from 'components/inputs';
import {ANewDialog} from 'components/dialogs';

import style from "./NewJobPositionDialog.lazy.css";
import {FormControls, Row} from "components/FormComponents";
import {insertJobPosition} from "mutations/create";

@observer
class NewJobPositionDialog extends ANewDialog {
    pageKey = "NewJobPositionDialog";
    title = "Create Job Position";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/job-positions/';
    @observable
    state = {};

    constructor() {
        super();

        this.form = new Form();
    }

    componentDidMount() {

    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Job Position is required');
            return;
        }

        const {name, desc, job_category, client, doc} = form.data;
        const data = {
            name,
            desc,
            job_category_id: job_category && job_category.id,
            client_id: client && client.id,
            doc: doc && doc.path,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertJobPosition(data).then(res => {
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

    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;

        const {isConsultant, isNoProjects} = storage.is;
        return (<FormControls>
            {!isNoProjects && <Row
                active
                rendered
                idx={0}
                title="Company"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectClientInput name="client" placeholder="Company..." required
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Job Position Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="name" type="text" placeholder="Job Position" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectJobCategoryInput name="job_category" className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
                <ClearableInput name="desc" type="textarea" placeholder="Job Description" required
                                className="form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Job Description Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Upload Document (PDF / Word)"
                    type={['PDF', 'Word']}
                    showOnlyIcon
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }
}

export default NewJobPositionDialog;
