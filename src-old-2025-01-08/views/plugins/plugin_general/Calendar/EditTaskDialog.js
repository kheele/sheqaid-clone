import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {GDocEditor} from 'components/documents';
import {ClearableInput, SelectEmployeeInput, SelectUserInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditTaskDialog.lazy.css";

@observer
class EditTaskDialog extends AEditDialog {
    pageKey = "EditTaskDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Task";
    }

    onCancel(e, btn) {
        this.refs.controls.onRemoveDoc().then(() => {
            super.onCancel(e, btn);
        });
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/calendar/tasks/";

    @observable
    state = {
        lists: {
            categories: ['General Task', 'Specific Task', 'NCR Action'],
            is_doc_required: ['Document Is Required From Task Recipient'].map(value => {
                return {text: value, value, checked: false};
            }),
            is_doc_attached: ['Attach Document'].map(value => {
                return {text: value, value, checked: false};
            }),
            is_doc_edit_allowed: ['Allow Task Recipient To Edit Attached Document'].map(value => {
                return {text: value, value, checked: false};
            }),
            type: []
        },
        title: null,
        new_doc_id: null
    };

    constructor() {
        super();
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    
    onRemoveDoc() {
        const {doc_desc, doc} = this.refs;
        return Promise.all([doc_desc.removeDoc(), doc.removeDoc()]);
    }
 
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('assigned_by')) {
                infoDialog.open('Task Assigned By is required');
                return;
            }
            if (!form.isValid('person_assigned')) {
                infoDialog.open('Task Assigned To is required');
                return;
            }
            if (!form.isValid('date')) {
                infoDialog.open('Start Date is required');
                return;
            }
            if (!form.isValid('due_date')) {
                infoDialog.open('Due Date is required');
                return;
            }
        }     
        
        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('assigned_by')) {
            infoDialog.open('Task Assigned By is required');
            return;
        }
        if (!form.isValid('person_assigned')) {
            infoDialog.open('Task Assigned To is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Start Date is required');
            return;
        }
        if (!form.isValid('due_date')) {
            infoDialog.open('Due Date is required');
            return;
        }

        const {
            assigned_by, person_assigned, 
            category, type, 
            date, due_date,
            desc, 
            doc_desc,
            doc,
            is_doc_required, is_doc_attached, is_doc_edit_allowed
        } = form.data;
        const data = {};
        
        ShouldUpdate.checkUser(data, old_data, assigned_by, 'assigned_by');
        ShouldUpdate.checkEmployee_deprecated(data, old_data, person_assigned, 'person_assigned');
        ShouldUpdate.check(data, old_data, category, 'category');
        ShouldUpdate.check(data, old_data, type, 'type');  
        ShouldUpdate.checkDate_deprecated(data, old_data, date, 'date');
        ShouldUpdate.checkDate_deprecated(data, old_data, due_date, 'due_date');
        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.check(data, old_data, doc_desc, 'doc_desc');
        ShouldUpdate.check(data, old_data, doc, 'doc');
        ShouldUpdate.check(data, old_data, is_doc_required, 'is_doc_required');
        ShouldUpdate.check(data, old_data, is_doc_attached, 'is_doc_attached');
        ShouldUpdate.check(data, old_data, is_doc_edit_allowed, 'is_doc_edit_allowed');
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            res.start = new Date(res.data.start);
            res.end = new Date(res.data.end);

            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        
        const {
            props: {onFormNext, onFormBack, onFormOpen},
            item, item: {
                id, data: {
                    created_at,
                    category, type, assigned_by, person_assigned, desc, start, end, doc, doc_desc,
                    is_doc_required, is_doc_attached, is_doc_edit_allowed
                }
            }
        } = this;
        
        console.log('item', this.item)

        return <FormControls onChange={this.form.onChange}>
            <Row 
                rendered  
                active
                idx={1}
                title="1. General Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}>
                    <label className="w-full-calc-subtract-10 text-center margin-t-10 margin-r-10 margin-b-0">Persons Involved</label>
                    <SelectUserInput ref="assigned_by" name="assigned_by" placeholder="Task Assigned By..." defaultValue={assigned_by} className="col-lg-6 col-xs-12 form-control"/>
                    <SelectEmployeeInput ref="person_assigned" name="person_assigned" placeholder="Task Assigned To..." defaultValue={person_assigned} className="col-lg-6 col-xs-12 form-control"/>
                    
                    <label className="w-full-calc-subtract-10 text-center margin-t-10 margin-r-10 margin-b-0">Category & Type</label>
                    <ClearableInput ref="category" name="category" type="select" placeholder="Task Category" defaultValue={category} className="col-lg-6 col-xs-12 form-control" values={this.state.lists.categories} add returnValue/>
                    <ClearableInput ref="type" name="type" type="select" placeholder="Type Of Task" defaultValue={type} className="col-lg-6 col-xs-12 form-control" values={this.state.lists.type} add returnValue/>
                    
                    <label className="w-full-calc-subtract-10 text-center margin-t-10 margin-r-10 margin-b-0">Start & Due Date</label>
                    <ClearableInput ref="date" name="date" type="date" placeholder="Start Date..." defaultValue={start} className="col-lg-6 col-xs-12 form-control"/>
                    <ClearableInput ref="due_date" name="due_date" type="date" placeholder="Due Date..." defaultValue={end} className="col-lg-6 col-xs-12 form-control pull-right"/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Task Description"
                className="row-dec"
                sectionClassName="min-h-390"
                onFormOpen={onFormOpen}  
                onFormNext={onFormNext}
                onFormBack={onFormBack}>
                    <label className="text-center margin-l-10 margin-t-10 margin-r-10 margin-b-0 w-full-calc-subtract-20">Short Description</label>
                    <ClearableInput ref="desc" name="desc" type="textarea" placeholder="Short Description" defaultValue={desc} className="margin-l-10 margin-r-10 margin-b-10 w-full-calc-subtract-20 form-control"/>
                        
                    <hr className="doc-options-hr margin-l-10 margin-r-10 w-full-calc-subtract-20"/>
                        
                    <label className="text-center margin-l-10 margin-t-10 margin-r-10 margin-b-0 w-full-calc-subtract-20">Long Description</label>
                    <GDocEditor ref="doc_desc" name="doc_desc" defaultValue={doc_desc} state={this.state}/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Document"
                className="row-doc"
                onFormOpen={onFormOpen}  
                onFormBack={onFormBack}>
                    <ClearableInput ref="is_doc_required" name="is_doc_required" type="checkbox" defaultValue={is_doc_required} className="col-lg-6 col-xs-12 is_doc_required margin-b-10 padding-b-0 padding-l-10 form-control" values={this.state.lists.is_doc_required}/>
                    
                    <hr className="doc-options-hr margin-l-10 margin-r-10 w-full-calc-subtract-20 pull-left"/>
                     
                    <ClearableInput ref="is_doc_attached" name="is_doc_attached" type="checkbox" defaultValue={is_doc_attached} className="col-lg-6 col-xs-12 margin-t-30 padding-b-0 padding-l-10 form-control" values={this.state.lists.is_doc_attached}/>
                    <ClearableInput ref="is_doc_edit_allowed" name="is_doc_edit_allowed" type="checkbox" defaultValue={is_doc_edit_allowed} className="col-lg-6 col-xs-12 margin-b-10 padding-b-0 padding-l-10 form-control" values={this.state.lists.is_doc_edit_allowed}/>
                        
                    <hr className="doc-options-hr margin-l-10 margin-r-10 margin-b-20 w-full-calc-subtract-20 pull-left"/>
                       
                    <GDocEditor ref="doc" name="doc" defaultValue={doc} state={this.state} onChangeTitle={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditTaskDialog;
