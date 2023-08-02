import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
    ClearableInput,
    SelectClientInput,
} from 'components/inputs';
import {ANewDialog} from 'components/dialogs';

import style from "./NewJobCategoryDialog.lazy.css";
import {FormControls, Row} from "components/FormComponents";
import insertJobCategory from "mutations/all/JobCategory/insertJobCategory";

@observer
class NewJobCategoryDialog extends ANewDialog {
    pageKey = "NewJobCategoryDialog";
    title = "Create Job Category";

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
            infoDialog.open('Name is required');
            return;
        }

        const {name, client,} = form.data;
        const data = {
            name,
            client_id: client && client.id,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertJobCategory(data).then(res => {
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
                <SelectClientInput name="client" placeholder="Company..." required showAll
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Job Category Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="name" type="text" placeholder="Name" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }
}

export default NewJobCategoryDialog;
