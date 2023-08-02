import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput, SelectClientInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
import insertProject from "mutations/all/Project/insertProject";

@observer
class NewDialog extends ANewDialog {
    pageKey = "Project";
    title = "Create Project";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/projects/";

    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Project Name is required');
            return;
        }

        const {
            name,
            address,
            client
        } = form.data;
        const data = {
            name,
            address,
            client_id: client && client.id,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertProject(data).then(res => {
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
        const {client} = this.props.extraProps;
        return <FormControls onChange={this.form.onChange}>
            <Row 
                rendered  
                activeAlways
                idx={1}
                title="Project Details" >
                    <ClearableInput name="name" type="text" placeholder="Project Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="address" type="textarea" placeholder="Project Address" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." required client={client} className="col-lg-12 form-control" onChange={this.form.onChange}/>}
            </Row>
        </FormControls>;
    }
}

export default NewDialog;
