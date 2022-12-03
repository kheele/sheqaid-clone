// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from '../../../../../utils/Utils';
import {ProfileField} from '../../../../../components/inputs';
import {Row} from '../../../../../components/FormComponents';
import {AProfileDialog} from '../../../../../components/dialogs';

import style from "./ProfileTrainingRegistryDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileTrainingRegistryDialog extends AProfileDialog {
    pageKey = "ProfileTrainingRegistryDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Training Registry";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
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
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    client, project, site,
                    name,
                    frequency,
                    sector_list,
                    provider,
                    job_position_list,
                    unit_standard,
                    unit_standard_desc
                }
            }
        } = this;
        
        const {isConsultant, isNoProjects} = storage.is;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls col-lg-12">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}   
                {!isNoProjects && <Row 
                    rendered  
                    active
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    {isConsultant && <ProfileField name="client" title="Company" value={client} renderer={val => val.name || val.data.name} className="col-lg-12"/>}
                    <ProfileField name="project" title="Project" value={project} renderer={val => val.name || val.data.name} className="col-lg-12"/>
                    <ProfileField name="site" title="Site" value={site} renderer={val => val.name || val.data.name} className="col-lg-12"/>
                </Row>}
                <Row 
                    rendered 
                    active={isNoProjects}
                    idx={1}
                    title="1. Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={!isNoProjects && onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="name" title="Course" value={name} className="col-lg-12"/>
                    <ProfileField name="job_position_list" title="Job Position(s)" value={job_position_list} renderer={v => v.map(val => val.name || val.data.name).join(', ')} className="col-lg-12"/>
                    <ProfileField name="sector_list" title="Sector(s)" value={sector_list} renderer={v => v.join(', ')} className="col-lg-12"/>
                    <ProfileField name="frequency" title="Training Frequency" value={frequency} className="col-lg-6"/>
                    <ProfileField name="provider" title="Training Provider" value={provider} className="col-lg-6"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Guideline To Available Unit Standards That May Be Used" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack}
                >
                    <ProfileField name="unit_standard" title="Unit Standard" value={unit_standard} className="col-lg-12"/>
                    <ProfileField name="unit_standard_desc" title="Unit Standard Description" value={unit_standard_desc} className="col-lg-12" />
                </Row>
            </div>
        </div>;
    }
    // </editor-fold>

}

export default ProfileTrainingRegistryDialog;
