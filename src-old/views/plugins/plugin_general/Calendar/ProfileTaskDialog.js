import React from "react";
import {observer} from 'mobx-react';
import {GDocEditor} from '../../../../components/documents';
import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField} from '../../../../components/inputs';
import {FormControls, Row} from '../../../../components/FormComponents';

import style from "./ProfileTaskDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTaskDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Task";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    category, type, assigned_by, person_assigned, desc, start, end, doc, doc_desc,
                    is_doc_required, is_doc_attached, is_doc_edit_allowed
                }
            }
        } = this;
        
        console.log('item', this.item)

        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. General Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}>
                    <label className="w-full-calc-subtract-10 text-center margin-t-10 margin-r-10 margin-b-0">Persons Involved</label>
                    <ProfileField name="assigned_by" placeholder="Task Assigned By" value={assigned_by} renderer={v => v.lname + ' ' + v.fname} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="person_assigned" placeholder="Task Assigned To" value={person_assigned} renderer={v => v.lname + ' ' + v.fname} className="col-lg-6 col-xs-12"/>
                    
                    <label className="w-full-calc-subtract-10 text-center margin-t-10 margin-r-10 margin-b-0">Category & Type</label>
                    <ProfileField name="category" value={category} placeholder="Task Category" className="col-lg-6 col-xs-12"/>
                    <ProfileField name="type" value={type} placeholder="Type Of Task" className="col-lg-6 col-xs-12"/>  
                    
                    <label className="w-full-calc-subtract-10 text-center margin-t-10 margin-r-10 margin-b-0">Start & Due Date</label>
                    <ProfileField name="date" value={start} type="date" placeholder="Start Date" className="col-lg-6 col-xs-12"/>
                    <ProfileField name="due_date" value={end} type="date" placeholder="Due Date" className="col-lg-6 col-xs-12"/>
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
                    <label className="text-center margin-t-10 margin-r-10 margin-b-0 w-full-calc-subtract-10">Short Description</label>
                    <ProfileField name="desc" placeholder="Short Description" value={desc} className="margin-r-10 margin-b-10 w-full-calc-subtract-10"/>  
                       
                    <hr className="doc-options-hr margin-r-10 w-full-calc-subtract-10"/>
                        
                    <label className="text-center margin-t-10 margin-r-10 margin-b-0 w-full-calc-subtract-10">Long Description</label>
                    <GDocEditor name="doc_desc" defaultValue={doc_desc} readonly/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Document"
                className="row-doc"
                onFormOpen={onFormOpen}  
                onFormBack={onFormBack}>
                    <ProfileField name="is_doc_required" placeholder="Document Required" value={is_doc_required} className="col-lg-12 margin-b-10"/>
                    
                    <hr className="doc-options-hr margin-t-10 margin-r-10 w-full-calc-subtract-10"/>
                     
                    <ProfileField name="is_doc_attached" placeholder="Document Attached?" value={is_doc_attached} className="col-lg-6 col-xs-12 margin-b-10"/>
                    <ProfileField name="is_doc_edit_allowed" placeholder="Document Edit Allowed?" value={is_doc_edit_allowed} className="col-lg-6 col-xs-12 margin-b-10"/>
                       
                    <hr className="doc-options-hr margin-t-10 margin-r-10 w-full-calc-subtract-10"/>
                       
                    <GDocEditor name="doc" defaultValue={doc} readonly/>
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
