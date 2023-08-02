// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../utils/Form';

import {ClearableInput} from '../../../components/inputs';
import {NewModuleListTable} from '../../../components/FormTableComponents';
import {FormControls, Row} from '../../../components/FormComponents';
import {ANewDialog} from '../../../components/dialogs';

import style from "./NewDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "ModuleGroup";
    title = "Create Module Group";

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
    path = "admin/plugin_manager/";
    
    @observable state = {
        lists: {
            status: ['Installed', 'Not Installed', 'Upcoming'].map(label => {
                return {label, value: label.replace(' ', '')};
            }),
            app: ['Admin', 'Client'].map(label => {
                return {label, value: label};
            })
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('title')) {
                infoDialog.open('Group Name is required');
                return;
            }
            if (!form.isValid('key')) {
                infoDialog.open('Key is required');
                return;
            }
            if (!form.isValid('status')) {
                infoDialog.open('Status is required');
                return;
            }
            if (!form.isValid('app')) {
                infoDialog.open('Application is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('title')) {
            infoDialog.open('Group Name is required');
            return;
        }
        if (!form.isValid('key')) {
            infoDialog.open('Key is required');
            return;
        }
        if (!form.isValid('status')) {
            infoDialog.open('Status is required');
            return;
        }
        if (!form.isValid('app')) {
            infoDialog.open('Application is required');
            return;
        }

        const {title, key, desc, modules = [], status, app} = form.data;
        const data = {
            title, 
            key, 
            desc: desc || 'No Description', 
            modules: modules.slice().map(v => {
                return {
                    ...v, 
                    has_update: v.has_update === 'Yes',
                    discount: v.discount ? parseFloat(v.discount) : 0.00,
                    price: v.price ? parseFloat(v.price) : 0.00,
                    sort: v.sort ? parseInt(v.sort) : 0,
                    faIconLeft: v.faIconLeft || '',
                    faIconRight: v.faIconRight || '',
                    svgIconLeft: v.svgIconLeft || '',
                    company_list: v.company_list ? v.company_list.filter(v => !!v && !!v.company).slice().map(v => toJS(v.company)) : []
                };
            }), 
            status,
            app
        };
        
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
                active
                idx={1}
                title="1. Module Group Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}>
                    <ClearableInput name="title" type="text" placeholder="Group Name" className="form-control col-lg-12"/>
                    <ClearableInput name="key" type="text" placeholder="Group Key" className="form-control col-lg-12"/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description" className="form-control col-lg-12"/>
                    <ClearableInput name="status" type="select" placeholder="Status..." className="form-control col-lg-12" values={this.state.lists.status} returnValue/>
                    <ClearableInput name="app" type="select" placeholder="Application..." className="form-control col-lg-12" values={this.state.lists.app} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Module Details"
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}>
                <NewModuleListTable name="modules" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewDialog;
