import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Button, ClearableInput, SelectEmployeeInput} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewEmergencyDrillDialog.lazy.css";

@observer
class NewEmergencyDrillDialog extends ANewDialog {
    pageKey = "NewEmergencyDrillDialog";
    title = "Create Emergency Drill";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/drill/";

    @observable
    state = {
        list: []
    };

    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('area')) {
            infoDialog.open('Area is required');
            return;
        }
        if (!form.isValid('manager_or_supervisor')) {
            infoDialog.open('Manager / Supervisor is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('team_member_list')) {
            infoDialog.open('Team Members is required');
            return;
        }

        const {area, manager_or_supervisor: {id, data: {fname, lname}}, date, team_member_list} = form.data;
        const data = {area, manager_or_supervisor: {id, fname, lname}, date: date.getTime()};
        data.team_member_list = team_member_list.map(val => val.id);
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(e => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="area" type="text" placeholder="Area" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectEmployeeInput name="manager_or_supervisor" type="select" placeholder="Manager / Supervisor..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date" type="date" placeholder="Date..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <ul>
                        <li>In case of Fire / High FDI - Phone/Call Drivers & Teams</li>
                        <li>Give clear message what the situation is</li>
                        <li>Evacuate an area immediately (Record Time to evacuate)</li>
                        <li>Gather at assembly point or demarcation area</li>
                        <li>Ensure all employees are accounted for</li>
                        <li>Stay calm at all times</li>
                        <li>Call fire emergency services hook emergency pump & go to filling point</li>
                        <li>Other employees awaiting further instructions</li>
                        <li>Report to Management as soon as possible</li>
                        <li>Wait for further instructions</li>
                    </ul>
                </div>
                <div className="row">
                    <label>Team Members</label>
                    <NewAttendanceRegisterTable ref="table" name="team_member_list" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewAttendanceRegisterTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
            check_in: [
                {value: 'Check In', checked: false}
            ],
            check_out: [
                {value: 'Check Out', checked: false}
            ]
        }
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td"><span>{item.fname}</span></div>
		<div className="td"><span>{item.lname}</span></div>
		<div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new">
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="fname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="lname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">First Name</div>
		<div className="td">Last Name</div>
                <div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Team Members" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewEmergencyDrillDialog;
