import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {
	ClearableInput,
	SelectClientInput,
	SelectProjectInput,
	SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import RiskAssessmentItemBaselineTable from './RiskAssessmentItemBaselineTable';

import style from "./NewBaselineRiskAssessmentDialog.lazy.css";
import {Dates} from "utils/Dates";
import insertBaselineRA from "mutations/all/HIRA_And_Opportunities/BaselineRA/insertBaselineRA";

@observer
class NewBaselineRiskAssessmentDialog extends ANewDialog {
	pageKey = "NewBaselineRiskAssessmentDialog";
	title = "Create Baseline Risk Assessment";
	className = 'ANewTableFormDialog';
	
	constructor(props) {
		super(props, style);
	}
	
	get controls() {
		return Controls;
	}
}

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/09_HIRA_And_Opportunities/baseline/";
	
	@observable
	state = {
		lists: {
			risk_tolerance: [1, 2, 3, 4].map(value => {
				return {label: String(value), value}
			})
		}
	};
	
	constructor() {
		super();
		
		this.onNext = this.onNext.bind(this);
		this.onFormChange = this.onFormChange.bind(this);
		
		this.form = new Form();
	}
	
	// <editor-fold defaultstate="collapsed" desc="onFormChange">
	onFormChange(idx) {
		const {dialog} = this.props;
		dialog.cssWidth = idx === 3 ? '100%' : '800px';
		return true;
	}
	
	// </editor-fold>
	
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 0) {
			if (!isObject(form.get('client'))) {
				infoDialog.open('Company is required');
				return;
			}
		}
		if (idx === 1) {
			if (!form.isValid('activity')) {
				infoDialog.open('Activity is required');
				return;
			}
		}
		
		return true;
	}
	
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		if (!isObject(form.get('client'))) {
			infoDialog.open('Company is required');
			return;
		}
		if (!form.isValid('activity')) {
			infoDialog.open('Activity is required');
			return;
		}
		if (!form.isValid('list') || form.get('list').isEmpty()) {
			infoDialog.open('Assessed Items are required');
			return;
		}
		
		const {
			//0
			client,
			project,
			site,
			//1
			activity,
			expiry_date,
			risk_tolerance,
			//2
			list,
		} = form.data;
		const data = {
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//1
			activity,
			expiry_date: Dates.formatDateSQL(expiry_date),
			risk_tolerance,
			//2
			list: {
				data: toJS(list.map(val => {
					const {
						responsible_person,
						control_measure_list_additional,
					} = val;
					if (responsible_person) {
						delete val.responsible_person;
					}
					if (control_measure_list_additional) {
						return {
							...val,
							responsible_person_id: responsible_person && responsible_person.id,
							control_measure_list_additional: {
								data: toJS(val.control_measure_list_additional.map(val => {
										const {text, responsible_person, cost, date_completed} = val;
										if (responsible_person) {
											delete val.responsible_person;
										}
										return {
											...val,
											date_completed: Dates.formatDateSQL(date_completed),
											responsible_person_id: responsible_person && responsible_person.id,
										};
									}),
								),
							},
						};
					}
					return {
						...val,
						responsible_person_id: responsible_person && responsible_person.id
					};
				}))
			},
		};
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertBaselineRA(data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.open());
		});
	}
	
	render() {
		const {onFormNext, onFormBack, onFormOpen, onFormChange} = this.props;
		const {isConsultant, isNoProjects} = storage.is;
		
		return <FormControls>
			{!isNoProjects && <Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormChange={onFormChange}
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
				onFormChange={onFormChange}
			>
				<ClearableInput name="activity" type="text" placeholder="Activity" required
				                className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
				<ClearableInput name="expiry_date" type="date" placeholder="Revision Date..." required
				                className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
				<ClearableInput name="risk_tolerance" type="select" placeholder="Risk Tolerance" required
				                className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}
				                values={this.state.lists.risk_tolerance} add returnValue/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Assessed Items"
				sectionClassName="overflow-auto"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormChange={onFormChange}
			>
				<RiskAssessmentItemBaselineTable name="list" isNew onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}
}

export default NewBaselineRiskAssessmentDialog;
