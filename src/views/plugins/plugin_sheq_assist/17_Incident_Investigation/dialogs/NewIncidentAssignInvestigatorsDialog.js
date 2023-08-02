import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';
import {ClearableInput, Clickable, ProfileField} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import {NavButtons} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';

import style from "./NewIncidentAssignInvestigatorsDialog.lazy.css";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewIncidentAssignInvestigatorsDialog";
    title = "Assign Investigator(s)";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/17_Incident_Investigation/";

    @observable
    state = {
        lists: {
            category_list: ['Safety', 'Health', 'Environment', 'Quality', 'Financial', 'Food Safety', 'Audit / Non-Conformance'].map(value => {
                return {value, text: value, checked: false};
            }),
            sub_category_list: ['IOD (Injury On Duty)', 'Damage', 'Occupational Health', 'Security'].map(value => {
                return {value, text: value, checked: false};
            }),
//            type: [{value: "Incident", text: "Incident", checked: false}, {value: "Accident", text: "Accident", checked: false}],
            type: ['Alcohol Testing', 'Arson', 'Assault', 'Fatality', 'Final Product', 'First Aid Injury', 'Forensic', 'Nearmiss', 'Irreversible Diagnosed Occupational Disease', 'Lost Time Injury', 'Medical Treatment Injury', 'Noise Induced Hearing Loss', 'Restricted Work Injury', 'Rreversible Diagnosed Occupational Disease', 'Structure', 'Vandalism', 'Vehicle', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            secondary_type_list: ['Alcohol Testing', 'Arson', 'Assault', 'Fatality', 'Final Product', 'First Aid Injury', 'Forensic', 'Nearmiss', 'Irreversible Diagnosed Occupational Disease', 'Lost Time Injury', 'Medical Treatment Injury', 'Noise Induced Hearing Loss', 'Restricted Work Injury', 'Rreversible Diagnosed Occupational Disease', 'Structure', 'Vandalism', 'Vehicle', 'Other'].map(value => {
                return {value, label: value};
            })
        }
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    
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
            if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
                infoDialog.open('Investigation Team is required');
                return;
            }
            if (!form.isValid('investigation_due_date')) {
                infoDialog.open('Investigation Due Date is required');
                return;
            }
        }
        
        return true;
    }
    
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
        if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
            infoDialog.open('Investigation Team is required');
            return;
        }
        if (!form.isValid('investigation_due_date')) {
            infoDialog.open('Investigation Due Date is required');
            return;
        }
        
        const {
            category_list, short_desc,
            sub_category_list,
            type,
            secondary_type_list,
            investigation_team_list, investigation_due_date
        } = form.data;
        
        const data = {
            
        };
        
        if(this.classification) {
            data.classification = {
            };
            
            //1
            if(toJS(this.classification.sec1_data.category_list) !== toJS(category_list.map(v => isString(v) ? v : v.value))) {
                data.classification.sec1_data = {
                    category_list: toJS(category_list.map(v => isString(v) ? v : v.value))
                };
            }
            if(this.classification.sec1_data.short_desc !== short_desc) {
                if(!data.classification.sec1_data) {
                    data.classification.sec1_data = {};
                }
                data.classification.sec1_data.short_desc = short_desc;
            }
            
            //2
            if(toJS(this.classification.sec2_data.sub_category_list) !== toJS(sub_category_list.map(v => isString(v) ? v : v.value))) {
                data.classification.sec2_data = {
                    sub_category_list: sub_category_list.map(v => isString(v) ? v : v.value)
                };
            }
            
            //3
            if(this.classification.sec3_data.type !== type) {
                data.classification.sec3_data = {
                    type
                };
            }
            
            //4
            if(toJS(this.classification.sec4_data.secondary_type_list) !== toJS(secondary_type_list.map(v => isString(v) ? v : v.value))) {
                data.classification.sec4_data = {
                    secondary_type_list: secondary_type_list.map(v => isString(v) ? v : v.value)
                };
            }
            
            //5
            if(toJS(this.classification.sec5_data.investigation_team_list.map(v => v.id)) !== toJS(investigation_team_list.map(v => v.id || v.employee.id))) {
                data.classification.sec5_data = {
                    investigation_team_list: investigation_team_list.map(v => {
                        if(v.employee) {
                            const {id, data, fname, lname} = v.employee;
                            return {id, fname: fname || data.fname, lname: lname || data.lname};
                        } else {
                            return toJS(v);
                        }
                    })
                };
            }
            if(this.classification.sec5_data.investigation_due_date !== investigation_due_date.getTime()) {
                if(!data.classification.sec5_data) {
                    data.classification.sec5_data = {};
                }
                data.classification.sec5_data.investigation_due_date = investigation_due_date.getTime();
            }
            if(this.investigation) {
                if(this.investigation.sec1_data.investigation_due_date !== investigation_due_date.getTime()) {
                    data.investigation = {
                        sec1_data: {investigation_due_date: investigation_due_date.getTime()}
                    };
                }
            }
        } else {
            data.classification = {
                sec1_data: {},
                sec2_data: {},
                sec3_data: {},
                sec4_data: {},
                sec5_data: {}
            };
        
            //sec1_data
            if(category_list) {
                data.classification.sec1_data.category_list = category_list.map(v => isString(v) ? v : v.value);
            }
            if(short_desc) {
                data.classification.sec1_data.short_desc = short_desc;
            }
            //sec2_data
            if(sub_category_list) {
                data.classification.sec2_data.sub_category_list = sub_category_list.map(v => isString(v) ? v : v.value);
            }
            //sec3_data
            if(type) {
                data.classification.sec3_data.type = type;
            }
            //sec4_data
            if(secondary_type_list) {
                data.classification.sec4_data.secondary_type_list = secondary_type_list.map(v => isString(v) ? v : v.value);
            }
            //sec5_data
            if(investigation_team_list) {
                data.classification.sec5_data.investigation_team_list = investigation_team_list.map((v) => {
                    if(v.employee) {
                        const {id, data, fname, lname} = v.employee;
                        return {id, fname: fname || data.fname, lname: lname || data.lname};
                    } else {
                        return toJS(v);
                    }
                });
            }
            data.classification.sec5_data.investigation_due_date = investigation_due_date.getTime();
            if(this.investigation) {
                if(this.investigation.sec1_data.investigation_due_date !== investigation_due_date.getTime()) {
                    data.investigation = {
                        sec1_data: {investigation_due_date: investigation_due_date.getTime()}
                    };
                }
            }
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "classification", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });   
    }
    
    get classification() {
        return this.props.state.item.data.classification;
    }
    
    get investigation() {
        return this.props.state.item.data.investigation;
    }
    
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, status,
                    classification,
                    investigation,
                    sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data, 
                    sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data
                }
            }
        } = this;
//        sec1_data: {category_list, short_desc},//1
//        sec2_data: {sub_category_list},//2
//        sec3_data: {type},//3
//        sec4_data: {secondary_type_list},//4
        
        console.log('=', item)
        
        if(classification) {
            sec1_data = classification.sec1_data || sec1_data;
            sec2_data = classification.sec2_data || sec2_data;
            sec3_data = classification.sec3_data || sec3_data;
            sec4_data = classification.sec4_data || sec4_data;
        }
        
        let investigation_team_list = null;
        let investigation_due_date = null;
        if(investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
            investigation_team_list = [...investigation.sec1_data.investigation_team_list, null];
        } else if(classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
            investigation_team_list = [...classification.sec5_data.investigation_team_list, null];
        }
        if(investigation && investigation.sec1_data && investigation.sec1_data.investigation_due_date) {
            investigation_due_date = investigation.sec1_data.investigation_due_date;
        } else if(classification && classification.sec5_data && classification.sec5_data.investigation_due_date) {
            investigation_due_date = classification.sec5_data.investigation_due_date;
        }
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row sec1_data active">
                    <label>
                        Incident Summary 
                        <Clickable idx={0} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField name="incident_num" title="Incident No." value={id} className="col-lg-6"/>
                        <ProfileField name="type" title="Type" value={sec3_data && sec3_data.type} className="col-lg-6"/>
                        <ProfileField name="incident_date" title="Date Incident Occurred" value={sec9_data && sec9_data.incident_date} type="date" className="col-lg-6"/>
                        <ProfileField name="date_reported" title="Date Incident Reported" value={sec7_data && sec7_data.date_reported} type="date" className="col-lg-6"/>
                        <ProfileField name="category_list" title="Category" value={sec1_data && sec1_data.category_list && sec1_data.category_list.join(', ')} className="col-lg-12"/>
                        <ProfileField name="short_desc" title="Short Description" value={sec1_data && sec1_data.short_desc} className="col-lg-12"/>
                        <ProfileField name="exact_location" title="Location" value={sec9_data && sec9_data.exact_location} className="col-lg-12"/>
                    </div>
                    <NavButtons idx={0} onNext={onFormNext}/>
                </div>
                <div className="row sec1_data">
                    <label className="">
                        1. Incident Category (Required) 
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="category_list" type="checkbox" placeholder="Incident Category" defaultValue={sec1_data.category_list} vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.category_list} returnValue/>
                        <ClearableInput name="short_desc" type="textarea" placeholder="Short Description" defaultValue={sec1_data.short_desc} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec2_data">
                    <label>
                        2. Incident Sub-Category (Optional)
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="sub_category_list" type="checkbox" placeholder="Sub-Category (Optional)" defaultValue={sec2_data.sub_category_list} vertical={2} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.sub_category_list} returnValue/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec3_data">
                    <label>
                        3. Incident Type (Required) 
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="type" type="radio" placeholder="Incident Type" defaultValue={sec3_data.type} className="col-lg-12 form-control" vertical={2} onChange={this.form.onChange} values={this.state.lists.type}/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec4_data">
                    <label>
                        4. Secondary Incident Type (Optional) 
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="secondary_type_list" type="select_multi" placeholder="Secondary Incident Type..." defaultValue={sec4_data.secondary_type_list} vertical={2} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.secondary_type_list} returnValue add/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec2_data">
                    <label>
                        5. Investigation Team
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <NewEmployeeListTable name="investigation_team_list" defaultValue={investigation_team_list} className="w-full-calc-add-10 -margin-l-10" onChange={this.form.onChange}/>
                        <ClearableInput name="investigation_due_date" type="date" placeholder="Investigation Due Date..." defaultValue={Dates.parse(investigation_due_date)} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={5} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default NewDialog;
