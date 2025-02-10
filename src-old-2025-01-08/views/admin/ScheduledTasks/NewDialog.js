// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "ScheduledTask";
    title = "Create Scheduled Task";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = "admin/scheduled-tasks/";
    
    @observable state = {
        lists: {
            status: ['Schedule', 'Error', 'Undefined Worker', 'Undefined Group'].map(label => {
                return {label, value: label.replace(' ', '')};
            })
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.form = new Form();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('group_name')) {
            infoDialog.open('Group Name is required');
            return;
        }
        if (!form.isValid('group_key')) {
            infoDialog.open('Group Key is required');
            return;
        }
        if (!form.isValid('id')) {
            infoDialog.open('ID is required');
            return;
        }
        if (!form.isValid('performedAt')) {
            infoDialog.open('Performed At is required');
            return;
        }
        if (!form.isValid('status')) {
            infoDialog.open('Status is required');
            return;
        }

        const {group_name, group_key, performedAt, status} = form.data;
        const data = {group_name, group_key, performedAt: performedAt.getTime(), status};
        
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
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        
        return <FormControls onChange={this.form.onChange}>
            <Row 
                rendered  
                activeAlways
                idx={1}
                title="1. Scheduled Task Details" 
                onFormOpen={onFormOpen}>
                    <ClearableInput name="group_name" type="text" placeholder="Group Name" className="form-control col-lg-12"/>
                    <ClearableInput name="group_key" type="text" placeholder="Group Key" className="form-control col-lg-12"/>
                    <ClearableInput name="id" type="text" placeholder="ID" className="form-control col-lg-12"/>
                    <ClearableInput name="performedAt" type="date" placeholder="Performed At" className="form-control col-lg-12"/>
                    <ClearableInput name="status" type="select" placeholder="Status..." className="form-control col-lg-12" values={this.state.lists.status} returnValue/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewDialog;
