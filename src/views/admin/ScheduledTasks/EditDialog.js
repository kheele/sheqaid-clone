// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';
import style from "./EditDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "ScheduledTask";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Scheduled Task";
    }

    get controls() {
        return Controls;
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
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

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
        const data = {};
        ShouldUpdate.check(data, old_data, group_name, 'group_name');
        ShouldUpdate.check(data, old_data, group_key, 'group_key');  
        ShouldUpdate.checkDate_deprecated(data, old_data, performedAt, 'performedAt');
        ShouldUpdate.check(data, old_data, status, 'status');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close(); 
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>
  
    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {onFormNext, onFormBack, onFormOpen},
            item, item: {
                id, data: {
                    group_name, group_key, performedAt, status
                }
            }
        } = this;
        
        console.log(this.item)
        
        return <FormControls onChange={this.form.onChange}>
            <Row 
                rendered  
                activeAlways
                idx={1}
                title="1. Scheduled Task Details" 
                onFormOpen={onFormOpen}>
                    <ClearableInput name="group_name" type="text" placeholder="Group Name" defaultValue={group_name} className="form-control col-lg-12"/>
                    <ClearableInput name="group_key" type="text" placeholder="Group Key" defaultValue={group_key} className="form-control col-lg-12"/>
                    <ClearableInput name="id" type="text" placeholder="ID" defaultValue={id} className="form-control col-lg-12"/>
                    <ClearableInput name="performedAt" type="date" placeholder="Performed At" defaultValue={performedAt} className="form-control col-lg-12"/>
                    <ClearableInput name="status" type="select" placeholder="Status..." defaultValue={status} className="form-control col-lg-12" values={this.state.lists.status} returnValue/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditDialog;
