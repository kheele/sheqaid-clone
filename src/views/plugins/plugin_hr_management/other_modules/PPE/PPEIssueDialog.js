// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {execWhen} from 'utils/Utils';
import Form from 'utils/Form';
import {ANewDialog} from 'components/dialogs';
import {
	ClearableInput,
	SelectClientInput, SelectDepartmentInput, SelectEmployeeInput, SelectJobPositionInput,
	SelectProjectInput,
	SelectSiteInput,
	SelectTeamInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./PPEIssueDialog.lazy.css";
import MKBox from "components/MK/MKBox";
import {EmployeePPEItemIssueTable} from "./PPEIssueComponents";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
	pageKey = "PPEIssueDialog";
	
	constructor(props) {
		super(props, style);
	}
	
	title() {
		return "PPE Issue";
	}
	
	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		employee_list: [],
		team_list: [],
		department_list: [],
		job_position_list: [],
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.form = new Form();
		this.form.addChangeOne("team_list", this.onChangeTeams.bind(this));
		this.form.addChangeOne("department_list", this.onChangeDepartments.bind(this));
		this.form.addChangeOne("job_position_list", this.onChangeJobPositions.bind(this));
	}
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onChange funs">
	onChangeTeams(el, val) {
		execWhen(() => this.refs.employee_ppe_item_issue).then(ref => {
			this.state.team_list = val;
			ref.onLoadList();
		});
	}
	
	onChangeDepartments(el, val) {
		execWhen(() => this.refs.employee_ppe_item_issue).then(ref => {
			this.state.department_list = val;
			ref.onLoadList();
		});
	}
	
	onChangeJobPositions(el, val) {
		execWhen(() => this.refs.employee_ppe_item_issue).then(ref => {
			this.state.job_position_list = val;
			ref.onLoadList();
		});
	}
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		//1
		if (!form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		// if (!form.isValid('project')) {
		//     infoDialog.open('Project is required');
		//     return;
		// }
		// if (!form.isValid('site')) {
		//     infoDialog.open('Site is required');
		//     return;
		// }
		
		//2
		if (!form.isValid('name')) {
			infoDialog.open('Item Description is required');
			return;
		}
		if (!form.isValid('unit')) {
			infoDialog.open('Item Unit is required');
			return;
		}
		if (form.isValid('duration_type') && !form.isValid('duration_value')) {
			infoDialog.open('Duration Value is required');
			return;
		}
		
		const {
			site,
			project,
			client,
			//
			name,
			unit,
			qty_received,
			qty_issued,
			qty_in_stock,
			duration_type,
			duration_value,
			notes,
			profile_pic,
			//
			team_list,
			department_list,
			job_position_list
		} = form.data;
		const data = {
			name,
			unit,
			qty_received,
			qty_issued,
			qty_in_stock,
			duration_type,
			duration_value: isNumber(duration_value) && duration_value,
			notes,
			profile_pic: profile_pic && profile_pic.path,
			
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			
			team_list: {
				data: (team_list || []).map(v => {
					if (v.team) {
						return {team_id: v.team.id};
					} else {
						return {team_id: v.id};
					}
				}),
			},
			department_list: {
				data: (department_list || []).map(v => {
					if (v.department) {
						return {department_id: v.department.id};
					} else {
						return {department_id: v.id};
					}
				}),
			},
			job_position_list: {
				data: (job_position_list || []).map(v => {
					if (v.job_position) {
						return {job_position_id: v.job_position.id};
					} else {
						return {job_position_id: v.id};
					}
				}),
			},
		};
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertPPE(data).then(res => {
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
		const {
			props: {
				onFormNext, onFormBack, onFormOpen
			},
			state
		} = this;
		
		return <FormControls>
			<Row
				active
				rendered
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				<SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control"
				                   onChange={this.form.onChange}/>
				<SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
				                    onChange={this.form.onChange}/>
				<SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
				                 onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={1}
				title="1. PPE Issue"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<MKBox
					className="filter-section grid-2 grid-gap-10"
					sx={{background: '#eee', m: '5px 10px 10px 0', p: '10px',}}
				>
					<SelectDepartmentInput name="department_list" type="select_multi" placeholder="Department(s)..." onChange={this.form.onChange}/>
					<SelectJobPositionInput name="job_position_list" type="select_multi" placeholder="Job Position(s)..." onChange={this.form.onChange}/>
					<SelectTeamInput name="team_list" type="select_multi" placeholder="Team(s)..." onChange={this.form.onChange}/>
					<SelectEmployeeInput name="employee_list" type="select_multi" placeholder="Employee(s)..." onChange={this.form.onChange}/>
				</MKBox>
				
				<hr className="margin-0"/>
				
				<EmployeePPEItemIssueTable
					ref="employee_ppe_item_issue"
					name="employee_ppe_item_issue"
					state={state}
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}
	
	// </editor-fold>
	
}

export default NewDialog;
