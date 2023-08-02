// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {ClearableInput, ProfileField, SelectEmployeeInput, SelectTeamInput} from '../../../../../components/inputs';
import {NewEmployeeListTable} from '../../../../../components/FormTableComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import style from "./NewOrganogramPersonDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewOrganogramPersonDialog extends ANewDialog {
    pageKey = "NewOrganogramPersonDialog";
    title = "Add Person To Organogram";

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
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            types: [{value: "Person", text: "Single Person", checked: false}, {value: "Team", text: "Team", checked: false}]
        },
        employee: null,
        employee_list: null,
        team: null,
        selectedType: null,
        employeeReportedTo: null
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.form = new Form();
        this.form.addChangeOne("type", this.onChangeType.bind(this));
        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));
        this.form.addChangeOne("employeeReportedTo", this.onChangeEmployeeReportedTo.bind(this));
    }
    // </editor-fold>

    onChangeType(el, val) {
        this.state.selectedType = val;
        this.onLoadTeam();
    }

    onChangeEmployee(el, val) {
        this.state.employee = val;
    }
    
    onChangeEmployeeReportedTo(el, val) {
        this.state.employeeReportedTo = val;
        this.onLoadTeam();
    }
    
    // <editor-fold defaultstate="collapsed" desc="onLoadTeam">
    onLoadTeam() {
        const {selectedType, employeeReportedTo} = this.state;
        if(selectedType === 'Team' && employeeReportedTo) {
            //team
//            this.state.employee_list = ;
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('type')) {
            infoDialog.open('Please select if you are adding a Person / Team');
            return;
        }
        if (form.get('type') === 'Person' && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (form.get('type') === 'Team') {
            if (!form.isValid('team') || (!form.isValid('employee_list') || form.get('employee_list').isEmpty())) {
                infoDialog.open('Select Team or Add at least one person');
                return;
            }
        }

        const {type, team, employee, employee_list, employeeReportedTo} = form.data;
        const data = {};
        if(team) {
            data.team = team;
        }
        if(employee) {
            data.employee = employee;
        }
        if(employee_list) {
            data.employee_list = employee_list.map(v => {
                const {id, data: {fname, lname}} = v.employee;
                return {id, fname, lname};
            });
        }
        if(employeeReportedTo) {
            data.employeeReportedTo = employeeReportedTo;
        }
        console.log(data)

        onSaved && onSaved(data);
        this.props.close();
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="selectedType">
    get selectedType() {
        const {item} = this;
        if(item) {
            const {employee, employee_list, team} = item;
            if(employee) {
                return "Person";
            } if(employee_list || team) {
                return "Team";
            } 
        }
        return null;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="defaultEmployeeList">
    get defaultEmployeeList() {
        const {item} = this;
        if(item) {
            console.log('defaultEmployeeList', item);
            const {employee_list, team} = item;
            if(employee_list) {
                return [...employee_list, null];
            } else if(team) {
                return [...team.data.list, null];
            }
        }
        return [null];
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="selectEmployee">
    get selectEmployee() {
        const {item} = this;
        if(item && item.employee) {
            const {id, data: {profile_pic, fname, lname}} = item.employee;
            return {label: fname + ' ' + lname, value: item.employee};
        }
        return null;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="selectEmployeeReportedTo">
    get selectEmployeeReportedTo() {
        const {item} = this;
        if(item && item.employeeReportedTo) {
            const {id, data: {profile_pic, fname, lname}} = item.employeeReportedTo;
            return {label: fname + ' ' + lname, value: item.employeeReportedTo};
        }
        return null;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {selectedType} = this.state;
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="type" type="radio" placeholder="Person / Team" defaultValue={this.selectedType} className="col-lg-10 pull-left-1 form-control" onChange={this.form.onChange} values={this.state.lists.types}/>
                    </div>
                </div>
                {selectedType && <div className="row">
                    <label>{selectedType}</label>
                    {selectedType === 'Person' && <div className="row sec-group">
                        <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.selectEmployee} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectedEmployeeWrapper state={this.state}/>
                    </div>}
                    {selectedType === 'Team' && <div className="row sec-group">
                        <SelectTeamInput name="team" placeholder="Team..." defaultValue={this.selectTeam} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <NewEmployeeListTable name="employee_list" defaultValue={this.defaultEmployeeList} disableOtherPerson onChange={this.form.onChange}/>
                    </div>}
                </div>}
                <div className="row">
                    <label>Report To</label>
                    <div className="row sec-group">
                        <SelectEmployeeInput name="employeeReportedTo" placeholder="Employee Reported To..." defaultValue={this.selectEmployeeReportedTo} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectedEmployeeReportedToWrapper state={this.state}/>
                    </div>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="SelectedEmployeeWrapper">
@observer
class SelectedEmployeeWrapper extends React.Component {
    
    render() {
        const {state: {employee}} = this.props;
        if(!employee) return null;
        const {id, data:{optional_info}} = employee;
        return <React.Fragment key={new Date().getTime()}>
            <ProfileField name="department" title="Department" value={optional_info && optional_info.department} renderer={v => v.name || v.data.name} className="col-lg-12"/>
            <ProfileField name="job_position" title="Job Position" value={optional_info && optional_info.job_position} renderer={v => v.name || v.data.name} className="col-lg-12"/>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectedEmployeeReportedToWrapper">
@observer
class SelectedEmployeeReportedToWrapper extends React.Component {
    
    render() {
        const {state: {employeeReportedTo}} = this.props;
        if(!employeeReportedTo) return null;
        const {id, data:{optional_info}} = employeeReportedTo;
        return <React.Fragment key={new Date().getTime()}>
            <ProfileField name="department" title="Department" value={optional_info && optional_info.department} renderer={v => v.name || v.data.name} className="col-lg-12"/>
            <ProfileField name="job_position" title="Job Position" value={optional_info && optional_info.job_position} renderer={v => v.name || v.data.name} className="col-lg-12"/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default NewOrganogramPersonDialog;
