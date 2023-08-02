// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {Row} from 'components/FormComponents';

import {EmployeeFromSelectWrapper, NewAttendanceTable, RadioWrapper} from './AttendanceComponents';

import style from "./EditAttendanceDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditAttendanceDialog";
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
        const {form, item: {data: old_data}} = this;
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
        
        const data = {};
        
        if(!isSupervisor) {
            const {supervisor: {id, data: {fname, lname}}} = team.data;
            data.supervisor = {id, fname, lname};
            data.team = {id: team.id, name: team.data.name};
            
            ShouldUpdate.checkClient(data, old_data, client);
            ShouldUpdate.checkProject(data, old_data, project);
            ShouldUpdate.checkSite(data, old_data, site);
            
            ShouldUpdate.checkObjectToJS(data, old_data, team, 'team');
            if(data.team) {
                
            }
        }
        
        ShouldUpdate.checkDate_deprecated(data, old_data, date, 'date');
        ShouldUpdate.check(data, old_data, day, 'day');
        
        ShouldUpdate.checkSignature(data, old_data, supervisor_signature, 'supervisor_signature');
        ShouldUpdate.checkSignature(data, old_data, manager_signature, 'manager_signature');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            if(!res || res === "ERROR") {
                infoDialog.open("An error occurred. Please try again.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                this.props.close();
            }
            infoDialog.close(2000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    date, 
                    date_split, 
                    day,
                    attendance_list,
                    attendance_list_keys,
                    team,
                    supervisor,
                    supervisor_signature, 
                    manager_signature,
                    client, project, site, client_id, project_id, site_id
                }
            }
        } = this;
        
        const {isSupervisor} = storage.is;
        
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
                    <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>}
                <Row 
                    active={isSupervisor}
                    rendered 
                    idx={1}
                    title="1. Date / Day Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput ref="date" name="date" type="date" placeholder="Date..." defaultValue={date} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <RadioWrapper ref="day" state={this.state} name="day" placeholder="Day" className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.day}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Department/Team & Attendance Details" 
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack} 
                >
                    {!isSupervisor && <ClearableInput name="employees_from" type="radio" placeholder="Employee From" vertical className="col-lg-6 pull-left-3 form-control" values={this.state.lists.employees_from} onChange={this.form.onChange}/>}
                    {!isSupervisor && <EmployeeFromSelectWrapper state={this.state} defaultValue={team} onChange={this.form.onChange}/>}
                    <NewAttendanceTable ref="newAttendanceTable" name="attendance_list" state={this.state} onOpenScreening={this.onOpenScreening} onChange={this.form.onChange}/>
                    <hr className="pull-left margin-0 margin-t-10 margin-b-10"/>
                    <ClearableInput name="supervisor_signature" type="signature" defaultValue={supervisor_signature} placeholder="Supervisor Signature" className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="manager_signature" type="signature" defaultValue={manager_signature} placeholder="Manager Signature" className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default EditDialog;
