// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {TinyMCE} from 'components/documents';
import {ShouldUpdate} from "utils/Utils";
import {AEditDialog} from 'components/dialogs';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {
    SelectClientInput,
    SelectMeetingInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditMinutesDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditMinutesDialog extends AEditDialog {
    pageKey = "EditMinutesDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Safety Data Sheet";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/calendar/minutes/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}, {text: 'Very High', value: 'Very High'}],
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
        if(idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Product Name is required');
                return;
            }
//            if (!form.isValid('category')) {
//                infoDialog.open('Category is required');
//                return;
//            }
        }
//        if(idx === 2) {
//            if (!form.isValid('risk_level')) {
//                infoDialog.open('Risk Assessment Level is required');
//                return;
//            }
//        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {isConsultant} = storage.is;

        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('meeting')) {
            infoDialog.open('Meeting (Agenda) is required');
            return;
        }
        
        const { 
            client, project, site,
            //
            meeting, details, participants, doc
        } = form.data;
        const data = {};
        
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
        
        ShouldUpdate.check(data, old_data, meeting, 'meeting');
        ShouldUpdate.check(data, old_data, details, 'details');
        ShouldUpdate.checkEmployeeList_deprecated(data, old_data, participants, 'participants');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
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
        
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover},
                meetingType
            },
            item, item: {
                id, data: {
                    created_at,
                    //
                    client, project, site,
                    //
                    meeting, details, participants, doc
                }
            }
        } = this;
        
        const {isConsultant} = storage.is;
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={0}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={1}
                title="1. Meeting (Agenda)" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
                onFormBack={onFormBack} 
            >
                <SelectMeetingInput name="meeting" placeholder="Meeting (Agenda)..." defaultValue={meeting} meetingType={meetingType} required className="col-lg-12 form-control" onChange={this.form.onChange} add/>
                <SelectedMeeting state={this.state}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Participants" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
                onFormBack={onFormBack} 
            >
                <NewEmployeeListTable ref="participants" name="participants" defaultValue={participants} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Minutes Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
                onFormBack={onFormBack} 
            >
                <TinyMCE name="details" defaultValue={details} height={300} open onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. Minutes Document" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <UploadButton 
                    name="doc" 
                    type={['PDF', 'Word']} 
                    buttonTitle='Upload PDF/Word' 
                    defaultValue={doc}
                    showOnlyIcon 
                    className="col-lg-6 hor-center" 
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditMinutesDialog;
