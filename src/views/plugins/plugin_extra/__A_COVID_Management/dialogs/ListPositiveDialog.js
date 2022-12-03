import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from '../../../../../components/dialogs';

import {EmployeePositiveCaseList, TopButtons} from './EmployeeLists';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import style from "./ListPositiveDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ListPositiveDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Positive Case(s)";
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
                            <span>Outcome<br />(Discharge)</span>
                            <span className="counter">{list.filter(({data:{outcome}}) => outcome === 'Discharge').length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Outcome<br />(Death)</span>
                            <span className="counter">{list.filter(({data:{outcome}}) => outcome === 'Death').length}</span>
                        </span>
                        
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Hospitalised</span>
                            <span className="counter">{list.filter(({data:{hospitalised}}) => hospitalised === 'Yes').length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Illness<br />Type (Severe)</span>
                            <span className="counter">{list.filter(({data:{illness_type}}) => illness_type === 'Severe').length}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>High<br />Risk Contacts</span>
                            <span className="counter">{list.map(({data:{high_risk_contacts_num}}) => high_risk_contacts_num || 0).reduce((n1, n2) => n1 + n2, 0)}</span>
                        </span>
                        <span className="min-h-70 flex-column grid-gap-5 counter">
                            <span>Vulnerability<br />Present</span>
                            <span className="counter">{list.filter(({data:{vulnerability_status}}) => vulnerability_status === 'Yes').length}</span>
                        </span>
                    </div>
                </div>)}
                <EmployeePositiveCaseList list={list} renderEmployee/>
            </div>
            <ProfilePDFReader ref="pdfReader" type="Positive" title="Positive Case"/>
        </div>;
    }

}

export default ProfileDialog;
