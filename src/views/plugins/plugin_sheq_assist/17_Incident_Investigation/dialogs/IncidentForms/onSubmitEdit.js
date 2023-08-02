import {mapIncidentPersonDetails} from "utils/ArrayMapperUtils";
import {isObservableArray, toJS} from "mobx";
import {ShouldUpdate} from "utils/Utils";
import insertIncident from "../../../../../../mutations/all/Incident/insertIncident";
import updateIncident from "../../../../../../mutations/all/Incident/updateIncident";

export default function onSubmitEdit(e, btn, onSaved) {
    const {form, item: {data: old_data}} = this;

    if (!form.isValid('category_list') || form.get('category_list').isEmpty()) {
        infoDialog.open('Incident Category is required');
        return;
    }
    if (!form.isValid('person_involved_list') || form.get('person_involved_list').isEmpty()) {
        infoDialog.open('Person(s) Involved in the Incident are/is required');
        return;
    }
    if (!form.isValid('person_reporting')) {
        infoDialog.open('Person Reporting the Incident is required');
        return;
    }
    if (!form.isValid('person_reported_to')) {
        infoDialog.open('Person Reported To is required');
        return;
    }

//        if (!form.isValid('person_injured')) {
//            infoDialog.open('Person Injured is required');
//            return;
//        }
//        if (!form.isValid('nature_of_injury_list')) {
//            infoDialog.open('Nature Of Injury is required');
//            return;
//        }
//        if (!form.isValid('bodily_injury_location_list')) {
//            infoDialog.open('Bodily Injury Location (Part(s) Of Body Injured) is required');
//            return;
//        }
//        if (!form.isValid('injury_mechanism_list')) {
//            infoDialog.open('Injury Mechanism (Direct Cause Of Injury) is required');
//            return;
//        }

    //TODO: further validation

    const {
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
        //6.3
        person_reported_to,
        //6.4
        witness_list,
        //6.5
        distribution_list,

        //7.1
        person_injured,
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
        is_vehicle_incident,
        is_infringement_issued,
        did_police_attend_scene,
        collision_reported_to_police_station,
        have_charges_been_laid,
        driver,
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
        //7.4
        consequence,
        likelihood,
        risk_rating,
    } = form.data;

    const data = {};

    ShouldUpdate.checkClient(data, old_data, client);
    ShouldUpdate.checkProject(data, old_data, project);
    ShouldUpdate.checkSite(data, old_data, site);

    console.log('sector_list',
        sector_list && sector_list.slice(),
        old_data.sec1_data && old_data.sec1_data && old_data.sec1_data.sector_list && old_data.sec1_data.sector_list.slice()
    )
    console.log('activity_list',
        activity_list && activity_list.slice(),
        old_data.sec2_data && old_data.sec2_data && old_data.sec2_data.activity_list && old_data.sec2_data.activity_list.slice()
    )

    //sec1_data
    if ((category_list && (isArray(category_list) || isObservableArray(category_list))) ||
        (sector_list && (isArray(sector_list) || isObservableArray(sector_list))) ||
        short_desc || group) {
        const new_sec1_data = {};
        ShouldUpdate.checkListToJS(new_sec1_data, old_data.sec1_data, category_list, 'category_list', v => isString(v) ? v : v.value);
        ShouldUpdate.checkListToJS(new_sec1_data, old_data.sec1_data, sector_list, 'sector_list', v => isString(v) ? v : v.value);
        ShouldUpdate.check(new_sec1_data, old_data.sec1_data, short_desc, 'short_desc');
        ShouldUpdate.check(new_sec1_data, old_data.sec1_data, group, 'group');
        if (!Object.keys(new_sec1_data).isEmpty()) {
            data.sec1_data = new_sec1_data;
        }
    }
    //sec2_data
    if ((sub_category_list && (isArray(sub_category_list) || isObservableArray(sub_category_list))) ||
        (activity_list && (isArray(activity_list) || isObservableArray(activity_list)))) {
        const new_sec2_data = {};
        ShouldUpdate.checkListToJS(new_sec2_data, old_data.sec2_data, sub_category_list, 'sub_category_list', v => isString(v) ? v : v.value);
        ShouldUpdate.checkListToJS(new_sec2_data, old_data.sec2_data, activity_list, 'activity_list', v => isString(v) ? v : v.value);
        if (!Object.keys(new_sec2_data).isEmpty()) {
            data.sec2_data = new_sec2_data;
        }
    }
    //sec3_data
    if (type) {
        const new_sec3_data = {};
        ShouldUpdate.check(new_sec3_data, old_data.sec3_data, type, 'type');
        if (!Object.keys(new_sec3_data).isEmpty()) {
            data.sec3_data = new_sec3_data;
        }
    }
    //sec4_data
    if (secondary_type_list && (isArray(secondary_type_list) || isObservableArray(secondary_type_list))) {
        const new_sec4_data = {};
        ShouldUpdate.checkListToJS(new_sec4_data, old_data.sec4_data, secondary_type_list, 'secondary_type_list', v => isString(v) ? v : v.value);
        if (!Object.keys(new_sec4_data).isEmpty()) {
            data.sec4_data = new_sec4_data;
        }
    }
    //sec5_data
    if (person_involved_list && (isArray(person_involved_list) || isObservableArray(person_involved_list))) {
        const new_sec5_data = {};
        const person_involved_list_mapped = person_involved_list.map(mapIncidentPersonDetails);
        ShouldUpdate.checkListToJS(new_sec5_data, old_data.sec5_data, person_involved_list_mapped, 'person_involved_list');
        if (!Object.keys(new_sec5_data).isEmpty()) {
            data.sec5_data = new_sec5_data;
        }
    }
    //sec6_data
    if (person_reporting) {
        const new_sec6_data = {};
        ShouldUpdate.checkEmployee_deprecated(new_sec6_data, old_data.sec6_data, person_reporting, 'person_reporting');
        if (!Object.keys(new_sec6_data).isEmpty()) {
            data.sec6_data = new_sec6_data;
        }
    }
    //sec7_data
    if (person_reported_to || date_reported || time_reported || time_shift) {
        const new_sec7_data = {};
        ShouldUpdate.checkEmployee_deprecated(new_sec7_data, old_data.sec7_data, person_reported_to, 'person_reported_to');
        ShouldUpdate.checkDate_deprecated(new_sec7_data, old_data.sec7_data, date_reported, 'date_reported');
        ShouldUpdate.check(new_sec7_data, old_data.sec7_data, time_reported, 'time_reported');
        ShouldUpdate.check(new_sec7_data, old_data.sec7_data, time_shift, 'time_shift');
        if (!Object.keys(new_sec7_data).isEmpty()) {
            data.sec7_data = new_sec7_data;
        }
    }
    //sec8_data
    if (witness_list && (isArray(witness_list) || isObservableArray(witness_list))) {
        const new_sec8_data = {};
        const witness_list_mapped = witness_list.map(mapIncidentPersonDetails);
        ShouldUpdate.checkListToJS(new_sec8_data, old_data.sec8_data, witness_list_mapped, 'witness_list');
        if (!Object.keys(new_sec8_data).isEmpty()) {
            data.sec8_data = new_sec8_data;
        }
    }
    //sec9_data
    if (incident_date || incident_time || location || exact_location) {
        const new_sec9_data = {};
        ShouldUpdate.checkDate_deprecated(new_sec9_data, old_data.sec9_data, incident_date, 'incident_date');
        ShouldUpdate.check(new_sec9_data, old_data.sec9_data, incident_time, 'incident_time');
        ShouldUpdate.check(new_sec9_data, old_data.sec9_data, location, 'location');
        ShouldUpdate.check(new_sec9_data, old_data.sec9_data, exact_location, 'exact_location');
        if (!Object.keys(new_sec9_data).isEmpty()) {
            data.sec9_data = new_sec9_data;
        }
    }
    //sec10_data
    if ((document_list && (isArray(document_list) || isObservableArray(document_list))) || desc) {
        const new_sec10_data = {};
        ShouldUpdate.checkFileList(new_sec10_data, old_data.sec10_data, document_list, 'document_list');
        ShouldUpdate.check(new_sec10_data, old_data.sec10_data, desc, 'desc');
        if (!Object.keys(new_sec10_data).isEmpty()) {
            data.sec10_data = new_sec10_data;
        }
    }
    //sec11_data
    if (person_injured || injured_person_dob || injured_person_gender || (nature_of_injury_list && (isArray(nature_of_injury_list) || isObservableArray(nature_of_injury_list)))) {
        const new_sec11_data = {};
        const nature_of_injury_list_mapped = nature_of_injury_list && nature_of_injury_list.map(v => isString(v) ? v : v.value);
        const bodily_injury_location_list_mapped = bodily_injury_location_list && bodily_injury_location_list.map(v => isString(v) ? v : v.value);
        const injury_mechanism_list_mapped = injury_mechanism_list && injury_mechanism_list.map(v => isString(v) ? v : v.value);

        ShouldUpdate.checkEmployee_deprecated(new_sec11_data, old_data.sec11_data, person_injured, 'person_injured');
        ShouldUpdate.checkDate_deprecated(new_sec11_data, old_data.sec11_data, injured_person_dob, 'injured_person_dob');
        ShouldUpdate.check(new_sec11_data, old_data.sec11_data, injured_person_gender, 'injured_person_gender');
        ShouldUpdate.checkListToJS(new_sec11_data, old_data.sec11_data, nature_of_injury_list_mapped, 'nature_of_injury_list');
        ShouldUpdate.checkListToJS(new_sec11_data, old_data.sec11_data, bodily_injury_location_list_mapped, 'bodily_injury_location_list');
        ShouldUpdate.checkListToJS(new_sec11_data, old_data.sec11_data, injury_mechanism_list_mapped, 'injury_mechanism_list');
        if (!Object.keys(new_sec11_data).isEmpty()) {
            data.sec11_data = new_sec11_data;
        }
    }
    //sec12_data
    if (test_undertaken || (test_type_list && (isArray(test_type_list) || isObservableArray(test_type_list))) || test_type_drug_undertaken || test_type_alcohol_undertaken || test_type_mobile_device_undertaken) {
        const new_sec12_data = {};
        const test_type_list_mapped = test_type_list && test_type_list.map(v => isString(v) ? v : v.value);
        ShouldUpdate.checkListToJS(new_sec12_data, old_data.sec12_data, test_type_list_mapped, 'test_type_list');
        ShouldUpdate.check(new_sec12_data, old_data.sec12_data, test_undertaken, 'test_undertaken');
        ShouldUpdate.check(new_sec12_data, old_data.sec12_data, test_type_drug_undertaken, 'test_type_drug_undertaken');
        ShouldUpdate.check(new_sec12_data, old_data.sec12_data, test_type_alcohol_undertaken, 'test_type_alcohol_undertaken');
        ShouldUpdate.check(new_sec12_data, old_data.sec12_data, test_type_mobile_device_undertaken, 'test_type_mobile_device_undertaken');
        if (!Object.keys(new_sec12_data).isEmpty()) {
            data.sec12_data = new_sec12_data;
        }
    }
    //sec13_data
    const hasDriverInfo = driver || driver_dob || driver_gender || address || email || phone || licence_num ||
        licence_expiry || licence_years;
    const hasVehicleInfo = vehicle_make || vehicle_model || vehicle_year || vehicle_color || vehicle_reg_num ||
        vehicle_fleet_num || vehicle_reg_date || vehicle_trip_type || vehicle_load_type;
    const has3rdPartyInfo = was_3rd_party_involved || are_3rd_party_details_available || third_party_fname ||
        third_party_lname || third_party_address || third_party_email || third_party_phone || did_driver_admit_liability ||
        did_someone_else_admit_liability || someone_else_admit_liability_name || liability_admitted_to_name ||
        third_party_opinion || third_party_document_list;
    const hasInfringementInfo = is_infringement_issued || penalty_num || issuing_authority || issuing_officer || type_of_breach ||
        addressee_issued_to_name || addressee_name_or_entity || addressee_amount || addressee_due_date || did_police_attend_scene ||
        ref_or_report_num || officer_name || officer_station || collision_reported_to_police_station || have_charges_been_laid ||
        nature_of_charges || who_laid_charges || who_were_nature_charges_laid_against;

    if (is_vehicle_incident || hasDriverInfo || hasVehicleInfo || has3rdPartyInfo || hasInfringementInfo) {
        const new_sec13_data = {};
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, is_vehicle_incident, 'is_vehicle_incident');

        ShouldUpdate.checkEmployee_deprecated(new_sec13_data, old_data.sec11_data, driver, 'driver');
        ShouldUpdate.checkDate_deprecated(new_sec13_data, old_data.sec11_data, driver_dob, 'driver_dob');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, driver_gender, 'driver_gender');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, address, 'address');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, email, 'email');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, phone, 'phone');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, licence_num, 'licence_num');
        ShouldUpdate.checkDate_deprecated(new_sec13_data, old_data.sec13_data, licence_expiry, 'licence_expiry');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, licence_years, 'licence_years');

        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_make, 'vehicle_make');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_model, 'vehicle_model');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_year, 'vehicle_year');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_color, 'vehicle_color');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_reg_num, 'vehicle_reg_num');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_fleet_num, 'vehicle_fleet_num');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_reg_date, 'vehicle_reg_date');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_trip_type, 'vehicle_trip_type');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, vehicle_load_type, 'vehicle_load_type');

        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, was_3rd_party_involved, 'was_3rd_party_involved');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, are_3rd_party_details_available, 'are_3rd_party_details_available');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, third_party_fname, 'third_party_fname');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, third_party_lname, 'third_party_lname');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, third_party_address, 'third_party_address');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, third_party_email, 'third_party_email');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, third_party_phone, 'third_party_phone');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, did_driver_admit_liability, 'did_driver_admit_liability');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, did_someone_else_admit_liability, 'did_someone_else_admit_liability');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, someone_else_admit_liability_name, 'someone_else_admit_liability_name');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, liability_admitted_to_name, 'liability_admitted_to_name');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, third_party_opinion, 'third_party_opinion');
        ShouldUpdate.checkFileList(new_sec13_data, old_data.sec13_data, third_party_document_list, 'third_party_document_list');

        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, is_infringement_issued, 'is_infringement_issued');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, penalty_num, 'penalty_num');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, issuing_authority, 'issuing_authority');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, issuing_officer, 'issuing_officer');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, type_of_breach, 'type_of_breach');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, addressee_issued_to_name, 'addressee_issued_to_name');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, addressee_name_or_entity, 'addressee_name_or_entity');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, addressee_amount, 'addressee_amount');
        ShouldUpdate.checkDate_deprecated(new_sec13_data, old_data.sec13_data, addressee_due_date, 'addressee_due_date');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, did_police_attend_scene, 'did_police_attend_scene');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, ref_or_report_num, 'ref_or_report_num');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, officer_name, 'officer_name');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, officer_station, 'officer_station');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, collision_reported_to_police_station, 'collision_reported_to_police_station');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, have_charges_been_laid, 'have_charges_been_laid');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, nature_of_charges, 'nature_of_charges');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, who_laid_charges, 'who_laid_charges');
        ShouldUpdate.check(new_sec13_data, old_data.sec13_data, who_were_nature_charges_laid_against, 'who_were_nature_charges_laid_against');

        if (!Object.keys(new_sec13_data).isEmpty()) {
            data.sec13_data = new_sec13_data;
        }
    }
    //sec14_data
    if (consequence || likelihood || risk_rating) {
        const new_sec14_data = {};
        ShouldUpdate.check(new_sec14_data, old_data.sec14_data, consequence, 'consequence');
        ShouldUpdate.check(new_sec14_data, old_data.sec14_data, likelihood, 'likelihood');
        ShouldUpdate.check(new_sec14_data, old_data.sec14_data, risk_rating, 'risk_rating');
        if (!Object.keys(new_sec14_data).isEmpty()) {
            data.sec14_data = new_sec14_data;
        }
    }
    //sec15_data
    if (distribution_list && (isArray(distribution_list) || isObservableArray(distribution_list))) {
        const new_sec15_data = {};
        const distribution_list_mapped = distribution_list.map(mapIncidentPersonDetails);
        ShouldUpdate.checkListToJS(new_sec15_data, old_data.sec15_data, distribution_list_mapped, 'distribution_list');
        if (!Object.keys(new_sec15_data).isEmpty()) {
            data.sec15_data = new_sec15_data;
        }
    }

    if (Object.keys(data).isEmpty()) {
        infoDialog.open("Nothing changed!");
        return;
    }

    console.log(data)

    btn.text("Saving...").disabled();
    updateIncident({id: this.item.id, ...data}).then(res => {
        console.log("res", res)
        onSaved && onSaved(res);
        infoDialog.open("Record successfully updated.");
        infoDialog.close(2000);
        this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
    });
};