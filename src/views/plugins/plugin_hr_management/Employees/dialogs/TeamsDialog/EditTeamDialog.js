// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {
	ClearableInput, RowOrgs, SelectAssetTypeInput,
	SelectClientInput,
	SelectEmployeeInput,
	SelectProjectInput,
	SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable, NewPPEItemListTable} from 'components/FormTableComponents';

import style from "./EditTeamDialog.lazy.css";
import updateTeam from "mutations/all/Team/updateTeam";
import {CircularProgress} from "@mui/material";
import findByIdTeam from "mutations/all/Team/findByIdTeam";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
	pageKey = "EditTeamDialog";
	title = "Edit Team";
	findById = findByIdTeam;
	removeById = updateTeam;
	softDeleteAttrs = {status: "Inactive"};
	
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
	path = "plugin_sheq_assist/employees/teams/";
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {
			status: [{text: "Active", value: "Active", checked: true}, {
				text: "Inactive",
				value: "Inactive",
				checked: false
			}]
		},
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();
		
		this.onNext = this.onNext.bind(this);
		
		this.form = new Form();
		this.form.addChangeOne("supervisor", this.onChangeSupervisor.bind(this));
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onChange funs">
	onChangeSupervisor(el, val) {
		const {execWhen} = this.props;
		execWhen(() => this.refs.list).then(list_ref => {
			if (val) {
				const path = "plugin_sheq_assist/StructureAndResponsibility/organograms/list/team/by_supervisor";
				neonBinding.events.emit(path, val.id).then(res => {
					console.log("res", res)
					if (res && isArray(res)) {
						list_ref.list = [...res, null];
					} else {
					
					}
				}).catch(err => {
				
				});
			}
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 0) {
			if (!form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
			// if (!form.isValid('project')) {
			// 	infoDialog.open('Project is required');
			// 	return;
			// }
			// if (!form.isValid('site')) {
			// 	infoDialog.open('Site is required');
			// 	return;
			// }
		}
		if (idx === 1) {
			if (!form.isValid('supervisor')) {
				infoDialog.open('Supervisor is required');
				return;
			}
			if (!form.isValid('name')) {
				infoDialog.open('Team Name is required');
				return;
			}
		}
		
		return true;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form, item: {data: old_data}} = this;
		
		//1
		if (!form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		// if (!form.isValid('project')) {
		// 	infoDialog.open('Project is required');
		// 	return;
		// }
		// if (!form.isValid('site')) {
		// 	infoDialog.open('Site is required');
		// 	return;
		// }
		
		//2
		if (!form.isValid('supervisor')) {
			infoDialog.open('Supervisor is required');
			return;
		}
		if (!form.isValid('name')) {
			infoDialog.open('Team Name is required');
			return;
		}
		
		//3
		if (!form.isValid('employee_list') || form.get('employee_list').isEmpty()) {
			infoDialog.open('At least 1 team member is required');
			return;
		}
		
		const {
			site, project, client,
			//
			supervisor,
			name, status,
			//
			employee_list,
			//
			ppe_type_list
		} = form.data;
		
		const data = {};
		
		ShouldUpdate.checkClient(data, old_data, client);
		ShouldUpdate.checkProject(data, old_data, project);
		ShouldUpdate.checkSite(data, old_data, site);
		
		ShouldUpdate.checkEmployee(data, old_data, supervisor, 'supervisor_id');
		ShouldUpdate.check(data, old_data, name, 'name');
		ShouldUpdate.check(data, old_data, status, 'status');
		
		ShouldUpdate.checkTeamEmployeeList(data, old_data, employee_list, 'employee_list');
		
		ShouldUpdate.checkPPEList(data, old_data, ppe_type_list, 'ppe_type_list');
		
		if (Object.keys(data).isEmpty()) {
			infoDialog.open("Nothing changed!");
			return;
		}
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		updateTeam({id: this.item.id, ...data}).then(res => {
			console.log("res", res)
			if (res === "NOT_FOUND") {
				infoDialog.open("Sorry! The record no longer exist.");
			} else if (res) {
				onSaved && onSaved(res.data);
				infoDialog.open("Record successfully updated.");
				infoDialog.close(2000);
				this.props.close();
			} else {
				infoDialog.open("Could not save the record. Please try again.");
			}
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}
	
	// </editor-fold>
	
	@computed get item() {
		return this.props.state.item;
	}
	
	// <editor-fold defaultstate="collapsed" desc="render">
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
					site, project, client,
					supervisor,
					name, status,
					//
					employee_list,
					//
					ppe_type_list
				}
			}
		} = this;
		
		const {isConsultant, isNoProjects} = storage.is;
		
		return (<FormControls>
			<RowOrgs
				client={client}
				project={project}
				site={site}
				onChange={this.form.onChange}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<Row
					rendered
					idx={1}
					title="1. Team Details"
				>
					<SelectEmployeeInput name="supervisor" placeholder="Supervisor..." defaultValue={supervisor}
					                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="name" type="text" placeholder="Team Name" defaultValue={name}
					                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="status" type="radio" placeholder="Status" defaultValue={status}
					                isClearable={false} className="col-lg-12 form-control" onChange={this.form.onChange}
					                values={this.state.lists.status} returnValue/>
				</Row>
			</RowOrgs>
			<Row
				rendered
				idx={2}
				title="2. Team Members"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewEmployeeListTable name="employee_list" defaultValue={[...(employee_list || []), null]} disableOtherPerson
				                      onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. PPE Required"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<NewPPEItemListTable name="ppe_type_list" defaultValue={[...(ppe_type_list || []), null]}
				                     onChange={this.form.onChange}/>
			</Row>
		</FormControls>);
	}
	
	// </editor-fold>
}

export default EditDialog;
