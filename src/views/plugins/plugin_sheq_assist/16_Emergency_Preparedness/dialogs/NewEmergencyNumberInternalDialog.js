import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewEmergencyNumberInternalDialog.lazy.css";

@observer
class NewEmergencyNumberInternalDialog extends ANewDialog {
    path = "plugin_sheq_assist/emergency-management/emergency-numbers/";
    pageKey = "NewEmergencyNumberInternalDialog";
    title = "Create Internal Emergency Number";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/internal/";

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Name is required');
            return;
        }
        if (!form.isValid('contacts')) {
            infoDialog.open('Contact No. is required');
            return;
        }

        const {name, designation, contacts} = form.data;
        const data = {name, contacts};
        if(designation) {
            data.designation = designation;
        }
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
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="name" type="text" placeholder="Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="designation" type="text" placeholder="Designation" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contacts" type="text" placeholder="Contact No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewEmergencyNumberInternalDialog;
