import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';

import style from "./ProfileSafetyObservationReportDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileSafetyObservationReportDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Safety Observation Report";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
    };
    
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at, 
                    site, observation_type, location, desc, causes, corrective_action, observed_team_member, photo, signature
                }
            }
        } = this;
        
        const {isConsultant, isHasProjects} = storage.is;
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        {isHasProjects && <ProfileField name="site" placeholder="Site" value={site} renderer={val => val.name} required className="col-lg-12"/>}
                        <ProfileField name="observation_type" placeholder="Observation Type" value={observation_type} required className="col-lg-12"/>
                        <ProfileField name="location" placeholder="Location Of Observation" value={location} required className="col-lg-12"/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="desc" type="textarea" placeholder="Observation Description" value={desc} required className="col-lg-12"/>
                    </div>
                </div>
                <div className="row col-lg-6">
                    <div className="row sec-group">
                        <ProfileField name="causes" placeholder="Causes" required className="col-lg-12" value={causes}/>
                        <ProfileField name="corrective_action" placeholder="Corrective Action" required className="col-lg-12" value={corrective_action}/>
                        <ProfileField name="observed_team_member" placeholder="Observed Team Member" value={observed_team_member} renderer={val => val.fname + ' ' + val.fname} required className="col-lg-12"/>
                    </div>
                </div>
                <div className="row row-photo col-lg-6 pull-right">
                    <div className="row sec-group">
                        <ProfileField name="photo" placeholder="Photo Of The Observation" type="file" value={photo} className="col-lg-12"/>
                    </div>
                </div>
                <div className="row col-lg-6 pull-left">
                    <div className="row sec-group">
                        <ProfileField name="signature" type="signature" placeholder="Signature" value={signature} required className="col-lg-12"/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
