import {mapIncidentPersonDetails} from "../../../../../../utils/ArrayMapperUtils";
import {toJS} from "mobx";

export default function onSubmitCreate(e, btn, onSaved) {
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
        short_desc,//2
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
        sector_list,
        //4
        sub_category_list,
        activity_list,
        //5.1
        person_involved_list,
        //5.2
        person_reporting,
        //5.3
        person_reported_to,
        //5.4
        witness_list,
        //6.1
        person_injured,
        injured_person_dob,
        injured_person_gender,
        nature_of_injury_list,
        bodily_injury_location_list,
        injury_mechanism_list,
        injury_desc,
        //6.2
        test_undertaken,
        test_type_list,
        test_type_drug_undertaken,
        test_type_alcohol_undertaken,
        test_type_mobile_device_undertaken,

        //6.3
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

        //6.4
        consequence,
        likelihood,
        risk_rating,
        //6.5
        distribution_list
    } = form.data;

    const data = {
        sec1_data: {},
        sec2_data: {},
        sec3_data: {},
        sec4_data: {},
        sec5_data: {},
        sec6_data: {},
        sec7_data: {},
        sec8_data: {},
        sec9_data: {},
        sec10_data: {},
        sec11_data: {},
        sec12_data: {},
        sec13_data: {},
        sec14_data: {},
        sec15_data: {}
    };

    if (client) {
        if (client.id) {
            const {id, data: _data, name} = client;
            data.client = {id, name: name || _data.name};
        } else {
            data.client = client;
        }
    }
    if (project) {
        if (project.id) {
            const {id, data: _data, name} = project;
            data.project = {id, name: name || _data.name};
        } else {
            data.project = project;
        }
    }
    if (site) {
        if (site.id) {
            const {id, data: _data, name} = site;
            data.site = {id, name: name || _data.name};
        } else {
            data.site = site;
        }
    }

    //sec1_data
    if (category_list) {
        data.sec1_data.category_list = category_list.map(v => {
            if (isString(v)) {
                return v;
            } else {
                return v.value;
            }
        });
    }
    if(sector_list) {
        data.sec1_data.sector_list = sector_list.map(v => {
            if (isString(v)) {
                return v;
            } else {
                return v.value;
            }
        });
    }
    if(group) {
        data.sec1_data.group = group;
    }
    if (short_desc) {
        data.sec1_data.short_desc = short_desc;
    }
    //sec2_data
    if (sub_category_list) {
        data.sec2_data.sub_category_list = sub_category_list.map(v => {
            if (isString(v)) {
                return v;
            } else {
                return v.value;
            }
        });
    }
    if (activity_list) {
        data.sec2_data.activity_list = activity_list.map(v => {
            if (isString(v)) {
                return v;
            } else {
                return v.value;
            }
        });
    }
    //sec3_data

    //sec4_data

    //sec5_data
    if (person_involved_list) {
        data.sec5_data.person_involved_list = person_involved_list.map(mapIncidentPersonDetails);
    }
    //sec6_data
    if (person_reporting) {
        const {id = null, data: _data, fname, lname} = person_reporting;
        data.sec6_data.person_reporting = {id, fname: fname || _data.fname, lname: lname || _data.lname};
    }
    //sec7_data
    if (person_reported_to) {
        const {id = null, data: _data, fname, lname} = person_reported_to;
        data.sec7_data.person_reported_to = {id, fname: fname || _data.fname, lname: lname || _data.lname};
    }
    if (date_reported) {
        data.sec7_data.date_reported = date_reported.getTime();
    }
    if (time_reported) {
        data.sec7_data.time_reported = time_reported;
    }
    if (time_shift) {
        data.sec7_data.time_shift = time_shift;
    }
    //sec8_data
    if (witness_list) {
        data.sec8_data.witness_list = witness_list.map(mapIncidentPersonDetails);
    }
    //sec9_data
    if (incident_date) {
        data.sec9_data.incident_date = incident_date.getTime();
    }
    if (incident_time) {
        data.sec9_data.incident_time = incident_time;
    }
    if (location) {
        data.sec9_data.location = location;
    }
    if (exact_location) {
        data.sec9_data.exact_location = exact_location;
    }
    //sec10_data
    if (document_list) {
        data.sec10_data.document_list = document_list.map(({path}) => path);
    }
    if (desc) {
        data.sec10_data.desc = desc;
    }
    //sec11_data
    if (person_injured) {
        const {id = null, data: _data, fname, lname} = person_injured;
        data.sec11_data.person_injured = {id, fname: fname || _data.fname, lname: lname || _data.lname};
    }
    if (injured_person_dob) {
        data.sec11_data.injured_person_dob = injured_person_dob.getTime();
    }
    if (injured_person_gender) {
        data.sec11_data.injured_person_gender = injured_person_gender;
    }
    if (nature_of_injury_list) {
        data.sec11_data.nature_of_injury_list = nature_of_injury_list.map(v => {
            if (isString(v)) {
                return v;
            } else {
                return v.value;
            }
        });
    }
    if (bodily_injury_location_list) {
        data.sec11_data.bodily_injury_location_list = bodily_injury_location_list.map(v => {
            if (isString(v)) {
                return v;
            } else {
                return v.value;
            }
        });
    }
    if (injury_mechanism_list) {
        data.sec11_data.injury_mechanism_list = injury_mechanism_list.map(v => {
            if (isString(v)) {
                return v;
            } else {
                return v.value;
            }
        });
    }
    if(injury_desc) {
        data.sec11_data.injury_desc = injury_desc;
    }
    //sec12_data
    if (test_undertaken) {
        data.sec12_data.test_undertaken = test_undertaken;
    }
    if (test_type_list) {
        data.sec12_data.test_type_list = test_type_list;
    }
    if (test_type_drug_undertaken) {
        data.sec12_data.test_type_drug_undertaken = test_type_drug_undertaken;
    }
    if (test_type_alcohol_undertaken) {
        data.sec12_data.test_type_alcohol_undertaken = test_type_alcohol_undertaken;
    }
    if (test_type_mobile_device_undertaken) {
        data.sec12_data.test_type_mobile_device_undertaken = test_type_mobile_device_undertaken;
    }
    //sec13_data
    if (is_vehicle_incident) {
        data.sec13_data.is_vehicle_incident = is_vehicle_incident;
    }
    if (driver) {
        const {id = null, data: _data, fname, lname} = driver;
        data.sec13_data.driver = {id, fname: fname || _data.fname, lname: lname || _data.lname};
    }
    if (driver_dob) {
        data.sec13_data.driver_dob = driver_dob.getTime();
    }
    if (driver_gender) {
        data.sec13_data.driver_gender = driver_gender;
    }
    if (address) {
        data.sec13_data.address = address;
    }
    if (email) {
        data.sec13_data.email = email;
    }
    if (phone) {
        data.sec13_data.phone = phone;
    }
    if (licence_num) {
        data.sec13_data.licence_num = licence_num;
    }
    if (licence_expiry) {
        data.sec13_data.licence_expiry = licence_expiry.getTime();
    }
    if (licence_years) {
        data.sec13_data.licence_years = licence_years;
    }

    if (vehicle_make) {
        data.sec13_data.vehicle_make = vehicle_make;
    }
    if (vehicle_model) {
        data.sec13_data.vehicle_model = vehicle_model;
    }
    if (vehicle_year) {
        data.sec13_data.vehicle_year = vehicle_year;
    }
    if (vehicle_color) {
        data.sec13_data.vehicle_color = vehicle_color;
    }
    if (vehicle_reg_num) {
        data.sec13_data.vehicle_reg_num = vehicle_reg_num;
    }
    if (vehicle_fleet_num) {
        data.sec13_data.vehicle_fleet_num = vehicle_fleet_num;
    }
    if (vehicle_reg_date) {
        data.sec13_data.vehicle_reg_date = vehicle_reg_date;
    }
    if (vehicle_trip_type) {
        data.sec13_data.vehicle_trip_type = vehicle_trip_type;
    }
    if (vehicle_load_type) {
        data.sec13_data.vehicle_load_type = vehicle_load_type;
    }

    if (was_3rd_party_involved) {
        data.sec13_data.was_3rd_party_involved = was_3rd_party_involved;
    }
    if (are_3rd_party_details_available) {
        data.sec13_data.are_3rd_party_details_available = are_3rd_party_details_available;
    }
    if (third_party_fname) {
        data.sec13_data.third_party_fname = third_party_fname;
    }
    if (third_party_lname) {
        data.sec13_data.third_party_lname = third_party_lname;
    }
    if (third_party_address) {
        data.sec13_data.third_party_address = third_party_address;
    }
    if (third_party_email) {
        data.sec13_data.third_party_email = third_party_email;
    }
    if (third_party_phone) {
        data.sec13_data.third_party_phone = third_party_phone;
    }
    if (did_driver_admit_liability) {
        data.sec13_data.did_driver_admit_liability = did_driver_admit_liability;
    }
    if (did_someone_else_admit_liability) {
        data.sec13_data.did_someone_else_admit_liability = did_someone_else_admit_liability;
    }
    if (someone_else_admit_liability_name) {
        data.sec13_data.someone_else_admit_liability_name = someone_else_admit_liability_name;
    }
    if (liability_admitted_to_name) {
        data.sec13_data.liability_admitted_to_name = liability_admitted_to_name;
    }
    if (third_party_opinion) {
        data.sec13_data.third_party_opinion = third_party_opinion;
    }
    if (third_party_document_list) {
        data.sec13_data.third_party_document_list = third_party_document_list.map(({path}) => path);
    }

    if (is_infringement_issued) {
        data.sec13_data.is_infringement_issued = is_infringement_issued;
    }
    if (penalty_num) {
        data.sec13_data.penalty_num = penalty_num;
    }
    if (issuing_authority) {
        data.sec13_data.issuing_authority = issuing_authority;
    }
    if (issuing_officer) {
        data.sec13_data.issuing_officer = issuing_officer;
    }
    if (type_of_breach) {
        data.sec13_data.type_of_breach = type_of_breach;
    }
    if (addressee_issued_to_name) {
        data.sec13_data.addressee_issued_to_name = addressee_issued_to_name;
    }
    if (addressee_name_or_entity) {
        data.sec13_data.addressee_name_or_entity = addressee_name_or_entity;
    }
    if (addressee_amount) {
        data.sec13_data.addressee_amount = addressee_amount;
    }
    if (addressee_due_date) {
        data.sec13_data.addressee_due_date = addressee_due_date.getTime();
    }
    if (did_police_attend_scene) {
        data.sec13_data.did_police_attend_scene = did_police_attend_scene;
    }
    if (ref_or_report_num) {
        data.sec13_data.ref_or_report_num = ref_or_report_num;
    }
    if (officer_name) {
        data.sec13_data.officer_name = officer_name;
    }
    if (officer_station) {
        data.sec13_data.officer_station = officer_station;
    }
    if (collision_reported_to_police_station) {
        data.sec13_data.collision_reported_to_police_station = collision_reported_to_police_station;
    }
    if (have_charges_been_laid) {
        data.sec13_data.have_charges_been_laid = have_charges_been_laid;
    }
    if (nature_of_charges) {
        data.sec13_data.nature_of_charges = nature_of_charges;
    }
    if (who_laid_charges) {
        data.sec13_data.who_laid_charges = who_laid_charges;
    }
    if (who_were_nature_charges_laid_against) {
        data.sec13_data.who_were_nature_charges_laid_against = who_were_nature_charges_laid_against;
    }
    //sec14_data
    if (consequence) {
        data.sec14_data.consequence = consequence;
    }
    if (likelihood) {
        data.sec14_data.likelihood = likelihood;
    }
    if (risk_rating) {
        data.sec14_data.risk_rating = risk_rating;
    }
    //sec15_data
    if (distribution_list) {
        data.sec15_data.distribution_list = distribution_list.map(mapIncidentPersonDetails);
    }

    console.log(data)

    btn.text("Saving...").disabled();
    neonBinding.events.emit(this.path + "create", toJS(data)).then(res => {
        console.log("res", res)
        onSaved && onSaved(res);
        infoDialog.open("Record successfully saved.");
        infoDialog.close(2000);
        this.props.close();
    }).finally(() => {
        btn.text("Save").enabled();
    });
};