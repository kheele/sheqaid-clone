// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";

import {
    AddFilesGridViewInput,
    ClearableInput,
    ClickableHumanBody,
    ProfileField, RowOrgs,
    SelectClientInput,
    SelectEmployeeInput, SelectIncidentSubCategoryList,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {FormControls, Fragment, RiskRating, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import ProfilePDFReader from '../../printers/ProfilePDFReader';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="profileRender">
const profileRender = function () {
    if (!this.item)
        return null;
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
                //4
                sub_category_list,
                //5
                sector_list,
                activity_list,
                //6.1
                person_involved_list,
                //6.2
                person_reporting,
                person_reporting_other,
                //6.3
                person_reported_to,
                person_reported_to_other,
                //6.4
                witness_list,
                //6.5
                distribution_list,

                //7.1
                person_injured,
                person_injured_other,
                injured_person_dob,
                injured_person_gender,
                nature_of_injury_list,
                bodily_injury_location_list,
                injury_mechanism_list,
                injury_desc,
                //7.2
                test_undertaken,
                test_type_list,
                test_type_drug_undertaken,
                test_type_alcohol_undertaken,
                test_type_mobile_device_undertaken,
                //7.3
                vehicle_list = [],
                //7.4
                severity = {},
                //7.5
                investigation = {},
            }
        }
    } = this;

    const {isConsultant} = storage.is;


    //7.3
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
    //7.4
    const {consequence, likelihood, risk_rating} = severity || {};

    let {
        //7
        weather_condition_list,
        //8
        protective_equipment_worn_list,
        //9
        class_list,
        //10
        environment_list,
        //11
        estimated_costs_damages,
        estimated_costs_medical,
        estimated_costs_salaries_wages,
        estimated_costs_investigations,
        estimated_costs_others
    } = investigation || {};

    return (<>
        <FormControls>
            <RowOrgs
                client={client}
                project={project}
                site={site}
                readonly
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Incident Details"
                >
                    <ProfileField name="group" title="Incident Group" value={group}
                                  className="col-lg-12"/>
                    <ProfileField name="short_desc" title="Short Description" value={short_desc}
                                  className="col-lg-12"/>
                    <ProfileField name="desc" title="Incident Description" value={desc}
                                  className="col-lg-12"/>

                    <ProfileField name="location" title="Location" value={location}
                                  className="col-lg-12"/>
                    <ProfileField name="exact_location" title="Exact Location" value={exact_location}
                                  className="col-lg-12"/>

                    <label className="label-docs col-lg-12 margin-t-15">Attach Relevant Documents/Files</label>
                    <AddFilesGridViewInput name="document_list" title="Document/File"
                                           defaultValue={document_list || []} readonly
                                           className="padding-t-40 margin-0 -margin-t-40 col-lg-12 pull-left"/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Date & Time"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="incident_date" type="date" title="Date Incident Occurred"
                              value={incident_date} className="col-lg-6"/>
                <ProfileField name="incident_time" title="Time Incident Occurred"
                              value={incident_time} className="col-lg-6"/>

                <ProfileField name="date_reported" type="date" title="Date Reported"
                              value={date_reported} className="col-lg-6"/>
                <ProfileField name="time_reported" title="Time Reported"
                              value={time_reported}
                              className="col-lg-6"/>

                <ProfileField name="time_shift" title="Time Shift"
                              value={time_shift}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Incident Category (Required)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="category_list" title="Category"
                              value={(category_list || []).map(v => v.category.name).join(', ')}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Incident Sub-Category (Optional)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="sub_category_list" title="Category"
                              value={(sub_category_list||[]).map(v => v.sub_category.name).join(', ')}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Sector(s) & Activities"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="sector_list" title="Sector(s)"
                              value={sector_list.map(v => v.sector.name).join(', ')}
                              className="col-lg-12"/>
                <ProfileField name="activity_list" title="Activities"
                              value={activity_list.map(v => v.activity.name).join(', ')}
                              className="col-lg-12"/>
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
                        <NewEmployeeListTable name="person_involved_list"
                                              defaultValue={person_involved_list || []}
                                              className="w-full-calc-add-10 -margin-l-10" readonly/>
                    </Row>
                    <Row
                        rendered
                        idx={6.2}
                        title="6.2. Person Reporting The Incident"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="person_reporting" title="Person Reporting The Incident"
                                      value={person_reporting || person_reporting_other}
                                      renderer={v => v.fname + ' ' + v.lname}
                                      className="col-lg-12"/>
                    </Row>
                    <Row
                        rendered
                        idx={6.3}
                        title="6.3. Incident Reported To"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="person_reported_to" title="Incident Reported To"
                                      value={person_reported_to || person_reported_to_other}
                                      renderer={v => v.fname + ' ' + v.lname}
                                      className="col-lg-12"/>
                    </Row>
                    <Row
                        rendered
                        idx={6.4}
                        title="6.4. Witnesses To The Incident"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <NewEmployeeListTable name="witness_list"
                                              defaultValue={(witness_list || []).map(({id, witness, witness_other}) => witness || witness_other)}
                                              className="w-full-calc-add-10 -margin-l-10" readonly/>
                    </Row>
                    <Row
                        rendered
                        idx={6.5}
                        title="6.5. Distribution List"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewEmployeeListTable name="distribution_list"
                                              defaultValue={(distribution_list || []).map(({id, employee, other_person}) => employee || other_person)}
                                              className="w-full-calc-add-10 -margin-l-10" readonly/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Injury Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={7.1}
                        title="7.1. Injury Report"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="person_injured" title="Person Injured"
                                      value={person_injured || person_injured_other}
                                      renderer={v => v.fname + ' ' + v.lname}
                                      className="col-lg-12"/>
                        <ProfileField name="injured_person_dob" type="date" title="Date Of Birth"
                                      value={injured_person_dob} className="col-lg-6"/>
                        <ProfileField name="injured_person_gender" title="Gender"
                                      value={injured_person_gender} className="col-lg-6"/>

                        <ProfileField name="nature_of_injury_list" title="Nature Of Injury"
                                      value={nature_of_injury_list && nature_of_injury_list.map(v => v.injury.name).join(', ')}
                                      className="col-lg-12"/>
                        <ProfileField ref="bodily_injury_location_list" name="bodily_injury_location_list"
                                      title="Bodily Injury Location (Part(s) Of Body Injured)"
                                      value={bodily_injury_location_list && bodily_injury_location_list.map(v => v.injury.name).join(', ')}
                                      className="col-lg-12"/>
                        <ClickableHumanBody ref="bodily_injury_location_list_pic"
                                            defaultValue={bodily_injury_location_list && bodily_injury_location_list.map(v => v.injury.name)}
                                            onAdded={this.onHumanBodyPartsAdded}
                                            onRemoved={this.onHumanBodyPartsRemoved}/>
                        <ProfileField name="injury_mechanism_list" title="Injury Mechanism (Direct Cause Of Injury)"
                                      value={injury_mechanism_list && injury_mechanism_list.map(v => v.injury.name).join(', ')}
                                      className="col-lg-12"/>
                        <ProfileField name="injury_desc" title="Injury Description"
                                      value={injury_desc}
                                      className="col-lg-12"/>
                    </Row>
                    <Row
                        rendered
                        idx={7.2}
                        title="7.2. Alcohol Or Drugs"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="test_undertaken" placeholder="Was Testing Undertaken?"
                                      value={test_undertaken} className="col-lg-12"/>
                        <ProfileField ref="test_type_list" name="test_type_list"
                                      value={test_type_list && test_type_list.map(v => isString(v) ? v : v.value).join(', ')}
                                      placeholder="Type Of Test(s) Undertaken" className="col-lg-12"/>
                        <ProfileField ref="test_type_drug_undertaken" name="test_type_drug_undertaken"
                                      placeholder="Drug Test Result"
                                      value={test_type_drug_undertaken}
                                      className="col-lg-12"/>
                        <ProfileField ref="test_type_alcohol_undertaken" name="test_type_alcohol_undertaken"
                                      placeholder="Alcohol Test Result"
                                      value={test_type_alcohol_undertaken}
                                      className="col-lg-12"/>
                        <ProfileField ref="test_type_mobile_device_undertaken" name="test_type_mobile_device_undertaken"
                                      placeholder="Was a Mobile Device being used?"
                                      value={test_type_mobile_device_undertaken}
                                      className="col-lg-12"/>
                    </Row>
                    <Row
                        rendered
                        idx={7.3}
                        title="7.3. Motor Vehicle Incident Details"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="is_vehicle_incident" placeholder="A Motor Vehicle Incident?"
                                      value={is_vehicle_incident} className="col-lg-12"/>
                        <Fragment ref="driver_details_sec" rendered>
                            <label className="margin-t-10 col-lg-12">13.1 Driver Details</label>
                            <ProfileField name="driver" placeholder="Driver Details"
                                          value={driver || driver_other}
                                          renderer={v => v.fname + ' ' + v.lname}
                                          className="col-lg-12"/>
                            <ProfileField name="driver_dob" type="date" placeholder="Date Of Birth"
                                          value={driver_dob} className="col-lg-6"/>
                            <ProfileField name="driver_gender" placeholder="Gender"
                                          value={driver_gender} className="col-lg-6"/>
                            <ProfileField name="address" type="textarea" placeholder="Address"
                                          value={address} className="col-lg-12"/>
                            <ProfileField name="email" type="email" placeholder="Email Address"
                                          value={email} className="col-lg-6"/>
                            <ProfileField name="phone" placeholder="Phone No." value={phone}
                                          className="col-lg-6"/>
                            <ProfileField name="licence_num" placeholder="Licence No."
                                          value={licence_num} className="col-lg-4"/>
                            <ProfileField name="licence_expiry" type="date" placeholder="Licence Expiry Date"
                                          value={licence_expiry} className="col-lg-4"/>
                            <ProfileField name="licence_years" placeholder="Licence Years Held"
                                          value={licence_years} className="col-lg-4"/>
                        </Fragment>
                        <Fragment ref="vehicle_details_sec" rendered>
                            <label className="margin-t-10 col-lg-12">13.2 Vehicle Details</label>
                            <ProfileField name="vehicle_make" placeholder="Vehicle/Trailer Make"
                                          value={vehicle_make} className="col-lg-6"/>
                            <ProfileField name="vehicle_model" placeholder="Vehicle/Trailer Model"
                                          value={vehicle_model} className="col-lg-6"/>
                            <ProfileField name="vehicle_year" placeholder="Year"
                                          value={vehicle_year}
                                          className="col-lg-6"/>
                            <ProfileField name="vehicle_color" placeholder="Color"
                                          value={vehicle_color} className="col-lg-6"/>
                            <ProfileField name="vehicle_reg_num" placeholder="Registration No."
                                          value={vehicle_reg_num} className="col-lg-4"/>
                            <ProfileField name="vehicle_fleet_num" placeholder="Fleet No."
                                          value={vehicle_fleet_num} className="col-lg-4"/>
                            <ProfileField name="vehicle_reg_date" type="date" placeholder="Registration Date"
                                          value={vehicle_reg_date} className="col-lg-4"/>
                            <ProfileField name="vehicle_trip_type" placeholder="Trip Type"
                                          value={vehicle_trip_type} className="col-lg-6"/>
                            <ProfileField name="vehicle_load_type" placeholder="Load Type"
                                          value={vehicle_load_type} className="col-lg-6"/>
                        </Fragment>
                        <Fragment ref="third_party_details_sec" rendered>
                            <label className="margin-t-10 col-lg-12">13.3 Third Party Details</label>
                            <ProfileField name="was_3rd_party_involved" placeholder="Was A Third Party Involved?"
                                          value={was_3rd_party_involved}
                                          className="col-lg-12"/>
                            <Fragment ref="was_3rd_party_involved_sec" rendered>
                                <ProfileField name="are_3rd_party_details_available"
                                              placeholder="Third Party Details Available?"
                                              value={are_3rd_party_details_available}
                                              className="col-lg-12"/>
                                <Fragment ref="are_3rd_party_details_available_sec" rendered>
                                    <ProfileField name="third_party_fname" placeholder="Third Party First Name"
                                                  value={third_party_fname}
                                                  className="col-lg-6"/>
                                    <ProfileField name="third_party_lname" placeholder="Third Party Last Name"
                                                  value={third_party_lname}
                                                  className="col-lg-6"/>
                                    <ProfileField name="third_party_address" type="textarea"
                                                  placeholder="Third Party Address"
                                                  value={third_party_address}
                                                  className="col-lg-12"/>
                                    <ProfileField name="third_party_email" type="email"
                                                  placeholder="Third Party Email Address"
                                                  value={third_party_email}
                                                  className="col-lg-6"/>
                                    <ProfileField name="third_party_phone" placeholder="Third Party Phone No."
                                                  value={third_party_phone}
                                                  className="col-lg-6"/>
                                </Fragment>
                                <ProfileField name="did_driver_admit_liability"
                                              placeholder="Did A Driver Admit Liability To Any Person(s)?"
                                              value={did_driver_admit_liability}
                                              className="col-lg-12"/>
                                <Fragment ref="did_driver_admit_liability_sec" rendered>
                                    <ProfileField ref="did_someone_else_admit_liability"
                                                  name="did_someone_else_admit_liability"
                                                  placeholder="Did Someone Else Admit Liability?"
                                                  value={did_someone_else_admit_liability}
                                                  className="col-lg-12"/>
                                    <ProfileField ref="someone_else_admit_liability_name"
                                                  name="someone_else_admit_liability_name"
                                                  placeholder="Someone Else Who Admitted Liability Name"
                                                  value={someone_else_admit_liability_name}
                                                  className="col-lg-12"/>
                                </Fragment>
                                <ProfileField ref="liability_admitted_to_name" name="liability_admitted_to_name"
                                              placeholder="Who Was Liability Admitted To?"
                                              value={liability_admitted_to_name}
                                              className="col-lg-12"/>
                                <ProfileField name="third_party_opinion" type="textarea"
                                              placeholder="In The 3rd Party Opinion, Who Was Responsible For The Collision And Why?"
                                              value={third_party_opinion}
                                              className="col-lg-12"/>

                                <label className="label-docs col-lg-12 margin-t-15">Attached Relevant
                                    Documents/Files</label>
                                <AddFilesGridViewInput name="third_party_document_list" title="Documents/Files"
                                                       defaultValue={third_party_document_list || []}
                                                       readonly
                                                       className="padding-t-40 margin-0 -margin-t-40 col-lg-12 pull-left"/>
                            </Fragment>
                        </Fragment>
                        <Fragment ref="infringement_details_sec" rendered>
                            <label className="margin-t-10 col-lg-12">13.4 Infringement</label>
                            <ProfileField name="is_infringement_issued" placeholder="Has Infringement Been Issued?"
                                          value={is_infringement_issued}
                                          className="col-lg-12"/>
                            <Fragment ref="is_infringement_issued_sec" rendered>
                                <label className="margin-t-10 col-lg-12">13.4.1 Infringement Details</label>
                                <ProfileField name="penalty_num" placeholder="Penalty Notice No."
                                              value={penalty_num} className="col-lg-6"/>
                                <ProfileField name="issuing_authority" placeholder="Issuing Authority"
                                              value={issuing_authority} className="col-lg-6"/>
                                <ProfileField name="issuing_officer" placeholder="Issuing Officer"
                                              value={issuing_officer} className="col-lg-6"/>
                                <ProfileField name="type_of_breach" placeholder="Type Of Breach"
                                              value={type_of_breach} className="col-lg-6"/>

                                <label className="margin-t-10 col-lg-12">13.4.2 Addressee Details</label>
                                <ProfileField name="addressee_issued_to_name" placeholder="Issued To"
                                              value={addressee_issued_to_name}
                                              className="col-lg-6"/>
                                <ProfileField name="addressee_name_or_entity" placeholder="Name / Entity"
                                              value={addressee_name_or_entity}
                                              className="col-lg-6"/>
                                <ProfileField name="addressee_amount" placeholder="Amount"
                                              value={(addressee_amount && addressee_amount.toCurrency("R"))}
                                              className="col-lg-6"/>
                                <ProfileField name="addressee_due_date" type="date" placeholder="Due Date"
                                              value={addressee_due_date} className="col-lg-6"/>
                            </Fragment>
                        </Fragment>
                        <Fragment ref="police_involvement_details_sec" rendered>
                            <label className="margin-t-10 col-lg-12">13.5 Police Involvement</label>
                            <ProfileField ref="did_police_attend_scene" name="did_police_attend_scene"
                                          placeholder="Did Police Attend Scene?"
                                          value={did_police_attend_scene}
                                          className="col-lg-12"/>
                            <Fragment ref="did_police_attend_scene_sec" rendered>
                                <ProfileField name="ref_or_report_num" placeholder="Ref/Report No. (If applicable)"
                                              value={ref_or_report_num} className="col-lg-12"/>
                                <ProfileField name="officer_name" placeholder="Police Officer Taking Collision Details"
                                              value={officer_name} className="col-lg-12"/>
                                <ProfileField name="officer_station"
                                              placeholder="Police Officer Station Taking Collision Details"
                                              value={officer_station} className="col-lg-12"/>
                            </Fragment>
                            <ProfileField ref="collision_reported_to_police_station"
                                          name="collision_reported_to_police_station"
                                          placeholder="Collision Reported To Police Station?"
                                          value={collision_reported_to_police_station}
                                          className="col-lg-12"/>
                            <ProfileField ref="have_charges_been_laid" name="have_charges_been_laid"
                                          placeholder="Have Charges Been Laid?"
                                          value={have_charges_been_laid}
                                          className="col-lg-12"/>
                            <Fragment ref="have_charges_been_laid_sec" rendered>
                                <ProfileField name="nature_of_charges" placeholder="Nature Of Charges"
                                              value={nature_of_charges} className="col-lg-12"/>
                                <ProfileField name="who_laid_charges" placeholder="Who Laid Charges?"
                                              value={who_laid_charges} className="col-lg-6"/>
                                <ProfileField name="who_were_nature_charges_laid_against"
                                              placeholder="Who Were Charges Laid Against?"
                                              value={who_were_nature_charges_laid_against}
                                              className="col-lg-6"/>
                            </Fragment>
                        </Fragment>
                    </Row>
                    <Row
                        rendered
                        idx={7.4}
                        title="7.4. Incident Consequence / Severity"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <ProfileField name="consequence" title="Consequence / Severity" value={consequence}
                                      className="col-lg-6"/>
                        <ProfileField name="likelihood" title="Likelihood / Probability" value={likelihood}
                                      renderer={v => (isNumber(v) ? v : 'ABCDE'.indexOf(v) + 1)} className="col-lg-6"/>
                        <label className="margin-t-10 hor-center col-lg-12">Incident Risk Rating</label>
                        <RiskRating selected={risk_rating} readonly ref="risk_rating" name="risk_rating"/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. Weather Conditions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="weather_condition_list" placeholder="Weather Conditions"
                              value={weather_condition_list} renderer={v => v.map(v => v.value).join(', ')} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={9}
                title="9. Protective Equipment Worn"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="protective_equipment_worn_list" placeholder="Protective Equipment Worn"
                              value={protective_equipment_worn_list} renderer={v => v.map(v => v.value).join(', ')}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={10}
                title="10. Class"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="class_list" placeholder="Class" value={class_list} renderer={v => v.map(v => v.value).join(', ')}
                              className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={11}
                title="11. Environment"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="environment_list" placeholder="Environment" value={environment_list}
                              renderer={v => v.map(v => v.value).join(', ')} className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={12}
                title="12. Estimated Costs"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ProfileField name="estimated_costs_damages" placeholder="Damages" value={estimated_costs_damages}
                              className="col-lg-12"/>
                <ProfileField name="estimated_costs_medical" placeholder="Medical" value={estimated_costs_medical}
                              className="col-lg-12"/>
                <ProfileField name="estimated_costs_salaries_wages" placeholder="Salaries / Wages"
                              value={estimated_costs_salaries_wages} className="col-lg-12"/>
                <ProfileField name="estimated_costs_investigations" placeholder="Investigations"
                              value={estimated_costs_investigations} className="col-lg-12"/>
                <ProfileField name="estimated_costs_others" placeholder="Others" value={estimated_costs_others}
                              className="col-lg-12"/>
            </Row>
        </FormControls>
        <ProfilePDFReader ref="pdfReader"/>
    </>);
};
// </editor-fold>

export default profileRender;
