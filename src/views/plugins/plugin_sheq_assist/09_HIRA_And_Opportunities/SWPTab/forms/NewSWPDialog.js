//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {onSelectLoadSWPCategories, onSelectLoadSWPLocations} from 'views/plugins/utils';

import {
	ClearableInput,
	SelectClientInput,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectProjectInput,
	SelectSiteInput,
	UploadButton,
} from 'components/inputs';

import ANewDialog from 'components/dialogs/ANewDialog';

import {
	NewPotentialHazardAndPossibleCauseListTable,
	NewPPERequiredListTable,
	NewSignSheetListTable,
	NewStepsToPerformTaskListTable,
	NewTrainingRequirementListTable,
	SelectWrapper,
} from './SWPComponents';

import style from "./NewSWPDialog.lazy.css";
import {FormControls, Row} from "components/FormComponents";
import {Dates} from "utils/Dates";
import insertSWP from "mutations/all/HIRA_And_Opportunities/SWP/insertSWP";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class NewSWPDialog extends ANewDialog {
    pageKey = "NewSWPDialog";
    title = "Create Written Safe Work Procedure";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    //<editor-fold desc="fields">
    @observable
    state = {
        lists: {
            category: [],
            location: []
        },
        loadedSelectLists: false
    };

    //</editor-fold>

    constructor() {
        super();

        this.form = new Form();
    }

    componentDidMount() {
        const loads = {category: onSelectLoadSWPCategories, location: onSelectLoadSWPLocations};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k].push(...res);
                this.state.lists[k] = this.state.lists[k].distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    //<editor-fold desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('category')) {
            infoDialog.open('Category is required');
            return;
        }
        if (!form.isValid('work_task')) {
            infoDialog.open('Work Task is required');
            return;
        }
        // if (!form.isValid('person_approving_procedure')) {
        // 	infoDialog.open('Person Approving Procedure is required');
        // 	return;
        // }

        const {
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
        } = form.data;
        const data = {
            //0
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            //1
            category,
            work_task,
            date_created: Dates.formatDateSQL(date_created),
            location,
            department_id: department && department.id,
            person_approving_procedure_id: person_approving_procedure && person_approving_procedure.id,
            expiry: Dates.formatDateSQL(expiry),
            sign_sheet_notes,
            //2
            doc,
            //3
            potential_hazard_and_possible_cause_list: {data: (potential_hazard_and_possible_cause_list || [])}, //{id, swp_id, cause, hazard, rating,}
            //4
            ppe_type_required_list: {data: (ppe_type_required_list || []).map(({id: ppe_type_id}) => ({ppe_type_id}))},//{id, swp_id, ppe_type,}
            //5
            steps_to_perform_task_list,
            //6
            notes,
            //7
            training_requirement_list,
            //8
            sign_sheet_employee_list: {data: (sign_sheet_employee_list || []).map(({id: employee_id}) => ({employee_id}))}, //{id, swp_id, signature, employee,}
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertSWP(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant, isNoProjects} = storage.is;

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                                 onChange={this.form.onChange}/>
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
                <SelectWrapper state={this.state} name="category" placeholder="Category..."
                               className="col-lg-12 form-control" onChange={this.form.onChange} values="category"/>
                <ClearableInput name="work_task" type="text" placeholder="Work Task" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <ClearableInput name="date_created" type="date" placeholder="Date Created..." defaultValue={new Date()}
                                required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="location" placeholder="Area activity takes place"
                               className="col-lg-12 form-control" onChange={this.form.onChange} values="location"/>
                <SelectDepartmentInput name="department" placeholder="Department activity takes place..." required
                                       className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <SelectEmployeeInput name="person_approving_procedure" placeholder="Person Approving Procedure..."
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry" type="date" placeholder="To Be Reviewed Before..." required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <ClearableInput name="sign_sheet_notes" type="textarea" placeholder="Notes for Sign Sheet" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                    className="col-lg-12"
                    onChange={this.form.onChange}
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
                                                             onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. List PPE Required"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewPPERequiredListTable name="ppe_type_required_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Steps To Perform This Task Safely"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewStepsToPerformTaskListTable name="steps_to_perform_task_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Additional Notes at the end of Potential Hazards"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Training Requirements and Reference Information"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <NewTrainingRequirementListTable name="training_requirement_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. List of Names To Appear On WSWP Sign Sheet"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewSignSheetListTable name="sign_sheet_employee_list" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default NewSWPDialog;
