import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import style from "./ProfileEmergencyRollCallRegisterDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEmergencyRollCallRegisterDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Emergency Roll Call Attendance Register";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at,
                    department, division, location, floor, date, floor_warden_name, emergency_roll_call_register_list
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row sec-group">
                    <ProfileField name="department" value={department} placeholder="Department" required className="col-lg-3" onChange={this.form.onChange}/>
                    <ProfileField name="division" value={division} placeholder="Division" required className="col-lg-3" onChange={this.form.onChange}/>
                    <ProfileField name="location" value={location} placeholder="Location" required className="col-lg-3" onChange={this.form.onChange}/>
                    <ProfileField name="floor" value={floor} placeholder="Floor" required className="col-lg-3" onChange={this.form.onChange}/>
                </div>
                <div className="row sec-group">
                    <ProfileField name="date" type="date" value={date} placeholder="Date" required className="col-lg-6" onChange={this.form.onChange}/>
                    <ProfileField name="floor_warden_name" value={floor_warden_name} placeholder="Fire/Warden Name" required className="col-lg-6" onChange={this.form.onChange}/>
                </div>
                <div className="row sec-group warning-row">
                    <p className="text-center">In the event of disaster, use this form to account fpr your employees at your Evacuation Roll Call Site.
                        Keep this form near you at all times or place where the form is visible and easily accessible should an evacuation occur.</p> 
                </div>
                <div className="row">
                    <label>Emergency Roll Call Attendance Register</label>
                    <ListTable ref="table" name="emergency_roll_call_register_list" defaultValue={emergency_roll_call_register_list} onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }

}

@observer
class ListTable extends ATableSavable {
    @observable
    selfState = {
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td"><span>{item.employee.fname + ' ' + item.employee.lname}</span></div>
            <div className="td"><span>{item.contacts}</span></div>
            <div className="td fixed-flex min-w-80"><span className={item.status === 'present' ? 'Yes' : 'No'}>{item.status === 'present' ? 'Yes' : 'No'}</span></div>
            <div className="td fixed-flex min-w-80"><span className={item.status === 'missing' ? 'Yes' : 'No'}>{item.status === 'missing' ? 'Yes' : 'No'}</span></div>
            <div className="td fixed-flex min-w-100"><span className={item.status === 'not_at_work' ? 'Yes' : 'No'}>{item.status === 'not_at_work' ? 'Yes' : 'No'}</span></div>
            <div className="td fixed-flex min-w-80"><span className={item.status === 'injured' ? 'Yes' : 'No'}>{item.status === 'injured' ? 'Yes' : 'No'}</span></div>
            <div className="td fixed-flex min-w-110"><span className={item.status === 'unresponsive' ? 'Yes' : 'No'}>{item.status === 'unresponsive' ? 'Yes' : 'No'}</span></div>
            <div className="td fixed-flex min-w-110"><span className={item.status === 'room_or_office' ? 'Yes' : 'No'}>{item.status === 'room_or_office' ? 'Yes' : 'No'}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Employee Name</div>
		<div className="td">Contacts</div>
		<div className="td fixed-flex min-w-80">Present</div>
		<div className="td fixed-flex min-w-80">Missing</div>
		<div className="td fixed-flex min-w-100">Not At Work</div>
		<div className="td fixed-flex min-w-80">Injured</div>
		<div className="td fixed-flex min-w-110">Unresponsive</div>
		<div className="td fixed-flex min-w-110">Room / Office</div>
            </THead>
            <TBody ref="body" title="Emergency Roll Call Attendance Register" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
