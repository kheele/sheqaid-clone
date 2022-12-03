// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from '../../../../../utils/Utils';
import {ProfileField} from '../../../../../components/inputs';
import {Row} from '../../../../../components/FormComponents';
import {AProfileDialog} from '../../../../../components/dialogs';

import style from "./ProfileToolboxTalkDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileToolboxTalkDialog extends AProfileDialog {
    pageKey = "ProfileToolboxTalkDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Toolbox Talk / Training Meeting";
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
                    //1
                    client, project, site,
                    //2
                    course_or_module, 
                    //3
                    allocation, job_title, sector_list,
                    //4
                    status, date_range, cost, 
                    //5
                    institution_conducting_training, hr, job_desc, 
                    //6
                    requirement_legal, 
                    requirement, 
                    max_participants_per_course, 
                    training_standard,
                    training_frequency, 
                    training_provider_requirement,
                    //7
                    competency_evaluation, 
                    unit_standard,
                    unit_standard_desc,
                    credits, 
                    nqf_level
                }
            }
        } = this;
        
        const {isConsultant, isNoProjects} = storage.is;
        
        const competency_evaluationVal = {
            OnDayOfEvaluation: 'On Day Of Evaluation', 
            LastDayOfEvaluation: 'Last Day Of Evaluation'
        }[competency_evaluation];
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
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
                    title="1. Course Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={!isNoProjects && onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="course_or_module" title="Course" value={course_or_module} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Sector & Job Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="allocation" title="Allocation / Job Category" value={allocation} className="col-lg-12"/>
                    <ProfileField name="job_title" title="Job Position For Training" value={job_title} renderer={v => v.name} className="col-lg-12"/>
                    <ProfileField name="sector_list" title="Sector(s)" value={sector_list} renderer={v => v.join(', ')} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Training Start & End Date" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="status" title="Training Status" value={status} className="col-lg-12"/>
                    <ProfileField name="start_date" type="date" title="Start Date" value={date_range && date_range.start} className="col-lg-6"/>
                    <ProfileField name="end_date" type="date" title="End Date" value={date_range && date_range.end} className="col-lg-6"/>
                    <ProfileField name="cost" title="Cost" value={cost} renderer={v => v.toCurrency('R')} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="4. Person / Institution Conducting Training" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="institution_conducting_training" title="Institution Conducting Training" value={institution_conducting_training} className="col-lg-12"/>
                    <ProfileField name="hr" title="Training Conductor" value={hr} renderer={v => (v.fname + ' ' + v.lname)} className="col-lg-12"/>
                    <ProfileField name="job_desc" title="Job Position" value={job_desc} renderer={v => v.name} desc="Job Position For Training Conductor" className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="5. Categorization"
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack}
                >
                    <ProfileField name="training_frequency" title="Training Frequency" value={training_frequency} className="col-lg-12"/>
                </Row>
            </div>
        </div>;
    }
    // </editor-fold>

}

export default ProfileToolboxTalkDialog;
