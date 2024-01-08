//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {
	Button, ProfileField,
} from 'components/inputs';
import {FormControls, NavButtons, Row} from 'components/FormComponents';
import {AProfileDialog, ViewReportPDFDialog} from 'components/dialogs';

import RiskAssessmentItemBaselineTable from './RiskAssessmentItemBaselineTable';

import style from "./ProfileBaselineRiskAssessmentDialog.lazy.css";
import {computed, observable} from "mobx";

import findByIdBaselineRA from "mutations/all/HIRA_And_Opportunities/BaselineRA/findByIdBaselineRA";
import {CircularProgress} from "@mui/material";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class ProfileBaselineRiskAssessmentDialog extends AProfileDialog {
	pageKey = "ProfileBaselineRiskAssessmentDialog";
	className = 'ANewTableFormDialog';
	findById = findByIdBaselineRA;

	constructor(props) {
		super(props, style);

		this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
	}


	title() {
		return "Baseline Risk Assessment";
	}

	onSaveAsPDF(e, btn) {
		this.refs.controls.onSaveAsPDF(e, btn);
	}

	get topButtons() {
		return <React.Fragment>
			<Button className="btn btn-primary save" onClick={this.onSaveAsPDF}>
				<i className="fa fa-file-pdf-o icon-left"/> Save As PDF
			</Button>
		</React.Fragment>;
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
	
	};

	//</editor-fold>

	constructor() {
		super();

		this.printImpl = this.printImpl.bind(this);
	}

	printImpl() {
		return neonBinding.events.emit(this.path + "create/pdf", this.item.id);
	}

	onSaveAsPDF(e, btn) {
		btn.text("Saving As PDF...").disabled();
		this.printImpl().then(res => {
			this.refs.viewReportPDFDialog.open(res);
			infoDialog.open("Record successfully saved as PDF.");
			infoDialog.close(2000);
		}).finally(() => {
			btn.text("Save As PDF").enabled();
		});
	}

	@computed get item() {
		return this.props.state.item;
	}

	//<editor-fold desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
			},
			item, item: {
				id, data: {
					created_at,
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
				}
			}
		} = this;

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
				{isConsultant && <ProfileField
					name="client"
					title="Company"
					value={client}
					renderer={val => val.name}
					className="col-lg-12"
				/>}
				<ProfileField
					name="project"
					title="Project"
					value={project}
					renderer={val => val.name}
					className="col-lg-12"
				/>
				<ProfileField
					name="site"
					title="Site"
					value={site}
					renderer={val => val.name}
					className="col-lg-12"
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
			>
				<ProfileField name="activity" type="text" placeholder="Description Of Task" value={activity}
				              className="col-lg-12"/>
				<ProfileField name="expiry_date" type="date" placeholder="Revision Date" value={expiry_date}
				              className="col-lg-12"/>
				<ProfileField name="risk_tolerance" type="text" placeholder="Risk Tolerance" value={risk_tolerance}
				              className="col-lg-12"/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Assessed Items"
				className="row-photos"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<RiskAssessmentItemBaselineTable name="list" readonly defaultValue={list}/>
			</Row>
			<ViewReportPDFDialog ref="viewReportPDFDialog" fileName="Risk_Assessment_Baseline_Report"
			                     title={"Baseline Risk Assessment (" + activity + ")"}/>
		</FormControls>;
	}
	//</editor-fold>
}

export default ProfileBaselineRiskAssessmentDialog;
