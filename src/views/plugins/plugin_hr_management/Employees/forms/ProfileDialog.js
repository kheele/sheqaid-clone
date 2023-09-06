// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ClearableInput, ProfileField, ProfilePic, RowOrgs, SelectGenderInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import OptionalInfoSection from './ViewOptionalInfoSection';
import ViewDocumentsSection from './ViewDocumentsSection';
import DependentsAndNextOfKinSection from './ViewDependentsAndNextOfKinSection';

import ViewNotificationSettingsTab from './ViewNotificationSettingsTab';

import DashboardSection from "./DashboardSection";

import style from "./ProfileDialog.lazy.css";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import {CircularProgress} from "@mui/material";
import ProfilePDFReport from "../reports/ProfilePDFReport";
import JobObservationsSection from "./ViewJobObservationsSection";
import TrainingsSection from "./ViewTrainingsSection";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "Employee";
	className = "AProfileEmployeeDocDialog";
	findById = findByIdEmployee;

	constructor(props) {
		super(props, style);
	}

	title() {
		return storage.is.isEmployee ? "My Account" : ("Employee (" + (this.props.isRemoved ? "Removed" : "Active") + ")");
	}

	onSaveAsPDF(e, btn) {
		this.refs.controls.onSaveAsPDF(e, btn);
	}

//    
//    get topButtonsHiddenDelete() {
//        if(this.props.isRemoved) {
//            return true;
//        }
//        const {user} = storage.loggedUser;
//        const {permissions_other} = user.data;
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");
//        if(!Permissions.allowRemove(permissions_other_Employees)) {
//            return true;
//        }
//        return this.isLoggedUser;
//    }
//    
//    get topButtonsHiddenPrint() {
//        const {user} = storage.loggedUser;
//        const {permissions_other} = user.data;
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");
//        if(!Permissions.allowPrint(permissions_other_Employees)) {
//            return true;
//        }
//        return false;
//    }

	get isLoggedUser() {
		const {user} = storage.loggedUser;
		const {item} = this.state;
		return storage.is.isEmployee && item && item.id === user.id;
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	path = 'plugin_sheq_assist/employees/';

	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		item: null,
	};
	components = [
		{title: 'Employment Info', comp: OptionalInfoSection, ref: "optionalInfoTab"},
		{title: 'Documents', comp: ViewDocumentsSection, ref: "documentsTab"},
		{title: 'Dependents & Next Of Kin', comp: DependentsAndNextOfKinSection, ref: "dependentsAndNextOfKinTab"},
		// {title: 'Job Observations', comp: JobObservationsSection, ref: "jobObservationsSection"},
		// {title: 'Trainings', comp: TrainingsSection, ref: "trainingsTab"},
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
		// },
		{
			title: 'Dashboard',
			comp: DashboardSection,
			ref: "dashboardSection",
			activeAlways: true,
			isLast: true
		}
	];
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onViewOtherInfo = this.onViewOtherInfo.bind(this);
		this.renderComponent = this.renderComponent.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="componentDidMount">
	async componentDidMount() {
		const {dialog} = this.props;

		autorun(async () => {
			if (!this.item) return;

			const {removed} = this.item.data;
			const node = await dialog.execWhen(() => dialog.getTitleDOMNode());
			const jqEl = $(node);

			if (removed) {
				jqEl.addClass('removed');
				jqEl.removeClass('active');
			} else {
				jqEl.addClass('active');
				jqEl.removeClass('removed');
			}
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
	onSaveAsPDF(e, btn) {
		this.refs.profilePDFReport.open(this.item);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onViewOtherInfo">
	onViewOtherInfo(e, btn) {
		const {action} = btn.props;
		this.refs[action + "Dialog"].open('employee.id', this.item);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderComponent">
	renderComponent({title, comp: Comp, ref, activeAlways = false, isLast}, n) {
		const {props: {onFormNext, onFormBack, onFormOpen}} = this;
		n += 3;
		return <Row
			activeAlways={activeAlways}
			rendered
			idx={n}
			title={n + '. ' + title}
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={!isLast && onFormNext}
		>
			<Comp ref={ref} idx={n} title={title} item={this.item} onFormOpen={onFormOpen} onFormBack={onFormBack}
			      onFormNext={onFormNext}/>
		</Row>;
	}

	// </editor-fold>

	@computed get item() {
		return this.state.item;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		const {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {renderProfileCover}
			},
			item, item: {
				id, data: {
					created_at,
					profile_pic,
					client, project, site,
					fname, lname, id_num, passport_num, dob, sex,
					phone, email,
				}
			}
		} = this;

		console.log('employee', this.item)

		return <FormControls>
			<RowOrgs
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				client={client}
				project={project}
				site={site}
				readonly
			>
				<Row
					rendered
					idx={1}
					title="1. Basic Info"
				>
					<ProfileField name="fname" title="First Name" value={fname} className="col-lg-6"/>
					<ProfileField name="lname" title="Last Name" value={lname} className="col-lg-6"/>
					<ProfileField name="id_num" title="Identification No." value={id_num} className="col-lg-6"/>
					<ProfileField name="passport_num" title="Passport No." value={passport_num} className="col-lg-6"/>
					<ProfileField name="dob" type="date" title="Date of Birth" value={dob} className="col-lg-6"/>
					<ProfileField name="sex" title="Gender" value={sex} className="col-lg-6"/>
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
				<ProfileField name="phone" title="Phone No." value={phone} className="col-lg-6"/>
				<ProfileField name="email" title="Email Address" value={email} className="col-lg-6"/>
			</Row>
			{this.components.map(this.renderComponent)}
			<ProfilePDFReport ref="profilePDFReport"/>
		</FormControls>;
	}

	// </editor-fold>
}

export default ProfileDialog;
//351