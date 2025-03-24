//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {CircularProgress} from "@mui/material";

import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';

import {
    NewPotentialHazardAndPossibleCauseListTable,
    NewPPERequiredListTable,
    NewSignSheetListTable,
    NewStepsToPerformTaskListTable,
    NewTrainingRequirementListTable,
} from './SWPComponents';
import {FormControls, Row} from "components/FormComponents";

import {findByIdSWP} from "mutations/findById";

import style from "./ProfileSWPDialog.lazy.css";
import {updateSWP} from "mutations/update";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileSWPDialog";
    findById = findByIdSWP;
    removeById = updateSWP;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Written Safe Work Procedure";
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    //<editor-fold desc="fields">
    @observable
    state = {};

    //</editor-fold>

    constructor(props) {
        super(props);
    }

    @computed get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            item, item: {
                id, data: {
                    created_at,
                    //0
                    client,
                    project,
                    site,
                    //1
                    category,
                    work_task,
                    date_created,
                    location,
                    department,
                    person_approving_procedure,
                    expiry,
                    sign_sheet_notes,
                    //2
                    doc,
                    //3
                    potential_hazard_and_possible_cause_list,
                    //4
                    ppe_type_required_list,
                    //5
                    steps_to_perform_task_list,
                    //6
                    notes,
                    //7
                    training_requirement_list,
                    //8
                    sign_sheet_employee_list,
                }
            }
        } = this;

        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant, isNoProjects} = storage.is;

        console.log(this.item)

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField
                    name="client"
                    title="Company"
                    value={client}
                    renderer={val => val.name}
                    className="col-lg-12"
                />}
                <ProfileField
                    name="project"
                    title="Project"
                    value={project}
                    renderer={val => val.name}
                    className="col-lg-12"
                />
                <ProfileField
                    name="site"
                    title="Site"
                    value={site}
                    renderer={val => val.name}
                    className="col-lg-12"
                />
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Basic Details"
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField name="category" type="select" placeholder="Category" value={category}
                              className="col-lg-12"/>
                <ProfileField name="work_task" type="text" placeholder="Work Task" value={work_task}
                              className="col-lg-12"/>

                <ProfileField name="date_created" type="date" placeholder="Date Created" value={date_created}
                              className="col-lg-12"/>
                <ProfileField name="location" type="select" placeholder="Area activity takes place" value={location}
                              className="col-lg-12"/>
                <ProfileField name="department" type="select" placeholder="Department activity takes place"
                              value={department} renderer={v => v.name} className="col-lg-12"/>

                <ProfileField name="person_approving_procedure" type="select" placeholder="Person Approving Procedure"
                              value={person_approving_procedure}
                              renderer={v => v.full_name}
                              className="col-lg-12"/>
                <ProfileField name="expiry" type="date" placeholder="To Be Reviewed Before"
                              value={expiry} className="col-lg-12"/>

                <ProfileField name="sign_sheet_notes" type="textarea" placeholder="Notes for Sign Sheet"
                              value={sign_sheet_notes} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Reference Document"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Reference Document (PDF/Word/Image)"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    defaultValue={doc}
                    className="col-lg-12"
                    readonly
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. List Potential Hazards and Possible Causes"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewPotentialHazardAndPossibleCauseListTable name="potential_hazard_and_possible_cause_list"
                                                             defaultValue={potential_hazard_and_possible_cause_list || []}
                                                             readonly/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. List PPE Required"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewPPERequiredListTable name="ppe_type_required_list" defaultValue={ppe_type_required_list || []}
                                         readonly/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Steps To Perform This Task Safely"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewStepsToPerformTaskListTable name="steps_to_perform_task_list"
                                                defaultValue={steps_to_perform_task_list || []} readonly/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Additional Notes at the end of Potential Hazards"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField name="notes" type="textarea" value={notes} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Training Requirements and Reference Information"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewTrainingRequirementListTable name="training_requirement_list"
                                                 defaultValue={training_requirement_list || []}
                                                 readonly/>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. List of Names To Appear On WSWP Sign Sheet"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewSignSheetListTable name="sign_sheet_employee_list" defaultValue={sign_sheet_employee_list || []}
                                       readonly/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>

}

export default ProfileDialog;
