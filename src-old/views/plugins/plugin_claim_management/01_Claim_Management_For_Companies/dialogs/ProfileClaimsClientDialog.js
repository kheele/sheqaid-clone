// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ProfileField, UploadButton} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {AProfileDialog} from '../../../../../components/dialogs';

import ProfileWCL2Dialog from '../../dialogs/ProfileWCL2Dialog.js';
import ProfileWCL4Dialog from '../../dialogs/ProfileWCL4Dialog.js';
import ProfileWCL5Dialog from '../../dialogs/ProfileWCL5Dialog.js';
import ProfileWCL6Dialog from '../../dialogs/ProfileWCL6Dialog.js';
import ProfileAnnexture1Dialog from '../../dialogs/ProfileAnnexture1Dialog.js';

import PrintWCL2Dialog from '../../dialogs/PrintWCL2Dialog.js';
import PrintWCL4Dialog from '../../dialogs/PrintWCL4Dialog.js';
import PrintWCL5Dialog from '../../dialogs/PrintWCL5Dialog.js';
import PrintWCL6Dialog from '../../dialogs/PrintWCL6Dialog.js';
import PrintAnnexture1Dialog from '../../dialogs/PrintAnnexture1Dialog.js';

import ChatBtn from '../../dialogs/ChatBtn';
import ButtonGeneratePDF from '../../dialogs/ButtonGeneratePDF';
import ButtonWCl from '../../dialogs/ButtonWCl';
import WCl5Table from "../../dialogs/WCl5Table";

import style from "./ProfileClaimsClientDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileClaimsClientDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Claim";
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/COIDA_Management/claims/client/";
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onClickChat = this.onClickChat.bind(this);
        this.onViewDialog = this.onViewDialog.bind(this);
        this.onPrintDialog = this.onPrintDialog.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="buttons funs">
    onViewDialog(evt, btn) {
        const {name, title, dialogName} = btn.props;
        const { 
            item, refs
        } = this;
        
        const dialog = refs[dialogName];
        if(!dialog) return;
        
        const value = item.data[name];
        if(!value) {
            infoDialog.open(`${title} is not available`);
            return;
        }
        dialog && dialog.open(item);
    }
    
    onPrintDialog(evt, btn) {
        let {name, title, dialogName, value} = btn.props;
        const dialog = this.refs[dialogName];
        if(!dialog) return;
        
        if(!value) {
            value = this.item.data[name];
        }
        
        if(!value) {
            infoDialog.open(`${title} is not available`);
            return;
        }
        dialog && dialog.open(this.item);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onClickChat">
    onClickChat(btn) {
        const {onChange} = this.props;
        chatBoxClaims.setActiveItem(this.item, btn, newMsg => {
            const {id, data: {message_list_provider}} = this.item;
            neonBinding.events.emit(this.path + "chat", id, message_list_provider).then(res => {
                console.log("claim chat res", res)
            });
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
            state,
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    client, project, site, 
                    employee, 
                    claim_number, 
                    provincial_office,
                    accident_date,
                    wcl_2, wcl_4, wcl_5_list, wcl_6, 
                    annexture_1,
                    doctor_email
                }
            }
        } = this;
        
        const {isContractor, isConsultant} = storage.is;
        return <FormControls>
                <Row 
                    rendered  
                    active
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    {isConsultant && <ProfileField name="client" value={client} renderer={v => v.name || v.data.name} placeholder="Company" className="col-lg-12"/>}
                    <ProfileField name="project" value={project} renderer={v => v.name || v.data.name} placeholder="Project" className="col-lg-6"/>
                    <ProfileField name="site" value={site} renderer={v => v.name || v.data.name} placeholder="Site" className="col-lg-6"/>
                </Row>
                <Row 
                    rendered 
                    idx={1}
                    title="Employee Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="employee" title="Employee" value={employee} renderer={v => ((v.fname || v.data.fname) + ' ' + (v.lname || v.data.lname))} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="Claim Number / Provincial Office / Date of Accident" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="claim_number" title="Claim Number" value={claim_number} className="col-lg-12"/>
                    <ProfileField name="provincial_office" title="Provincial Office" value={provincial_office} className="col-lg-12"/>
                    <ProfileField name="accident_date" title="Date of Accident" value={accident_date} type="date" className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="W.CI.2 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ButtonWCl value={wcl_2} name="wcl_2" dialogName="profileWCL2Dialog" text="W.CI.2" onClick={this.onViewDialog}/>
                    <hr className="margin-t-5 margin-b-15"/>
                    <ButtonGeneratePDF value={wcl_2} name="wcl_2" dialogName="printWCL2Dialog" text="W.CI.2" onClick={this.onPrintDialog}/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="W.CI.4 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ButtonWCl value={wcl_4} name="wcl_4" dialogName="profileWCL4Dialog" text="W.CI.4" onClick={this.onViewDialog}/>
                    <hr className="margin-t-5 margin-b-5"/>
                    <UploadButton 
                        ref="wcl_4_external_doc" 
                        name="wcl_4_external_doc" 
                        defaultValue={wcl_4 && wcl_4.external_doc}
                        buttonTitle="W.CI.4 Attachment" 
                        type={['PDF', 'Word', 'Photo']}
                        readonly
                        showOnlyIcon 
                        className="col-lg-12 col-xs-12 margin-t-10"
                    />
                    <hr className="margin-t-5 margin-b-15"/>
                    <ButtonGeneratePDF value={wcl_4} name="wcl_4" dialogName="printWCL4Dialog" text="W.CI.4" onClick={this.onPrintDialog}/>
                    <hr className="margin-t-5 margin-b-15"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Medical Practioner/Chiropractor Email Address
                    </label>
                    <ProfileField name="doctor_email_1" type="text" title="Email Address" value={doctor_email} footerDesc="For Filling W.CI.4 Online" className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="W.CI.5 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <WCl5Table ref="wcl_5_list" name="wcl_5_list" defaultValue={wcl_5_list || []} onViewDialog={this.onViewDialog} onPrintDialog={this.onPrintDialog}/>
                </Row>
                <Row 
                    rendered 
                    idx={6}
                    title="W.CI.6 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ButtonWCl value={wcl_6} name="wcl_6" dialogName="profileWCL6Dialog" text="W.CI.6" onClick={this.onViewDialog}/>
                    <hr className="margin-t-5 margin-b-15"/>
                    <ButtonGeneratePDF value={wcl_6} name="wcl_6" dialogName="printWCL6Dialog" text="W.CI.6" onClick={this.onPrintDialog}/>
                </Row>
                <Row 
                    rendered 
                    idx={7}
                    title="Annexture 1 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <ButtonWCl value={annexture_1} name="annexture_1" dialogName="profileAnnexture1Dialog" text="Annexture 1" onClick={this.onViewDialog}/>
                    <hr className="margin-t-5 margin-b-15"/>
                    <ButtonGeneratePDF value={annexture_1} name="annexture_1" dialogName="printAnnexture1Dialog" text="Annexture 1" onClick={this.onPrintDialog}/>
                </Row>
                
            <ProfileWCL2Dialog ref="profileWCL2Dialog"/>
            <ProfileWCL4Dialog ref="profileWCL4Dialog"/>
            <ProfileWCL5Dialog ref="profileWCL5Dialog"/>
            <ProfileWCL6Dialog ref="profileWCL6Dialog"/>
            <ProfileAnnexture1Dialog ref="profileAnnexture1Dialog"/>
            <PrintWCL2Dialog ref="printWCL2Dialog"/>
            <PrintWCL4Dialog ref="printWCL4Dialog"/>
            <PrintWCL5Dialog ref="printWCL5Dialog"/>
            <PrintWCL6Dialog ref="printWCL6Dialog"/>
            <PrintAnnexture1Dialog ref="printAnnexture1Dialog"/>
            
            <ChatBtn item={item} onClick={this.onClickChat}/>
        </FormControls>;
    }
    // </editor-fold>
}

export default ProfileDialog;
//352