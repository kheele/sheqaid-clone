//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../utils/Form';

import {ANewDialog} from '../../dialogs';

import style from "./SignatureDialog.lazy.css";
import {FormControls, Row} from "../../FormComponents";
import {NewSignatureSettingsListTable} from "../../FormTableComponents";
import {
    ClearableInput, SelectEmployeeInput,
    SelectModuleClaimsInput,
    SelectModuleExtraInput,
    SelectModuleHRInput,
    SelectModuleSHEQInput
} from "../../inputs";
import {execWhen} from "../../../utils/Utils";

//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class Dialog extends ANewDialog {
    pageKey = "SignatureDialog";
    title = "Signature Settings";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}
//</editor-fold>

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/signature-settings/';

    @observable
    state = {
        lists: {
            plugin: [
                {text: 'SHEQ Management', value: 'plugin_sheq_assist', checked: false},
                {text: 'Human Resource Management', value: 'plugin_hr_management', checked: false},
                {text: 'Claim Management', value: 'plugin_claim_management', checked: false},
                {text: 'Extra Modules', value: 'plugin_extra', checked: false},
            ],
            is_employee_owning: [
                {text: 'Yes', value: true, checked: false},
                {text: 'No', value: false, checked: false},
            ],
        },
        plugin: null,
    };

    //<editor-fold desc="constructor">
    constructor() {
        super();

        this.form = new Form();
        this.form.addChangeOne("plugin", this.onChangePlugin.bind(this));
    }
    //</editor-fold>

    //<editor-fold desc="onChanges">
    onChangePlugin(el, val) {
        this.state.plugin = val;
    }
    //</editor-fold>

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('plugin')) {
            infoDialog.open('Plugin is required');
            return;
        }
        if (!form.isValid('module')) {
            infoDialog.open('Module is required');
            return;
        }
        if (!form.isValid('is_employee_owning')) {
            infoDialog.open('Select "Requires Employee Owning The Form" option');
            return;
        }
        if (!form.get('is_employee_owning') && !form.isValid('signature_settings_list')) {
            infoDialog.open('Other Employee(s) To Sign is/are required');
            return;
        }

        const {
            plugin, module,
            is_employee_owning,
            signature_settings_list
        } = form.data;
        const data = {
            plugin,
            module,
            is_employee_owning,
        };

        if(signature_settings_list) {
            data.signature_settings_list = signature_settings_list.map(({job_position, employee,}) => ({
                job_position: job_position ? (isString(job_position) ? job_position : (job_position.name || job_position.data.name)) : null,
                employee: employee ? {id: employee.id, fname: employee.data.fname, lname: employee.data.lname, email: employee.data.email} : null,
            }));
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
    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {plugin, module} = this.props.dialog.props;
        return <FormControls>
            <Row
                activeAlways
                rendered
                idx={0}
                title="Plugin & Module"
            >
                <ClearableInput name="plugin" type="radio" placeholder="Plugin" defaultValue={plugin} vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.plugin} returnValue/>
                <SelectModule state={this.state} defaultValue={module} onChange={this.form.onChange}/>
            </Row>
            <Row
                activeAlways
                rendered
                idx={1}
                title="Employee(s) To Sign"
            >
                <ClearableInput name="is_employee_owning" type="radio" placeholder="Requires Employee Owning The Form?"
                                vertical className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.is_employee_owning} returnValue/>
                <hr/>
                <label className="margin-0 margin-t-10 col-lg-12">Other Employee(s) To Sign</label>
                <NewSignatureSettingsListTable name="signature_settings_list" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    //</editor-fold>
}

//<editor-fold desc="SelectModule">
@observer
class SelectModule extends React.Component {
    render() {
        const {state: {plugin}, defaultValue, onChange} = this.props;

        if (!plugin) {
            return null;
        }

        let node = [<hr/>];
        if (plugin === 'plugin_sheq_assist') {
            node.push(<SelectModuleSHEQInput name="module" defaultValue={defaultValue} className="col-lg-12"
                                             onChange={onChange}/>);
        } else if (plugin === 'plugin_hr_management') {
            node.push(<SelectModuleHRInput name="module" defaultValue={defaultValue} className="col-lg-12"
                                           onChange={onChange}/>);
        } else if (plugin === 'plugin_extra') {
            node.push(<SelectModuleExtraInput name="module" defaultValue={defaultValue} className="col-lg-12"
                                              onChange={onChange}/>);
        } else if (plugin === 'plugin_claim_management') {
            node.push(<SelectModuleClaimsInput name="module" defaultValue={defaultValue} className="col-lg-12"
                                               onChange={onChange}/>);
        } else {
            return null;
        }

        return <>{node}</>;
    }
}

//</editor-fold>

export default Dialog;
