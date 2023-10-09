// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen} from 'utils/Utils';
import {
	ClearableInput,
	SelectClientInput,
	SelectEmployeeInput,
	SelectProjectInput,
	SelectSiteInput,
	UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import NewWCL2Dialog from './NewWCL2Dialog.js';
import NewWCL4Dialog from './NewWCL4Dialog.js';
import NewWCL5Dialog from './NewWCL5Dialog.js';
import NewWCL6Dialog from './NewWCL6Dialog.js';
import NewAnnexture1Dialog from './NewAnnexture1Dialog.js';

import PrintWCL2Dialog from '../../dialogs/PrintWCL2Dialog.js';
import PrintWCL4Dialog from '../../dialogs/PrintWCL4Dialog.js';
import PrintWCL5Dialog from '../../dialogs/PrintWCL5Dialog.js';
import PrintWCL6Dialog from '../../dialogs/PrintWCL6Dialog.js';
import PrintAnnexture1Dialog from '../../dialogs/PrintAnnexture1Dialog.js';

import ButtonWCl from '../../dialogs/ButtonWCl';

import NewDialog from './ClaimsEmployerDetailsDialog/NewDialog';

import WCl5Table from "../../dialogs/WCl5Table";

import style from "./NewClaimsClientDialog.lazy.css";
import findByClientIdClaimsEmployerDetails
	from "mutations/all/COIDA/ClaimsEmployerDetails/findByClientIdClaimsEmployerDetails";
import insertClaimsClient from "mutations/all/COIDA/ClaimsClient/insertClaimsClient";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewClaimsClientDialog extends ANewDialog {
	pageKey = "NewClaimsClientDialog";
	title = "Create ClaimsClient";
	
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
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {},
		wcl_2: null,
		wcl_4: null,
		wcl_6: null,
		annexture_1: null,
		employer_details: null,
		doctor_email_change_1: false,
		doctor_email_change_2: false
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();
		
		this.onNext = this.onNext.bind(this);
		
		this.onNewDialog = this.onNewDialog.bind(this);
		this.onPrintDialog = this.onPrintDialog.bind(this);
		
		this.form = new Form();
		this.form.addChangeOne("doctor_email_1", this.onChangeDoctorEmail1.bind(this));
		this.form.addChangeOne("doctor_email_2", this.onChangeDoctorEmail2.bind(this));
		this.form.addChangeOne("client", this.onChangeClient.bind(this));
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onChange funs">
	onChangeDoctorEmail1(el, val) {
		const {doctor_email_change_2} = this.state;
		if (doctor_email_change_2) {
			this.state.doctor_email_change_2 = false;
			return;
		}
		execWhen(() => this.refs.doctor_email_2).then(ref => {
			this.state.doctor_email_change_2 = true;
			if (val) {
				ref.onChange(val);
			} else {
				ref.reset();
			}
		});
	}
	
	onChangeDoctorEmail2(el, val) {
		const {doctor_email_change_1} = this.state;
		if (doctor_email_change_1) {
			this.state.doctor_email_change_1 = false;
			return;
		}
		execWhen(() => this.refs.doctor_email_1).then(ref => {
			this.state.doctor_email_change_1 = true;
			if (val) {
				ref.onChange(val);
			} else {
				ref.reset();
			}
		});
	}
	
	onChangeClient(el, val) {
		if (val) {
			progressDialog.open();
			findByClientIdClaimsEmployerDetails(val.id).then(res => {
				progressDialog.close();
				if (!res) {
					infoDialog.open('No Employer Details found');
					this.refs.newClaimsEmployerDetailsDialog.open().then(res => {
						this.state.employer_details = res;
					});
				} else {
					this.state.employer_details = res;
				}
			}).catch(err => {
				progressDialog.close();
				this.state.employer_details = null;
				console.error(err);
				infoDialog.open('An error occurred. Please try again');
			});
		} else {
			this.state.employer_details = null;
		}
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="buttons funs">
	onNewDialog(evt, btn) {
		let {idx, name, dialogName, value, onComplete} = btn.props;
		const dialog = this.refs[dialogName];
		if (!dialog) return;
		
		const {
			form, form: {
				data: {
					client = null, employee = null, claim_number = null, accident_date = null
				}
			},
			state, state: {employer_details}, refs
		} = this;
		
		if (!value) {
			value = state[name];
		}
		
		if (!form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		
		if (!form.isValid('accident_date') && (
			name === 'annexture_1' ||
			name === 'wcl_2' ||
			name === 'wcl_4' ||
			name === 'wcl_5' ||
			name === 'wcl_6')) {
			infoDialog.open('Date of Accident is required');
			return;
		}
		
		dialog && dialog.extraProp('employer_details', employer_details).extraProp('employee', employee).extraProp('claim_number', claim_number).extraProp('accident_date', accident_date).open(value).then(value => {
			if (onComplete) {
				onComplete(value, btn);
			} else {
				state[name] = value;
			}
		});
	}
	
	onPrintDialog(evt, btn) {
		let {name, title, dialogName, value} = btn.props;
		const dialog = this.refs[dialogName];
		if (!dialog) return;
		
		console.log('btn.props', btn.props)
		if (!value) {
			value = this.item.data[name];
		}
		
		if (!value) {
			infoDialog.open(`${title} is not available`);
			return;
		}
		dialog && dialog.open(this.item);
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		const {isContractor, isConsultant} = storage.is;
		if (idx === 0) {
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
		}
		if (idx === 1) {
			if (!form.isValid('employee')) {
				infoDialog.open('Employee is required');
				return;
			}
		}
		if (idx === 2) {
			if (!form.isValid('accident_date')) {
				infoDialog.open('Date of Accident is required');
				return;
			}
		}
		if (idx === 4) {
			if (form.isValid('doctor_email_1') && !form.get('doctor_email_1').isEmailAddress()) {
				infoDialog.open('Medical Practitioner/Chiropractor Email Address is not valid email address');
				return;
			}
		}
		if (idx === 5) {
			if (form.isValid('doctor_email_2') && !form.get('doctor_email_2').isEmailAddress()) {
				infoDialog.open('Medical Practitioner/Chiropractor Email Address is not valid email address');
				return;
			}
		}
		
		return true;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;
		
		if (!form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		if (!form.isValid('employee')) {
			infoDialog.open('Employee is required');
			return;
		}
		if (!form.isValid('accident_date')) {
			infoDialog.open('Date of Accident is required');
			return;
		}
		if (form.isValid('doctor_email_1') && !form.get('doctor_email_1').isEmailAddress()) {
			infoDialog.open('Medical Practitioner/Chiropractor Email Address is not valid email address');
			return;
		}
		
		const {
			client,
			project,
			site,
			//
			employee,
			//
			claim_number,
			provincial_office,
			accident_date,
			doctor_email_1,
			//
			wcl_4_external_doc,
			wcl_5_list
		} = form.data;
		
		const {
			wcl_2,
			wcl_4,
			wcl_6,
			annexture_1,
		} = this.state;
		
		const data = {
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//
			employee_id: employee.id,
			//
			claim_number,
			provincial_office,
			accident_date: Dates.formatDateSQL(accident_date),
			doctor_email_1,
			//
			wcl_2: wcl_2 ? {data: wcl_2} : null,
			wcl_4: wcl_4 ? {data: wcl_4} : null,
			wcl_5_list: {
				data: (wcl_5_list || []).filter(v => !!v).map(({wcl_5_external_doc, doctor_email, wcl_5}) => {
					if (wcl_5_external_doc) {
						return {external_doc: wcl_5_external_doc};
					} else if (doctor_email) {
						return {doctor_email};
					} else if (wcl_5) {
						return toJS(wcl_5);
					}
				}).filter(v => !!v),
			},
			wcl_6: wcl_6 ? {data: wcl_6} : null,
			annexture_1: annexture_1 ? {data: annexture_1} : null
		};
		
		console.log('wcl_5_list', wcl_5_list && wcl_5_list.slice())
		
		if (wcl_4_external_doc) {
			if (!data.wcl_4) {
				data.wcl_4 = {
					data: {external_doc: wcl_4_external_doc},
				};
			} else {
				data.wcl_4.data.external_doc = wcl_4_external_doc;
			}
		}
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		insertClaimsClient(data).then(res => {
			console.log("res", res)
			onSaved && onSaved(res);
			infoDialog.open("Record successfully saved.");
			infoDialog.close(2000);
			this.props.close();
		}).finally(() => {
			btn.text("Save").enabled();
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {state, props: {onFormNext, onFormBack, onFormOpen}} = this;
		const {isContractor, isConsultant} = storage.is;
		return <FormControls onChange={this.form.onChange}>
			<Row
				rendered
				active
				idx={0}
				title="Company / Project / Site"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				{isConsultant && <SelectClientInput ref="client" name="client" placeholder="Company..." required
				                                    className="col-lg-12 form-control"/>}
				<SelectProjectInput ref="project" name="project" placeholder="Project..." required
				                    className="col-lg-12 form-control"/>
				<SelectSiteInput ref="site" name="site" placeholder="Site..." required className={"col-lg-12 form-control"}/>
			</Row>
			<Row
				rendered
				idx={1}
				title="Employee Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." required
				                     className="col-lg-12 form-control"/>
			</Row>
			<Row
				rendered
				idx={2}
				title="Claim Number / Provincial Office / Date of Accident"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput ref="claim_number" name="claim_number" type="text" placeholder="Claim Number"
				                className="col-lg-12 form-control"/>
				<ClearableInput ref="provincial_office" name="provincial_office" type="text" placeholder="Provincial Office"
				                className="col-lg-12 form-control"/>
				<ClearableInput ref="accident_date" name="accident_date" type="date" placeholder="Date of Accident..."
				                className="col-lg-12 form-control"/>
			</Row>
			<Row
				rendered
				idx={3}
				title="W.CI.2 Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ButtonWCl state={state} name="wcl_2" dialogName="newWCL2Dialog" text="W.CI.2" onClick={this.onNewDialog}/>
			</Row>
			<Row
				rendered
				idx={4}
				title="W.CI.4 Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ButtonWCl state={state} name="wcl_4" dialogName="newWCL4Dialog" text="W.CI.4" onClick={this.onNewDialog}/>
				<h3 className="text-center col-lg-12 margin-t-10 margin-b-0">OR</h3>
				<UploadButton
					ref="wcl_4_external_doc"
					name="wcl_4_external_doc"
					buttonTitle="Upload W.CI.4"
					type={['PDF', 'Word', 'Photo']}
					showOnlyIcon
					className="col-lg-12 col-xs-12 margin-t-10"
				/>
				<h3 className="text-center col-lg-12 margin-t-10 margin-b-0">OR</h3>
				<label className="col-lg-12 text-center margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
					Medical Practitioner/Chiropractor Email Address
				</label>
				<ClearableInput ref="doctor_email_1" name="doctor_email_1" type="text" placeholder="Email Address"
				                footerDesc="For Filling W.CI.4 Online" className="col-lg-12 form-control"/>
			</Row>
			<Row
				rendered
				idx={5}
				title="W.CI.5 Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<WCl5Table ref="wcl_5_list" name="wcl_5_list" defaultValue={[null]} onNewDialog={this.onNewDialog}
				           onPrintDialog={this.onPrintDialog}/>
			</Row>
			<Row
				rendered
				idx={6}
				title="W.CI.6 Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ButtonWCl state={state} name="wcl_6" dialogName="newWCL6Dialog" text="W.CI.6" onClick={this.onNewDialog}/>
			</Row>
			<Row
				rendered
				idx={7}
				title="Annexture 1 Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<ButtonWCl state={state} name="annexture_1" dialogName="newAnnexture1Dialog" text="Annexture 1"
				           onClick={this.onNewDialog}/>
			</Row>
			
			<NewWCL2Dialog ref="newWCL2Dialog"/>
			<NewWCL4Dialog ref="newWCL4Dialog"/>
			<NewWCL5Dialog ref="newWCL5Dialog"/>
			<NewWCL6Dialog ref="newWCL6Dialog"/>
			<NewAnnexture1Dialog ref="newAnnexture1Dialog"/>
			
			<PrintWCL2Dialog ref="printWCL2Dialog"/>
			<PrintWCL4Dialog ref="printWCL4Dialog"/>
			<PrintWCL5Dialog ref="printWCL5Dialog"/>
			<PrintWCL6Dialog ref="printWCL6Dialog"/>
			<PrintAnnexture1Dialog ref="printAnnexture1Dialog"/>
			
			<NewDialog ref="newClaimsEmployerDetailsDialog"/>
		</FormControls>;
	}
	
	// </editor-fold>
}

export default NewClaimsClientDialog;
//352
