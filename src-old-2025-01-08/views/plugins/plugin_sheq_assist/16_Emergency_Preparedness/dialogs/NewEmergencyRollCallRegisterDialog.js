import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Button, ClearableInput, SelectDepartmentInput, SelectEmployeeInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewEmergencyRollCallRegisterDialog.lazy.css";

@observer
class NewEmergencyRollCallRegisterDialog extends ANewDialog {
    pageKey = "NewEmergencyRollCallRegisterDialog";
    title = "Create Emergency Roll Call Attendance Register";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-roll-call/";

    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('department')) {
            infoDialog.open('Department is required');
            return;
        }
        if (!form.isValid('division')) {
            infoDialog.open('Division is required');
            return;
        }
        if (!form.isValid('location')) {
            infoDialog.open('Location is required');
            return;
        }
        if (!form.isValid('floor')) {
            infoDialog.open('Floor is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('fire_warden_name')) {
            infoDialog.open('Fire Warden/Fighter Name is required');
            return;
        }
        if (!form.isValid('emergency_roll_call_register_list')) {
            infoDialog.open('Emergency Roll Call Attendance Register is required');
            return;
        }

        const {department, division, location, floor, date, fire_warden_name, emergency_roll_call_register_list} = form.data;
        const data = {division, location, floor, date: date.getTime(), fire_warden_name};
        if(department) {
            const {id, name, data: _data} = department;
            data.department = {id, name: name || _data.name};
        }
        data.emergency_roll_call_register_list = emergency_roll_call_register_list.map(val => {
            console.log(val)
            const {employee} = val;
            if(employee.id) {
                val.employee = {id: val.employee.id, fname: val.employee.data.fname, lname: val.employee.data.lname};
            }
            return val; 
        });
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <SelectDepartmentInput name="department" placeholder="Department..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="division" type="text" placeholder="Division" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="location" type="text" placeholder="Location" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="floor" type="text" placeholder="Floor" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <ClearableInput name="date" type="date" placeholder="Date" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="fire_warden_name" type="text" placeholder="Fire Warden/Fighter Name" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group warning-row">
                        <p>In the event of disaster, use this form to account for your employees at your Evacuation Roll Call Site.
                            Keep this form near you at all times or place where the form is visible and easily accessible should an evacuation occur.</p> 
                    </div>
                </div>
                <div className="row">
                    <label>Emergency Roll Call Attendance Register</label>
                    <NewEmergencyRollCallRegisterTable ref="table" name="emergency_roll_call_register_list" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewEmergencyRollCallRegisterTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
            list: [
                {value: 'present', checked: false}, 
                {value: 'missing', checked: false}, 
                {value: 'not_at_work', checked: false}, 
                {value: 'injured', checked: false}, 
                {value: 'unresponsive', checked: false}, 
                {value: 'room_or_office', checked: false}
            ]
        }
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            const {employee} = item;
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td"><span>{employee.id ? (employee.data.fname + ' ' + employee.data.lname) : employee}</span></div>
		<div className="td fixed-flex min-w-220"><span>{item.contacts}</span></div>
		<div className="td fixed-flex td-calc"><span>{item.status === 'present' ? 'Yes' : 'No'}</span></div>
		<div className="td fixed-flex td-calc"><span>{item.status === 'missing' ? 'Yes' : 'No'}</span></div>
		<div className="td fixed-flex td-calc"><span>{item.status === 'not_at_work' ? 'Yes' : 'No'}</span></div>
		<div className="td fixed-flex td-calc"><span>{item.status === 'injured' ? 'Yes' : 'No'}</span></div>
		<div className="td fixed-flex td-calc"><span>{item.status === 'unresponsive' ? 'Yes' : 'No'}</span></div>
		<div className="td fixed-flex td-calc"><span>{item.status === 'room_or_office' ? 'Yes' : 'No'}</span></div>                
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right margin-l-0 margin-t-5 w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new">
		<div className="td">
                    <SelectEmployeeInput ref={this.onSetRef} name="employee" placeholder="Select..." required className="form-control" onChange={this.onChange}/>
                </div>
		<div className="td fixed-flex min-w-220">
                    <ClearableInput ref={this.onSetRef} name="contacts" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td td-options fixed-flex min-w-245">
                    <ClearableInput ref={this.onSetRef} name="status" type="radio" placeholder="" required isClearable={false} className="form-control" onChange={this.onChange} values={this.selfState.lists.list}/>
		</div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right margin-l-0 margin-t-5 w-40" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        return (<Table className="w-full padding-0 margin-0">
            <THead className="align-left">
                <div className="td">Employee Name</div>
		<div className="td fixed-flex min-w-220">Contacts</div>
                
                <div className="td td-tr fixed-flex min-w-245">
                    <div className="td text-center">Risk Rating Without Controls</div>
                    <div className="td td-tr">
                        <div className="td td-calc td-rotate"><span>Present</span></div>
                        <div className="td td-calc td-rotate"><span>Missing</span></div>
                        <div className="td td-calc td-rotate"><span>Not At Work</span></div>
                        <div className="td td-calc td-rotate"><span>Injured</span></div>
                        <div className="td td-calc td-rotate"><span>Unresponsive</span></div>
                        <div className="td td-calc td-rotate"><span>Room / Office</span></div>
                    </div>
                </div>
                <div className="td fixed-flex min-w-60 padding-0"></div>
            </THead>
            <TBody ref="body" title="Emergency Roll Call Attendance Register" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewEmergencyRollCallRegisterDialog;
