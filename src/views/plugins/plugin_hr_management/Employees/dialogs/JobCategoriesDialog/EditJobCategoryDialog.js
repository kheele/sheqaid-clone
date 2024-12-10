import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';
import {ClearableInput, SelectClientInput,} from 'components/inputs';

import {AEditDialog} from 'components/dialogs';
import style from "./EditJobCategoryDialog.lazy.css";
import {FormControls, Row} from "components/FormComponents";
import {updateJobCategory} from "mutations/update";
import {CircularProgress} from "@mui/material";
import {findByIdJobCategory} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "JobCategoryDialog";
    className = 'ANewTableFormDialog';
    findById = findByIdJobCategory;
    removeById = updateJobCategory;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Job Category";
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

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    @computed get item() {
        return this.props.state.item;
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Name is required');
            return;
        }

        const {name, client} = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.checkClient(data, old_data, client);

        console.log(data)

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateJobCategory({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            if (res === "NOT_FOUND") {
                infoDialog.open("Sorry! The record no longer exist.");
            } else if (res) {
                onSaved && onSaved(res.data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            } else {
                infoDialog.open("Could not save the record. Please try again.");
            }
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, name
                }
            }
        } = this;

        console.log(this.item)

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
                <SelectClientInput name="client" placeholder="Company..."
                                   defaultValue={RenderUtils.selectedClient.call(this)}
                                   required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Job Category Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput name="name" type="text" placeholder="Name" defaultValue={name} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }
}

export default EditDialog;
