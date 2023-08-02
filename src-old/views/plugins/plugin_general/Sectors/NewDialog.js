import React from "react";
import {observer} from 'mobx-react';

import Form from '../../../../utils/Form';

import {ClearableInput} from '../../../../components/inputs';
import {FormControls, Row} from '../../../../components/FormComponents';
import {ANewDialog} from '../../../../components/dialogs';

import style from "./NewDialog.lazy.css";

@observer
class NewDialog extends ANewDialog {
    pageKey = "Sector";
    title = "Create Sector";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/sectors/";

    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Sector Name is required');
            return;
        }

        const {name} = form.data;
        const data = {name};

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return <FormControls onChange={this.form.onChange}>
            <Row 
                activeAlways
                rendered 
                idx={1}
                title="Sector Details">
                    <ClearableInput name="name" type="text" placeholder="Sector Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default NewDialog;
