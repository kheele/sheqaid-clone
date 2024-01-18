import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {AProfileDialog} from 'components/dialogs';
import {SelectTable, THead} from 'components/tables';
import {
    ProfileField, SelectTrainingMatixInput, UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileTrainingRegisterDialog.lazy.css";
import TrainingPlanListByCourse from "components/FormListComponents/TrainingPlanListByCourse";
import Divider from "@mui/material/Divider";
import findByIdTrainingRegister from "mutations/all/TrainingRegister/findByIdTrainingRegister";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTrainingRegisterDialog";
    findById = findByIdTrainingRegister;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Training Register";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);
    }

    @computed
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }
        
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    client, project, site,
                    training,
                    trainer,
                    trainer_external,
                    institution_conducting_training,
                    time_or_duration,
                    time_from,
                    time_to,
                    date,
                    list_proof,
                    employee_list,
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;
        
        let {course, training_plan_list, job_position_list} = training || {};
        training_plan_list = training_plan_list || [];
        // const year = training_plan_list.map(({year}) => year)[0];
        
        return <FormControls>
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
                title="1. Training Matrix (Course)"
                onFormOpen={onFormOpen}
                onFormBack={!isNoProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <SelectTrainingMatixInput
                    name="training"
                    placeholder="Training Matrix (Course)"
                    defaultValue={training}
                    className="col-lg-12"
                    readonly
                />
                <br/>
                <TrainingPlanListByCourse
                    ref={this.trainingPlanListRef}
                    name="training_plan"
                    defaultValue={training_plan_list}
                    readonly
                />
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Duration, Time & Date"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField
                    name="date"
                    type="date"
                    placeholder="Date"
                    value={date}
                    className="col-lg-6"
                />
                <ProfileField
                    name="time_or_duration"
                    placeholder="Duration"
                    value={time_or_duration}
                    className="col-lg-6"
                />
                <ProfileField
                    ref="time_from"
                    name="time_from"
                    value={time_from}
                    placeholder="Start Time"
                    className="col-lg-6"
                />
                <ProfileField
                    ref="time_to"
                    name="time_to"
                    value={time_to}
                    placeholder="End Time"
                    className="col-lg-6"
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Trainer / Institution Conducting Training"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField
                    ref="institution_conducting_training"
                    name="institution_conducting_training"
                    title="Institution Conducting Training"
                    value={institution_conducting_training}
                    className="col-lg-12"
                />
                <ProfileField
                    ref="trainer"
                    name="trainer"
                    placeholder="Trainer"
                    value={trainer}
                    renderer={v => v.full_name}
                    className="col-lg-12"
                />
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Attendance Register"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="list_proof"
                    buttonTitle="Attendance Register Proof (PDF, Word, Image)"
                    type={['Word', 'PDF', 'Image']}
                    defaultValue={list_proof}
                    showOnlyIcon
                    readonly
                    className="col-lg-7 hor-center"
                />
                <Divider/>
                <Employees title="Attendance Register List" list_table={employee_list}/>
            </Row>
        </FormControls>;
    }

}

//<editor-fold desc="Employees">
@observer
class Employees extends React.Component {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Employee No.</div>
            <div className="td">Name</div>
            <div className="td fixed-flex min-w-140">ID/Passport No.</div>
            <div className="td">Site</div>
            <div className="td fixed-flex min-w-140">Signature</div>
            <div className="td fixed-flex min-w-0 padding-0"></div>
        </THead>;
    }

    renderItem(item, n) {
        const {signature, employee: {id, full_name, id_num, passport_num, employee_num, site}} = item;
        return <React.Fragment key={id}>
            <div className="td fixed-flex min-w-120">{employee_num || 'N/A'}</div>
            <div className="td">{full_name}</div>
            <div className="td fixed-flex min-w-140">{id_num || passport_num}</div>
            <div className="td">{site && site.name || 'N/A'}</div>
            <div className="td td-signature fixed-flex min-w-140">
                <ProfileField idx={n} name="signature" type="signature" value={signature} className="w-full"/>
            </div>
        </React.Fragment>;
    }

    render() {
        const {employee_list, title} = this.props;
        console.log('employee_list', employee_list)
        return <div className="row SelectedEmployees">
            <div className="row sec-group row-table">
                <SelectTable
                    ref="selectTable"
                    replaceCols
                    name="employee"
                    desc="Employees"
                    title={title}
                    className="col-lg-12 min-h-300 margin-l-0 margin-r-10 no-padding"
                    renderTHead={this.renderTHead}
                    renderItem={this.renderItem}
                    list={employee_list}
                />
            </div>
        </div>;
    }
}
//</editor-fold>

export default ProfileDialog;
