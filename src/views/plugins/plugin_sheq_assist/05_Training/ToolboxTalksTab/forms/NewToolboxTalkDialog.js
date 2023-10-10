// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../../utils/Form';
import {Dates, execWhen} from '../../../../../../utils/Utils';
import {onSelectLoadTrainingFrequencies} from '../../../../utils';

import {
	Button,
	ClearableInput,
	DateRangeInput,
	SelectClientInput,
	SelectJobCategoryInput,
	SelectJobPositionInput,
	SelectProjectInput,
	SelectSiteInput,
	SelectToolboxTalkCourseInput, SelectToolboxTalkSubjectCategoryInput,
	SelectUserInput, UploadButton
} from '../../../../../../components/inputs';
import {FormControls, Row} from '../../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../../components/dialogs';

import style from "./NewToolboxTalkDialog.lazy.css";
import Divider from "@mui/material/Divider";
import {SelectTable, THead} from "../../../../../../components/tables";
import {NewEmployeeListTable} from "../../../../../../components/FormTableComponents";
import insertTrainingToolboxTalk from "../../../../../../mutations/all/TrainingToolboxTalk/insertTrainingToolboxTalk";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewToolboxTalkDialog extends ANewDialog {
	pageKey = "ToolboxTalk";
	title = "Create Toolbox Talk / Training Meeting";
	
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
	path = "plugin_sheq_assist/05_Trainings/toolbox-talks/";
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {
			training_frequency: ['Non-Expiry', '5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
		},
		loadedSelectLists: false
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onNext = this.onNext.bind(this);
		
		this.form = new Form();
		this.form.addChangeOne("hr", this.onChangeHR.bind(this));
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onChangeHR">
	onChangeHR(el, val) {
		execWhen(() => this.refs.job_desc).then(job_desc_ref => {
			if (val) {
				if (val.data) {
					let {optional_info} = val.data;
					if (optional_info) {
						const {job_position} = optional_info;
						job_position && job_desc_ref.onChange({label: job_position.name, value: job_position});
					}
				} else if (val.job_position) {
					const {job_position} = val;
					job_position && job_desc_ref.onChange({label: job_position.name, value: job_position});
				}
			} else {
				job_desc_ref.reset();
			}
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onChangeCourse">
	onChangeCourse(el, val) {
		execWhen(() => this.refs.attendance_register_list).then(attendance_register_list => {
			if (val) {
				console.log('onChangeCourse', val)
				workers.emit('plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/list/search_by_name', val).then(list => {
					// attendance_register_list.list = list[0].data;
				});
				
			}
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="componentDidMount">
	componentDidMount() {
		const loads = {training_frequency: onSelectLoadTrainingFrequencies};
		Promise.all(Object.keys(loads).map(k => {
			return loads[k]().then(res => {
				this.state.lists[k].push(...res);
				this.state.lists[k] = this.state.lists[k].distinct();
			});
		})).then(res => {
			this.state.loadedSelectLists = true;
		});
	}
	
	// </editor-fold>
	
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
		
		if (idx === 1) {
			if (!form.isValid('subject')) {
				infoDialog.open('Toolbox Talk / Training Meeting Subject is required');
				return;
			}
		}
		
		return true;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		const {isConsultant, isNoProjects} = storage.is;
		
		//1
		if (isConsultant && !form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		if (!form.isValid('subject')) {
			infoDialog.open('Toolbox Talk / Training Meeting Subject is required');
			return;
		}
		
		const {
			//0
			client, project, site,
			//1
			training_frequency,
			subject,
			subject_category,
			date,
			time_from,
			time_to,//list
			//2
			institution_conducting_training,//list
			hr,//list
			job_desc,
			//3
			doc,//list
			//4
			attendance_register_doc,//list
			attendance_register_list,//list
		} = form.data;
		const data = {
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//1
			training_frequency,
			subject_id: subject && subject.id,
			subject_category,
			date: Dates.formatDateSQL(date),
			time_from,
			time_to,//list
			//2
			institution_conducting_training,
			hr_id: hr && hr.id,//list
			job_desc_id: job_desc && job_desc.id,
			//3
			doc,//list
			//4
			attendance_register_doc,//list
			attendance_register_list,//list
		};
		
		if (attendance_register_list) {
			data.attendance_register_list = attendance_register_list.map((
				{
					employee,
					employee: {
						id,
						data: {
							fname,
							lname,
							email,
							phone,
							id_num,
							passport_num
						}
					}
				}
			) => ({
				id, fname, lname, email, phone, id_num, passport_num
			}));
		}
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertTrainingToolboxTalk(data).then(res => {
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
		const {loggedClientName} = storage.selected;
		return (<FormControls>
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
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={!isNoProjects && onFormBack}
			>
				<SelectToolboxTalkCourseInput name="subject" placeholder="Toolbox Talk / Training Meeting..."
				                              className="col-lg-12 form-control"
				                              onChange={this.form.onChange}/>
				<SelectToolboxTalkSubjectCategoryInput name="subject_category" placeholder="Subject Category..."
				                                       className="col-lg-6 form-control"
				                                       onChange={this.form.onChange}/>
				<SelectWrapper state={this.state} name="training_frequency" placeholder="Training Frequency..."
				               className="col-lg-6 form-control" onChange={this.form.onChange}
				               values="training_frequency"/>
			</Row>
			<Row
				rendered
				activeAlways
				idx={2}
				title="2. Toolbox Talk / Training Meeting"
			>
				<FormControls>
					<Row
						rendered
						idx={2.1}
						title="2.1. Date & Time"
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
					>
						<ClearableInput name="date" type="date" placeholder="Date..." className="col-lg-12 form-control"
						                onChange={this.form.onChange}/>
						<div
							className="
                            flex col-lg-12 bg-eee margin-t-10 margin-b-5 border-radius-20
                            padding-t-20 padding-b-10 padding-l-10 padding-r-10
                            ">
							<ClearableInput name="time_from" type="time" placeholder="Time From..."
							                className="border-radius-0 border-radius-l-20 form-control"
							                onChange={this.form.onChange}/>
							<ClearableInput name="time_to" type="time" placeholder="Time To..."
							                className="border-radius-0 border-radius-r-20 form-control"
							                onChange={this.form.onChange}/>
						</div>
					</Row>
					<Row
						rendered
						idx={2.2}
						title="2.2. Person / Institution Conducting Training"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormNext={onFormNext}
					>
						<ClearableInput name="institution_conducting_training" type="text"
						                placeholder="Institution Conducting Training" defaultValue={loggedClientName}
						                className="col-lg-12 form-control"
						                onChange={this.form.onChange}/>
						<SelectUserInput name="hr" placeholder="Training Conductor..." defaultUser showOtherPerson
						                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
						<SelectJobPositionInput name="job_desc" placeholder="Job Position..."
						                        desc="Job Position For Training Conductor"
						                        className="col-lg-12 form-control"
						                        onChange={this.form.onChange} add/>
					</Row>
					<Row
						rendered
						idx={2.3}
						title="2.3. Attach Toolbox Talk / Training Meeting Document"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormNext={onFormNext}
					>
						<UploadButton
							name="doc"
							buttonTitle="Document (PDF, Word)"
							type={['Word', 'PDF', 'Image']}
							showOnlyIcon
							className="col-lg-6 hor-center"
							onChange={this.form.onChange}
						/>
					</Row>
					<Row
						rendered
						idx={2.4}
						title="2.4. Attendance Register"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
					>
						<FormControls>
							<Row
								rendered
								activeAlways
								idx={2.41}
								title="2.4.1 Attach Attendance Register File"
							>
								<UploadButton
									name="attendance_register_doc"
									buttonTitle="Document (PDF, Word)"
									type={['Word', 'PDF', 'Image']}
									showOnlyIcon
									className="col-lg-6 hor-center"
									onChange={this.form.onChange}
								/>
							</Row>
							<Row
								rendered
								activeAlways
								idx={2.42}
								title="2.4.2 Add Employee Attendance List"
							>
								<NewEmployeeListTable ref="attendance_register_list" name="attendance_register_list"
								                      onChange={this.form.onChange}/>
							</Row>
						</FormControls>
					</Row>
				</FormControls>
			</Row>
		</FormControls>);
	}
	
	// </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="SelectWrapper">
@observer
class SelectWrapper extends React.Component {
	
	render() {
		const {state, name, placeholder, className, onChange, values} = this.props;
		if (!state.loadedSelectLists) return null;
		return <ClearableInput name={name} type="select" placeholder={placeholder} className={className}
		                       onChange={onChange} values={state.lists[values]} returnValue add/>;
	}
}

// </editor-fold>

export default NewToolboxTalkDialog;
