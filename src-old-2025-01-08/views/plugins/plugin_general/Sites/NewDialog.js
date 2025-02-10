import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectClientInput, SelectProjectInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
import {insertSite} from "mutations/create";

@observer
class NewDialog extends ANewDialog {
    pageKey = "Site";
    title = "Create Site";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/sites/";

    @observable state = {
        selectedClient: null,
        selectedProject: null
    };

    constructor() {
        super();

        this.onChangeClient = this.onChangeClient.bind(this);

        this.form = new Form();
        this.form.addChangeOne("client", this.onChangeClient);
    }

    onChangeClient(el, val) {
        this.state.selectedClient = val;
        if (val && this.form.isValid('project')) {
            const project = this.form.get('project');
            const {client} = project.data;
            if (!client || (client.id !== val.id)) {
                this.refs.project.reset();
            }
        }
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Site Name is required');
            return;
        }

        const {
            name,
            address,
            project,
            client
        } = form.data;
        const data = {
            name,
            address,
            project_id: project && project.id,
            client_id: client && client.id,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertSite(data).then(res => {
            console.log("res", res)
            storage.load.loadClients(true);

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
        const {isConsultant} = storage.is;
        const {client, project} = this.props.extraProps;
        return <FormControls onChange={this.form.onChange}>
            <Row
                rendered
                activeAlways
                idx={1}
                title="Site Details">
                <ClearableInput name="name" type="text" placeholder="Site Name" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="address" type="textarea" placeholder="Site Address"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." client={client} required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." project={project} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default NewDialog;
