// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {
    ClearableInput,
    ClickableHumanBody,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';
// </editor-fold>
import style from "./NewIncidentQuickDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewIncidentQuickDialog";
    title = "Quick Incident";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/17_Incident_Investigation/quick/";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            type: ['Nearmiss', 'First Aid', 'Medical', 'Accident'].map(value => {
                return {value, text: value, checked: false};
            }),
            severity: ['Working / At Work', 'Medical Examination'].map(value => {
                return {value, text: value, checked: false};
            }),
            nature_of_injury_list: ["Abrasions", "Amputation", "Asphyxiation", "Burns (Chemical Burns)", "Burns (Hot Liquids)", "Burns (Hot Surfaces)",
                    "Contusion (Bruises)", "Electrical Shock", "Foreign Object In Eye", "Fracture", "Incision (Knives / Glass Cuts)", "Lacerations (Ragged Etched Wounds)",
                    "No Visible Injury", "Poisoning", "Puncture Wound", "Snake Spitting", "Snake Bite", "Sprains", "Strain", "Unconscious",
                    "Other Injuries (Specify)"].map(value => {
                return {value, text: value, checked: false};
            }),
            bodily_injury_location_list: ["Abdomen", "Ankle(Left)", "Ankle(Right)", "Arm(Left)", "Arm(Right)", "Chest",
                    "Ear/Hearing(Left)", "Ear/Hearing(Right)", "Elbow(Left)", "Elbow(Right)", "Eye(Left)", "Eye(Right)",
                    "Foot/Toe(s)(Left)", "Foot/Toe(s)(Right)", "Forearm(Left)", "Forearm(Right)",
                    "Hand/Finger(s)(Left)", "Hand/Finger(s)(Right)", "Head/Face", "Knee(Left)", "Knee(Right)",
                    "Leg(Left)", "Leg(Right)", "Mouth", "Neck", "Nose", "Pelvis", "Pubis",
                    "Shoulder(Left)", "Shoulder(Right)", "Thigh(Left)", "Thigh(Right)", "Wrist(Left)", "Wrist(Right)",

                    "Back", "Internal Organs", "Hips", "Respiratory", "Trunk",
                    "Other Injuries (Specify)"].map(value => {
                return {value, text: value, checked: false};
            }),
            injury_mechanism_list: ["Animals (All excl snakes)", "Assault", "Caught between or under (Crushed/Amputated)", "Caught In (Pinch & Nip Points)", "Contact With Chemicals",
                    "Contact With Electricity", "Contact With Flames", "Contact With High Temperature", /*"Contact With ...",*/ "Contact With Hot Surfaces",
                    "Contact With Noise", /*"Contact With ..."*/, "Contact With Sharp Object - Other", "Drowning", /*"...",*/,
                    "Falling Into", "Falling Object", /*"...",*/, "Handling (Lifting Or Pushing)", "Slipping",
                    /*"...",*/, "Struck Against (Running Or Bumping Into)", "Struck By Moving Object", /*"...",*/ "Vehicle",
                    "Other Or Multiple Mechanisms (Specify)"].map(value => {
                return {value, text: value, checked: false};
            }),
            gender: ['Male', 'Female', 'Other'].map(value => {
                return {value, label: value}
            }),
            is_vehicle_incident: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            })
        }
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.onHumanBodyPartsAdded = this.onHumanBodyPartsAdded.bind(this);
        this.onHumanBodyPartsRemoved = this.onHumanBodyPartsRemoved.bind(this);

        this.form = new Form();
        this.form.addChangeOne("bodily_injury_location_list", this.onChangeBodilyInjuryLocationList.bind(this));
        this.form.addChangeOne("is_vehicle_incident", this.onChangeIsVehicleIncident.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeBodilyInjuryLocationList(el, val) {
        const {bodily_injury_location_list_pic} = this.refs;
        bodily_injury_location_list_pic.setSelectedItems(val || []);
    }
    
    onHumanBodyPartsAdded(val) {
        const item = this.state.lists.bodily_injury_location_list.find(({value}) => value === val);
        item && (item.checked = true);
    }
    
    onHumanBodyPartsRemoved(val) {
        const item = this.state.lists.bodily_injury_location_list.find(({value}) => value === val);
        item && (item.checked = false);
    }

    onChangeIsVehicleIncident(el, val) {
        const {
            driver_details_sec: driver_details_sec_ref,
            vehicle_details_sec: vehicle_details_sec_ref,
        } = this.refs;
        if(val) {
            if(val === 'Yes') {
                driver_details_sec_ref.show();
                vehicle_details_sec_ref.show();
            } else {
                driver_details_sec_ref.hide();
                vehicle_details_sec_ref.hide();
            }
        } else {
            driver_details_sec_ref.hide();
            vehicle_details_sec_ref.hide();
        }
    }
    // </editor-fold>
 
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('category_list') || form.get('category_list').isEmpty()) {
                infoDialog.open('Incident Category is required');
                return;
            }
        }
        if(idx === 3) {
            if (!form.isValid('type')) {
                infoDialog.open('Incident Type is required');
                return;
            }
        }
        if(idx === 5) {
            if (!form.isValid('person_involved_list') || form.get('person_involved_list').isEmpty()) {
                infoDialog.open('Person(s) Involved in the Incident are/is required');
                return;
            }
        }
        if(idx === 6) {
            if (!form.isValid('person_reporting')) {
                infoDialog.open('Person Reporting the Incident is required');
                return;
            }
        }
        if(idx === 7) {
            if (!form.isValid('person_reported_to')) {
                infoDialog.open('Person Reported To is required');
                return;
            }
        }
        if(idx === 11) {
//            if (!form.isValid('person_injured')) {
//                infoDialog.open('Person Injured is required');
//                return;
//            }
//            if (!form.isValid('nature_of_injury_list') || form.get('nature_of_injury_list').isEmpty()) {
//                infoDialog.open('Nature Of Injury is required');
//                return;
//            }
//            if (!form.isValid('bodily_injury_location_list') || form.get('bodily_injury_location_list').isEmpty()) {
//                infoDialog.open('Bodily Injury Location (Part(s) Of Body Injured) is required');
//                return;
//            }
//            if (!form.isValid('injury_mechanism_list') || form.get('injury_mechanism_list').isEmpty()) {
//                infoDialog.open('Injury Mechanism (Direct Cause Of Injury) is required');
//                return;
//            }
        }
        if(idx === 12) {
            if (form.get('test_undertaken') === 'Yes') {
                //TODO: further validation is necessory
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        if (!form.isValid('category_list') || form.get('category_list').isEmpty()) {
            infoDialog.open('Incident Category is required');
            return;
        }
        if (!form.isValid('type')) {
            infoDialog.open('Incident Type is required');
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
        
        const {
            site, project, client, 
            short_desc,
            type,
            person_reporting,
            date_reported, time_reported,
            incident_date, incident_time, exact_location,
            person_injured, nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list,
            //13
            is_vehicle_incident,
            driver, driver_dob, driver_gender, email, phone,
            vehicle_make, vehicle_reg_num
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
        
        if(client) {
            if(client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        if(project) {
            if(project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
            } else {
                data.project = project;
            }
        }
        if(site) {
            if(site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
            } else {
                data.site = site;
            }
        }  
        
        //sec1_data
        if(short_desc) {
            data.sec1_data.short_desc = short_desc;
        }
        //sec2_data
        //sec3_data
        if(type) {
            data.sec3_data.type = type;
        }
        //sec4_data
        //sec5_data
        //sec6_data
        if(person_reporting) {
            const {id = null, data: _data, fname, lname} = person_reporting;
            data.sec6_data.person_reporting = {id, fname: fname || _data.fname, lname: lname || _data.lname};
        }
        //sec7_data
        if(date_reported) {
            data.sec7_data.date_reported = date_reported.getTime();
        }
        if(time_reported) {
            data.sec7_data.time_reported = time_reported;
        }
        //sec8_data
        //sec9_data
        if(incident_date) {
            data.sec9_data.incident_date = incident_date.getTime();
        }
        if(incident_time) {
            data.sec9_data.incident_time = incident_time;
        }
        if(exact_location) {
            data.sec9_data.exact_location = exact_location;
        }
        //sec10_data
        //sec11_data
        if(person_injured) {
            const {id = null, data: _data, fname, lname} = person_injured;
            data.sec11_data.person_injured = {id, fname: fname || _data.fname, lname: lname || _data.lname};
        }
        if(nature_of_injury_list) {
            data.sec11_data.nature_of_injury_list = nature_of_injury_list.map(v => {
                if(isString(v)) {
                    return v;
                } else {
                    return v.value;
                }
            });
        }
        if(bodily_injury_location_list) {
            data.sec11_data.bodily_injury_location_list = bodily_injury_location_list.map(v => {
                if(isString(v)) {
                    return v;
                } else {
                    return v.value;
                }
            });
        }
        if(injury_mechanism_list) {
            data.sec11_data.injury_mechanism_list = injury_mechanism_list.map(v => {
                if(isString(v)) {
                    return v;
                } else {
                    return v.value;
                }
            });
        }
        //sec12_data
        //sec13_data
        if(is_vehicle_incident) {
            data.sec13_data.is_vehicle_incident = is_vehicle_incident;
        }
        if(driver) {
            const {id = null, data: _data, fname, lname} = driver;
            data.sec13_data.driver = {id, fname: fname || _data.fname, lname: lname || _data.lname};
        }
        if(driver_dob) {
            data.sec13_data.driver_dob = driver_dob.getTime();
        }
        if(driver_gender) {
            data.sec13_data.driver_gender = driver_gender;
        }
        if(email) {
            data.sec13_data.email = email;
        }
        if(phone) {
            data.sec13_data.phone = phone;
        }
        
        if(vehicle_make) {
            data.sec13_data.vehicle_make = vehicle_make;
        }
        if(vehicle_reg_num) {
            data.sec13_data.vehicle_reg_num = vehicle_reg_num;
        }
        //sec14_data
        //sec15_data
        
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
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    active
                    rendered 
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={1}
                    title="Step 1" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="incident_date" type="date" placeholder="Date Incident Occurred..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="incident_time" type="time" placeholder="Time Incident Occurred..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="date_reported" type="date" placeholder="Date Reported..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="time_reported" type="time" placeholder="Time Reported..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="exact_location" type="textarea" placeholder="Exact Location" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="short_desc" type="textarea" placeholder="Short Description" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="Step 2" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <SelectEmployeeInput name="person_reporting" placeholder="Person Reporting The Incident..." className="col-lg-12 form-control" onChange={this.form.onChange} showOtherPerson/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="Step 3" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="type" type="radio" placeholder="Incident Type" className="col-lg-12 form-control" vertical={2} onChange={this.form.onChange} values={this.state.lists.type}/>
                    <ClearableInput name="severity" type="radio" placeholder="Severity" className="col-lg-12 form-control" vertical={2} onChange={this.form.onChange} values={this.state.lists.severity}/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="Step 4" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <SelectEmployeeInput ref="person_injured" name="person_injured" placeholder="Person Injured..." className="col-lg-12 form-control" onChange={this.form.onChange} showOtherPerson/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="Step 5" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="bodily_injury_location_list" type="checkbox" vertical={3} placeholder="Part(s) Of Body Injured..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.bodily_injury_location_list} returnValue/>
                    <ClickableHumanBody ref="bodily_injury_location_list_pic" onAdded={this.onHumanBodyPartsAdded} onRemoved={this.onHumanBodyPartsRemoved}/>
                    <ClearableInput name="injury_mechanism_list" type="checkbox" vertical={2} placeholder="Cause(s) Of Injury..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.injury_mechanism_list} returnValue/>
                </Row>
                <Row 
                    rendered 
                    idx={6}
                    title="Step 6" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="is_vehicle_incident" type="radio" placeholder="A Motor Vehicle Incident?" className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.is_vehicle_incident}/>
                    <SelectEmployeeInput name="driver" placeholder="Driver Details..." className="col-lg-12 form-control" onChange={this.form.onChange} showOtherPerson/>
                    <ClearableInput name="email" type="email" placeholder="Email Address" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="phone" type="text" placeholder="Phone No." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="vehicle_make" type="text" placeholder="Vehicle/Trailer Make" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="vehicle_reg_num" type="text" placeholder="Registration No." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;
