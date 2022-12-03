// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {Dates} from '../../../../../utils/Utils';
import {getLocation} from '../../../../../utils/Maps';

import {ANewDialog, VerifyFaceDialog} from '../../../../../components/dialogs';
import {Button, ClearableInput} from '../../../../../components/inputs';
import {Row} from '../../../../../components/FormComponents';

import NewScreeningDialog from '../../../plugin_extra/__A_COVID_Management/dialogs/NewScreeningDialog.js';

import {RadioWrapper, RenderScreeningStatus, RenderTimeIn, RenderTimeOut} from './AttendanceComponents';

import style from "./NewAttendanceSelfDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewAttendanceSelfDialog";
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
            type: ['Biometric', 'Manual'].map(text => {
                return {text, value: text, checked: false};
            })
        },
        day: null,
        department: null,
        team: null,
        location: null,
        type: null,
        item: {
            time_in: null, 
            time_out: null,
            employee: null,
            signature: null
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.onOpenScreening = this.onOpenScreening.bind(this);
        this.onScreeningComplete = this.onScreeningComplete.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("date", this.onChangeDate.bind(this));
        this.form.addChangeOne("type", this.onChangeType.bind(this));
        this.form.addChangeOne("time_in", this.onChangeTimeIn.bind(this));
        this.form.addChangeOne("time_out", this.onChangeTimeOut.bind(this));
        this.form.addChangeOne("signature", this.onChangeSignature.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        const {loggedUser: {user}} = storage;
        this.state.item.employee = user;
        
        getLocation().then(res => {
            console.log('getLocation', res)
            this.state.location = res;
        }).catch(err => {
            console.error(err)
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeDate(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.day).then(() => {
            if(val) {
                this.state.day = val.getWeekday().substring(0, 3);
            }
        });
    }
    
    onChangeType(el, val) {
        this.state.type = val;
    }
    
    onChangeTimeIn(el, val) {
        if(val) {
            const d = new Date();
            this.state.item.time_in = d;
        } else {
            this.state.item.time_in = null;
        }
    }
    
    onChangeTimeOut(el, val) {
        if(val) {
            const d = new Date();
            this.state.item.time_out = d;
        } else {
            this.state.item.time_out = null;
        }
    }
    
    onChangeSignature(el, val) {
        this.state.item.signature = val;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onOpenScreening">
    onOpenScreening(evt, btn) {
        const {item} = this.state;
        this.refs.newScreeningDialog.extraProp('showOnlyTable', true).open(item.employee).then(res => {
            this.onScreeningComplete(item, res);
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onScreeningComplete">
    onScreeningComplete(item, res) {
        item.employee.data.covid_screening_list.push(res);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
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
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('day')) {
            infoDialog.open('Day is required');
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
        
        const {
            selected: {selectedClient, selectedProject, selectedSite}, 
            loggedUser: {user: {id, data: {fname, lname, current_team}}}
        } = storage;
        data.supervisor = {id, fname, lname};
        data.team = {id: current_team.id, name: current_team.data.name};
        data.client = {id: selectedClient.id, name: selectedClient.data.name};
        data.project = {id: selectedProject.id, name: selectedProject.data.name};
        data.site = {id: selectedSite.id, name: selectedSite.data.name};
        
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
        const {loggedUser: {user}} = storage;
        const {item} = this.state;
        
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    active
                    rendered 
                    idx={1}
                    title="1. Date / Day Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
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
                    <ClearableInput name='type' type="radio" placeholder='Use' vertical className="display-table hor-center w-280 form-control" onChange={this.form.onChange} values={this.state.lists.type} returnValue/>
                    <TimeSelection state={this.state} item={item} onChange={this.form.onChange}/>
                    <hr className="fixed-flex margin-b-15 min-w-20"/>
                    <Button className="btn btn-primary screening-b hor-center w-280 margin-t-10 margin-b-5 border-radius-20" onClick={this.onOpenScreening}>
                        <RenderScreeningStatus item={item}/> Screening
                    </Button>
                </Row>
            </div>
            <NewScreeningDialog ref="newScreeningDialog"/>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="TimeSelection">
@observer
class TimeSelection extends React.Component {
    
    constructor() {
        super();

        this.onVerify = this.onVerify.bind(this);
    }
    
    onVerify(onProcess) {
        this.refs.verifyFaceDialog.open().then(onProcess);
    }
    
    render() {
        const {state, state: {type}, item, onChange} = this.props;
        if(!type) return null;
        return <React.Fragment>
            <hr className="fixed-flex margin-b-15 min-w-20"/>
            <div className="flex padding-l-0 padding-t-5 padding-r-10 padding-b-5">
                <div className="flex">
                    <ButtonAction state={state} name='time_in' text="In" onChange={onChange} onVerify={this.onVerify}/>
                    <RenderTimeIn state={state} item={item}/>
                </div>
                <hr className="fixed-flex margin-l-5 margin-t-20 margin-r-5 min-w-10"/>
                <div className="flex">
                    <ButtonAction state={state} name='time_out' text="Out" onChange={onChange} onVerify={this.onVerify}/>
                    <RenderTimeOut state={state} item={item}/>
                </div>
            </div>
            <ClearableInput name='signature' type="signature" placeholder='Signature' className="display-table hor-center w-280 form-control" onChange={onChange}/>
            <VerifyFaceDialog ref="verifyFaceDialog"/>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonAction">
@observer
class ButtonAction extends React.Component {
    @observable state = {
        active: false
    };
    
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        const {state: {active}, props: {name, onChange, onVerify, state: {type}}} = this;
        
        const onProcess = (name, state, active, onChange) => {
            const val = state.active = !active;
            onChange && onChange(val, name, this);
        };
        if(type === 'Manual') {
            onProcess(name, this.state, active, onChange);
        } else {
            onVerify && onVerify(() => {
                onProcess(name, this.state, active, onChange);
            });
        }
    }
    
    @computed get icon() {
        const name = this.state.active ? "check" : "times";
        return <i className={"fa fa-" + name}/>;
    }

    render() {
        const {text} = this.props;
        return <Button className="btn btn-primary border-radius-20 ButtonAction h-35" onClick={this.onClick}>
            {this.icon} Time {text}
        </Button>;
    }
}
// </editor-fold>

export default NewDialog;
