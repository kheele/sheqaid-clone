//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {onSelectLoadSOPLocations} from 'views/plugins/utils';

import {
	ClearableInput,
	PhotoUploadButton,
	SelectClientInput, SelectEmployeeInput,
	SelectProjectInput, SelectSiteInput, UploadButton,
} from 'components/inputs';

import {ANewDialog} from 'components/dialogs';

import {
	SelectWrapper,
	NewRiskListTable,
	NewCloseDownListTable,
	NewSafetyPreRequesiteListTable,
	NewCustomSafetyPreRequesiteListTable,
	NewProcedureListTable,
	NewKeyPointListTable,
	NewOperationListTable,
} from './SOPComponents';

import {FormControls, Row} from "components/FormComponents";
import {Dates} from "utils/Dates";
import {toDataURI} from "utils/Utils";
import insertSOP from "mutations/all/HIRA_And_Opportunities/SOP/insertSOP";

import style from "./NewSOPDialog.lazy.css";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class NewSOPDialog extends ANewDialog {
	pageKey = "NewSOPDialog";
	title = "Create Safe Operating Procedure";

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
			category: [{text: 'Machine', value: 'Machine'}, {text: 'Task', value: 'Task'}, {text: 'Action', value: 'Action'}],
			risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}],
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
		const loads = {location: onSelectLoadSOPLocations};
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
		if (!form.isValid('risk_level')) {
			infoDialog.open('Risk Assessment Level is required');
			return;
		}
		// if (!form.isValid('prepared_by')) {
		// 	infoDialog.open('Prepared By is required');
		// 	return;
		// }

		const {
			//0
			client,
			project,
			site,
			//1
			category,
			risk_level,
			location,
			prepared_by,
			date_created,
			date_revised,
			//2
			doc,
			//3
			risk_list,
			//4
			close_down_list,
			//5
			safety_pre_requesite_list,
			//6
			custom_safety_pre_requesite_list,
			//7
			procedure_list,
			key_point_list,
			operation_list,
			//8
			other,
		} = form.data;
		const data = {
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//1
			category,
			risk_level,
			location,
			prepared_by_id: prepared_by && prepared_by.id,
			date_created: Dates.formatDateSQL(date_created),
			date_revised: Dates.formatDateSQL(date_revised),
			//2
			doc: doc && {path: await toDataURI(doc)} || null,
			//3
			risk_list,
			//4
			close_down_list,
			//5
			safety_pre_requesite_list,
			//6
			custom_safety_pre_requesite_list,
			//7
			procedure_list,
			key_point_list,
			operation_list,
			//8
			other,
		};

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertSOP(data).then(res => {
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
				<ClearableInput name="category" type="radio" placeholder="Category" required
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.category}/>
				<ClearableInput name="risk_level" type="radio" placeholder="Risk Level" required
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.risk_level}/>
				<SelectWrapper state={this.state} name="location" placeholder="Risk Task Location"
				               className="col-lg-12 form-control" onChange={this.form.onChange} values="location"/>

				<SelectEmployeeInput name="prepared_by" placeholder="Prepared By..."
				                 required className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="date_created" type="date" placeholder="Date Created..." defaultValue={new Date()}
				                required className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="date_revised" type="date" placeholder="Date Revised..." required
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
				title="3. Risks Associated With The Equipment / Procedure"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewRiskListTable name="risk_list" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Close Down"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewCloseDownListTable name="close_down_list" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={5}
				title="5. Safety Pre-requisites"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewSafetyPreRequesiteListTable name="safety_pre_requesite_list" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={6}
				title="6. Custom Safety Pre-requisites"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewCustomSafetyPreRequesiteListTable name="custom_safety_pre_requesite_list"
				                                      onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={7}
				title="7. Procedures"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<NewProcedureListTable name="procedure_list" onChange={this.form.onChange}/>
				<NewKeyPointListTable name="key_point_list" onChange={this.form.onChange}/>
				<NewOperationListTable name="operation_list" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={8}
				title="8. OTHER - Add exit text into the block below if required. You can/paste from a text document."
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<ClearableInput name="other" type="textarea" placeholder="Other" className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}
	//</editor-fold>
}

export default NewSOPDialog;
