//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from "utils/Utils";
import {onSelectLoadSWPCategories, onSelectLoadSWPLocations} from 'views/plugins/utils';

import {
	ClearableInput,
	SelectClientInput,
	SelectDepartmentInput, SelectEmployeeInput, SelectProjectInput, SelectSiteInput, UploadButton,
} from 'components/inputs';

import {AEditDialog} from 'components/dialogs';

import {
	SelectWrapper,
	NewSignSheetListTable,
	NewPotentialHazardAndPossibleCauseListTable,
	NewPPERequiredListTable,
	NewStepsToPerformTaskListTable,
	NewTrainingRequirementListTable,
} from './SWPComponents';

import {FormControls, Row} from "components/FormComponents";
import {Dates} from "utils/Dates";
import {toDataURI} from "utils/UtilsFuns";

import updateSWP from "mutations/all/HIRA_And_Opportunities/SWP/updateSWP";
import findByIdSWP from "mutations/all/HIRA_And_Opportunities/SWP/findByIdSWP";

import style from "./EditSWPDialog.lazy.css";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class EditSWPDialog extends AEditDialog {
	pageKey = "EditSWPDialog";
	findById = findByIdSWP;

	constructor(props) {
		super(props, style);
	}

	get title() {
		return "Edit Written Safe Work Procedure";
	}

	get topButtonsHiddenSave() {
		return true;
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
		loadedSelectLists: false,
		item: null,
	};

	//</editor-fold>

	constructor() {
		super();

		this.form = new Form();
	}

	//<editor-fold desc="componentDidMount">
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
	//</editor-fold>

	//<editor-fold desc="onFormSave">
	onFormSave(e, btn) {
		const {
			form,
			item: {id, data: old_data},
		} = this;
		const {is: {isContractor}, loggedContractor} = storage;

		const onSubmit = (data, onSaved) => {
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			btn.text("Saving...").disabled();
			progressDialog.open();
			updateSWP({id: this.item.id, ...data}).then(res => {
				console.log("res", res)
				onSaved && onSaved(res);
				infoDialog.open("Record successfully updated.");
				infoDialog.close(2000);
			}).finally(() => {
				btn.text("Save").enabled();
				setTimeout(() => progressDialog.close());
			});
		};

		const {idx} = btn.props;
		if (idx === 0) {
			// const {isConsultant} = storage.is;
			// if (isConsultant && !form.isValid('client')) {
			//     infoDialog.open('Company is required');
			//     return;
			// }

			const {
				//0
				site, project, client,
			} = form.data;

			const data = {};

			if (isContractor) {
				ShouldUpdate.checkSite(data, old_data, site, 'contractor_site_id');
			} else {
				ShouldUpdate.checkClient(data, old_data, client);
				ShouldUpdate.checkProject(data, old_data, project);
				ShouldUpdate.checkSite(data, old_data, site);
			}

			onSubmit(data);
			return;
		}

		if (idx === 1) {
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
				//1
				category,
				work_task,
				date_created,
				location,
				department,
				person_approving_procedure,
				expiry,
				sign_sheet_notes,
			} = form.data;

			const data = {};
			ShouldUpdate.check(data, old_data, category, 'category');
			ShouldUpdate.check(data, old_data, work_task, 'work_task');
			ShouldUpdate.checkDate(data, old_data, date_created, 'date_created');
			ShouldUpdate.check(data, old_data, location, 'location');
			ShouldUpdate.checkDepartment(data, old_data, department, 'department');
			ShouldUpdate.checkEmployee(data, old_data, person_approving_procedure, 'person_approving_procedure');
			ShouldUpdate.checkDate(data, old_data, expiry, 'expiry');
			ShouldUpdate.check(data, old_data, sign_sheet_notes, 'sign_sheet_notes');

			onSubmit(data);
			return;
		}

		if (idx === 2) {
			const {
				//2
				doc,
			} = form.data;
			const data = {};
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		if (idx === 3) {
			const {
				//3
				potential_hazard_and_possible_cause_list,
			} = form.data;
			const data = {};
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		if (idx === 4) {
			const {
				//4
				ppe_required_list,
			} = form.data;
			const data = {};
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		if (idx === 5) {
			const {
				//5
				steps_to_perform_task_list,
			} = form.data;
			const data = {};
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		if (idx === 6) {
			const {
				//6
				notes,
			} = form.data;
			const data = {};
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		if (idx === 7) {
			const {
				//7
				training_requirement_list,
			} = form.data;
			const data = {};
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		if (idx === 8) {
			const {
				//8
				sign_sheet_employee_list,
			} = form.data;
			const data = {};
			ShouldUpdate.checkFile(data, old_data, doc, 'doc');

			onSubmit(data);
			return;
		}

		return true;
	}

	//</editor-fold>

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
					ppe_required_list,
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
				onFormSave={this.onFormSave}
			>
				{isConsultant && <SelectClientInput
					name="client"
					placeholder="Company..."
					defaultValue={RenderUtils.selectedClient.call(this)}
					showAll
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>}
				<SelectProjectInput
					name="project"
					placeholder="Project..."
					defaultValue={RenderUtils.selectedProject.call(this)}
					showAll
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
				/>
				<SelectSiteInput
					name="site"
					placeholder="Site..."
					defaultValue={RenderUtils.selectedSite.call(this)}
					showAll
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
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
				onFormSave={this.onFormSave}
			>
				<SelectWrapper state={this.state} name="category" placeholder="Category..." defaultValue={category}
				               className="col-lg-12 form-control" onChange={this.form.onChange} values="category"/>
				<ClearableInput name="work_task" type="text" placeholder="Work Task" defaultValue={work_task} required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>

				<ClearableInput name="date_created" type="date" placeholder="Date Created..."
				                defaultValue={Dates.parse(date_created)} required className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				<SelectWrapper state={this.state} name="location" placeholder="Area activity takes place"
				               defaultValue={location} className="col-lg-12 form-control" onChange={this.form.onChange}
				               values="location"/>
				<SelectDepartmentInput name="department" placeholder="Department activity takes place..."
				                       defaultValue={department} required className="col-lg-12 form-control"
				                       onChange={this.form.onChange}/>

				<SelectEmployeeInput name="person_approving_procedure" placeholder="Person Approving Procedure..."
				                     defaultValue={person_approving_procedure} required className="col-lg-12 form-control"
				                     onChange={this.form.onChange}/>
				<ClearableInput name="expiry" type="date" placeholder="To Be Reviewed Before..."
				                defaultValue={expiry} required
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>

				<ClearableInput name="sign_sheet_notes" type="textarea" placeholder="Notes for Sign Sheet"
				                defaultValue={sign_sheet_notes} required className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Reference Document"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}
			>
				<UploadButton
					name="doc"
					buttonTitle="Reference Document (PDF/Word/Image)"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					defaultValue={doc}
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
				onFormSave={this.onFormSave}
			>
				<NewPotentialHazardAndPossibleCauseListTable name="potential_hazard_and_possible_cause_list"
				                                             defaultValue={potential_hazard_and_possible_cause_list || []}
				                                             onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. List PPE Required"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}
			>
				<NewPPERequiredListTable name="ppe_required_list" defaultValue={ppe_required_list || []}
				                         onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={5}
				title="5. Steps To Perform This Task Safely"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}
			>
				<NewStepsToPerformTaskListTable name="steps_to_perform_task_list"
				                                defaultValue={steps_to_perform_task_list || []} onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={6}
				title="6. Additional Notes at the end of Potential Hazards"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}
			>
				<ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes}
				                className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={7}
				title="7. Training Requirements and Reference Information"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}
			>
				<NewTrainingRequirementListTable name="training_requirement_list" defaultValue={training_requirement_list || []}
				                                 onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={8}
				title="8. List of Names To Appear On WSWP Sign Sheet"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormSave={this.onFormSave}
			>
				<NewSignSheetListTable name="sign_sheet_employee_list" defaultValue={sign_sheet_employee_list || []}
				                       onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}

	//</editor-fold>
}

export default EditSWPDialog;
