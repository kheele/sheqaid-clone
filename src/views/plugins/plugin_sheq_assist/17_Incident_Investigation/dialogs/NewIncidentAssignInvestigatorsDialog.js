import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {AddFilesGridViewInput, ClearableInput, ProfileField, RowOrgs} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';

import style from "./NewIncidentAssignInvestigatorsDialog.lazy.css";
import {Dates} from "utils/Dates";
import {ShouldUpdate} from "utils/Utils";
import insertIncidentInvestigation
	from "mutations/all/Incident/IncidentInvestigation/insertIncidentInvestigation";
import updateIncidentInvestigation
	from "mutations/all/Incident/IncidentInvestigation/updateIncidentInvestigation";
import insertProxyEmployeeIncidentInvestigator
	from "mutations/all/ProxyEmployeeIncidentInvestigator/insertProxyEmployeeIncidentInvestigator";
import deleteProxyEmployeeIncidentInvestigator
	from "mutations/all/ProxyEmployeeIncidentInvestigator/deleteProxyEmployeeIncidentInvestigator";

@observer
class NewDialog extends ANewDialog {
	pageKey = "NewIncidentAssignInvestigatorsDialog";
	title = "Assign Investigator(s)";
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/17_Incident_Investigation/";
	
	constructor() {
		super();
		
		this.onNext = this.onNext.bind(this);
		
		this.form = new Form();
	}
	
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		
		if (idx === 5) {
			if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
				infoDialog.open('Investigation Team is required');
				return;
			}
			// if (!form.isValid('due_date')) {
			// 	infoDialog.open('Investigation Due Date is required');
			// 	return;
			// }
		}
		
		return true;
	}
	
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
			infoDialog.open('Investigation Team is required');
			return;
		}
		
		// if (!form.isValid('due_date')) {
		// 	infoDialog.open('Investigation Due Date is required');
		// 	return;
		// }
		
		const {
			investigation_team_list,
			due_date,
		} = form.data;
		
		if (this.investigation) {
			const data = {};
			ShouldUpdate.checkDate(data, this.investigation, due_date, 'due_date');
			
			//this one is handled in the list table
			// ShouldUpdate.checkList(data, this.investigation, __investigation_team_list, 'investigation_team_list');
			
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}
			
			console.log(data)
			
			btn.text("Saving...").disabled();
			progressDialog.open();
			updateIncidentInvestigation({id: this.investigation.id, ...data}).then(res => {
				console.log("res", res)
				onSaved && onSaved(data);
				infoDialog.open("Record successfully updated.");
				infoDialog.close(2000);
				this.props.close();
			}).finally(() => {
				btn.text("Save").enabled();
				setTimeout(() => progressDialog.close());
			});
		} else {
			const __investigation_team_list = (investigation_team_list || []).map((v) => {
				if (v.employee) {
					return {investigator_id: v.employee.id};
				} else {
					return {investigator_other: {data: v.other_person}};
				}
			});
			
			const data = {
				incident_id: this.item.id,
				due_date: Dates.formatDateSQL(due_date),
				investigation_team_list: {
					data: __investigation_team_list,
				},
			};
			
			console.log(data)
			
			btn.text("Saving...").disabled();
			progressDialog.open();
			insertIncidentInvestigation(data).then(res => {
				console.log("res", res)
				if (res === "INCIDENT_NOT_FOUND") {
					infoDialog.open("The Incident no longer exist.");
					return;
				}
				
				onSaved && onSaved(data);
				infoDialog.open("Record successfully updated.");
				infoDialog.close(2000);
				this.props.close();
			}).finally(() => {
				btn.text("Save").enabled();
				setTimeout(() => progressDialog.close());
			});
		}
	}
	
	get investigation() {
		return this.item.data.investigation;
	}
	
	get item() {
		return this.props.state.item;
	}
	
	render() {
		if (!this.item)
			return null;
		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {renderProfileCover}
			},
			item, item: {
				id, data: {
					//0
					site,
					project,
					client,
					//1
					group,
					short_desc,
					desc,
					location,
					exact_location,
					document_list,
					//2
					incident_date,
					incident_time,
					date_reported,
					time_reported,
					time_shift,
					//3
					category_list,
					//4
					sub_category_list,
					//5
					sector_list,
					activity_list,
					//6.1
					person_involved_list,
					//6.2
					person_reporting,
					person_reporting_other,
					//6.3
					person_reported_to,
					person_reported_to_other,
					//6.4
					witness_list,
					//6.5
					distribution_list,
					
					//7.1
					person_injured,
					person_injured_other,
					injured_person_dob,
					injured_person_gender,
					nature_of_injury_list,
					bodily_injury_location_list,
					injury_mechanism_list,
					injury_desc,
					//7.2
					test_undertaken,
					test_type_list,
					test_type_drug_undertaken,
					test_type_alcohol_undertaken,
					test_type_mobile_device_undertaken,
					//7.3
					vehicle_list = [],
					//7.4
					severity = {},
					//7.5
					investigation = {},
				}
			}
		} = this;
		
		console.log('=', item)
		
		let investigation_team_list = (investigation && [...investigation.investigation_team_list, null]);
		let due_date = investigation && investigation.due_date;
		
		return <FormControls>
			<RowOrgs
				client={client}
				project={project}
				site={site}
				readonly
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<Row
					rendered
					idx={1}
					title="1. Incident Summary"
				>
					<ProfileField name="incident_num" title="Incident No." value={id} className="col-lg-6"/>
					<ProfileField name="group" title="Incident Group" value={group}
					              className="col-lg-6"/>
					<ProfileField name="short_desc" title="Short Description" value={short_desc}
					              className="col-lg-12"/>
					<ProfileField name="desc" title="Incident Description" value={desc}
					              className="col-lg-12"/>
					
					<ProfileField name="location" title="Location" value={location}
					              className="col-lg-6"/>
					<ProfileField name="exact_location" title="Exact Location" value={exact_location}
					              className="col-lg-6"/>
				</Row>
			</RowOrgs>
			<Row
				rendered
				idx={2}
				title="2. Date & Time"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ProfileField name="incident_date" type="date" title="Date Incident Occurred"
				              value={incident_date} className="col-lg-6"/>
				<ProfileField name="incident_time" title="Time Incident Occurred"
				              value={incident_time} className="col-lg-6"/>
				
				<ProfileField name="date_reported" type="date" title="Date Reported"
				              value={date_reported} className="col-lg-6"/>
				<ProfileField name="time_reported" title="Time Reported"
				              value={time_reported}
				              className="col-lg-6"/>
				
				<ProfileField name="time_shift" title="Time Shift"
				              value={time_shift}
				              className="col-lg-12"/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Incident Category/Sub-Category"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ProfileField name="category_list" title="Category"
				              value={(category_list || []).map(v => v.category.name).join(', ')}
				              className="col-lg-12"/>
				<ProfileField name="sub_category_list" title="Sub-Category"
				              value={(sub_category_list || []).map(v => v.sub_category.name).join(', ')}
				              className="col-lg-12"/>
			</Row>
			<Row
				rendered
				activeAlways
				idx={4}
				title="4. Investigation Due Date & Team"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<NewEmployeeListTable
					name="investigation_team_list"
					defaultValue={investigation_team_list}
					savable={!!this.investigation}
					targetItem={this.investigation && {key: "investigation_id", item: this.investigation} || null}
					insertFn={insertProxyEmployeeIncidentInvestigator}
					deleteFn={deleteProxyEmployeeIncidentInvestigator}
					onAttrs={({employee, other_person}) => ({
						investigator_id: employee && employee.id,
						investigator_other_id: other_person && other_person.id ? other_person.id : null,
						investigator_other: other_person && !other_person.id ? {data: other_person} : null
					})}
					className="w-full-calc-add-10 -margin-l-10"
					onChange={this.form.onChange}
				/>
				<ClearableInput name="due_date" type="date" placeholder="Investigation Due Date..."
				                defaultValue={due_date} className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}
}

export default NewDialog;
