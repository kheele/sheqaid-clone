// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';
import {Dates} from '../../../../../utils/Utils';

import {Button, ClearableInput, SelectDepartmentInput, SelectTeamInput} from '../../../../../components/inputs';
import {SelectTable, THead} from '../../../../../components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeFromSelectWrapper">
@observer
class EmployeeFromSelectWrapper extends React.Component {
    
    render() {
        const {state: {employees_from}, onChange} = this.props;
        if(!employees_from) return null;
        if(employees_from === "Department") {
            return <SelectDepartmentInput name="department" placeholder="Department..." className="col-lg-6 pull-left-3 form-control" onChange={onChange}/>;
        }
        if(employees_from === "Team") {
            return <SelectTeamInput name="team" placeholder="Team..." className="col-lg-6 pull-left-3 form-control" onChange={onChange}/>;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RadioWrapper">
@observer
class RadioWrapper extends React.Component {
    
    render() {
        const {state, name, placeholder, className, onChange, values} = this.props;
        const defaultValue = state[name];
        return <ClearableInput key={new Date().getTime()} name={name} type="radio" placeholder={placeholder} defaultValue={defaultValue} isEditable={false} horizontal className={className} onChange={onChange} values={values} returnValue/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderTimeIn">
@observer
class RenderTimeIn extends React.Component {
    render() {
        const {item} = this.props;
        const {time_in} = item;
        return <span>{time_in ? Dates.formatTimeExcSec(time_in) : '--:--'}</span>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderTimeOut">
@observer
class RenderTimeOut extends React.Component {
    render() {
        const {item} = this.props;
        const {time_out} = item;
        return <span>{time_out ? Dates.formatTimeExcSec(time_out) : '--:--'}</span>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderHrs">
@observer
class RenderHrs extends React.Component {
    render() {
        const {item} = this.props;
        const {time_in, time_out} = item;
        let hrs;
        if(time_out && time_in) {
            const {_data: {hours, minutes, seconds}} = time_out.durationPrev(time_in);
            if(hours > 0) {
                hrs = hours;
            }
            if(minutes > 0) {
                const mins = minutes;
                if(hrs) {
                    hrs += ":" + mins;
                } else {
                    hrs = "0:" + mins;
                }
            } else {
                if(hrs) {
                    hrs += ":00";
                } else {
                    hrs = "0:00";
                }
            }
            console.log('diff hrs', hrs)
        }
        return hrs || '--';
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderScreeningStatus">
@observer
class RenderScreeningStatus extends React.Component {
    
    @computed get has_screening() {
        const {item} = this.props;
        const {employee} = item;
        const {covid_screening_list = []} = employee.data;
        if(covid_screening_list.isEmpty()) {
            return false;
        }
        const has_screening = covid_screening_list.anyMatch(({id, data: {date}}) => {
            return new Date().equals(date);
        });
        return has_screening;
    }
    
    render() {
        return <i className={'fa fa-' + (this.has_screening ? 'check' : 'times')}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderAutomaticTD">
@observer
class RenderAutomaticTD extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }
    
    render() {
        const {isAutomatic} = this;
        const {type, name, item, item: {time_in, time_out}, n, onChange, values} = this.props;
        if(!isAutomatic) return null;
        if(type === "In") {
            return <div className="td fixed-flex min-w-130 td-time-in td-RenderAutomaticTD">
                <h6 className="xs-shown font-size-13">Time In</h6>
                <div className="flex">
                    <ClearableInput name={name} type="checkbox" isClearable={false} idx={n} onChange={onChange} values={values}/>
                    <RenderTimeIn item={item}/>
                </div>
            </div>;
        } else {
            return <div className="td fixed-flex min-w-130 td-time-out td-RenderAutomaticTD">
                <h6 className="xs-shown font-size-13">Time Out</h6>
                <div className="flex">
                    <ClearableInput name={name} type="checkbox" isClearable={false} idx={n} onChange={onChange} values={values}/>
                    <RenderTimeOut item={item}/>
                </div>
            </div>;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderNotAutomaticTD">
@observer
class RenderNotAutomaticTD extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }
    
    render() {
        const {isAutomatic} = this;
        const {type, name, item: {time_in, time_out}, n, onChange, values} = this.props;
        if(isAutomatic) return null;
        const defaultValueIn = time_in && Dates.formatTimeExcSec(time_in);
        const defaultValueOut = time_out && Dates.formatTimeExcSec(time_out);
        if(type === "In") {
            return <div className="td fixed-flex min-w-130 td-time-in td-RenderNotAutomaticTD">
                <h6 className="xs-shown font-size-13">Time In</h6>
                <ClearableInput name={name} type="time" idx={n} defaultValue={defaultValueIn} isClearable={false} onChange={onChange} className="h-30 margin-t-5 margin-b-5 form-control"/>
            </div>;
        } else {
            return <div className="td fixed-flex min-w-130 td-time-out td-RenderNotAutomaticTD">
                <h6 className="xs-shown font-size-13">Time Out</h6>
                <ClearableInput name={name} type="time" idx={n} defaultValue={defaultValueOut} isClearable={false} onChange={onChange} className="h-30 margin-t-5 margin-b-5 form-control"/>
            </div>;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderAutomaticTH">
@observer
class RenderAutomaticTH extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }
    
    render() {
        const {isAutomatic} = this;
        if(!isAutomatic) return null;
        return <React.Fragment>    
            <div className="td fixed-flex min-w-130">Time In</div>
            <div className="td fixed-flex min-w-130">Time Out</div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderNotAutomaticTH">
@observer
class RenderNotAutomaticTH extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }
    
    render() {
        const {isAutomatic} = this;
        if(isAutomatic) return null;
        return <React.Fragment>    
            <div className="td fixed-flex min-w-130">Time In</div>
            <div className="td fixed-flex min-w-130">Time Out</div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderItem">
@observer
class RenderItem extends React.Component {
    
    render() {
        const {
            readonly, attendanceItem,
            item, n, lists, state, onChange, onOpenScreening, onScreeningComplete
        } = this.props;
        
        let { 
            employee, employee: {
                id, data: {
                    created_at, fname, lname, optional_info = {}, 
                    client, 
                    project, 
                    site, 
                    client_id, project_id, site_id
                }
            },
            time_in, time_out, signature
        } = item;
        
        if(readonly) {
            return <React.Fragment key={n}>
                <div className="td">
                    <h6 className="xs-shown font-size-13">Employee</h6>
                    {lname + ' ' + fname}
                </div>
                <div className="td fixed-flex min-w-80 td-time-in td-RenderAutomaticTD">
                    <h6 className="xs-shown font-size-13">Time In</h6>
                    <RenderTimeIn item={item}/>
                </div>
                <div className="td fixed-flex min-w-80 td-time-out td-RenderAutomaticTD">
                    <h6 className="xs-shown font-size-13">Time Out</h6>
                    <RenderTimeOut item={item}/>
                </div>
                <div className="td fixed-flex min-w-120 padding-0">
                    <h6 className="xs-shown font-size-13">Signature</h6>
                    <img src={signature}/>
                </div>
            </React.Fragment>;
        } else {
            const name_time_in = "time_in" + n;
            const name_time_out = "time_out" + n;
            lists[name_time_in] = [
                {value: "In", text: "In", checked: !!time_in}
            ];
            lists[name_time_out] = [
                {value: "Out", text: "Out", checked: !!time_out}
            ];
            const options_time_in = lists[name_time_in];
            const options_time_out = lists[name_time_out];

            return <React.Fragment key={n}>
                <div className="td">
                    <h6 className="xs-shown font-size-13">Employee</h6>
                    {lname + ' ' + fname}
                </div>
                <RenderAutomaticTD state={state} type="In" name={name_time_in} item={item} n={n} onChange={onChange} values={options_time_in}/>
                <RenderAutomaticTD state={state} type="Out" name={name_time_out} item={item} n={n} onChange={onChange} values={options_time_out}/>
                <RenderNotAutomaticTD state={state} type="In" name={name_time_in} item={item} n={n} onChange={onChange}/>
                <RenderNotAutomaticTD state={state} type="Out" name={name_time_out} item={item} n={n} onChange={onChange}/>

                <div className="td fixed-flex min-w-100">
                    <h6 className="xs-shown font-size-13">Screening</h6>
                    <Button item={item} className="btn btn-primary border-radius-20 padding-0 padding-l-5 padding-r-5" onComplete={onScreeningComplete} onClick={onOpenScreening}>
                        <RenderScreeningStatus item={item}/> Screening
                    </Button>
                </div>
                <div className="td fixed-flex min-w-120 padding-0">
                    <h6 className="xs-shown font-size-13">Signature</h6>
                    <ClearableInput name={'signature_' + n} type="signature" defaultValue={signature} idx={n} className="w-full h-30 margin-t-5 margin-b-5 form-control" onChange={onChange}/>
                </div>
            </React.Fragment>;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewAttendanceTable">
@observer
class NewAttendanceTable extends React.Component {
    @observable
    state = {
        lists: {
            attendance_type: [
                {text: "Automatic", value: "Automatic", checked: false},
                {text: "Manual", value: "Manual", checked: false}
            ]
        },
        list: [],
        attendance_type: null,
        department: null,
        team: null
    };
	
    constructor(props) {
        super(props);
        
        const {readonly} = props;
        if(readonly) {
            const {item: {data: {attendance_list}}} = props;
            this.state.list = attendance_list;
        }
        
        this.onScreeningComplete = this.onScreeningComplete.bind(this);
        
        this.onChange = this.onChange.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("attendance_type", this.onChangeAttendanceType.bind(this));
    }
    
    onChangeAttendanceType(el, val) {
        this.state.attendance_type = val;
        this.state.list.forEach(v => {
            v.attendance_type = val;
        });
    }    
    
    @computed get isAutomatic() {
        const {attendance_type} = this.state;
        return attendance_type === "Automatic";
    }
    
    onScreeningComplete(item, res) {
        item.employee.data.covid_screening_list.push(res);
    }
	
    onChange(val, input_name, el) {
        const {isAutomatic} = this;
        const {name, onChange} = this.props;
        const {idx} = el.props;
        const item = this.state.list[idx];
        if(input_name.startsWith('time_in')) {
            if(val) {
                const d = new Date();
                if(!isAutomatic) {
                    const times = val.split(":");
                    d.setHours(parseInt(times[0]));
                    d.setMinutes(parseInt(times[1]));
                }
                item.time_in = d;
            } else {
                item.time_in = null;
            }
        } else if(input_name.startsWith('time_out')){
            if(val) {
                const d = new Date();
                if(!isAutomatic) {
                    const times = val.split(":");
                    d.setHours(parseInt(times[0]));
                    d.setMinutes(parseInt(times[1]));
                }
                item.time_out = d;
            } else {
                item.time_out = null;
            }
        } else if(input_name.startsWith('signature')){
            item.signature = val;
        }
        
        onChange && onChange(toJS(this.state.list), name, this);
    }
    
    set department(department) {
//        this.state.list = department.data.list.map(employee => {
//            return {employee, time_in: null, time_out: null, signature: null, attendance_type: null};
//        });
        this.state.department = department;
    }
    
    set team(team) {
        this.state.list = team.data.list.map(employee => {
            return {employee, time_in: null, time_out: null, signature: null, attendance_type: null};
        });
        this.state.team = team;
    }
    
    renderTHead() {
        const {readonly, item} = this.props;
        if(readonly) {
            return <THead>
                <div className="td">Employee</div>
                <div className="td fixed-flex min-w-80">Time In</div>
                <div className="td fixed-flex min-w-80">Time Out</div>
                <div className="td fixed-flex min-w-130 padding-l-0 padding-r-0">Signature</div>
            </THead>;
        }
        return <THead>
            <div className="td">Employee</div>
            <RenderAutomaticTH state={this.state}/>
            <RenderNotAutomaticTH state={this.state}/>
            <div className="td fixed-flex min-w-100">Screening</div>
            <div className="td fixed-flex min-w-130 padding-l-0 padding-r-0">Signature</div>
        </THead>;
    }
	
    renderItem(item, n, onClick) {
        const {readonly} = this.props;
        if(readonly) {
            return <RenderItem 
                readonly={readonly}
                attendanceItem={this.props.item} 
                n={n} 
                item={item}
            />;
        }
        return <RenderItem 
            item={item} 
            n={n} 
            lists={this.state.lists} 
            state={this.state} 
            onChange={this.onChange} 
            onOpenScreening={this.props.onOpenScreening}
            onScreeningComplete={this.onScreeningComplete}
        />;
    }

    render() {
        const {readonly} = this.props;
        let title, department, team, supervisor, list;
        
        if(readonly) {
            const {
                item: {
                    data: {
                        created_at,
                        date, 
                        date_split, 
                        day,
                        attendance_list,
                        attendance_list_keys,
                        department: _department,
                        team: _team,
                        supervisor: _supervisor,
                        supervisor_signature, 
                        manager_signature,
                        client, project, site, client_id, project_id, site_id
                    }
                }
            } = this.props;
            if(_department) {
                department = _department;
                title = "Department";
            }
            if(_team) {
                team = _team;
                title = "Team";
            }
            supervisor = _supervisor;
            list = attendance_list;
        } else {
            const {department: _department, team: _team} = this.state;
            if(!_department && !_team) return null;
            
            if(_department) {
                department = _department;
                title = "Department";
            }
            if(_team) {
                const {
                    data: {
                        supervisor: _supervisor, 
                        supervisor: {
                            data: {lname, fname}
                        }, 
                        name, 
                        list: _list
                    }
                } = _team;
                team = _team;
                title = "Team";
                supervisor = _supervisor;
                list = _list;
            }
        }
        
        title = department ? "Department" : "Team";
        
        const {data: {name}} = department || team;
        
        const renderSupervisor = supervisor => {
            const {data: {lname, fname}} = supervisor;
            return <div>
                <label>Supervisor</label>{lname + ' ' + fname}
            </div>;
        };
        
        return <React.Fragment>
            <div className="flex TeamDetials pull-left">
                <div>
                    <label>{title} Name</label>{name}
                </div>
                {supervisor && renderSupervisor(supervisor)}
                <div>
                    <label>No. of Members</label>{list.length}
                </div>
            </div>
            {!readonly && <ClearableInput ref="attendance_type" name="attendance_type" type="radio" vertical defaultValue="Automatic" placeholder="Attendance Type" horizontal isClearable={false} className="col-lg-7 pull-left-2_5 margin-b-10 form-control" onChange={this.form.onChange} values={this.state.lists.attendance_type}/>}
            <SelectTable ref="selectAttendtanceTable"
                replaceColsAll 
                name="list" 
                desc="Employees" 
                title="Attendtance List" 
                className="col-lg-12 no-padding h-auto SelectAttendtanceTable" 
                renderTHead={this.renderTHead} 
                renderItem={this.renderItem} 
                list={this.state.list}
            />
        </React.Fragment>;
    }
}
// </editor-fold>

export {
    EmployeeFromSelectWrapper,
    RadioWrapper,
    RenderTimeIn,
    RenderTimeOut,
    RenderHrs,
    RenderScreeningStatus,
    RenderAutomaticTD,
    RenderNotAutomaticTD,
    RenderAutomaticTH,
    RenderNotAutomaticTH,
    RenderItem,
    NewAttendanceTable
};
