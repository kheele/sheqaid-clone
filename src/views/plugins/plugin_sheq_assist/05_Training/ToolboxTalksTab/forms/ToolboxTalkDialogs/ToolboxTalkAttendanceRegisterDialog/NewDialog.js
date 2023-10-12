import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
	ClearableInput,
	SelectClientInput, SelectProjectInput, SelectSiteInput,
	SelectToolboxTalkSubjectInput,
} from 'components/inputs';
import {ANewDialog} from 'components/dialogs';

import {FormControls, Row} from "components/FormComponents";
import style from "./NewDialog.lazy.css";
import {THead} from "components/tables";
import {NewEmployeeListTable} from "components/FormTableComponents";
import {execWhen, isWeb} from "utils/UtilsFuns";
import {Dates} from "utils/Dates";
import insertTrainingToolboxTalkRegister
	from "../../../../../../../../mutations/all/TrainingToolboxTalkRegister/insertTrainingToolboxTalkRegister";

@observer
class NewDialog extends ANewDialog {
	pageKey = "NewDialog";
	title = "Create Toolbox Talk Attendance Register";
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	path = 'plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/';
	@observable
	state = {};
	
	constructor() {
		super();
		
		this.form = new Form();
		this.form.addChangeOne("employee_list", this.onChangeEmployeeList.bind(this));
	}
	
	// <editor-fold defaultstate="collapsed" desc="onChangeEmployeeList">
	onChangeEmployeeList(el, val) {
		execWhen(() => this.refs.selectEmployeeTable).then(selectEmployeeTable => {
			if (val) {
				console.log('onChangeEmployeeList', val)
				selectEmployeeTable.list = val;
			}
		});
	}
	
	// </editor-fold>
	
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		const {isConsultant, isNoProjects} = storage.is;
		
		//1
		if (isConsultant && !form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		//2
		if (!form.isValid('subject')) {
			infoDialog.open('Toolbox Talk / Training Meeting Subject is required');
			return;
		}
		if (!form.isValid('date')) {
			infoDialog.open('Date is required');
			return;
		}
		if (!form.isValid('employee_list')) {
			infoDialog.open('At least 1 Employee is required');
			return;
		}
		
		const {
			//0
			client,
			project,
			site,
			//1
			subject,
			date,
			employee_list,
		} = form.data;
		
		const data = {
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//1
			subject_id: subject && subject.id,
			date: Dates.formatDateSQL(date),
			employee_list: {
				data: (employee_list || []).map(({employee}) => ({employee_id: employee.id})),
			},
		};
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertTrainingToolboxTalkRegister(data).then(res => {
			console.log("res", res)
			if (res) {
				const {path: file, item} = res;
				if (isWeb()) {
					//TODO: rename toolbox talk to training meeting / toolbox talk
					saveFileAs(file, `Training-Toolbox-Talks-Attendance-Register_${Dates.formatDate(new Date())}.xlsx`);
					
					infoDialog.open(<>
						<p>Toolbox Talk Attendance Register successfully saved & exported.</p>
						<p><small>The file will be automatically downloaded</small></p>
					</>);
				} else {
					infoDialog.open(<>
						<p>Toolbox Talk Attendance Register successfully saved & exported.</p>
						<p>Saved in the following folder:</p>
						<p><small>{file.path}</small></p>
						<p><small>The file will open after 3 seconds</small></p>
					</>);
				}
				onSaved && onSaved(item);
				
				this.props.close();
			} else {
				infoDialog.open("An error occurred. Please try again.");
				infoDialog.close(2000);
			}
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}
	
	render() {
		const {isConsultant, isNoProjects} = storage.is;
		
		return <FormControls>
			{!isNoProjects && <Row
				activeAlways
				rendered
				idx={0}
				title="Company / Project / Site"
			>
				{isConsultant && <SelectClientInput name="client" placeholder="Company..." required
				                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
				<SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
				                    onChange={this.form.onChange}/>
				<SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
				                 onChange={this.form.onChange}/>
			</Row>}
			<Row
				activeAlways
				rendered
				idx={1}
				title="1. Register Details"
			>
				<SelectToolboxTalkSubjectInput name="subject" placeholder="Toolbox Talk / Training Meeting Subject..."
				                               className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="date" type="date" placeholder="Date..." className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Row>
			<Row
				activeAlways
				rendered
				idx={2}
				title="2. Employee List"
			>
				<NewEmployeeListTable ref="employee_list" name="employee_list" onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}
}

// <editor-fold defaultstate="collapsed" desc="renderTHeadEmployees">
function renderTHeadEmployees() {
	return <THead>
		<div className="td fixed-flex min-w-30">#</div>
		<div className="td">Name</div>
		<div className="td fixed-flex min-w-150">ID/Passport No.</div>
		<div className="td">Job Position</div>
		<div className="td">Site</div>
		<div className="td fixed-flex min-w-90">Signature</div>
		<div className="td fixed-flex no-padding min-w-70"></div>
	</THead>;
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderItemEmployees">
function renderItemEmployees(item, n) {
	const {id, data, employee} = item;
	const {
		fname,
		lname,
		id_num,
		passport_num,
		job_position,
		client,
		project,
		site
	} = (employee ? employee.data : employee) || data || item;
	console.log('renderItemEmployees: item', item)
	return <React.Fragment key={id_num || passport_num} className="tr-readonly">
		<div className="td fixed-flex min-w-30">{n + 1}</div>
		<div className="td">{fname + ' ' + lname}</div>
		<div className="td fixed-flex min-w-150">{id_num || passport_num}</div>
		<div className="td">{job_position ? job_position.name : 'N/A'}</div>
		<div className="td"></div>
		<div className="td fixed-flex min-w-90"></div>
	</React.Fragment>;
}

// </editor-fold>

export default NewDialog;
