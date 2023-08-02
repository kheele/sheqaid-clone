// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import style from "./ProfileTrainingMatrixDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileTrainingMatrixDialog extends AProfileDialog {
    pageKey = "ProfileTrainingMatrixDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Training Matrix";
    }

    get controls() {
        return Controls;
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
                    course,
                    //3
                    job_category_list, job_position_list, sector_list,
                    //4
                    status, date_range, cost,
                    //5
                    institution_conducting_training, trainer, trainer_job_position,
                    //6
                    requirement_legal,
                    requirement,
                    max_participants_per_course,
                    training_standard,
                    training_frequency,
                    provider_requirement,
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

        return <FormControls>
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
                {isConsultant && <ProfileField name="client" title="Company" value={client}
                                               renderer={val => val.name || val.data.name} className="col-lg-12"/>}
                <ProfileField name="project" title="Project" value={project} renderer={val => val.name || val.data.name}
                              className="col-lg-12"/>
                <ProfileField name="site" title="Site" value={site} renderer={val => val.name || val.data.name}
                              className="col-lg-12"/>
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
                <ProfileField name="course" title="Course" value={course}
                              renderer={val => val.name}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Sector & Job Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="job_category_list" title="Allocation / Job Category" value={job_category_list}
                              renderer={v => v.map(({job_category: {name}}) => name).join(', ')} className="col-lg-12"/>
                <ProfileField name="job_position_list" title="Job Position For Training" value={job_position_list}
                              renderer={v => v.map(({job_position: {name}}) => name).join(', ')} className="col-lg-12"/>
                <ProfileField name="sector_list" title="Sector(s)" value={sector_list} renderer={v => v.map(({sector: {name}}) => name).join(', ')}
                              className="col-lg-12"/>
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
                <ProfileField name="start_date" type="date" title="Start Date" value={date_range && date_range.start}
                              className="col-lg-6"/>
                <ProfileField name="end_date" type="date" title="End Date" value={date_range && date_range.end}
                              className="col-lg-6"/>
                <ProfileField name="cost" title="Cost" value={cost} renderer={v => v.toCurrency('R')}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Person / Institution Conducting Training"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="institution_conducting_training" title="Institution Conducting Training"
                              value={institution_conducting_training} className="col-lg-12"/>
                <ProfileField name="trainer" title="Training Conductor" value={trainer} renderer={v => (v.lname + ' ' + v.fname)}
                              className="col-lg-12"/>
                <ProfileField name="trainer_job_position" title="Job Position" value={trainer_job_position} renderer={v => v.name}
                              desc="Job Position For Training Conductor" className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Standard"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="requirement_legal" title="Legal Requirement" value={requirement_legal}
                              className="col-lg-12"/>
                <ProfileField name="requirement" title="Requirement" value={requirement} className="col-lg-12"/>
                <ProfileField name="max_participants_per_course" title="Max. Participants Per Course"
                              value={max_participants_per_course} className="col-lg-12"/>
                <ProfileField name="training_standard" title="Training Standard (Minimum Days)"
                              value={training_standard} className="col-lg-12"/>
                <ProfileField name="training_frequency" title="Training Frequency" value={training_frequency}
                              className="col-lg-12"/>
                <ProfileField name="provider_requirement" title="Training Provider Requirement"
                              value={provider_requirement} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Guideline To Available Unit Standards That May Be Used"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ProfileField name="competency_evaluation" title="Competency Evaluation"
                              value={competency_evaluationVal} className="col-lg-12"/>
                <ProfileField name="unit_standard" title="Unit Standard" value={unit_standard} className="col-lg-12"/>
                <ProfileField name="unit_standard_desc" title="Unit Standard Description" value={unit_standard_desc}
                              className="col-lg-12"/>
                <ProfileField name="credits" title="Credits" value={credits} className="col-lg-6"/>
                <ProfileField name="nqf_level" title="NQF Level" value={nqf_level} className="col-lg-6"/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileTrainingMatrixDialog;
