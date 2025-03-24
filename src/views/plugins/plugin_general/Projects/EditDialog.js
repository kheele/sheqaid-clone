import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from "utils/Utils";
import {ClearableInput, SelectClientInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {AEditDialog} from 'components/dialogs';
import style from "./EditDialog.lazy.css";
import {updateProject} from "mutations/update";
import {NewSiteListTable} from "../../../../components/FormTableComponents";
import {findByIdProject} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "Project";
    className = 'ANewTableFormDialog';
    removeById = updateProject;
    findById = findByIdProject;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Project";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/projects/";
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
            infoDialog.open('Project Name is required');
            return;
        }

        const {name, address, client} = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, address, 'address');
        ShouldUpdate.checkClient(data, old_data, client, 'client_id');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateProject({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            storage.update.updateProject(this.item.id, data);
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
                    created_at, name, address, client, site_list
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
                title="Project Details"
            >
                <ClearableInput name="name" type="text" placeholder="Project Name" defaultValue={name} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="address" type="textarea" placeholder="Project Address" defaultValue={address}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    defaultValue={RenderUtils.selectedClient.call(this)}
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
            </Row>
            <Row
                activeAlways
                rendered
                idx={2}
                rowClassName="flex row-more"
                title="Sites"
            >
                <NewSiteListTable
                    title="Sites"
                    name="site_list"
                    defaultValue={site_list}
                    readonly
                />
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
