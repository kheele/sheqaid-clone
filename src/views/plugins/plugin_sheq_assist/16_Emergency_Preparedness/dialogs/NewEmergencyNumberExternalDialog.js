import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {ClearableInput} from '../../../../../components/inputs';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewEmergencyNumberExternalDialog.lazy.css";

@observer
class NewEmergencyNumberExternalDialog extends ANewDialog {
    path = "plugin_sheq_assist/emergency-management/emergency-numbers/";
    pageKey = "NewEmergencyNumberExternalDialog";
    title = "Create External Emergency Number";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/external/";
    
    @observable state = {
        lists: {
            org_name: ['Ambulance', 'Hospital', 'Police', 'Fire Fighting']
        }
    };

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('org_name')) {
            infoDialog.open('Organization is required');
            return;
        }
        if (!form.isValid('contacts')) {
            infoDialog.open('Contact No. is required');
            return;
        }

        const {org_name, area, contacts} = form.data;
        const data = {org_name, contacts};
        if(area) {
            data.area = area;
        }

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
                        <ClearableInput name="org_name" type="select" placeholder="Organization..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.org_name} add returnValue/>
                        <ClearableInput name="area" type="text" placeholder="Area" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contacts" type="text" placeholder="Contact No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewEmergencyNumberExternalDialog;
