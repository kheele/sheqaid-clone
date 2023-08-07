import insertIncident from "mutations/all/Incident/insertIncident";
import {Dates} from "utils/Dates";

export default async function onSubmitCreate(e, btn, onSaved) {
    const {form} = this;

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

    const vehicle = !is_vehicle_incident ? null : {
        driver_id: driver && driver.id,
        driver_dob: Dates.formatDateSQL(driver_dob),
        driver_gender,
        address,
        email,
        phone,
        licence_num,
        licence_expiry: Dates.formatDateSQL(licence_expiry),
        licence_years,
        //
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_color,
        vehicle_reg_num,
        vehicle_fleet_num,
        vehicle_reg_date: Dates.formatDateSQL(vehicle_reg_date),
        vehicle_trip_type,
        vehicle_load_type,
        //
        was_3rd_party_involved,//
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
        third_party_document_list: {
            data: await Promise.all([...(third_party_document_list || [])].map(async doc => ({doc: {path: await toDataURL(doc)}}))),
        },
        //
        is_infringement_issued,
        penalty_num,
        issuing_authority,
        issuing_officer,
        type_of_breach,
        addressee_issued_to_name,
        addressee_name_or_entity,
        addressee_amount,
        addressee_due_date: Dates.formatDateSQL(addressee_due_date),
        //
        did_police_attend_scene,
        ref_or_report_num,
        officer_name,
        officer_station,
        collision_reported_to_police_station,
        have_charges_been_laid,
        nature_of_charges,
        who_laid_charges,
        who_were_nature_charges_laid_against,
    };

    console.log('sector_list', sector_list)

    const data = {
        //0
        client_id: client && client.id,
        project_id: project && project.id,
        site_id: site && site.id,
        //1
        group,
        short_desc,
        desc,
        location,
        exact_location,
        document_list: {
            data: await Promise.all([...(document_list || [])].map(async doc => ({doc: {path: await toDataURL(doc)}})))
        },
        //2
        incident_date: Dates.formatDateSQL(incident_date),
        incident_time,
        date_reported: Dates.formatDateSQL(date_reported),
        time_reported,
        time_shift,
        //3
        category_list: {
            data: (category_list || []).map(({id: category_id}) => ({category_id}))
        },
        //4
        sub_category_list: {
            data: (sub_category_list || []).map(({id: sub_category_id}) => ({sub_category_id}))
        },
        //5
        sector_list: {
            data: (sector_list || []).map(({id: sector_id}) => ({sector_id}))
        },
        activity_list: {
            data: (activity_list || []).map(({id: activity_id}) => ({activity_id}))
        },
        //6
        person_involved_list: {
            data: (person_involved_list || []).map(({other_person, employee}) => {
                if (other_person) {
                    delete other_person.id;
                    if (other_person.job_position) {
                        other_person.job_position_id = other_person.job_position.id;
                        delete other_person.job_position;
                    }
                }
                return {
                    person_involved_id: employee && employee.id,
                    person_involved_other: other_person && {
                        data: other_person
                    } || null,
                };
            })
        },
        person_reporting_id: person_reporting && person_reporting.id,
        person_reporting_other: person_reporting && !person_reporting.id ? {
            data: person_reporting
        } : null,
        person_reported_to_id: person_reported_to && person_reported_to.id,
        person_reported_to_other: person_reported_to && !person_reported_to.id ? {
            data: person_reported_to
        } : null,
        witness_list: {
            data: (witness_list || []).map(({other_person, employee}) => {
                if (other_person) {
                    delete other_person.id;
                    if (other_person.job_position) {
                        other_person.job_position_id = other_person.job_position.id;
                        delete other_person.job_position;
                    }
                }
                return {
                    witness_id: employee && employee.id,
                    witness_other: other_person && {
                        data: other_person
                    } || null,
                };
            })
        },
        distribution_list: {
            data: (distribution_list || []).map(({other_person, employee}) => {
                if (other_person) {
                    delete other_person.id;
                    if (other_person.job_position) {
                        other_person.job_position_id = other_person.job_position.id;
                        delete other_person.job_position;
                    }
                }
                return {
                    employee_id: employee && employee.id,
                    other_person: other_person && {
                        data: other_person
                    } || null,
                };
            })
        },
        //7.1
        person_injured_id: person_injured && person_injured.id,
        person_injured_other: person_injured && !person_injured.id ? {
            data: person_injured
        } : null,
        injured_person_dob: Dates.formatDateSQL(injured_person_dob),
        injured_person_gender,
        injury_list: {
            data: [
                ...(nature_of_injury_list || []),
                ...(bodily_injury_location_list || []),
                ...(injury_mechanism_list || []),
            ].map(({id: injury_id}) => ({injury_id}))
        },
        injury_desc,
        //7.2
        test_undertaken,
        test_type_list: {
        	data: (test_type_list || []).map((name) => ({name})),
        },
        test_type_drug_undertaken,
        test_type_alcohol_undertaken,
        test_type_mobile_device_undertaken,
        //7.3
        is_vehicle_incident,
        vehicle_list: vehicle && is_vehicle_incident ? {
            data: [vehicle],
        } : null,
        //7.4
        severity: {
            data: {
                consequence, likelihood
            }
        },
    };

    console.log(data)

    btn.text("Saving...").disabled();
    progressDialog.open();
    insertIncident(data).then(res => {
        console.log("res", res)
        onSaved && onSaved(res);
        infoDialog.open("Record successfully saved.");
        infoDialog.close(2000);
        this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
        setTimeout(() => progressDialog.close());
    });
};