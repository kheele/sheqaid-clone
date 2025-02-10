import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';

import {EmployeeVulnerabilityCaseList, TopButtons} from './EmployeeLists';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./ListVulnerableDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ListVulnerableDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Vulnerability Case(s)";
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
                            <span>Vulnerability<br />Status (Yes)</span>
                            <span className="counter">{list.filter(({data:{vulnerability_status}}) => vulnerability_status === 'Yes').length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Age<br />=&gt; 60 years</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({text, status}) => text === 'Age => 60 years' && status === 'Yes')).length}</span>
                        </span>
                        
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Smoking<br />current</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({text, status}) => text === 'Smoking current' && status === 'Yes')).length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Pregnancy<br />=&gt; 28 weeks</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({text, status}) => text === 'Pregnancy => 28 weeks' && status === 'Yes')).length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Obesity</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({text, status}) => text === 'Obesity' && status === 'Yes')).length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Received<br />Flu Vaccine</span>
                            <span className="counter">{list.filter(({data:{checklist}}) => checklist.anyMatch(({text, status}) => text === 'Received Flu Vaccine' && status === 'Yes')).length}</span>
                        </span>
                    </div>
                </div>)}
                <EmployeeVulnerabilityCaseList list={list} renderEmployee/>
            </div>
            <ProfilePDFReader ref="pdfReader" type="Vulnerability" title="Vulnerability Case"/>
        </div>;
    }

}

export default ProfileDialog;
