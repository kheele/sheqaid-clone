import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {Dates} from '../../../../../utils/Utils';
import {onAsyncSelectLoadFlashReportEmployersOrContractors} from '../../../utils';

import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import GridView from '../../../../../components/lists/GridView';

import style from "./ProfileFlashReportDialog.lazy.css";

@observer
class ProfileFlashReportDialog extends AProfileDialog {
    pageKey = "ProfileFlashReportDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Flash Report";
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
            incident_type: ["Personal Inquiry", "Security", "Fire", "Environment", "Property Damage", "Vehicle", "Plant"]
        }
    };
    
    constructor(props) {
        super(props);

        this.onAsyncSelectLoadFlashReportEmployersOrContractorsxv = onAsyncSelectLoadFlashReportEmployersOrContractors.bind(this);

        this.renderPhotographItem = this.renderPhotographItem.bind(this);
        
        this.form = new Form();
    }
    
    get item() {
        return this.props.state.item;
    }

    renderPhotographItem(item, n) {
        return <div key={"item-" + n} className="col-lg-3" idx={n}>
            <div>
                <img src={item.path.dlUrls && item.path.dlUrls[0]}/>
            </div>
        </div>;
    }
    
    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at,
                    area, section,
                    name_of_injured_person, age, occupation,
                    employer, employer_or_contractor,
                    incident_date, incident_time, location_of_incident, incident_type,
                    desc_of_incident,
                    photo_list,
                    severity, immediate_causes_of_incident,
                    immediate_actions_taken_to_prevent_a_similar_incident, distributions,
                    reported_by, position, date_reported
                }
            }
        } = this;
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="area" value={area} placeholder="Area" onChange={this.form.onChange}/>
                        <ProfileField name="section" value={section} placeholder="Section" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="name_of_injured_person" value={name_of_injured_person} placeholder="Name Of Injured Person" className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="age" type="number" value={age} placeholder="Age" className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="occupation" value={occupation} placeholder="Occupation" className="col-lg-4" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="employer" value={employer} placeholder="Employer" onChange={this.form.onChange}/>
                        <ProfileField name="employer_or_contractor" value={employer_or_contractor} type="select" placeholder="Employer / Contractor" onChange={this.form.onChange} add onAsyncSelectLoad={this.onAsyncSelectLoadFlashReportEmployersOrContractors}/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="incident_date" value={incident_date} type="date" placeholder="Date Of Incident" className="col-lg-3" onChange={this.form.onChange}/>
                        <ProfileField name="incident_time" value={incident_time} type="time" placeholder="Time Of Incident" className="col-lg-3" onChange={this.form.onChange}/>
                        <ProfileField name="location_of_incident" value={location_of_incident} placeholder="Location Of Incident" className="col-lg-3" onChange={this.form.onChange}/>
                        <ProfileField name="incident_type" value={incident_type} type="select" placeholder="Incident Type" className="col-lg-3" onChange={this.form.onChange} values={this.state.lists.incident_type}/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="desc_of_incident" value={desc_of_incident} placeholder="Decription Of Incident" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="severity" value={severity} placeholder="Severity" onChange={this.form.onChange}/>
                        <ProfileField name="immediate_causes_of_incident" value={immediate_causes_of_incident} placeholder="Immediate Causes Of Incident" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row photo-grid">
                    <label className="hor-center">Evidence</label>
                    <div className="row sec-group">
                        <GridView key="gridView" ref="gridView" title="Evidence" renderItem={this.renderPhotographItem} list={photo_list}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="immediate_actions_taken_to_prevent_a_similar_incident" value={immediate_actions_taken_to_prevent_a_similar_incident} placeholder="Immediate Actions Taken To Prevent A Similar Incident" className="col-lg-8" onChange={this.form.onChange}/>
                        <ProfileField name="distributions" placeholder="Distributions" value={distributions} className="col-lg-4" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="reported_by" value={reported_by} placeholder="Reported By" className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="position" value={position} placeholder="Position" className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="date_reported" value={date_reported} type="date" placeholder="Date Reported" className="col-lg-4" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

export default ProfileFlashReportDialog;
