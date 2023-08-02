// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";

import {
    AddFilesGridViewInput,
    ClearableInput,
    ClickableHumanBody,
    ProfileField,
    SelectClientInput,
    SelectEmployeeInput, SelectIncidentActivityList, SelectIncidentSubCategoryList,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../../components/inputs';
import {FormControls, Fragment, RiskRating, Row} from '../../../../../../components/FormComponents';
import {NewEmployeeListTable} from '../../../../../../components/FormTableComponents';
import ProfilePDFReader from '../../printers/ProfilePDFReader';
import {observer} from "mobx-react";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="editRender">
const editRender = function () {
    if (!this.item)
        return null;

    console.log('editRender', this.item)

    let {
        props: {
            onFormNext, onFormBack, onFormOpen,
            dialog: {renderProfileCover}
        },
        item, item: {
            id, data: {
                created_at, status,
                client, project, site,
                classification,
                investigation,
                sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data,
                sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data
            }
        }
    } = this;

    const {isConsultant} = storage.is;

    if (classification) {
        sec1_data = classification.sec1_data || sec1_data;
        sec2_data = classification.sec2_data || sec2_data;
        sec3_data = classification.sec3_data || sec3_data;
        sec4_data = classification.sec4_data || sec4_data;
    }

    let investigation_team_list = null;
    let investigation_due_date = null;
    if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
        investigation_team_list = [...investigation.sec1_data.investigation_team_list, null];
    } else if (classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
        investigation_team_list = [...classification.sec5_data.investigation_team_list, null];
    }
    if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_due_date) {
        investigation_due_date = investigation.sec1_data.investigation_due_date;
    } else if (classification && classification.sec5_data && classification.sec5_data.investigation_due_date) {
        investigation_due_date = classification.sec5_data.investigation_due_date;
    }

    const investigation_details = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_details : null;
    const investigation_findings_list = (investigation && investigation.sec2_data && investigation.sec2_data.investigation_findings_list) ?
        [...investigation.sec2_data.investigation_findings_list, null] : [null];
    const investigation_findings_further_desc = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_findings_further_desc : null;
    const document_list = (investigation && investigation.sec2_data && investigation.sec2_data.document_list) ?
        investigation.sec2_data.document_list : null;

    let risk_rating = null;
    let consequence = null;
    let likelihood = null;
    if (investigation && investigation.sec3_data && investigation.sec3_data.risk_rating) {
        risk_rating = investigation.sec3_data.risk_rating;
    } else if (sec14_data && sec14_data.risk_rating) {
        risk_rating = sec14_data.risk_rating;
    }
    if (investigation && investigation.sec3_data && investigation.sec3_data.consequence) {
        consequence = investigation.sec3_data.consequence;
    } else if (sec14_data && sec14_data.consequence) {
        consequence = sec14_data.consequence;
    }
    if (investigation && investigation.sec3_data && investigation.sec3_data.likelihood) {
        likelihood = investigation.sec3_data.likelihood;
    } else if (sec14_data && sec14_data.likelihood) {
        likelihood = sec14_data.likelihood;
    }

    let cause_analysis = null;
    if (investigation && investigation.sec4_data && investigation.sec4_data.cause_analysis) {
        cause_analysis = investigation.sec4_data.cause_analysis;
    }

    let corrective_actions = null;
    if (investigation && investigation.sec5_data && investigation.sec5_data.corrective_actions) {
        corrective_actions = investigation.sec5_data.corrective_actions;
    }

    let distribution_list = null;
    if (investigation && investigation.sec6_data && investigation.sec6_data.distribution_list) {
        distribution_list = [...investigation.sec6_data.distribution_list].filter(v => !!v);
    } else if (sec15_data && sec15_data.distribution_list) {
        distribution_list = [...sec15_data.distribution_list].filter(v => !!v);
    }

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
                {isConsultant &&
                    <SelectClientInput name="client" placeholder="Company..." defaultValue={client} required
                                       className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={project} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={site} required
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                                defaultValue={sec1_data.group} className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.group} returnValue/>
                <ClearableInput name="short_desc" type="textarea" placeholder="Short Description"
                                defaultValue={sec1_data.short_desc} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="desc" type="textarea" placeholder="Incident Description"
                                defaultValue={sec10_data && sec10_data.desc} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <ClearableInput name="location" type="select" placeholder="Select Location..."
                                defaultValue={sec9_data && sec9_data.location}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.location} returnValue add/>
                <ClearableInput name="exact_location" type="textarea" placeholder="Exact Location"
                                defaultValue={sec9_data && sec9_data.exact_location} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-t-15">Attach Relevant Documents/Files</label>
                <AddFilesGridViewInput name="document_list" title="Add Document/File"
                                       defaultValue={sec10_data && sec10_data.document_list}
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
                                defaultValue={sec9_data && sec9_data.incident_date} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="incident_time" type="time" placeholder="Time Incident Occurred..."
                                defaultValue={sec9_data && sec9_data.incident_time} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>

                <ClearableInput name="date_reported" type="date"
                                defaultValue={sec7_data && sec7_data.date_reported}
                                placeholder="Date Reported..." className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="time_reported" type="time"
                                defaultValue={sec7_data && sec7_data.time_reported}
                                placeholder="Time Reported..." className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>

                <ClearableInput name="time_shift" type="radio"
                                defaultValue={sec7_data && sec7_data.time_shift}
                                placeholder="Time Shift"
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
                <ClearableInput name="category_list" type="checkbox" placeholder="Incident Category"
                                defaultValue={sec1_data.category_list} vertical={3} className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.category_list} returnValue/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Incident Sub-Category (Optional)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectIncidentSubCategoryList ref="sub_category_list" name="sub_category_list" defaultValue={sec2_data.sub_category_list}
                                               onChange={this.form.onChange}
                                               values={this.state.lists.sub_category_list}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Sectors & Activities"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="sector_list" type="checkbox" placeholder="Sector(s)"
                                defaultValue={sec1_data.sector_list} vertical={3} className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.sector_list} returnValue/>

                <SelectIncidentActivityList ref="activity_list" name="activity_list" defaultValue={sec2_data.activity_list}
                                               onChange={this.form.onChange}
                                               values={this.state.lists.activity_list}/>
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
                                              defaultValue={[...(sec5_data.person_involved_list || []), null]}
                                              className="w-full-calc-add-10 -margin-l-10"
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
                        <SelectEmployeeInput name="person_reporting"
                                             defaultValue={sec6_data && sec6_data.person_reporting}
                                             placeholder="Person Reporting The Incident..."
                                             className="col-lg-12 form-control"
                                             onChange={this.form.onChange} showOtherPerson/>
                    </Row>
                    <Row
                        rendered
                        idx={6.3}
                        title="6.3. Incident Reported To"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <SelectEmployeeInput name="person_reported_to"
                                             defaultValue={sec7_data && sec7_data.person_reported_to}
                                             placeholder="Incident Reported To..." className="col-lg-12 form-control"
                                             onChange={this.form.onChange} showOtherPerson/>
                    </Row>
                    <Row
                        rendered
                        idx={6.4}
                        title="6.4. Witnesses To The Incident"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewEmployeeListTable name="witness_list"
                                              defaultValue={[...(sec8_data.witness_list || []), null]}
                                              className="w-full-calc-add-10 -margin-l-10"
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
                        title="7.1. Injury Report"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <SelectEmployeeInput name="person_injured"
                                             defaultValue={sec11_data && sec11_data.person_injured}
                                             placeholder="Person Injured..." className="col-lg-12 form-control"
                                             onChange={this.form.onChange} showOtherPerson/>
                        <ClearableInput name="injured_person_dob"
                                        defaultValue={sec11_data && sec11_data.injured_person_dob}
                                        type="date" placeholder="Date Of Birth..." className="col-lg-6 form-control"
                                        onChange={this.form.onChange}/>
                        <ClearableInput name="injured_person_gender"
                                        defaultValue={sec11_data && sec11_data.injured_person_gender} type="select"
                                        placeholder="Gender..." className="col-lg-6 form-control"
                                        onChange={this.form.onChange}
                                        values={this.state.lists.gender} returnValue/>

                        <ClearableInput name="nature_of_injury_list"
                                        defaultValue={sec11_data && sec11_data.nature_of_injury_list}
                                        type="select_multi"
                                        placeholder="Nature Of Injury..." vertical={2}
                                        className="col-lg-12 form-control"
                                        onChange={this.form.onChange} values={this.state.lists.nature_of_injury_list}
                                        returnValue add/>
                        <ClearableInput ref="bodily_injury_location_list" name="bodily_injury_location_list"
                                        defaultValue={sec11_data && sec11_data.bodily_injury_location_list}
                                        type="select_multi"
                                        vertical={3} placeholder="Bodily Injury Location (Part(s) Of Body Injured)..."
                                        className="col-lg-12 form-control" onChange={this.form.onChange}
                                        values={this.state.lists.bodily_injury_location_list} returnValue add/>
                        <ClickableHumanBody ref="bodily_injury_location_list_pic"
                                            defaultValue={sec11_data && sec11_data.bodily_injury_location_list}
                                            onAdded={this.onHumanBodyPartsAdded}
                                            onRemoved={this.onHumanBodyPartsRemoved}/>
                        <ClearableInput name="injury_mechanism_list"
                                        defaultValue={sec11_data && sec11_data.injury_mechanism_list}
                                        type="select_multi"
                                        vertical={2} placeholder="Injury Mechanism (Direct Cause Of Injury)..."
                                        className="col-lg-12 form-control" onChange={this.form.onChange}
                                        values={this.state.lists.injury_mechanism_list} returnValue add/>
                        <ClearableInput name="injury_desc" defaultValue={sec11_data && sec11_data.injury_desc}
                                        type="textarea"
                                        placeholder="Injury Description" className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
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
                                        value={sec12_data && sec12_data.test_undertaken}
                                        className="col-lg-12 form-control"
                                        onChange={this.form.onChange} values={this.state.lists.test_undertaken}/>
                        <ClearableInput ref="test_type_list" rendered={false} name="test_type_list" type="checkbox"
                                        placeholder="Type Of Test(s) Undertaken"
                                        value={sec12_data && sec12_data.test_type_list}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}
                                        values={this.state.lists.test_type_list} returnValue/>
                        <ClearableInput ref="test_type_drug_undertaken" name="test_type_drug_undertaken"
                                        rendered={false}
                                        type="select" placeholder="Drug Test Result"
                                        value={sec12_data && sec12_data.test_type_drug_undertaken}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}
                                        values={this.state.lists.test_type_drug_undertaken} returnValue/>
                        <ClearableInput ref="test_type_alcohol_undertaken" name="test_type_alcohol_undertaken"
                                        rendered={false}
                                        type="select" placeholder="Alcohol Test Result"
                                        value={sec12_data && sec12_data.test_type_alcohol_undertaken}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}
                                        values={this.state.lists.test_type_alcohol_undertaken} returnValue/>
                        <ClearableInput ref="test_type_mobile_device_undertaken"
                                        name="test_type_mobile_device_undertaken"
                                        rendered={false} type="select" placeholder="Was a Mobile Device being used?"
                                        value={sec12_data && sec12_data.test_type_mobile_device_undertaken}
                                        className="col-lg-12 form-control" onChange={this.form.onChange}
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
                                        value={sec13_data && sec13_data.is_vehicle_incident}
                                        className="col-lg-12 form-control"
                                        onChange={this.form.onChange} values={this.state.lists.is_vehicle_incident}/>
                        <Fragment ref="driver_details_sec" rendered={false}>
                            <label className="margin-t-10 col-lg-12">13.1 Driver Details</label>
                            <SelectEmployeeInput name="driver" placeholder="Driver Details..."
                                                 value={sec13_data && sec13_data.driver}
                                                 className="col-lg-12 form-control"
                                                 parentClassName="col-lg-12 pull-left" onChange={this.form.onChange}
                                                 showOtherPerson/>
                            <ClearableInput name="driver_dob" type="date" placeholder="Date Of Birth..."
                                            value={sec13_data && sec13_data.driver_dob}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="driver_gender" type="select" placeholder="Gender..."
                                            value={sec13_data && sec13_data.driver_gender}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange} values={this.state.lists.gender} returnValue/>
                            <ClearableInput name="address" type="textarea" placeholder="Address"
                                            value={sec13_data && sec13_data.address} className="col-lg-12 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="email" type="email" placeholder="Email Address"
                                            value={sec13_data && sec13_data.email} className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="phone" type="text" placeholder="Phone No."
                                            value={sec13_data && sec13_data.phone} className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="licence_num" type="text" placeholder="Licence No."
                                            value={sec13_data && sec13_data.licence_num}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="licence_expiry" type="date" placeholder="Licence Expiry Date..."
                                            value={sec13_data && sec13_data.licence_expiry}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="licence_years" type="number" placeholder="Licence Years Held"
                                            value={sec13_data ? sec13_data.licence_years : null}
                                            className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        </Fragment>
                        <Fragment ref="vehicle_details_sec" rendered={false}>
                            <label className="margin-t-10 col-lg-12">13.2 Vehicle Details</label>
                            <ClearableInput name="vehicle_make" type="text" placeholder="Vehicle/Trailer Make"
                                            value={sec13_data && sec13_data.vehicle_make}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_model" type="text" placeholder="Vehicle/Trailer Model"
                                            value={sec13_data && sec13_data.vehicle_model}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_year" type="number" placeholder="Year"
                                            value={sec13_data && sec13_data.vehicle_year}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_color" type="text" placeholder="Color"
                                            value={sec13_data && sec13_data.vehicle_color}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_reg_num" type="text" placeholder="Registration No."
                                            value={sec13_data && sec13_data.vehicle_reg_num}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_fleet_num" type="text" placeholder="Fleet No."
                                            value={sec13_data && sec13_data.vehicle_fleet_num}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_reg_date" type="date" placeholder="Registration Date..."
                                            value={sec13_data && sec13_data.vehicle_reg_date}
                                            className="col-lg-12 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_trip_type" type="text" placeholder="Trip Type"
                                            value={sec13_data && sec13_data.vehicle_trip_type}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="vehicle_load_type" type="text" placeholder="Load Type"
                                            value={sec13_data && sec13_data.vehicle_load_type}
                                            className="col-lg-6 form-control"
                                            onChange={this.form.onChange}/>
                        </Fragment>
                        <Fragment ref="third_party_details_sec" rendered={false}>
                            <label className="margin-t-10 col-lg-12">13.3 Third Party Details</label>
                            <ClearableInput name="was_3rd_party_involved" type="radio"
                                            placeholder="Was A Third Party Involved?"
                                            value={sec13_data && sec13_data.was_3rd_party_involved}
                                            className="col-lg-12 form-control" onChange={this.form.onChange}
                                            values={this.state.lists.was_3rd_party_involved}/>
                            <Fragment ref="was_3rd_party_involved_sec" rendered={false}>
                                <ClearableInput name="are_3rd_party_details_available" type="radio"
                                                placeholder="Third Party Details Available?"
                                                value={sec13_data && sec13_data.are_3rd_party_details_available}
                                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                                values={this.state.lists.are_3rd_party_details_available}/>
                                <Fragment ref="are_3rd_party_details_available_sec" rendered={false}>
                                    <ClearableInput name="third_party_fname" type="text"
                                                    placeholder="Third Party First Name"
                                                    value={sec13_data && sec13_data.third_party_fname}
                                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                    <ClearableInput name="third_party_lname" type="text"
                                                    placeholder="Third Party Last Name"
                                                    value={sec13_data && sec13_data.third_party_lname}
                                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                    <ClearableInput name="third_party_address" type="textarea"
                                                    placeholder="Third Party Address"
                                                    value={sec13_data && sec13_data.third_party_address}
                                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                    <ClearableInput name="third_party_email" type="email"
                                                    placeholder="Third Party Email Address"
                                                    value={sec13_data && sec13_data.third_party_email}
                                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                    <ClearableInput name="third_party_phone" type="text"
                                                    placeholder="Third Party Phone No."
                                                    value={sec13_data && sec13_data.third_party_phone}
                                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                </Fragment>
                                <ClearableInput name="did_driver_admit_liability" type="radio"
                                                placeholder="Did A Driver Admit Liability To Any Person(s)?"
                                                value={sec13_data && sec13_data.did_driver_admit_liability}
                                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                                values={this.state.lists.did_driver_admit_liability}/>
                                <Fragment ref="did_driver_admit_liability_sec" rendered={false}>
                                    <ClearableInput ref="did_someone_else_admit_liability"
                                                    name="did_someone_else_admit_liability" type="radio"
                                                    placeholder="Did Someone Else Admit Liability?"
                                                    value={sec13_data && sec13_data.did_someone_else_admit_liability}
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}
                                                    values={this.state.lists.did_someone_else_admit_liability}/>
                                    <ClearableInput ref="someone_else_admit_liability_name"
                                                    name="someone_else_admit_liability_name" type="text"
                                                    placeholder="Someone Else Who Admitted Liability Name"
                                                    value={sec13_data && sec13_data.someone_else_admit_liability_name}
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                                </Fragment>
                                <ClearableInput ref="liability_admitted_to_name" rendered={false}
                                                name="liability_admitted_to_name" type="text"
                                                placeholder="Who Was Liability Admitted To?"
                                                value={sec13_data && sec13_data.liability_admitted_to_name}
                                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="third_party_opinion" type="textarea"
                                                placeholder="In The 3rd Party Opinion, Who Was Responsible For The Collision And Why?"
                                                value={sec13_data && sec13_data.third_party_opinion}
                                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                                <label className="margin-t-25 col-lg-12">Attach Relevant Documents/Files</label>
                                <AddFilesGridViewInput name="third_party_document_list" title="Add Document/File"
                                                       defaultValue={sec13_data && sec13_data.third_party_document_list}
                                                       className="padding-t-40 margin-0 -margin-t-40 col-lg-12 pull-left"
                                                       onChange={this.form.onChange}/>
                            </Fragment>
                        </Fragment>
                        <Fragment ref="infringement_details_sec" rendered={false}>
                            <label className="margin-t-10 col-lg-12">13.4 Infringement</label>
                            <ClearableInput name="is_infringement_issued" type="radio"
                                            placeholder="Has Infringement Been Issued?"
                                            value={sec13_data && sec13_data.is_infringement_issued}
                                            className="col-lg-12 form-control" onChange={this.form.onChange}
                                            values={this.state.lists.is_infringement_issued}/>
                            <Fragment ref="is_infringement_issued_sec" rendered={false}>
                                <label className="margin-t-10 col-lg-12">13.4.1 Infringement Details</label>
                                <ClearableInput name="penalty_num" type="text" placeholder="Penalty Notice No."
                                                value={sec13_data && sec13_data.penalty_num}
                                                className="col-lg-6 form-control"
                                                onChange={this.form.onChange}/>
                                <ClearableInput name="issuing_authority" type="text" placeholder="Issuing Authority"
                                                value={sec13_data && sec13_data.issuing_authority}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="issuing_officer" type="text" placeholder="Issuing Officer"
                                                value={sec13_data && sec13_data.issuing_officer}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="type_of_breach" type="text" placeholder="Type Of Breach"
                                                value={sec13_data && sec13_data.type_of_breach}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>

                                <label className="margin-t-10 col-lg-12">13.4.2 Addressee Details</label>
                                <ClearableInput name="addressee_issued_to_name" type="text" placeholder="Issued To"
                                                value={sec13_data && sec13_data.addressee_issued_to_name}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="addressee_name_or_entity" type="text" placeholder="Name / Entity"
                                                value={sec13_data && sec13_data.addressee_name_or_entity}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="addressee_amount" type="number" placeholder="Amount"
                                                value={sec13_data && sec13_data.addressee_amount}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="addressee_due_date" type="date" placeholder="Due Date..."
                                                value={sec13_data && sec13_data.addressee_due_date}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                            </Fragment>
                        </Fragment>
                        <Fragment ref="police_involvement_details_sec" rendered={false}>
                            <label className="margin-t-10 col-lg-12">13.5 Police Involvement</label>
                            <ClearableInput ref="did_police_attend_scene" name="did_police_attend_scene" type="radio"
                                            placeholder="Did Police Attend Scene?"
                                            value={sec13_data && sec13_data.did_police_attend_scene}
                                            className="col-lg-12 form-control" onChange={this.form.onChange}
                                            values={this.state.lists.did_police_attend_scene}/>
                            <Fragment ref="did_police_attend_scene_sec" rendered={false}>
                                <ClearableInput name="ref_or_report_num" type="text"
                                                placeholder="Ref/Report No. (If applicable)"
                                                value={sec13_data && sec13_data.ref_or_report_num}
                                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="officer_name" type="text"
                                                placeholder="Police Officer Taking Collision Details"
                                                value={sec13_data && sec13_data.officer_name}
                                                className="col-lg-12 form-control"
                                                onChange={this.form.onChange}/>
                                <ClearableInput name="officer_station" type="text"
                                                placeholder="Police Officer Station Taking Collision Details"
                                                value={sec13_data && sec13_data.officer_station}
                                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                            </Fragment>
                            <ClearableInput ref="collision_reported_to_police_station"
                                            name="collision_reported_to_police_station" type="radio"
                                            placeholder="Collision Reported To Police Station?"
                                            value={sec13_data && sec13_data.collision_reported_to_police_station}
                                            className="col-lg-12 form-control" onChange={this.form.onChange}
                                            values={this.state.lists.collision_reported_to_police_station}/>
                            <ClearableInput ref="have_charges_been_laid" name="have_charges_been_laid" rendered={false}
                                            type="radio" placeholder="Have Charges Been Laid?"
                                            value={sec13_data && sec13_data.have_charges_been_laid}
                                            className="col-lg-12 form-control" onChange={this.form.onChange}
                                            values={this.state.lists.have_charges_been_laid}/>
                            <Fragment ref="have_charges_been_laid_sec" rendered={false}>
                                <ClearableInput name="nature_of_charges" type="text" placeholder="Nature Of Charges"
                                                value={sec13_data && sec13_data.nature_of_charges}
                                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="who_laid_charges" type="text" placeholder="Who Laid Charges?"
                                                value={sec13_data && sec13_data.who_laid_charges}
                                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                                <ClearableInput name="who_were_nature_charges_laid_against" type="text"
                                                placeholder="Who Were Charges Laid Against?"
                                                value={sec13_data && sec13_data.who_were_nature_charges_laid_against}
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
                        onFormNext={onFormNext}
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
                    <Row
                        rendered
                        idx={7.5}
                        title="7.5. Distribution List"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewEmployeeListTable name="distribution_list"
                                              defaultValue={[...(sec15_data.distribution_list || []), null]}
                                              className="w-full-calc-add-10 -margin-l-10"
                                              onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
        </div>
    </div>);
};
// </editor-fold>

export default editRender;
