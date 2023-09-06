import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {FormControls, Row} from 'components/FormComponents';
import {CompetencyControls} from "../../Competencies/forms/ProfileDialog";
import {ContractControls} from "../../Contracts/forms/ProfileDialog";
import {CounselingControls} from "../../Counselings/forms/ProfileDialog";
import {
	JobAppointmentControls
} from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/JobAppointments/forms/ProfileDialog";
import {LeaveControls} from "../../Leaves/forms/ProfileDialog";
import {LicenseControls} from "../../Licenses/forms/ProfileDialog";
import {MedicalControls} from "../../Medicals/forms/ProfileDialog";
import {WarningControls} from "../../Warnings/forms/ProfileDialog";
import {WorkPermitControls} from "../../WorkPermits/forms/ProfileDialog";
import {Dates} from "utils/Dates";
import PrDPSection from "./PrDPSection";
import IDOrPassportSection from "./IDOrPassportSection";
import {mapPersonDetails} from "../../../../../utils/ArrayMapperUtils";

@observer
class EditDocumentsSection extends React.Component {
	pageKey = "NewDocumentsTab";

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.form = new Form();
	}

	//</editor-fold>

	//<editor-fold desc="formData">
	get formData() {
		const {data} = this.form;
		let {
			document_list,
			//

			competency_list,
			contract_list,
			counselling_list,
			leave_list,
			license_list,
			medical_list,
			warning_list,
			work_permit_list,
			job_appointment_list,
		} = data;

		return {
			document_list: {
				data: (document_list || []).map((
					{
						type,
						expiry_date,
						doc,
					}
				) => ({
					is_default: true,
					//1
					type,
					expiry_date: Dates.formatDateSQL(expiry_date),
					//2
					doc: doc && doc.path,
				}))
			},
			competency_list: {
				data: (competency_list || []).map((
					{
						issued_date,
						expiry_date,
						type,
						competency_type,
						accreditation_num,
						training,
						doc
					}
				) => ({
					issued_date: Dates.formatDateSQL(issued_date),
					expiry_date: Dates.formatDateSQL(expiry_date),
					type,
					competency_type,
					accreditation_num,
					training_id: training && training.id,
					doc: doc.path
				}))
			},
			contract_list: {
				data: (contract_list || []).map((
					{
						contractDetailsTab,
						salaryInfoTab,
						doc,
						job_profile_doc,
					}
				) => {
					const contract_details = toNoneNullObject(contractDetailsTab.form.data);
					const salary_info = toNoneNullObject(salaryInfoTab.form.data);

					const v = {
						doc: doc && doc.path,
						job_profile_doc: job_profile_doc && job_profile_doc.path,
					};

					if (contract_details) {
						const {
							contract_type,
							start_date,
							expiry_date,
							end_of_trial_period,
							start_time,
							end_time,
							daily_working_hours,
							notes,
						} = contractDetailsTab.form.data;
						v.contract_details_list = {
							data: [{
								contract_type,
								start_date: Dates.formatTimestampSQL(start_date),
								expiry_date: Dates.formatTimestampSQL(expiry_date),
								end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
								start_time,
								end_time,
								daily_working_hours,
								notes,
							}],
						};
					}

					if (salary_info) {
						const {
							payment_type,
							salary_interval,
							salary,
							wage,
							deductible,//[{text, value}]
						} = salaryInfoTab.form.data;

						const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];
						v.salary_info_list = {
							data: [{
								payment_type,
								salary_interval,
								salary,
								wage,
								deductible_list: {data: deductible_list},//[{text, value}]
							}],
						};
					}

					return v;
				})
			},
			counselling_list: {
				data: (counselling_list || []).map((
					{
						doc,
						responsible_person,
						corrective_actions,
						counselling_hrs_to_complete,
						expiry_date,
						incident_desc,
						reasons,
						types,
						witness_list,
					}
				) => ({
					doc: doc && doc.path,
					responsible_person_id: responsible_person && responsible_person.id,
					corrective_actions,
					counselling_hrs_to_complete,
					expiry_date: Dates.formatTimestampSQL(expiry_date),
					incident_desc,
					reasons,
					types,
					witness_list: {
						data: witness_list ? witness_list.map(v => {
							if (v.id) {
								return {witness_id: v.id};
							}
							const {job_position} = v;
							if(job_position) {
								delete v.job_position;
								v.job_position_id = job_position.id;
							}
							return {witness_external: {data: v}};
						}) : []
					},
				}))
			},
			leave_list: {
				data: (leave_list || []).map((
					{
						doc,
						date,
						days_booked,
						due_to,
						employee_comments,
						expiry_date,
						notes,
						reason,
						type,
					}
				) => ({
					doc: doc && doc.path,
					date: Dates.formatTimestampSQL(date),
					days_booked,
					due_to: !form.isValid('due_to') ? 'Occurred Incident' : due_to,
					employee_comments,
					expiry_date: Dates.formatTimestampSQL(expiry_date),
					notes,
					reason,
					type,
				}))
			},
			license_list: {
				data: (license_list || []).map((
					{
						doc,
						date,
						expiry_date,
						notes,
					}
				) => ({
					doc: doc && doc.path,
					date: Dates.formatTimestampSQL(date),
					expiry_date: Dates.formatTimestampSQL(expiry_date),
					notes,
				}))
			},
			medical_list: {
				data: (medical_list || []).map((
					{
						doc,
						expiry_date,
						restrictions,
						annexture_3,
					}
				) => ({
					doc: doc && doc.path,

					expiry_date: Dates.formatTimestampSQL(expiry_date),
					restrictions,
					annexture_3,
				}))
			},
			warning_list: {
				data: (warning_list || []).map((
					{
						doc,
						date,
						details,
						employee_comments,
						expiry_date,
						issued_by,
						notes,
						type,
						witness_list,
					}
				) => ({
					doc: doc && doc.path,
					date: Dates.formatTimestampSQL(date),
					details,
					employee_comments,
					expiry_date: Dates.formatTimestampSQL(expiry_date),
					issued_by_id: issued_by && issued_by.id,
					notes,
					type,
					witness_list: {
						data: witness_list ? witness_list.map(v => {
							if (v.id) {
								return {witness_id: v.id};
							}
							const {job_position} = v;
							if(job_position) {
								delete v.job_position;
								v.job_position_id = job_position.id;
							}
							return {witness_external: {data: v}};
						}) : []
					},
				}))
			},
			work_permit_list: {
				data: (work_permit_list || []).map((
					{
						doc,
						date,
						expiry_date,
						notes,
					}
				) => ({
					doc: doc && doc.path,

					date: Dates.formatDateSQL(date),
					expiry_date: Dates.formatDateSQL(expiry_date),
					notes,
				}))
			},
			job_appointment_list: {
				data: (job_appointment_list || []).map(({doc, date, expiry_date}) => ({
					doc: doc && doc.path,
					date: Dates.formatTimestampSQL(date),
					expiry_date: Dates.formatTimestampSQL(expiry_date),
					notes,
				}))
			},
		}
	}

	//</editor-fold>

	//<editor-fold desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen, onFormSave, item, idx} = this.props;

		let {
			id,
			document_list,

			competency_list,
			contract_list,
			counselling_list,
			leave_list,
			license_list,
			medical_list,
			warning_list,
			work_permit_list,
			job_appointment_list,

			ppe_list,
			trainer_training_list,
		} = (item && item.data) || {};

		const isNewEmployee = !id;

		let __idx = 0;
		const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
		return <div id={this.pageKey + "-tab"} className={className}>
			<FormControls lazyLoad>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} ID / Passport`}
					sectionClassName="IDOrPassportSection-section h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
					onFormSave={onFormSave}
				>
					<IDOrPassportSection item={item} isNewEmployee={isNewEmployee} isEmbedded onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Competencies`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<CompetencyControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					                    onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Contracts`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<ContractControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					                  onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Job Appointments`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<JobAppointmentControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					                        onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Counselling`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<CounselingControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					                    onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Leaves`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<LeaveControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					               onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Licenses & PrDP`}
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<FormControls>
						<Row
							rendered
							idx={idx + `.${__idx}.1`}
							title={idx + `.${__idx}.1 Licenses`}
							sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
							onFormOpen={onFormOpen}
							onFormNext={onFormNext}
						>
							<LicenseControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
							                 onChange={this.form.onChange}/>
						</Row>
						<Row
							rendered
							idx={idx + `.${__idx}.2`}
							title={idx + `.${__idx}.2 PrDP`}
							sectionClassName="PrDPSection-section h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
							onFormOpen={onFormOpen}
							onFormBack={onFormBack}
						>
							<PrDPSection item={item} isNewEmployee={isNewEmployee} isEmbedded onChange={this.form.onChange}/>
						</Row>
					</FormControls>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Medical Fitness`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<MedicalControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					                 onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Warnings`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
				>
					<WarningControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					                 onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={idx + `.${__idx++}`}
					title={idx + `.${__idx} Work Permit`}
					sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
				>
					<WorkPermitControls item={item} isNewEmployee={isNewEmployee} tabsHeight="530px" isEmbedded
					                    onChange={this.form.onChange}/>
				</Row>
			</FormControls>
		</div>
	}

	//</editor-fold>
}

export default EditDocumentsSection;