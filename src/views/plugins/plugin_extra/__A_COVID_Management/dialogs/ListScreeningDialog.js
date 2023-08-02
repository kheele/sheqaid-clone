import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';

import {EmployeeScreeningList, TopButtons} from './EmployeeLists';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./ListScreeningDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ListScreeningDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Screening(s)";
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get topButtons() {
        return <TopButtons 
            key={`${new Date().getTime()}`}
            dialog={this}
            state={this.state} 
            onCancel={this.onCancel} 
            onSubmit={this.onSubmit}
            onRef={(ref, name) => this.refs[name] = ref}
        />;
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
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {onSubmitDataOptions} = this.props.dialog.props;
        const {text: action} = btn.props;
        if(action === 'Submit') {
            onSubmitDataOptions(e, btn, this.item);
        } else if(action === 'Print') {
            this.refs.pdfReader.open(this.item);
        }
//        neonBinding.events.emit(this.props.path + "share", this.item.id, data).then(res => {
//            console.log("res", res)
//            onSaved && onSaved(res);
//            infoDialog.open("Document successfully shared.");
//            infoDialog.close(2000);
//            this.props.close();
//        }).finally(() => {
//            btn.text("Share").enabled();
//        }); 
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }
    
    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog, dialog: {renderProfileCover}},
            item: list
        } = this;
        
        const title = dialog.extraProp('title');
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<div className="flex-column">
                    {title}
                    <div className="Stats grid-8 grid-gap-5">
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Records</span>
                            <span className="counter">{list.length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Employees</span>
                            <span className="counter">{list.map(({data:{employee}}) => employee.id).distinct().length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Consent (No)</span>
                            <span className="counter">{list.filter(({data:{consent}}) => (isObject(consent) ? consent.value : consent) === 'No').length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Symptoms<br />Present (Yes)</span>
                            <span className="counter">{list.filter(({data:{symptoms_status}}) => symptoms_status === 'Yes').length}</span>
                        </span>
                        
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Has Fever</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'temperature' && parseFloat(status) > 38)).length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Not<br />Wearing Mask</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'are_you_wearing_a_mask' && status === 'No')).length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>In Contact<br />With Covid Patient</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'in_contact_with_covid_patient' && status === 'Yes')).length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Travelled In<br />Last 14 Days</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'last_14_days_travelled' && status === 'Yes')).length}</span>
                        </span>
                    </div>
                </div>)}
                <EmployeeScreeningList list={list} renderEmployee/>
            </div>
            <ProfilePDFReader ref="pdfReader" type="Screening" title="Screening Case"/>
        </div>;
    }

}

export default ProfileDialog;
