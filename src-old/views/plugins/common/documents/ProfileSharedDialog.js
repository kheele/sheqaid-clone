import React from "react";
import {observer} from 'mobx-react';

import Form from '../../../../utils/Form';

import {Dates} from '../../../../utils/Utils';
import {AProfileDialog} from '../../../../components/dialogs';
import {Button, Clickable, ProfileField, ProfilePic} from '../../../../components/inputs';
import {NavButtons, ViewDocumentDetailsPanel} from '../../../../components/FormComponents';

import style from "./ProfileSharedDialog.lazy.css";

@observer
class ProfileSharedDialog extends AProfileDialog {
    pageKey = "ProfileSharedDialog";
  
    constructor(props) {
        super(props, style);
    }
    
    open(item, title) {
        this._title = title;
        return super.open(item);
    }

    title() {
        return this._title || this.props.title;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path;
    
    constructor(props) {
        super(props);
        
        this.path = this.props.dialog.extraProp("path") + "shared/";
        
        this.onNext = this.onNext.bind(this);
        this.onApprove = this.onApprove.bind(this);
        
        this.form = new Form();
    }

    onNext(e, btn) {        
        return true;
    }
    
    onApprove(e, btn) {
        btn.text("Approving document...").disabled();
        neonBinding.events.emit(this.path + "approve", this.item.id).then(res => {
            console.log("res", res)
//            onSaved && onSaved(res);
            infoDialog.open("Record successfully approved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Approve Edited Document").enabled();
        });
    }
    
    get item() {
        return this.props.state.item;
    }

    renderProfilePic() {     
        const {data: {company: {id, data}}} = this.item;
        if(data && data.profile_pic) {
            return <img src={data.profile_pic.dlUrls[0]} width="100%" height="100%"/>;
        } else {
            return <ProfilePic readonly profilePic="clients" id={id} fixedCenter/>;
        }
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
                    fname, lname, email, doc_expiry_date, allow_doc_editing, notes,
                    doc_tbl, doc_name, doc_id, doc_ref,
                    edited_doc, edited_doc_completed = false, edited_doc_approved = false
                }
            }
        } = this;
        
        const docTitle = doc_ref && doc_ref.data && (doc_ref.data.title || doc_name.singular);
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>Shared Document ({docTitle})</h3>
                    <h5>{'Create On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                {allow_doc_editing && <div className="row active">
                    <label>
                        1. Edited Document Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    {edited_doc_completed && <div className="row sec-group">
                        <ProfileField title="Document Editing Status" value="Completed" className="col-lg-6"/>
                        <ProfileField title="Edited Document Approved" value={edited_doc_approved ? "Yes" : "No"} className="col-lg-6"/>
                    </div>}
                    {edited_doc_completed && <div className="row sec-group">
                        <Button className="btn btn-primary hor-center margin-t-10" text="Approve Edited Document" onClick={this.onApprove}/>
                        <ProfileField title="Edited Document File" name="edited_doc" value={edited_doc} type="file" className="col-lg-12 h-1100"/>
                    </div>}
                    {!edited_doc_completed && <div className="row sec-group">
                        <ProfileField title="Document Editing Status" value="Processing" className="col-lg-12"/>
                    </div>}
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>}
                <div className={"row"  + (!allow_doc_editing ? " active" : "")}>
                    <label>
                        {allow_doc_editing ? '2' : '1'}. Person Sharing Document To
                        <Clickable idx={allow_doc_editing ? 2 : 1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField title="First Name" value={fname} className="col-lg-4"/>
                        <ProfileField title="Last Name" value={lname} className="col-lg-4"/>
                        <ProfileField title="Email Address" value={email} className="col-lg-4"/>
                    </div>
                    <NavButtons idx={allow_doc_editing ? 2 : 1} onBack={allow_doc_editing && onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        {allow_doc_editing ? '3' : '2'}. Document Notes & Permissions
                        <Clickable idx={allow_doc_editing ? 3 : 2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField title="Date Document Sharing Expires" type="date" value={doc_expiry_date} className="col-lg-6"/>
                        <ProfileField title="Allow Document Editing" value={allow_doc_editing} className="col-lg-6"/>
                        <ProfileField title="Notes" type="textarea" value={notes} className="col-lg-12"/>
                    </div>
                    <NavButtons idx={allow_doc_editing ? 3 : 2} onBack={onFormBack} onNext={doc_ref && onFormNext}/>
                </div>
                {doc_ref && <ViewDocumentDetailsPanel idx={4} title={allow_doc_editing && "4. View Original Document Details"} item={doc_ref} onFormBack={onFormBack} onFormOpen={onFormOpen}/>}
            </div>
        </div>;
    }

}

export default ProfileSharedDialog;
