// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";

import {
	AddFilesGridViewInput,
	ClearableInput,
	ClickableHumanBody,
	SelectClientInput,
	SelectEmployeeInput,
	SelectGenderInput,
	SelectIncidentActivityList,
	SelectIncidentBodilyInjuryLocationList,
	SelectIncidentCategoryList,
	SelectIncidentInjuryMechanismList,
	SelectIncidentNatureOfInjuryList,
	SelectIncidentSubCategoryList,
	SelectIncidentTestTypeInput,
	SelectProjectInput,
	SelectSectorInput,
	SelectSiteInput
} from 'components/inputs';
import {FormControls, Fragment, RiskRating, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="newRender">
const newRender = function () {
	const {onFormNext, onFormBack, onFormOpen} = this.props;
	const {isConsultant} = storage.is;
	return (<div className="controls-wrapper controls-sectioned">
		<div className="controls">
			<Row
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
			</Row>
			<Row
				rendered
				idx={1}
				title="1. Incident Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput name="group" type="radio" placeholder="Incident Group"
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.group} returnValue/>
				<ClearableInput name="short_desc" type="textarea" placeholder="Short Description"
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="desc" type="textarea" placeholder="Incident Description"
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>

				<ClearableInput name="location" type="select" placeholder="Select Location..."
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.location} returnValue add/>
				<ClearableInput name="exact_location" type="textarea" placeholder="Exact Location"
				                className="col-lg-12 form-control" onChange={this.form.onChange}/>

				<label className="col-lg-12 margin-t-15">Attach Relevant Documents/Files</label>
				<AddFilesGridViewInput name="document_list" title="Add Document/File"
				                       className="padding-t-40 margin-0 -margin-t-40 col-lg-12 pull-left"
				                       onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Date & Time"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<ClearableInput name="incident_date" type="date" placeholder="Date Incident Occurred..."
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="incident_time" type="time" placeholder="Time Incident Occurred..."
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>

				<ClearableInput name="date_reported" type="date" placeholder="Date Reported..."
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="time_reported" type="time" placeholder="Time Reported..."
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>

				<ClearableInput name="time_shift" type="radio" placeholder="Time Shift"
				                className="col-lg-6 hor-center form-control" onChange={this.form.onChange}
				                values={this.state.lists.time_shift} return/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Incident Category (Required)"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<SelectIncidentCategoryList name="category_list" type="checkbox" placeholder="Incident Category"
				                            vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Incident Sub-Category (Optional)"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<SelectIncidentSubCategoryList ref="sub_category_list" type="checkbox" name="sub_category_list"
				                               vertical={2} className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={5}
				title="5. Sectors & Activities"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<SelectSectorInput name="sector_list" type="checkbox" placeholder="Sector(s)"
				                   vertical={3} className="col-lg-12 form-control"
				                   onChange={this.form.onChange}/>

				<SelectIncidentActivityList ref="activity_list" type="checkbox" name="activity_list"
				                            vertical={2} className="col-lg-12 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={6}
				title="6. Person(s)"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<FormControls>
					<Row
						rendered
						idx={6.1}
						title="6.1. Person(s) Involved In The Incident"
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
					>
						<NewEmployeeListTable name="person_involved_list" className="w-full-calc-add-10 -margin-l-10"
						                      onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={6.2}
						title="6.2. Person Reporting The Incident"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormNext={onFormNext}
					>
						<SelectEmployeeInput name="person_reporting" placeholder="Person Reporting The Incident..."
						                     className="col-lg-12 form-control" onChange={this.form.onChange}
						                     showOtherPerson/>
					</Row>
					<Row
						rendered
						idx={6.3}
						title="6.3. Incident Reported To"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormNext={onFormNext}
					>
						<SelectEmployeeInput name="person_reported_to" placeholder="Incident Reported To..."
						                     className="col-lg-12 form-control" onChange={this.form.onChange}
						                     showOtherPerson/>
					</Row>
					<Row
						rendered
						idx={6.4}
						title="6.4. Witnesses To The Incident"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormNext={onFormNext}
					>
						<NewEmployeeListTable name="witness_list" className="w-full-calc-add-10 -margin-l-10"
						                      onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={6.5}
						title="6.5. Distribution List"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
					>
						<NewEmployeeListTable name="distribution_list" className="w-full-calc-add-10 -margin-l-10"
						                      onChange={this.form.onChange}/>
					</Row>
				</FormControls>
			</Row>
			<Row
				rendered
				idx={7}
				title="7. Injury Details"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<FormControls>
					<Row
						rendered
						idx={7.1}
						title="7.1 Injury Report"
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
					>
						<SelectEmployeeInput ref="person_injured" name="person_injured" placeholder="Person Injured..."
						                     className="col-lg-12 form-control" onChange={this.form.onChange}
						                     showOtherPerson/>
						<ClearableInput ref="injured_person_dob" name="injured_person_dob" type="date"
						                placeholder="Date Of Birth..." className="col-lg-6 form-control"
						                onChange={this.form.onChange}/>
						<SelectGenderInput ref="injured_person_gender" name="injured_person_gender"
						                   className="col-lg-6 form-control"
						                   onChange={this.form.onChange}/>

						<SelectIncidentNatureOfInjuryList name="nature_of_injury_list"
						                                  className="col-lg-12 form-control"
														  onChange={this.form.onChange}/>
						<SelectIncidentBodilyInjuryLocationList ref="bodily_injury_location_list"
						                                        className="col-lg-12 form-control"
																onChange={this.form.onChange}/>
						<ClickableHumanBody ref="bodily_injury_location_list_pic" onAdded={this.onHumanBodyPartsAdded}
						                    onRemoved={this.onHumanBodyPartsRemoved}/>
						<SelectIncidentInjuryMechanismList name="injury_mechanism_list"
						                                   className="col-lg-12 form-control"
														   onChange={this.form.onChange}/>
						<ClearableInput name="injury_desc" type="textarea" placeholder="Injury Description"
						                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={7.2}
						title="7.2. Alcohol Or Drugs"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormNext={onFormNext}
					>
						<ClearableInput name="test_undertaken" type="radio" placeholder="Was Testing Undertaken?"
						                className="col-lg-12 form-control" onChange={this.form.onChange}
						                values={this.state.lists.test_undertaken}/>
						<SelectIncidentTestTypeInput ref="test_type_list" rendered={false} name="test_type_list" type="checkbox"
						                placeholder="Type Of Test(s) Undertaken" className="col-lg-12 form-control"
						                onChange={this.form.onChange}/>
						<ClearableInput ref="test_type_drug_undertaken" name="test_type_drug_undertaken"
						                rendered={false} type="select" placeholder="Drug Test Result"
						                className="col-lg-12 form-control" onChange={this.form.onChange}
						                values={this.state.lists.test_type_drug_undertaken} returnValue/>
						<ClearableInput ref="test_type_alcohol_undertaken" name="test_type_alcohol_undertaken"
						                rendered={false} type="select" placeholder="Alcohol Test Result"
						                className="col-lg-12 form-control" onChange={this.form.onChange}
						                values={this.state.lists.test_type_alcohol_undertaken} returnValue/>
						<ClearableInput ref="test_type_mobile_device_undertaken"
						                name="test_type_mobile_device_undertaken" rendered={false} type="select"
						                placeholder="Was a Mobile Device being used?" className="col-lg-12 form-control"
						                onChange={this.form.onChange}
						                values={this.state.lists.test_type_mobile_device_undertaken} returnValue/>
					</Row>
					<Row
						rendered
						idx={7.3}
						title="7.3. Motor Vehicle Incident Details"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
						onFormNext={onFormNext}
					>
						<ClearableInput name="is_vehicle_incident" type="radio" placeholder="A Motor Vehicle Incident?"
						                className="col-lg-12 form-control" onChange={this.form.onChange}
						                values={this.state.lists.is_vehicle_incident}/>
						<Fragment ref="driver_details_sec" rendered={false}>
							<label className="margin-t-10 col-lg-12">13.1 Driver Details</label>
							<SelectEmployeeInput name="driver" placeholder="Driver Details..."
							                     className="col-lg-12 form-control"
							                     parentClassName="col-lg-12 pull-left" onChange={this.form.onChange}
							                     showOtherPerson/>
							<ClearableInput name="driver_dob" type="date" placeholder="Date Of Birth..."
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<SelectGenderInput name="driver_gender"
							                   className="col-lg-6 form-control"
							                   onChange={this.form.onChange}
							/>
							<ClearableInput name="address" type="textarea" placeholder="Address"
							                className="col-lg-12 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="email" type="email" placeholder="Email Address"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="phone" type="text" placeholder="Phone No."
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="licence_num" type="text" placeholder="Licence No."
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="licence_expiry" type="date" placeholder="Licence Expiry Date..."
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="licence_years" type="number" placeholder="Licence Years Held"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
						</Fragment>
						<Fragment ref="vehicle_details_sec" rendered={false}>
							<label className="margin-t-10 col-lg-12">13.2 Vehicle Details</label>
							<ClearableInput name="vehicle_make" type="text" placeholder="Vehicle/Trailer Make"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_model" type="text" placeholder="Vehicle/Trailer Model"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_year" type="number" placeholder="Year"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_color" type="text" placeholder="Color"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_reg_num" type="text" placeholder="Registration No."
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_fleet_num" type="text" placeholder="Fleet No."
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_reg_date" type="date" placeholder="Registration Date..."
							                className="col-lg-12 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_trip_type" type="text" placeholder="Trip Type"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							<ClearableInput name="vehicle_load_type" type="text" placeholder="Load Type"
							                className="col-lg-6 form-control" onChange={this.form.onChange}/>
						</Fragment>
						<Fragment ref="third_party_details_sec" rendered={false}>
							<label className="margin-t-10 col-lg-12">13.3 Third Party Details</label>
							<ClearableInput name="was_3rd_party_involved" type="radio"
							                placeholder="Was A Third Party Involved?" className="col-lg-12 form-control"
							                onChange={this.form.onChange}
							                values={this.state.lists.was_3rd_party_involved}/>
							<Fragment ref="was_3rd_party_involved_sec" rendered={false}>
								<ClearableInput name="are_3rd_party_details_available" type="radio"
								                placeholder="Third Party Details Available?"
								                className="col-lg-12 form-control" onChange={this.form.onChange}
								                values={this.state.lists.are_3rd_party_details_available}/>
								<Fragment ref="are_3rd_party_details_available_sec" rendered={false}>
									<ClearableInput name="third_party_fname" type="text"
									                placeholder="Third Party First Name"
									                className="col-lg-6 form-control" onChange={this.form.onChange}/>
									<ClearableInput name="third_party_lname" type="text"
									                placeholder="Third Party Last Name"
									                className="col-lg-6 form-control" onChange={this.form.onChange}/>
									<ClearableInput name="third_party_address" type="textarea"
									                placeholder="Third Party Address" className="col-lg-6 form-control"
									                onChange={this.form.onChange}/>
									<ClearableInput name="third_party_email" type="email"
									                placeholder="Third Party Email Address"
									                className="col-lg-6 form-control" onChange={this.form.onChange}/>
									<ClearableInput name="third_party_phone" type="text"
									                placeholder="Third Party Phone No."
									                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								</Fragment>
								<ClearableInput name="did_driver_admit_liability" type="radio"
								                placeholder="Did A Driver Admit Liability To Any Person(s)?"
								                className="col-lg-12 form-control" onChange={this.form.onChange}
								                values={this.state.lists.did_driver_admit_liability}/>
								<Fragment ref="did_driver_admit_liability_sec" rendered={false}>
									<ClearableInput ref="did_someone_else_admit_liability"
									                name="did_someone_else_admit_liability" type="radio"
									                placeholder="Did Someone Else Admit Liability?"
									                className="col-lg-12 form-control" onChange={this.form.onChange}
									                values={this.state.lists.did_someone_else_admit_liability}/>
									<ClearableInput ref="someone_else_admit_liability_name"
									                name="someone_else_admit_liability_name" type="text"
									                placeholder="Someone Else Who Admitted Liability Name"
									                className="col-lg-12 form-control" onChange={this.form.onChange}/>
								</Fragment>
								<ClearableInput ref="liability_admitted_to_name" rendered={false}
								                name="liability_admitted_to_name" type="text"
								                placeholder="Who Was Liability Admitted To?"
								                className="col-lg-12 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="third_party_opinion" type="textarea"
								                placeholder="In The 3rd Party Opinion, Who Was Responsible For The Collision And Why?"
								                className="col-lg-12 form-control" onChange={this.form.onChange}/>
								<label className="margin-t-25 col-lg-12">Attach Relevant Documents/Files</label>
								<AddFilesGridViewInput name="third_party_document_list" title="Add Document/File"
								                       className="padding-t-40 margin-0 -margin-t-40 col-lg-12 pull-left"
								                       onChange={this.form.onChange}/>
							</Fragment>
						</Fragment>
						<Fragment ref="infringement_details_sec" rendered={false}>
							<label className="margin-t-10 col-lg-12">13.4 Infringement</label>
							<ClearableInput name="is_infringement_issued" type="radio"
							                placeholder="Has Infringement Been Issued?"
							                className="col-lg-12 form-control" onChange={this.form.onChange}
							                values={this.state.lists.is_infringement_issued}/>
							<Fragment ref="is_infringement_issued_sec" rendered={false}>
								<label className="margin-t-10 col-lg-12">13.4.1 Infringement Details</label>
								<ClearableInput name="penalty_num" type="text" placeholder="Penalty Notice No."
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="issuing_authority" type="text" placeholder="Issuing Authority"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="issuing_officer" type="text" placeholder="Issuing Officer"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="type_of_breach" type="text" placeholder="Type Of Breach"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<label className="margin-t-10 col-lg-12">13.4.2 Addressee Details</label>
								<ClearableInput name="addressee_issued_to_name" type="text" placeholder="Issued To"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="addressee_name_or_entity" type="text" placeholder="Name / Entity"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="addressee_amount" type="number" placeholder="Amount"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="addressee_due_date" type="date" placeholder="Due Date..."
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							</Fragment>
						</Fragment>
						<Fragment ref="police_involvement_details_sec" rendered={false}>
							<label className="margin-t-10 col-lg-12">13.5 Police Involvement</label>
							<ClearableInput ref="did_police_attend_scene" name="did_police_attend_scene" type="radio"
							                placeholder="Did Police Attend Scene?" className="col-lg-12 form-control"
							                onChange={this.form.onChange}
							                values={this.state.lists.did_police_attend_scene}/>
							<Fragment ref="did_police_attend_scene_sec" rendered={false}>
								<ClearableInput name="ref_or_report_num" type="text"
								                placeholder="Ref/Report No. (If applicable)"
								                className="col-lg-12 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="officer_name" type="text"
								                placeholder="Police Officer Taking Collision Details"
								                className="col-lg-12 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="officer_station" type="text"
								                placeholder="Police Officer Station Taking Collision Details"
								                className="col-lg-12 form-control" onChange={this.form.onChange}/>
							</Fragment>
							<ClearableInput ref="collision_reported_to_police_station"
							                name="collision_reported_to_police_station" type="radio"
							                placeholder="Collision Reported To Police Station?"
							                className="col-lg-12 form-control" onChange={this.form.onChange}
							                values={this.state.lists.collision_reported_to_police_station}/>
							<ClearableInput ref="have_charges_been_laid" name="have_charges_been_laid" rendered={false}
							                type="radio" placeholder="Have Charges Been Laid?"
							                className="col-lg-12 form-control" onChange={this.form.onChange}
							                values={this.state.lists.have_charges_been_laid}/>
							<Fragment ref="have_charges_been_laid_sec" rendered={false}>
								<ClearableInput name="nature_of_charges" type="text" placeholder="Nature Of Charges"
								                className="col-lg-12 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="who_laid_charges" type="text" placeholder="Who Laid Charges?"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
								<ClearableInput name="who_were_nature_charges_laid_against" type="text"
								                placeholder="Who Were Charges Laid Against?"
								                className="col-lg-6 form-control" onChange={this.form.onChange}/>
							</Fragment>
						</Fragment>
					</Row>
					<Row
						rendered
						idx={7.4}
						title="7.4. Incident Severity"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
					>
						<ClearableInput ref="consequence" name="consequence" type="radio"
						                placeholder="Consequence / Severity" className="col-lg-6 form-control" vertical
						                onChange={this.form.onChange} values={this.state.lists.consequence}
						                returnValue/>
						<ClearableInput ref="likelihood" name="likelihood" type="radio"
						                placeholder="Likelihood / Probability" className="col-lg-6 form-control"
						                vertical onChange={this.form.onChange} values={this.state.lists.likelihood}
						                returnValue/>
						<label className="margin-t-10 hor-center col-lg-12">Incident Risk Rating</label>
						<RiskRating selected={this.state.riskRatingSelected} ref="risk_rating" name="risk_rating"
						            onChange={this.form.onChange}/>
					</Row>
				</FormControls>
			</Row>
		</div>
	</div>);
};

// </editor-fold>

export default newRender;
