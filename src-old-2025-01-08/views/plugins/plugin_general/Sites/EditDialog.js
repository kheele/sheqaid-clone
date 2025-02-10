import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ClearableInput, SelectClientInput, SelectProjectInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {AEditDialog} from 'components/dialogs';
import style from "./EditDialog.lazy.css";

import {ShouldUpdate} from "utils/Utils";
import {updateSite} from "mutations/update";

@observer
class EditDialog extends AEditDialog {
    pageKey = "Site";
    className = 'ANewTableFormDialog';
    removeById = updateSite;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Site";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/sites/";
    @observable
    state = {};

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Site Name is required');
            return;
        }

        const {name, address, project, client} = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, address, 'address');
        ShouldUpdate.checkProject(data, old_data, project, 'project_id');
        ShouldUpdate.checkClient(data, old_data, client, 'client_id');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateSite({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            storage.update.updateSite(this.item.id, data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            progressDialog.close();
        });
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item, item: {
                id, data: {
                    created_at, name, address, project, client, employees
                }
            }
        } = this;

        console.log(this.item)

        const {isConsultant} = storage.is;
        return <FormControls onChange={this.form.onChange}>
            <Row
                rendered
                activeAlways
                idx={1}
                title="Site Details">
                <ClearableInput name="name" type="text" placeholder="Site Name" defaultValue={name} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="address" type="textarea" placeholder="Site Address" defaultValue={address}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                {isConsultant && <SelectClientInput name="client" placeholder="Company..."
                                                    defaultValue={RenderUtils.selectedClient.call(this)} required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..."
                                    defaultValue={RenderUtils.selectedProject.call(this)} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
