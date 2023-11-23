import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {
	ClearableInput,
	Clickable, SelectChemicalPhysicalStateInput, SelectChemicalProductInput, SelectChemicalTypesInput,
	SelectClientInput, SelectEmployeeInput,
	SelectProjectInput, SelectSDSProductInput,
	SelectSiteInput
} from 'components/inputs';
import {FormControls, Fragment, NavButtons, RiskRating, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import RiskAssessmentItemTaskBasedTable from './RiskAssessmentItemTaskBasedTable';

import style from "./NewTaskBaseRiskAssessmentDialog.lazy.css";
import {Dates} from "utils/Dates";
import insertTaskbasedRA from "mutations/all/HIRA_And_Opportunities/TaskbasedRA/insertTaskbasedRA";

@observer
class NewTaskBaseRiskAssessmentDialog extends ANewDialog {
	pageKey = "NewTaskBaseRiskAssessmentDialog";
	title = "Create Task Base Risk Assessment";
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
	path = "plugin_sheq_assist/09_HIRA_And_Opportunities/task-base/";

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

		this.form = new Form();
	}

	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 1) {
			if (!isObject(form.get('client'))) {
				infoDialog.open('Company is required');
				return;
			}
			if (!form.isValid('activity')) {
				infoDialog.open('Description Of Task is required');
				return;
			}
		}
		if (idx === 2) {
			if (!form.isValid('list') || form.get('list').isEmpty()) {
				infoDialog.open('Assessed Items are required');
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
			infoDialog.open('Description Of Task is required');
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
			list: toJS(list),
		};

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertTaskbasedRA(data).then(res => {
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
				<ClearableInput name="activity" type="text" placeholder="Description Of Task" required
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
			>
				<RiskAssessmentItemTaskBasedTable name="list" isNew onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}
}

export default NewTaskBaseRiskAssessmentDialog;