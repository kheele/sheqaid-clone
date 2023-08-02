import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {
    ClearableInput,
    PhotoUploadButton,
    SelectEmployeeInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewSafetyObservationReportDialog.lazy.css";

@observer
class NewSafetyObservationReportDialog extends ANewDialog {
    pageKey = "NewSafetyObservationReportDialog";
    title = "Create Safety Observations Report";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/21_Internal_Audit/safety-observations-report/";

    @observable
    state = {
        
    };

    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant, isHasProjects} = storage.is;

        if (isHasProjects && !form.isValid('site')) {
            infoDialog.open('Site is required');
            return;
        }
        if (!form.isValid('observation_type')) {
            infoDialog.open('Observation Type is required');
            return;
        }
        if (!form.isValid('location')) {
            infoDialog.open('Location Of Observation is required');
            return;
        }

        if (!form.isValid('desc')) {
            infoDialog.open('Observation Description is required');
            return;
        }

        if (!form.isValid('causes')) {
            infoDialog.open('Causes is required');
            return;
        }
        if (!form.isValid('corrective_action')) {
            infoDialog.open('Corrective Action is required');
            return;
        }
        if (!form.isValid('observed_team_member')) {
            infoDialog.open('Observed Team Member is required');
            return;
        }
        if (!form.isValid('signature')) {
            infoDialog.open('Signature is required');
            return;
        }

        if (!form.isValid('photo')) {
            infoDialog.open('Please Upload Photo Of The Observation');
            return;
        }

        const {
            site, observation_type, location, desc, causes, corrective_action, observed_team_member, signature, photo
        } = form.data;
        const data = {
            site: {id: site.id, name: site.data.name}, observation_type, 
            location, desc, causes, corrective_action, 
            observed_team_member: {id: observed_team_member.id, fname: observed_team_member.data.fname, lname: observed_team_member.data.lname},
            signature: JSON.stringify(signature),
            photo: photo.path
        };
        
        if(site) {
            const {id, data: {name}} = site;
            data.site = {id, name};
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        const {isConsultant, isHasProjects} = storage.is;
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row row-details col-lg-4">
                    <div className="row sec-group">
                        {isHasProjects && <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                        <ClearableInput name="observation_type" type="text" placeholder="Observation Type" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="location" type="text" placeholder="Location Of Observation *" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ClearableInput name="desc" type="textarea" placeholder="Observation Description" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ClearableInput name="causes" type="text" placeholder="Causes" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="corrective_action" type="text" placeholder="Corrective Action" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectEmployeeInput name="observed_team_member" placeholder="Observed Team Member..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ClearableInput name="signature" type="signature" placeholder="Signature" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row row-photo col-lg-8 pull-right h-full">
                    <label>Photo Of The Observation</label>
                    <div className="row sec-group">
                        <PhotoUploadButton name="photo" buttonTitle="Upload Photo" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewSafetyObservationReportDialog;
