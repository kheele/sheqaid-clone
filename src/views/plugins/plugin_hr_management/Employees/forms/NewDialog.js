// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import parsePhoneNumber from 'libphonenumber-js';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, SAIdUtils, toDataURI} from 'utils/Utils';

import {
	ClearableInput,
	ProfilePic, RowOrgs,
	SelectGenderInput,
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import OptionalInfoSection from './EditOptionalInfoSection';
import DocumentsSection from './EditDocumentsSection';
import DependentsAndNextOfKinSection from './EditDependentsAndNextOfKinSection';
import SpecificComplianceRequirementsTab from './NewDialogSpecificComplianceRequirementsTab';

import style from "./NewDialog.lazy.css";
import insertEmployee from "mutations/all/Employee/insertEmployee";
// import JobAppointmentsTab from "./ViewJobAppointmentsTab";
// import ViewNotificationSettingsTab from "./ViewNotificationSettingsTab";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
	pageKey = "Employees";
	title = "Create Employee";
	className = 'ANewTableFormDialog ANewEmployeeDocDialog';

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
	path = 'plugin_sheq_assist/employees/';

	// <editor-fold defaultstate="collapsed" desc="state">
	@observable
	state = {
		lists: {
			receive_expired_docs_notifs: [{text: "Receive Expired Documents Notifications", value: true, checked: false}],
		},
		index: 0
	};
	components = [
		{title: 'Employment Info', comp: OptionalInfoSection, ref: "optionalInfoSection"},
		{title: 'Documents', comp: DocumentsSection, ref: "documentsSection"},
		{title: 'Dependents & Next Of Kin', comp: DependentsAndNextOfKinSection, ref: "dependantsAndNextOfKinSection"},
		// {title: 'Job Appointment', comp: JobAppointmentsTab, ref: "jobAppointmentsSection"},
		// {
		//     title: 'Trainings',
		//     comp: TrainingsTab,
		//     ref: "trainingsTab"
		// },
		// {
		//     title: 'PPE Issue',
		//     comp: ViewPPETab,
		//     ref: "ppeTab"
		// },
		// {
		//     title: 'Incidents',
		//     comp: IncidentsTab,
		//     ref: "incidentsTab"
		// },
		// {
		//     title: 'COVID-19',
		//     comp: COVIDTab,
		//     ref: "covidTab"
		// },
		// {
		//     title: 'Attendance',
		//     comp: ViewAttendanceTab,
		//     ref: "attendanceTab"
		// },
		// {
		//     title: 'Compliance',
		//     comp: SpecificComplianceRequirementsTab,
		//     ref: "specificComplianceRequirementsTab"
		// },
		// {
		//     title: 'Notification Settings',
		//     comp: ViewNotificationSettingsTab,
		//     ref: "viewNotificationSettingsTab",
		//     isLast: true
		// }
	];
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.renderComponent = this.renderComponent.bind(this);

		this.form = new Form();
		this.form.addChangeOne("id_num", this.onChangeIdNum.bind(this));
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="componentDidMount">
	componentDidMount() {

	}

	// </editor-fold>

	//<editor-fold desc="onChangeIdNum">
	onChangeIdNum(el, val) {
		execWhen(() => this.refs.dob && this.refs.sex).then(() => {
			const {
				dob: dob_ref, sex: sex_ref
			} = this.refs;
			if (val) {
				const sex = SAIdUtils.getGender(val);
				const dob = SAIdUtils.getDOB(val);
				sex && sex_ref.onChange({label: sex, value: sex});
				dob && dob_ref.onChange(dob);
			}
		});
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	async onSubmit(e, btn, onSaved) {
		const {form,
			refs: {
				optionalInfoSection,
				documentsSection,
				dependantsAndNextOfKinSection,
				specificComplianceRequirementsSection
			}
		} = this;

		const {is: {isContractor}} = storage;

		if (!form.isValid('fname')) {
			infoDialog.open('First Name is required');
			return;
		}
		if (!form.isValid('lname')) {
			infoDialog.open('Last Name is required');
			return;
		}
		if (!form.isValid('id_num') && !form.isValid('passport_num')) {
			infoDialog.open('Identification No / Passport No is required');
			return;
		}
		if (form.isValid('email') && !form.get('email').isEmailAddress()) {
			infoDialog.open('Email Address is not valid');
			return;
		}

		let phone;
		if (form.isValid('phone')) {
			//TODO: fix Default Country
			const phoneNumber = parsePhoneNumber(form.get('phone'), 'ZA');
			if (!phoneNumber) {
				infoDialog.open('Phone Number is not valid');
				return;
			}
			phone = phoneNumber.formatNational().trim().replaceAll(' ', '');
			if (phone.startsWith('0')) {
				phone = phone.substring(1, phone.length);
			}
			if (phone.length < 9) {
				infoDialog.open('Phone Number is not valid');
				return;
			}
		}

		const {
			profile_pic, fname, lname, id_num, passport_num, dob, sex,
			email,
			// receive_expired_docs_notifs,
			client,
			project,
			site,
		} = form.data;

		const data = {
			profile_pic: profile_pic && {path: await toDataURI(profile_pic.path)},

			//
			fname,
			lname,
			id_num: id_num && String(id_num),
			passport_num,
			dob: Dates.formatDateSQL(dob),
			sex,
			email: email && email.toLowerCase(),
			phone: phone && String(phone),

			// competency_list: [{data: []}],
			// contract_list: [{data: []}],
			// counselling_list: [{data: []}],
			// leave_list: [{data: []}],
			// license_list: [{data: []}],
			// medical_list: [{data: []}],
			// warning_list: [{data: []}],
			// work_permit_list: [{data: []}],

			// compliance_list: {
			//     data: (compliance_requirements || []).map(v => {
			//         if (v.status === "Comformance") {
			//             v.status = "C";
			//         } else if (v.status === "Non-Comformance") {
			//             v.status = "NCR";
			//         }
			//         return v;
			//     })
			// },

			// team_id,

			client_id: !isContractor ? (client && client.id) : null,
			project_id: !isContractor ? (project && project.id) : null,
			site_id: !isContractor ? (site && site.id) : null,

			contractor_client_id: isContractor ? (client && client.id) : null,
			contractor_site_id: isContractor ? (site && site.id) : null,
			// contractor_user_id: contractor_user && contractor_user.id,
		};

		// if(receive_expired_docs_notifs) {
		//     data.receive_expired_docs_notifs = receive_expired_docs_notifs;
		// } else {
		//     data.receive_expired_docs_notifs = false;
		// }

		console.log(optionalInfoSection, documentsSection, dependantsAndNextOfKinSection, specificComplianceRequirementsSection)
		const optionalInfoFormData = optionalInfoSection.formData;
		if (optionalInfoFormData) {
			Object.keys(optionalInfoFormData).forEach(key => {
				data[key] = optionalInfoFormData[key];
			});
		}

		const documentsFormData = documentsSection.formData;
		if (documentsFormData) {
			Object.keys(documentsFormData).forEach(key => {
				data[key] = documentsFormData[key];
			});
		}

		const dependantsAndNextOfKinFormData = dependantsAndNextOfKinSection.formData;
		if (dependantsAndNextOfKinFormData) {
			Object.keys(dependantsAndNextOfKinFormData).forEach(key => {
				data[key] = dependantsAndNextOfKinFormData[key];
			});
		}

		// const compliance_requirements = toNoneNullObject(specificComplianceRequirementsSection.form.data);
		// if (compliance_requirements) {
		//     data.compliance_requirements = compliance_requirements.list;
		// }

		console.log(data)

		btn.text("Saving...").disabled();
		progressDialog.open();
		insertEmployee(data).then(res => {
			console.log("res", res)
			if (res === "EMAIL_DUP") {
				infoDialog.open("An Employee with this email address already exist.");
			} else if (res === "PHONE_DUP") {
				infoDialog.open("An Employee with this phone number address already exist.");
			} else {
				onSaved && onSaved(res);
				infoDialog.open("Record successfully saved.");
				infoDialog.close(2000);
				this.props.close();
			}
		}).finally(() => {
			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderComponent">
	renderComponent({title, comp: Comp, ref, isLast}, n) {
		const {props: {onFormNext, onFormBack, onFormOpen}} = this;
		n += 3;
		return <Row
			rendered
			idx={n}
			title={n + '. ' + title}
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={!isLast && onFormNext}
		>
			<Comp ref={ref} idx={n} title={title} onFormOpen={onFormOpen} onFormBack={onFormBack}
			      onFormNext={onFormNext}/>
		</Row>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen} = this.props;

		return <FormControls>
			<RowOrgs
				onChange={this.form.onChange}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<Row
					rendered
					idx={1}
					title="1. Basic Info"
				>
					<ProfilePic name="profile_pic" onChange={this.form.onChange}/>
					<ClearableInput name="fname" type="text" placeholder="First Name" required className="col-lg-6 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="lname" type="text" placeholder="Last Name" required className="col-lg-6 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="id_num" type="text" placeholder="Identification No" className="col-lg-6 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="passport_num" type="text" placeholder="Passport No" className="col-lg-6 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput ref="dob" name="dob" type="date" placeholder="Date of Birth..." required
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<SelectGenderInput ref="sex" name="sex" className="col-lg-6 form-control" onChange={this.form.onChange}/>
				</Row>
			</RowOrgs>
			<Row
				rendered
				idx={2}
				title="2. Contact Details"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<ClearableInput name="phone" type="text" placeholder="Phone No." className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="email" type="email" placeholder="Email Address / Username"
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>
			</Row>
			{/*<Row*/}
			{/*    rendered*/}
			{/*    idx={3}*/}
			{/*    title="3. Notifications Settings"*/}
			{/*    onFormOpen={onFormOpen}*/}
			{/*    onFormBack={onFormBack}*/}
			{/*>*/}
			{/*    <ClearableInput name="receive_expired_docs_notifs" type="checkbox" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.receive_expired_docs_notifs} returnValue/>*/}
			{/*</Row>*/}
			{this.components.map(this.renderComponent)}
		</FormControls>;
	}

	// </editor-fold>
}

export default NewDialog;
