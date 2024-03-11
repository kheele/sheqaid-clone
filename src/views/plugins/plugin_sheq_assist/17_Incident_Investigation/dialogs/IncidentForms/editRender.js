// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";

import {
	AddFilesGridViewInput,
	ClearableInput,
	ClickableHumanBody, RowOrgs,
	SelectEmployeeInput, SelectGenderInput,
	SelectIncidentActivityList,
	SelectIncidentBodilyInjuryLocationList, SelectIncidentCategoryList,
	SelectIncidentInjuryMechanismList, SelectIncidentNatureOfInjuryList,
	SelectIncidentSubCategoryList, SelectIncidentTestTypeInput,
	SelectSectorInput,
} from 'components/inputs';
import {FormControls, Fragment, RiskRating, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import NewDocumentTable from "./NewDocumentTable";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="editRender">
const editRender = function () {
	console.log('editRender', this.item)
	
	let {
		props: {
			onFormNext, onFormBack, onFormOpen,
			dialog: {renderProfileCover}
		},
		item, item: {
			id, data: {
				//0
				site,
				project,
				client,
				
				//1
				group,
				short_desc,
				desc,
				location,
				exact_location,
				document_list,
				
				//2
				incident_date,
				incident_time,
				date_reported,
				time_reported,
				time_shift,
				
				//3
				category_list,
				sub_category_list,
				
				//4
				sector_list,
				activity_list,
				
				//5
				//5.1
				person_involved_list,
				//5.2
				person_reporting,
				person_reporting_other,
				//5.3
				person_reported_to,
				person_reported_to_other,
				//5.4
				witness_list,
				//5.5
				distribution_list,
				
				//6
				vehicle_list = [],
				
				//7
				is_person_injured,
				person_injured,
				person_injured_other,
				injured_person_dob,
				injured_person_gender,
				nature_of_injury_list,
				bodily_injury_location_list,
				injury_mechanism_list,
				injury_desc,
				
				//8
				test_undertaken,
				test_type_list,
				test_type_drug_undertaken,
				test_type_alcohol_undertaken,
				test_type_mobile_device_undertaken,
				
				//9
				severity = {},
			}
		}
	} = this;
	
	//6
	const {
		is_vehicle_incident,
		is_infringement_issued,
		did_police_attend_scene,
		collision_reported_to_police_station,
		have_charges_been_laid,
		driver,
		driver_other,
		driver_dob,
		driver_gender,
		address,
		email,
		phone,
		licence_num,
		licence_expiry,
		licence_years,
		vehicle_make,
		vehicle_model,
		vehicle_year,
		vehicle_color,
		vehicle_reg_num,
		vehicle_fleet_num,
		vehicle_reg_date,
		vehicle_trip_type,
		vehicle_load_type,
		was_3rd_party_involved,
		are_3rd_party_details_available,
		third_party_fname,
		third_party_lname,
		third_party_address,
		third_party_email,
		third_party_phone,
		did_driver_admit_liability,
		did_someone_else_admit_liability,
		someone_else_admit_liability_name,
		liability_admitted_to_name,
		third_party_opinion,
		third_party_document_list,
		penalty_num,
		issuing_authority,
		issuing_officer,
		type_of_breach,
		addressee_issued_to_name,
		addressee_name_or_entity,
		addressee_amount,
		addressee_due_date,
		ref_or_report_num,
		officer_name,
		officer_station,
		nature_of_charges,
		who_laid_charges,
		who_were_nature_charges_laid_against,
	} = (vehicle_list || [])[0] || {};
	
	//9
	const {consequence, likelihood, risk_rating, risk_rating_score} = severity || {};
	
	return (<FormControls>
		<RowOrgs
			client={client}
			project={project}
			site={site}
			onChange={this.form.onChange}
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={onFormNext}
			onFormSave={this.onFormSave}
		>
			<Row
				rendered
				idx={1}
				title="1. Incident Details"
			>
				<ClearableInput name="group" type="radio" placeholder="Incident Group"
				                defaultValue={group} className="col-lg-12 form-control"
				                onChange={this.form.onChange} values={this.state.lists.group} returnValue/>
				<ClearableInput name="short_desc" type="textarea" placeholder="Short Description"
				                defaultValue={short_desc} className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="desc" type="textarea" placeholder="Incident Description"
				                defaultValue={desc} className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				
				<ClearableInput name="location" type="select" placeholder="Area..."
				                defaultValue={location}
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.location} returnValue add/>
				<ClearableInput name="exact_location" type="textarea" placeholder="Exact Location"
				                defaultValue={exact_location} className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				
				<label className="col-lg-12 margin-t-15">Relevant Documents/Files</label>
				{/*<AddFilesGridViewInput name="document_list" title="Add Document/File"*/}
				{/*                       defaultValue={document_list}*/}
				{/*                       className="padding-t-40 margin-0 -margin-t-40 col-lg-12 pull-left"*/}
				{/*                       onChange={this.form.onChange}/>*/}
				<NewDocumentTable
					ref="document_list"
					name="document_list"
					defaultValue={[...(document_list || []), null]}
					savable
					item={item}
				/>
			</Row>
		</RowOrgs>
		<Row
			rendered
			idx={2}
			title="2. Date & Time"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={onFormNext}
			onFormSave={this.onFormSave}
		>
			<ClearableInput name="incident_date" type="date" placeholder="Date Incident Occurred..."
			                defaultValue={incident_date} className="col-lg-6 form-control"
			                onChange={this.form.onChange}/>
			<ClearableInput name="incident_time" type="time" placeholder="Time Incident Occurred..."
			                defaultValue={incident_time} className="col-lg-6 form-control"
			                onChange={this.form.onChange}/>
			
			<ClearableInput name="date_reported" type="date"
			                defaultValue={date_reported}
			                placeholder="Date Reported..." className="col-lg-6 form-control"
			                onChange={this.form.onChange}/>
			<ClearableInput name="time_reported" type="time"
			                defaultValue={time_reported}
			                placeholder="Time Reported..." className="col-lg-6 form-control"
			                onChange={this.form.onChange}/>
			
			<ClearableInput name="time_shift" type="radio"
			                defaultValue={time_shift}
			                placeholder="Time Shift"
			                className="col-lg-6 hor-center form-control" onChange={this.form.onChange}
			                values={this.state.lists.time_shift} return/>
		</Row>
		<Row
			rendered
			idx={3}
			title="3. Categories & Sub-Categories"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={onFormNext}
			onFormSave={this.onFormSave}
		>
			<SelectIncidentCategoryList name="category_list" type="checkbox" placeholder="Incident Category"
			                            defaultValue={(category_list || []).map(({category}) => category)}
			                            vertical={3} className="col-lg-12 form-control"
			                            onChange={this.form.onChange}/>
			<SelectIncidentSubCategoryList ref="sub_category_list" type="checkbox" name="sub_category_list"
			                               defaultValue={(sub_category_list || []).map(({sub_category}) => sub_category)}
			                               vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange}/>
		</Row>
		<Row
			rendered
			idx={4}
			title="4. Sectors & Activities"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={onFormNext}
			onFormSave={this.onFormSave}
		>
			<SelectSectorInput name="sector_list" type="checkbox" placeholder="Sector(s)"
			                   defaultValue={(sector_list || []).map(({sector}) => sector)}
			                   vertical={3} className="col-lg-12 form-control"
			                   onChange={this.form.onChange}/>
			
			<SelectIncidentActivityList ref="activity_list" type="checkbox" name="activity_list"
			                            defaultValue={(activity_list || []).map(({activity}) => activity)}
			                            vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange}/>
		</Row>
		<Row
			rendered
			idx={5}
			title="5. Person(s)"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={onFormNext}
		>
			<FormControls>
				<Row
					rendered
					idx={5.1}
					title="5.1. Person(s) Involved In The Incident"
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
					onFormSave={this.onFormSave}
				>
					<NewEmployeeListTable name="person_involved_list"
					                      defaultValue={[...(person_involved_list || []).map(({
						                                                                          id,
						                                                                          person_involved,
						                                                                          person_involved_other
					                                                                          }) => person_involved || person_involved_other), null]}
					                      className="w-full-calc-add-10 -margin-l-10"
					                      onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={5.2}
					title="5.2. Person Reporting The Incident"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
					onFormSave={this.onFormSave}
				>
					<SelectEmployeeInput name="person_reporting"
					                     defaultValue={person_reporting || person_reporting_other}
					                     placeholder="Person Reporting The Incident..."
					                     className="col-lg-12 form-control"
					                     onChange={this.form.onChange} showOtherPerson/>
				</Row>
				<Row
					rendered
					idx={5.3}
					title="5.3. Incident Reported To"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
					onFormSave={this.onFormSave}
				>
					<SelectEmployeeInput name="person_reported_to"
					                     defaultValue={person_reported_to || person_reported_to_other}
					                     placeholder="Incident Reported To..." className="col-lg-12 form-control"
					                     onChange={this.form.onChange} showOtherPerson/>
				</Row>
				<Row
					rendered
					idx={5.4}
					title="5.4. Witnesses To The Incident"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormNext={onFormNext}
					onFormSave={this.onFormSave}
				>
					<NewEmployeeListTable name="witness_list"
					                      defaultValue={[...(witness_list || []).map(({
						                                                                  id,
						                                                                  witness,
						                                                                  witness_other
					                                                                  }) => witness || witness_other), null]}
					                      className="w-full-calc-add-10 -margin-l-10"
					                      onChange={this.form.onChange}/>
				</Row>
				<Row
					rendered
					idx={5.5}
					title="5.5. Distribution List"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
					onFormSave={this.onFormSave}
				>
					<NewEmployeeListTable name="distribution_list"
					                      defaultValue={[...(distribution_list || []).map(({
						                                                                       id,
						                                                                       employee,
						                                                                       other_person
					                                                                       }) => employee || other_person), null]}
					                      className="w-full-calc-add-10 -margin-l-10"
					                      onChange={this.form.onChange}/>
				</Row>
			</FormControls>
		</Row>
		<Row
			rendered
			idx={6}
			title="6. Motor Vehicle Involvement"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={onFormNext}
			onFormSave={this.onFormSave}
		>
			<ClearableInput name="is_vehicle_incident" type="radio" placeholder="A Motor Vehicle Incident?"
			                value={is_vehicle_incident}
			                className="col-lg-12 form-control"
			                onChange={this.form.onChange} values={this.state.lists.is_vehicle_incident}/>
			<Fragment ref="driver_details_sec" rendered={false}>
				<label className="margin-t-10 col-lg-12">13.1 Driver Details</label>
				<SelectEmployeeInput name="driver" placeholder="Driver Details..."
				                     value={driver || driver_other}
				                     className="col-lg-12 form-control"
				                     parentClassName="col-lg-12 pull-left" onChange={this.form.onChange}
				                     showOtherPerson/>
				<ClearableInput name="driver_dob" type="date" placeholder="Date Of Birth..."
				                value={driver_dob}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<SelectGenderInput name="driver_gender"
				                   value={driver_gender}
				                   className="col-lg-6 form-control"
				                   onChange={this.form.onChange}/>
				<ClearableInput name="address" type="textarea" placeholder="Address"
				                value={address} className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="email" type="email" placeholder="Email Address"
				                value={email} className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="phone" type="text" placeholder="Phone No."
				                value={phone} className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="licence_num" type="text" placeholder="Licence No."
				                value={licence_num}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="licence_expiry" type="date" placeholder="Licence Expiry Date..."
				                value={licence_expiry}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="licence_years" type="number" placeholder="Licence Years Held"
				                value={licence_years}
				                className="col-lg-6 form-control" onChange={this.form.onChange}/>
			</Fragment>
			<Fragment ref="vehicle_details_sec" rendered={false}>
				<label className="margin-t-10 col-lg-12">13.2 Vehicle Details</label>
				<ClearableInput name="vehicle_make" type="text" placeholder="Vehicle/Trailer Make"
				                value={vehicle_make}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_model" type="text" placeholder="Vehicle/Trailer Model"
				                value={vehicle_model}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_year" type="number" placeholder="Year"
				                value={vehicle_year}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_color" type="text" placeholder="Color"
				                value={vehicle_color}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_reg_num" type="text" placeholder="Registration No."
				                value={vehicle_reg_num}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_fleet_num" type="text" placeholder="Fleet No."
				                value={vehicle_fleet_num}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_reg_date" type="date" placeholder="Registration Date..."
				                value={vehicle_reg_date}
				                className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_trip_type" type="text" placeholder="Trip Type"
				                value={vehicle_trip_type}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="vehicle_load_type" type="text" placeholder="Load Type"
				                value={vehicle_load_type}
				                className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
			</Fragment>
			<Fragment ref="third_party_details_sec" rendered={false}>
				<label className="margin-t-10 col-lg-12">13.3 Third Party Details</label>
				<ClearableInput name="was_3rd_party_involved" type="radio"
				                placeholder="Was A Third Party Involved?"
				                value={was_3rd_party_involved}
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.was_3rd_party_involved}/>
				<Fragment ref="was_3rd_party_involved_sec" rendered={false}>
					<ClearableInput name="are_3rd_party_details_available" type="radio"
					                placeholder="Third Party Details Available?"
					                value={are_3rd_party_details_available}
					                className="col-lg-12 form-control" onChange={this.form.onChange}
					                values={this.state.lists.are_3rd_party_details_available}/>
					<Fragment ref="are_3rd_party_details_available_sec" rendered={false}>
						<ClearableInput name="third_party_fname" type="text"
						                placeholder="Third Party First Name"
						                value={third_party_fname}
						                className="col-lg-6 form-control" onChange={this.form.onChange}/>
						<ClearableInput name="third_party_lname" type="text"
						                placeholder="Third Party Last Name"
						                value={third_party_lname}
						                className="col-lg-6 form-control" onChange={this.form.onChange}/>
						<ClearableInput name="third_party_address" type="textarea"
						                placeholder="Third Party Address"
						                value={third_party_address}
						                className="col-lg-6 form-control" onChange={this.form.onChange}/>
						<ClearableInput name="third_party_email" type="email"
						                placeholder="Third Party Email Address"
						                value={third_party_email}
						                className="col-lg-6 form-control" onChange={this.form.onChange}/>
						<ClearableInput name="third_party_phone" type="text"
						                placeholder="Third Party Phone No."
						                value={third_party_phone}
						                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					</Fragment>
					<ClearableInput name="did_driver_admit_liability" type="radio"
					                placeholder="Did A Driver Admit Liability To Any Person(s)?"
					                value={did_driver_admit_liability}
					                className="col-lg-12 form-control" onChange={this.form.onChange}
					                values={this.state.lists.did_driver_admit_liability}/>
					<Fragment ref="did_driver_admit_liability_sec" rendered={false}>
						<ClearableInput ref="did_someone_else_admit_liability"
						                name="did_someone_else_admit_liability" type="radio"
						                placeholder="Did Someone Else Admit Liability?"
						                value={did_someone_else_admit_liability}
						                className="col-lg-12 form-control" onChange={this.form.onChange}
						                values={this.state.lists.did_someone_else_admit_liability}/>
						<ClearableInput ref="someone_else_admit_liability_name"
						                name="someone_else_admit_liability_name" type="text"
						                placeholder="Someone Else Who Admitted Liability Name"
						                value={someone_else_admit_liability_name}
						                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					</Fragment>
					<ClearableInput ref="liability_admitted_to_name" rendered={false}
					                name="liability_admitted_to_name" type="text"
					                placeholder="Who Was Liability Admitted To?"
					                value={liability_admitted_to_name}
					                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="third_party_opinion" type="textarea"
					                placeholder="In The 3rd Party Opinion, Who Was Responsible For The Collision And Why?"
					                value={third_party_opinion}
					                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					
					<label className="margin-t-25 col-lg-12">Attach Relevant Documents/Files</label>
					<AddFilesGridViewInput name="third_party_document_list" title="Add Document/File"
					                       defaultValue={third_party_document_list}
					                       className="padding-t-40 margin-0 -margin-t-40 col-lg-12 pull-left"
					                       onChange={this.form.onChange}/>
				</Fragment>
			</Fragment>
			<Fragment ref="infringement_details_sec" rendered={false}>
				<label className="margin-t-10 col-lg-12">13.4 Infringement</label>
				<ClearableInput name="is_infringement_issued" type="radio"
				                placeholder="Has Infringement Been Issued?"
				                value={is_infringement_issued}
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.is_infringement_issued}/>
				<Fragment ref="is_infringement_issued_sec" rendered={false}>
					<label className="margin-t-10 col-lg-12">13.4.1 Infringement Details</label>
					<ClearableInput name="penalty_num" type="text" placeholder="Penalty Notice No."
					                value={penalty_num}
					                className="col-lg-6 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="issuing_authority" type="text" placeholder="Issuing Authority"
					                value={issuing_authority}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="issuing_officer" type="text" placeholder="Issuing Officer"
					                value={issuing_officer}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="type_of_breach" type="text" placeholder="Type Of Breach"
					                value={type_of_breach}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					
					<label className="margin-t-10 col-lg-12">13.4.2 Addressee Details</label>
					<ClearableInput name="addressee_issued_to_name" type="text" placeholder="Issued To"
					                value={addressee_issued_to_name}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="addressee_name_or_entity" type="text" placeholder="Name / Entity"
					                value={addressee_name_or_entity}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="addressee_amount" type="number" placeholder="Amount"
					                value={addressee_amount}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="addressee_due_date" type="date" placeholder="Due Date..."
					                value={addressee_due_date}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
				</Fragment>
			</Fragment>
			<Fragment ref="police_involvement_details_sec" rendered={false}>
				<label className="margin-t-10 col-lg-12">13.5 Police Involvement</label>
				<ClearableInput ref="did_police_attend_scene" name="did_police_attend_scene" type="radio"
				                placeholder="Did Police Attend Scene?"
				                value={did_police_attend_scene}
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.did_police_attend_scene}/>
				<Fragment ref="did_police_attend_scene_sec" rendered={false}>
					<ClearableInput name="ref_or_report_num" type="text"
					                placeholder="Ref/Report No. (If applicable)"
					                value={ref_or_report_num}
					                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="officer_name" type="text"
					                placeholder="Police Officer Taking Collision Details"
					                value={officer_name}
					                className="col-lg-12 form-control"
					                onChange={this.form.onChange}/>
					<ClearableInput name="officer_station" type="text"
					                placeholder="Police Officer Station Taking Collision Details"
					                value={officer_station}
					                className="col-lg-12 form-control" onChange={this.form.onChange}/>
				</Fragment>
				<ClearableInput ref="collision_reported_to_police_station"
				                name="collision_reported_to_police_station" type="radio"
				                placeholder="Collision Reported To Police Station?"
				                value={collision_reported_to_police_station}
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.collision_reported_to_police_station}/>
				<ClearableInput ref="have_charges_been_laid" name="have_charges_been_laid" rendered={false}
				                type="radio" placeholder="Have Charges Been Laid?"
				                value={have_charges_been_laid}
				                className="col-lg-12 form-control" onChange={this.form.onChange}
				                values={this.state.lists.have_charges_been_laid}/>
				<Fragment ref="have_charges_been_laid_sec" rendered={false}>
					<ClearableInput name="nature_of_charges" type="text" placeholder="Nature Of Charges"
					                value={nature_of_charges}
					                className="col-lg-12 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="who_laid_charges" type="text" placeholder="Who Laid Charges?"
					                value={who_laid_charges}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
					<ClearableInput name="who_were_nature_charges_laid_against" type="text"
					                placeholder="Who Were Charges Laid Against?"
					                value={who_were_nature_charges_laid_against}
					                className="col-lg-6 form-control" onChange={this.form.onChange}/>
				</Fragment>
			</Fragment>
		</Row>
		<Row
			rendered
			idx={7}
			title="7. Injury Details"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
		>
			<ClearableInput name="is_person_injured" type="radio" placeholder="Is Person Injured?"
			                value={is_person_injured}
			                className="col-lg-12 form-control" onChange={this.form.onChange}
			                values={this.state.lists.is_person_injured}/>
			<Fragment ref="injury_details_sec" rendered={false}>
				<SelectEmployeeInput name="person_injured"
				                     defaultValue={person_injured || person_injured_other}
				                     placeholder="Person Injured..." className="col-lg-12 form-control"
				                     onChange={this.form.onChange} showOtherPerson/>
				<ClearableInput name="injured_person_dob"
				                defaultValue={injured_person_dob}
				                type="date" placeholder="Date Of Birth..." className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<SelectGenderInput name="injured_person_gender"
				                   defaultValue={injured_person_gender}
				                   className="col-lg-6 form-control"
				                   onChange={this.form.onChange}/>
				
				<SelectIncidentNatureOfInjuryList name="nature_of_injury_list"
				                                  defaultValue={(nature_of_injury_list || []).map(({injury}) => injury)}
				                                  className="col-lg-12 form-control"
				                                  onChange={this.form.onChange}
				                                  values={this.state.lists.nature_of_injury_list}/>
				<SelectIncidentBodilyInjuryLocationList ref="bodily_injury_location_list" name="bodily_injury_location_list"
				                                        defaultValue={(bodily_injury_location_list || []).map(({injury}) => injury)}
				                                        className="col-lg-12 form-control" onChange={this.form.onChange}
				                                        values={this.state.lists.bodily_injury_location_list}/>
				<ClickableHumanBody ref="bodily_injury_location_list_pic"
				                    defaultValue={(bodily_injury_location_list || []).map(({injury}) => injury)}
				                    onAdded={this.onHumanBodyPartsAdded}
				                    onRemoved={this.onHumanBodyPartsRemoved}/>
				<SelectIncidentInjuryMechanismList name="injury_mechanism_list"
				                                   defaultValue={(injury_mechanism_list || []).map(({injury}) => injury)}
				                                   className="col-lg-12 form-control" onChange={this.form.onChange}
				                                   values={this.state.lists.injury_mechanism_list}/>
				<ClearableInput name="injury_desc" defaultValue={injury_desc}
				                type="textarea"
				                placeholder="Injury Description" className="col-lg-12 form-control"
				                onChange={this.form.onChange}/>
			</Fragment>
		</Row>
		<Row
			rendered
			idx={8}
			title="8. Alcohol Or Drugs"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormNext={onFormNext}
			onFormSave={this.onFormSave}
		>
			<ClearableInput name="test_undertaken" type="radio" placeholder="Was Testing Undertaken?"
			                value={test_undertaken}
			                className="col-lg-12 form-control"
			                onChange={this.form.onChange} values={this.state.lists.test_undertaken}/>
			<SelectIncidentTestTypeInput ref="test_type_list" rendered={false} name="test_type_list" type="checkbox"
			                             placeholder="Type Of Test(s) Undertaken"
			                             value={test_type_list}
			                             className="col-lg-12 form-control" onChange={this.form.onChange}/>
			<ClearableInput ref="test_type_drug_undertaken" name="test_type_drug_undertaken"
			                rendered={false}
			                type="select" placeholder="Drug Test Result"
			                value={test_type_drug_undertaken}
			                className="col-lg-12 form-control" onChange={this.form.onChange}
			                values={this.state.lists.test_type_drug_undertaken} returnValue/>
			<ClearableInput ref="test_type_alcohol_undertaken" name="test_type_alcohol_undertaken"
			                rendered={false}
			                type="select" placeholder="Alcohol Test Result"
			                value={test_type_alcohol_undertaken}
			                className="col-lg-12 form-control" onChange={this.form.onChange}
			                values={this.state.lists.test_type_alcohol_undertaken} returnValue/>
			<ClearableInput ref="test_type_mobile_device_undertaken"
			                name="test_type_mobile_device_undertaken"
			                rendered={false} type="select" placeholder="Was a Mobile Device being used?"
			                value={test_type_mobile_device_undertaken}
			                className="col-lg-12 form-control" onChange={this.form.onChange}
			                values={this.state.lists.test_type_mobile_device_undertaken} returnValue/>
		</Row>
		<Row
			rendered
			idx={9}
			title="9. Incident Severity"
			onFormOpen={onFormOpen}
			onFormBack={onFormBack}
			onFormSave={this.onFormSave}
		>
			<ClearableInput ref="consequence" name="consequence" defaultValue={consequence} type="radio"
			                placeholder="Consequence / Severity" className="col-lg-6 form-control" vertical
			                onChange={this.form.onChange} values={this.state.lists.consequence}
			                returnValue/>
			<ClearableInput ref="likelihood" name="likelihood" defaultValue={likelihood} type="radio"
			                placeholder="Likelihood / Probability" className="col-lg-6 form-control"
			                vertical
			                onChange={this.form.onChange} values={this.state.lists.likelihood} returnValue/>
			<label className="margin-t-10 hor-center col-lg-12">Incident Risk Rating</label>
			<RiskRating selected={this.state.riskRatingSelected} ref="risk_rating" name="risk_rating"
			            onChange={this.form.onChange}/>
		</Row>
	</FormControls>);
};
// </editor-fold>

export default editRender;
