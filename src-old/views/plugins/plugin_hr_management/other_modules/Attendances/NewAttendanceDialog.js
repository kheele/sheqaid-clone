// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';
import {Dates} from '../../../../../utils/Utils';

import {ANewDialog} from '../../../../../components/dialogs';
import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from '../../../../../components/inputs';
import {Row} from '../../../../../components/FormComponents';

import NewScreeningDialog from '../../../plugin_extra/__A_COVID_Management/dialogs/NewScreeningDialog.js';

import {EmployeeFromSelectWrapper, NewAttendanceTable, RadioWrapper} from './AttendanceComponents';

import style from "./NewAttendanceDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewAttendanceDialog";
    className = "FormAttendanceDialog";
    title = "Attendance";

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
    path = "plugin_sheq_assist/employees/attendance/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            day: Array.from(Dates.weekDaysStr.values()).map(text => {
                text = text.substring(0, 3);
                return {text, value: text, checked: false};
            }),
            employees_from: ["Department", "Team"].map(text => {
                return {text, value: text, checked: false};
            })
        },
        day: null,
        department: null,
        team: null,
        employees_from: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.onOpenScreening = this.onOpenScreening.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("employees_from", this.onChangeEmployeesFrom.bind(this));
        this.form.addChangeOne("date", this.onChangeDate.bind(this));
        this.form.addChangeOne("department", this.onChangeDepartment.bind(this));
        this.form.addChangeOne("team", this.onChangeTeam.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        const {loggedUser} = storage;
        const {isSupervisor} = storage.is;
        if(isSupervisor) {
            const {current_team} = loggedUser.user.data;
            this.state.team = current_team;
            const {execWhen} = this.props;
            execWhen(() => this.refs.newAttendanceTable).then(newAttendanceTable => {
                console.log('team', toJS(current_team))
                newAttendanceTable.team = current_team;
            });
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeEmployeesFrom(el, val) {
        this.state.employees_from = val;
    }
    
    onChangeDepartment(el, val) {
        this.state.department = val;
        const {execWhen} = this.props;
        execWhen(() => this.refs.newAttendanceTable).then(newAttendanceTable => {
            if(val) {
                console.log('department', toJS(val))
                newAttendanceTable.department = val;
            }
        });
    }
    
    onChangeTeam(el, val) {
        this.state.team = val;
        const {execWhen} = this.props;
        execWhen(() => this.refs.newAttendanceTable).then(newAttendanceTable => {
            if(val) {
                console.log('team', toJS(val))
                newAttendanceTable.team = val;
            }
        });
    }

    onChangeDate(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.day).then(() => {
            if(val) {
                this.state.day = val.getWeekday().substring(0, 3);
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onOpenScreening">
    onOpenScreening(evt, btn) {
        const {item, onComplete} = btn.props;
        this.refs.newScreeningDialog.extraProp('showOnlyTable', true).open(item.employee).then(res => {
            onComplete(item, res);
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        const {isSupervisor} = storage.is;
        if(!isSupervisor && idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            if (!form.isValid('project')) {
                infoDialog.open('Project is required');
                return;
            }
            if (!form.isValid('site')) {
                infoDialog.open('Site is required');
                return;
            }
        }
        if(!isSupervisor && idx === 1) {
            if (!form.isValid('date')) {
                infoDialog.open('Date is required');
                return;
            }
            if (!form.isValid('day')) {
                infoDialog.open('Day is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isSupervisor} = storage.is;

        if(!isSupervisor) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            if (!form.isValid('project')) {
                infoDialog.open('Project is required');
                return;
            }
            if (!form.isValid('site')) {
                infoDialog.open('Site is required');
                return;
            }
        }
        
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('day')) {
            infoDialog.open('Day is required');
            return;
        }
        
        if(!isSupervisor && !form.isValid('team')) {
            infoDialog.open('Team is required');
            return;
        }
        
        if(isSupervisor && !form.isValid('supervisor_signature')) {
            infoDialog.open('Supervisor Signature is required');
            return;
        }
        
        const {
            site, project, client, 
            date, day,
            team,
            supervisor_signature, manager_signature,
            attendance_list
        } = form.data;
        const data = { 
            date: date.getTime(), day,
            attendance_list: attendance_list.map(v => {
                const {id, data: {fname, lname}} = v.employee;
                v.employee = {id, fname, lname};
                if(v.time_in) {
                    v.time_in = v.time_in.getTime();
                }
                if(v.time_out) {
                    v.time_out = v.time_out.getTime();
                }
                if(v.signature) {
                    v.signature = JSON.stringify(v.signature);
                }
                return v;
            }),
            attendance_list_keys: attendance_list.map(v => v.employee.id)
        };
        
        if(isSupervisor) {
            const {
                selected: {selectedClient, selectedProject, selectedSite}, 
                loggedUser: {user: {id, data: {fname, lname, current_team}}}
            } = storage;
            data.supervisor = {id, fname, lname};
            data.team = {id: current_team.id, name: current_team.data.name};
            data.client = {id: selectedClient.id, name: selectedClient.data.name};
            data.project = {id: selectedProject.id, name: selectedProject.data.name};
            data.site = {id: selectedSite.id, name: selectedSite.data.name};
        } else {
            const {supervisor: {id, data: {fname, lname}}} = team.data;
            data.supervisor = {id, fname, lname};
            data.team = {id: team.id, name: team.data.name};
            data.client = {id: client.id, name: client.data.name};
            data.project = {id: project.id, name: project.data.name};
            data.site = {id: site.id, name: site.data.name};
        }
        
        if(supervisor_signature) {
            data.supervisor_signature = JSON.stringify(supervisor_signature.slice());
        }
        if(manager_signature) {
            data.manager_signature = JSON.stringify(manager_signature.slice());
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(employee_res => {
            console.log("res", employee_res)
            onSaved && onSaved(employee_res);
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
        const {isSupervisor} = storage.is;
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {!isSupervisor && <Row 
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
                </Row>}
                <Row 
                    active={isSupervisor}
                    rendered 
                    idx={1}
                    title="1. Date / Day Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={!isSupervisor && onFormBack} 
                >
                    <ClearableInput ref="date" name="date" type="date" placeholder="Date..." defaultValue={new Date()} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <RadioWrapper ref="day" state={this.state} name="day" placeholder="Day" className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.day}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Attendance Details" 
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack} 
                >
                    {!isSupervisor && <ClearableInput name="employees_from" type="radio" placeholder="Employee From" vertical className="col-lg-6 pull-left-3 form-control" values={this.state.lists.employees_from} onChange={this.form.onChange}/>}
                    {!isSupervisor && <EmployeeFromSelectWrapper state={this.state} onChange={this.form.onChange}/>}
                    <NewAttendanceTable ref="newAttendanceTable" name="attendance_list" state={this.state} onOpenScreening={this.onOpenScreening} onChange={this.form.onChange}/>
                    <hr className="pull-left margin-0 margin-t-10 margin-b-10"/>
                    <ClearableInput name="supervisor_signature" type="signature" placeholder="Supervisor Signature" className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="manager_signature" type="signature" placeholder="Manager Signature" className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                </Row>
            </div>
            <NewScreeningDialog ref="newScreeningDialog"/>
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;
