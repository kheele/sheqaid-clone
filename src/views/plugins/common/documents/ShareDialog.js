import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {AProfileDialog} from 'components/dialogs';
import {Button, ClearableInput, Clickable} from 'components/inputs';
import {NavButtons, ViewDocumentDetailsPanel} from 'components/FormComponents';

import style from "./ShareDialog.lazy.css";

@observer
class ShareDialog extends AProfileDialog {
    pageKey = "ShareDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Share " + this.props.title;
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Share
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
        lists: {
            allow_doc_editing: ["Allow Document Editing"].map(value => {
                return {value: "Yes", text: value, checked: false}
            })
        }
    }
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            if (!form.isValid('fname')) {
                infoDialog.open('First Name is required');
                return;
            }
            if (!form.isValid('lname')) {
                infoDialog.open('Last Name is required');
                return;
            }
            if (!form.isValid('email')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('email').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        if (!form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }
        if (!form.isValid('email')) {
            infoDialog.open('Email Address is required');
            return;
        } else if (!form.get('email').isEmailAddress()) {
            infoDialog.open('Email Address is not valid');
            return;
        }
        
        const {
            fname, lname, email, doc_expiry_date, allow_doc_editing, notes
        } = form.data;
        
        const data = {
            fname, lname, email
        };
        
        if(notes) {
            data.notes = notes;
        }
        if(doc_expiry_date) {
            data.doc_expiry_date = doc_expiry_date.getTime();
        }
        if(allow_doc_editing) {
            data.allow_doc_editing = allow_doc_editing;
        }
        
        console.log(data)

        btn.text("Sharing...").disabled();
        workers.emit(this.props.path + "share", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Document successfully shared.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Share").enabled();
        });  
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
                    created_at, type, desc, internal_or_external, responsible_department, responsible_person, expiry, company, title, doc_num, doc
                }
            }
        } = this;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Person Sharing Document To
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="fname" type="text" placeholder="First Name" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="lname" type="text" placeholder="Last Name" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="email" type="email" placeholder="Email Address" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Document Notes & Permissions
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="doc_expiry_date" type="date" placeholder="Date Document Sharing Expires..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="allow_doc_editing" type="checkbox" className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.allow_doc_editing} returnValue/>
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
                <ViewDocumentDetailsPanel item={this.item} />
            </div>
        </div>;
    }

}

export default ShareDialog;
//240