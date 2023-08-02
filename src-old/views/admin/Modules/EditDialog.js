// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../utils/Form';
import {ShouldUpdate} from '../../../utils/Utils';

import {ClearableInput} from '../../../components/inputs';
import {NewModuleListTable} from '../../../components/FormTableComponents';
import {FormControls, Row} from '../../../components/FormComponents';
import {AEditDialog} from '../../../components/dialogs';
import style from "./EditDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "ModuleGroup";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Module Group";
    }

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = "admin/plugin_manager/";
    
    @observable state = {
        lists: {
            app: ['Admin', 'Client'].map(label => {
                return {label, value: label};
            }),
            status: ['Installed', 'Not Installed', 'Upcoming'].map(label => {
                return {label, value: label.replace(' ', '')};
            })
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
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
        const {form, item: {data: old_data}} = this;

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
        const data = {};
        ShouldUpdate.check(data, old_data, title, 'title');
        ShouldUpdate.check(data, old_data, key, 'key');  
        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.check(data, old_data, status, 'status');
        ShouldUpdate.check(data, old_data, app, 'app');
        
        const {modules: old_modules = []} = old_data;
        if(!modules.isEmpty() || !old_modules.isEmpty()) {
            const compareArrays = (a1, a2) => {
                const map = (v1, v2) => {
                    const matchKeys = Object.keys(v1).sort() === Object.keys(v2).sort();
                    const matchValues = Object.values(v1).sort() === Object.values(v2).sort();
                    return matchKeys && matchValues;
                };
                return a1.allMatch(v1 => a2.anyMatch(v2 => map(v1, v2))) &&
                        a2.allMatch(v2 => a1.anyMatch(v1 => map(v2, v1)));
            };
            if(modules.length !== old_modules.length || !compareArrays(modules, old_modules)) {
                data.modules = modules.map(v => {
                    return {
                        ...v, 
                        has_update: v.has_update === 'Yes',
                        discount: v.discount ? parseFloat(v.discount) : 0.00,
                        price: v.price ? parseFloat(v.price) : 0.00,
                        sort: v.sort ? parseInt(v.sort) : 0,
                        faIconLeft: v.faIconLeft || '',
                        faIconRight: v.faIconRight || '',
                        svgIconLeft: v.svgIconLeft || '',
                        company_list: v.company_list ? v.company_list.filter(v => !!v && (!!v.id || !!v.company)).slice().map(v => toJS(v || v.company)) : []
                    };
                });
            } else {
                
            }
        }
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)
        console.log("Modules.EditDialog.onSubmit", data)

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
                    title, key, desc, modules = [], status, app
                }
            }
        } = this;
        
        console.log(this.item)
        
        return <FormControls onChange={this.form.onChange}>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Module Group Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}>
                    <ClearableInput name="title" type="text" placeholder="Group Name" defaultValue={title} className="form-control col-lg-12"/>
                    <ClearableInput name="key" type="text" placeholder="Group Key" defaultValue={key} className="form-control col-lg-12"/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description" defaultValue={desc} className="form-control col-lg-12"/>
                    <ClearableInput name="status" type="select" placeholder="Status..." defaultValue={status} className="form-control col-lg-12" values={this.state.lists.status} returnValue/>
                    <ClearableInput name="app" type="select" placeholder="Application..." defaultValue={app} className="form-control col-lg-12" values={this.state.lists.app} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Module Details"
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}>
                <NewModuleListTable name="modules" defaultValue={[...modules, null]} onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditDialog;
