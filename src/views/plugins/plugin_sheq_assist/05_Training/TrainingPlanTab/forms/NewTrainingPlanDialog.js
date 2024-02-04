// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../../utils/Form';

import {
	ClearableInput,
	SelectClientInput,
	SelectProjectInput,
	SelectSiteInput
} from '../../../../../../components/inputs';
import {Row} from '../../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../../components/dialogs';

import style from "./NewTrainingPlanDialog.lazy.css";
import SelectOrTableWrapper from "./NewTrainingPlanComponents/SelectOrTableWrapper";
import ValidateAndCollect1Employee from "./NewTrainingPlanFuns/ValidateAndCollect1Employee";
import ValidateAndCollectCourses from "./NewTrainingPlanFuns/ValidateAndCollectCourses";
import ValidateAndCollectJobPositions from "./NewTrainingPlanFuns/ValidateAndCollectJobPositions";
import ValidateAndCollectYears from "./NewTrainingPlanFuns/ValidateAndCollectYears";
import insertTrainingPlan from "../../../../../../mutations/all/TrainingPlan/insertTrainingPlan";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewTrainingPlanDialog extends ANewDialog {
	pageKey = "NewTrainingPlanDialog";
	title = "Create Training Plan";
	className = 'ANewTableFormDialog';
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/05_Trainings/training-plan/";
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {
			select_employees: [
				{text: "1 Employee", value: "1Employee", checked: false},
				{text: "Job Position(s)", value: "JobPositions", checked: false},
				{text: "Course(s)", value: "Courses", checked: false},
				{text: "Year(s)", value: "Years", checked: false}
			]
		},
		select_employees: null
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onNext = this.onNext.bind(this);
		
		this.form = new Form();
		this.form.addChangeOne("select_employees", this.onChangeSelectEmployees.bind(this));
	}
	
	// </editor-fold>
	
	onChangeSelectEmployees(el, val) {
		this.state.select_employees = val;
	}
	
	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 0) {
			const {isConsultant} = storage.is;
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
		}
		
		return true;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	async onSubmit(e, btn, onSaved) {
		const {
			form,
			state: {select_employees},
			refs: {
				selectOrTableWrapper,
				selectOrTableWrapper: {
					selectEmployeeWrapper,
					newTrainingYearListTableWrapper,
					newTrainingCourseListTableWrapper,
					newJobPositionListTableWrapper,
				}
			}
		} = this;
		
		const {isConsultant, isNoProjects} = storage.is;
		
		//0
		if (isConsultant && !form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		
		//1
		if (!form.isValid('select_employees')) {
			infoDialog.open(<div className="text-left">
				One of these options:<br/>
				1. 1 Employee;<br/>
				2. Job Position(s);<br/>
				3. Course(s);<br/>
				4. Year(s)]<br/>
				is required
			</div>);
			return;
		}
		
		const {
			//0
			client, project, site,
		} = form.data;
		const data = {
			// employee_plan_list, this value is set below. It's built from ONLY 1Employee option below
			// job_position_plan_list, this value is set below. It's built from ONLY JobPositions option below
			// course_plan_list, this value is set below. It's built from ONLY Courses option below
			// year_plan_list, this value is set below. It's built from ONLY Years option below
			//employee_blacklist, this value is set below. It's built from ONLY JobPositions, Courses & Years options below
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
		};
		
		if (select_employees === '1Employee') {
			// console.log('selectEmployeeWrapper', selectEmployeeWrapper)
			if (!ValidateAndCollect1Employee.collect(data, selectEmployeeWrapper)) {
				return;
			}
		} else {
			if (select_employees === 'JobPositions') {
				// console.log('newJobPositionListTableWrapper', newJobPositionListTableWrapper)
				if (!ValidateAndCollectJobPositions.collect(data, newJobPositionListTableWrapper)) {
					return;
				}
			} else if (select_employees === 'Courses') {
				// console.log('newTrainingCourseListTableWrapper', newTrainingCourseListTableWrapper)
				if (!ValidateAndCollectCourses.collect(data, newTrainingCourseListTableWrapper)) {
					return;
				}
			} else if (select_employees === 'Years') {
				// console.log('newTrainingYearListTableWrapper', newTrainingYearListTableWrapper)
				if (!ValidateAndCollectYears.collect(data, newTrainingYearListTableWrapper)) {
					return;
				}
			}
		}
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertTrainingPlan(data).then(res => {
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
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen} = this.props;
		const {isConsultant, isNoProjects} = storage.is;
		return (<div className="controls-wrapper controls-sectioned">
			<div className="controls">
				{!isNoProjects && <Row
					rendered
					active
					idx={0}
					title="Company / Project / Site"
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
				>
					{isConsultant && <SelectClientInput name="client" placeholder="Company..." required
					                                    className="col-lg-12 form-control"
					                                    onChange={this.form.onChange}/>}
					<SelectProjectInput name="project" placeholder="Project..." required
					                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
					<SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
					                 onChange={this.form.onChange}/>
				</Row>}
				<Row
					rendered
					active={isNoProjects}
					idx={1}
					title="1. Training Plan & Employee(s)"
					onFormOpen={onFormOpen}
					onFormBack={!isNoProjects && onFormBack}
				>
					<ClearableInput name="select_employees" type="radio" placeholder="Select Per" required horizontal
					                className="col-lg-12 form-control" onChange={this.form.onChange}
					                values={this.state.lists.select_employees}/>
					<SelectOrTableWrapper ref="selectOrTableWrapper" state={this.state} onChange={this.form.onChange}/>
				</Row>
			</div>
		</div>);
	}
	
	// </editor-fold>
}

export default NewTrainingPlanDialog;
