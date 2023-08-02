import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates} from "utils/Utils";

import {Button, ClearableInput, ProfileField, ProofUploadButton} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewRiskAssessmentTrainingDialog.lazy.css";

@observer
class NewRiskAssessmentTrainingDialog extends ANewDialog {
    pageKey = "NewRiskAssessmentTrainingDialog";
    title = "Create Risk Assessment Training";
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
    path = "plugin_sheq_assist/employees/";
    @observable
    state = {
        lists: {
            type: [{text: "Normal Training", value: "Normal", checked: false}, {text: "Induction Training", value: "Induction", checked: false}],
            register_type: [
                {text: 'Upload Document', value: 'Upload', checked: false},
                {text: 'Add List', value: 'Type', checked: false}
            ]
        },
        type: null,
        register_type: null,
        training: null,
        trainer: null,
        employees: null
    };

    constructor(props) {
        super(props);
        
        this.state.type = this.props.dialog.props.type;

        this.onChangeTraining = this.onChangeTraining.bind(this);
        this.onChangeTrainer = this.onChangeTrainer.bind(this);
        this.onChangeEmployees = this.onChangeEmployees.bind(this);
        
        this.onLoadListTrainings = this.onLoadListTrainings.bind(this);
        this.onLoadListTrainers = this.onLoadListTrainers.bind(this);
        this.onLoadListEmployees = this.onLoadListEmployees.bind(this);
        
        this.form = new Form();
        
        this.onChangeType = this.onChangeType.bind(this);
        this.form.addChangeOne("type", this.onChangeType);

        this.onChangeRegisterType = this.onChangeRegisterType.bind(this);

        this.form.addChangeOne("register_type", this.onChangeRegisterType);
    }
    
    onChangeType(el, val) {
        this.state.type = val;
    }

    onChangeRegisterType(el, val) {
        this.state.register_type = val;
    }

    onLoadListTrainings() {
        return neonBinding.events.emit('plugin_sheq_assist/05_Trainings/training-matrix/list/search_by', {key: 'type', value: this.state.type});
    }
    
    onLoadListTrainers() {
        return neonBinding.events.emit('plugin_sheq_assist/employees/list');
    }
    
    onLoadListEmployees() {
        return neonBinding.events.emit('plugin_sheq_assist/employees/list');
    }
    
    onChangeTraining(){
        const {training} = this.state;
        this.refs.selectTrainingTable.setSelectedList(training).open().then(list => {
            this.state.training = list[0];
        });
    }
    
    onChangeTrainer(){
        const {trainer} = this.state;
        this.refs.selectTrainerTable.setSelectedList(trainer).open().then(list => {
            this.state.trainer = list[0];
        });
    }
    
    onChangeEmployees(){
        const {employees} = this.state;
        const list = employees ? employees.map(v => v.employee) : null;
        this.refs.selectEmployeeTable.setSelectedList(list).open().then(list => {
            this.state.employees = list.map(employee => {
                return {employee}
            });
        });
    }

    onSubmit(e, btn, onSaved) {
        const {form, state: {training, trainer, employees}} = this;

        if (!form.isValid('type')) {
            infoDialog.open('Training Type is required');
            return;
        }
        if (!form.isValid('time_or_duration')) {
            infoDialog.open('Time / Duration is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!training) {
            infoDialog.open('Training is required');
            return;
        }
        if (!trainer) {
            infoDialog.open('Trainer is required');
            return;
        }
        if (!form.isValid('register_type')) {
            infoDialog.open('Register Type is required');
            return;
        } else {
            if (form.get('register_type') === 'Upload' && !form.isValid('list_proof')) {
                infoDialog.open('Please Upload Training Register');
                return;
            } else if (form.get('register_type') === 'Type' && !employees) {
                infoDialog.open('Please Add Training Register');
                return;
            } else if (employees) {
                for(var n = 0; n < employees.length; n++){
                    const item = employees[n];
                    if(!item.signature) {
                        const {fname, lname} = item.employee.data;
                        infoDialog.open((fname + ' ' + lname) + ' does not have a signature provided');
                        return;
                    }
                }
            }
        }

        const {type, time_or_duration, date, register_type, list_proof} = form.data;
        const data = {
            type,
            training: {id: training.id, type: training.data.type, course_or_module: training.data.course_or_module, job_title: training.data.job_title}, 
            trainer: {id: trainer.id, fname: trainer.data.fname, lname: trainer.data.lname}, 
            time_or_duration, date: date.getTime()
        };

        if(register_type === 'Upload'){
            data.list_proof = list_proof.path;
        }
        if(register_type === 'Type'){
            data.list_table = employees.map(({signature, employee:{id, data: {created_at, fname, lname, id_num, employee_num, job_position, site}}}) => {
                return {signature: JSON.stringify(signature), employee: {id, fname, lname, id_num, employee_num, site}};
            });
        }
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
                        <ClearableInput name="type" type="radio" placeholder="Training Type" required defaultValue={this.state.type} className="col-lg-5 pull-left-3_5 form-control" onChange={this.form.onChange} values={this.state.lists.type}/>
                    </div>
                </div>
                {this.state.type && <React.Fragment>
                    <div className="row">
                        <div className="row sec-group">
                            <ClearableInput name="time_or_duration" type="text" placeholder="Time / Duration" required className="col-lg-3 pull-left-3 form-control" onChange={this.form.onChange}/>
                            <ClearableInput name="date" type="date" placeholder="Date" required defaultValue={new Date()} className="col-lg-3 pull-right-3 form-control" onChange={this.form.onChange}/>
                        </div>
                    </div>
                    <SelectTable ref="selectTrainingTable" isDialog replaceCols name="training" 
                        desc="Trainings" title="Select Training" 
                        className="col-lg-12 no-padding SelectTrainingTable" 
                        renderTHead={renderTHeadTraining} renderItem={renderItemTraining} 
                        onLoadList={this.onLoadListTrainings}
                        isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                    <SelectedTraining state={this.state} onChangeTraining={this.onChangeTraining} title="Select Training"/>
                    <SelectTable ref="selectTrainerTable" 
                        isDialog replaceCols name="trainer" 
                        desc="Trainers" title="Select Trainer" 
                        className="col-lg-12 no-padding SelectTrainerTable" 
                        renderTHead={renderTHeadTrainerOrEmployees} renderItem={renderItemTrainerOrEmployees} 
                        onLoadList={this.onLoadListTrainers}
                        isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                    <SelectedTrainer state={this.state} onChangeTrainer={this.onChangeTrainer} title="Select Trainer"/>
                    <div className="row row-register-list">
                        <label>Register List</label>
                        <div className="row sec-group">
                            <ClearableInput name="register_type" type="radio" placeholder="Register Type" className="col-lg-5 pull-left-3_5 form-control" onChange={this.form.onChange} values={this.state.lists.register_type}/>
                        </div>
                        <div className="row sec-group row-group-list">
                            {this.state.register_type === 'Upload' && <ProofUploadButton name="list_proof" className="col-lg-8 hor-center" onChange={this.form.onChange}/>}
                            {this.state.register_type === 'Type' && <React.Fragment>
                                    <SelectTable ref="selectEmployeeTable" 
                                            isDialog replaceCols name="list_table" 
                                            desc="Employees" title="Select Employees" 
                                            className="col-lg-12 no-padding SelectEmployeeTable" 
                                            renderTHead={renderTHeadTrainerOrEmployees} renderItem={renderItemTrainerOrEmployees} 
                                            onLoadList={this.onLoadListEmployees}
                                            isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                                    <SelectedEmployees state={this.state} onChangeEmployees={this.onChangeEmployees} title="Select Employees"/>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </React.Fragment>}
            </div>
        </div>);
    }
}

@observer
class SelectedTraining extends React.Component {
    
    render() {
        const {state: {training}, onChangeTraining, title} = this.props;
        console.log('training', training)
        if(!training) {
            return <div className="row SelectedTrainings">
                <div className="row sec-group">
                    <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeTraining}>Select Training...</Button>
                </div>
            </div>;
        } else {
            const {id, data: {
                    created_at, 
                    type, date_range, hr, job_desc,
                    allocation, job_title, course_or_module,
                    requirement, max_participants_per_course, training_standard, training_provider_requirement/*["Accredited", "Non-Accredited"]*/, training_frequency,
                    competency_evaluation, unit_standard, credits, nqf_level,
                    cost, certificate, certificate_expiration, status}} = training;
            return <div className="row SelectedTrainings">
                <div className="row sec-group">
                    <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeTraining}>Change Training...</Button>
                    <hr className="margin-r-10"/>
                </div>
                <label className="hor-center selected-training-title">Selected Training Details</label>
                <div className="row sec-group">
                    <ProfileField title="Training Type" value={type} className="col-lg-4"/>
                    <ProfileField title="Training Provider Requirement" value={training_provider_requirement} className="col-lg-4"/>
                    <ProfileField title="Start Date" value={Dates.formatDate(date_range.start)} className="col-lg-2"/>
                    <ProfileField title="End Date" value={Dates.formatDate(date_range.end)} className="col-lg-2"/>
                    
                    <ProfileField title="HR" value={hr} renderer={v => (v.fname + ' ' + v.lname)} className="col-lg-4"/>
                    <ProfileField title="Training Frequency" value={training_frequency} className="col-lg-4"/>
                    <ProfileField title="Requirement" value={requirement} className="col-lg-4"/>
                    <ProfileField title="Job Description" value={job_desc} className="col-lg-12"/>

                    <ProfileField title="Allocation" value={allocation} className="col-lg-4"/>
                    <ProfileField title="Job Title" value={job_title} className="col-lg-4"/>
                    <ProfileField title="Course" value={course_or_module} className="col-lg-4"/>
                </div>
            </div>;
        }
    }
}

@observer
class SelectedTrainer extends React.Component {
    
    render() {
        const {state: {trainer}, onChangeTrainer, title} = this.props;
        console.log('trainer', trainer)
        if(!trainer) {
            return <div className="row SelectedTrainers">
                <div className="row sec-group">
                    <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeTrainer}>Select Trainer...</Button>
                </div>
            </div>;
        } else {
            const {id, data: {created_at, fname, lname, id_num, passport_num, job_position}} = trainer;
            return <div className="row SelectedTrainers">
                <div className="row sec-group">
                    <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeTrainer}>Change Trainer...</Button>
                    <hr className="margin-r-10"/>
                </div>
                <label className="hor-center selected-trainer-title">Selected Trainer Details</label>
                <div className="row sec-group">
                    <ProfileField title="First Name" value={fname} className="col-lg-3"/>
                    <ProfileField title="Last Name" value={lname} className="col-lg-3"/>
                    <ProfileField title="Identification No." value={id_num} className="col-lg-3"/>
                    <ProfileField title="Passport No." value={passport_num} className="col-lg-3"/>
                </div>
            </div>;
        }
    }
}

@observer
class SelectedEmployees extends React.Component {

    constructor(props) {
        super(props);

        this.renderItemEmployees = renderItemEmployees.bind(this);
        
        this.form = new Form();
        
        this.onChangeSignature = this.onChangeSignature.bind(this);
        this.form.addChangeOne("signature", this.onChangeSignature);
    }
    
    onChangeSignature(el, val){
        const item = this.props.state.employees[el.props.idx];
        console.log(val, el, this.props.state.employees)
        if(val) {
            item.signature = val;
        } else {
            delete item.signature;
        }
    }
    
    render() {
        const {state: {employees}, onChangeEmployees, title} = this.props;
        console.log('employees', employees)
        if(!employees) {
            return <div className="row SelectedEmployees">
                <div className="row sec-group">
                    <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeEmployees}>Add Employee(s)...</Button>
                </div>
            </div>;
        } else {
            return <div className="row SelectedEmployees">
                <div className="row sec-group">
                    <Button className="hor-center btn btn-primary margin-t-10" onClick={onChangeEmployees}>Add / Change Employee(s)...</Button>
                    <hr/>
                </div>
                <label className="hor-center selected-employee-title">Selected Employees Details</label>
                <div className="row sec-group row-table">
                    <SelectTable ref="selectTable" replaceCols name="employee" 
                        desc="Employees" title={title} 
                        className="col-lg-12 margin-l-0 margin-r-10 no-padding" 
                        renderTHead={renderTHeadEmployees} renderItem={this.renderItemEmployees} 
                        list={employees}/>
                </div>
            </div>;
        }
    }
}

function renderTHeadTraining() {
    return <THead>
        <div className="td fixed-flex min-w-120">Date Created</div>
        <div className="td fixed-flex min-w-100">Status</div>
        <div className="td fixed-flex min-w-120">Accreditation</div>
        <div className="td">HR</div>
        <div className="td">Job Title</div>
        <div className="td">Course</div>
        <div className="td fixed-flex min-w-100">Requirement</div>
        <div className="td fixed-flex no-padding min-w-70"></div>
    </THead>;
}

function renderTHeadTrainerOrEmployees() {
    return <THead>
        <div className="td fixed-flex min-w-120">Date Created</div>
        <div className="td">Name</div>
        <div className="td">Job Position</div>
        <div className="td fixed-flex no-padding min-w-70"></div>
    </THead>;
}

function renderTHeadEmployees() {
    return <THead>
        <div className="td fixed-flex min-w-180">Employee No.</div>
        <div className="td">Last Name</div>
        <div className="td">First Name</div>
        <div className="td fixed-flex min-w-180">ID No.</div>
        <div className="td">Site</div>
        <div className="td">Signature</div>
        <div className="td fixed-flex padding-l-20 min-w-60"></div>
    </THead>;
}

function renderItemTraining(item, n){
    const {id, data: {created_at, status, training_provider_requirement, hr, job_title, course_or_module, requirement, certificate_expiration}} = item;
    return <React.Fragment key={id} className="tr-readonly">
        <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
        <div className="td fixed-flex min-w-100">{status}</div>
        <div className="td fixed-flex min-w-120">{training_provider_requirement}</div>
        <div className="td">{hr.fname + ' ' + hr.lname}</div>
        <div className="td">{job_title}</div>
        <div className="td">{course_or_module}</div>
        <div className="td fixed-flex min-w-100">{requirement}</div>
    </React.Fragment>;
}

function renderItemTrainerOrEmployees(item, n){
    const {id, data: {created_at, fname, lname, job_position}} = item;
    return <React.Fragment key={id} className="tr-readonly">
        <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
        <div className="td">{fname + ' ' + lname}</div>
        <div className="td">{job_position ? job_position.name : 'N/A'}</div>
    </React.Fragment>;
}

function renderItemEmployees(item, n){
    const {employee: {id, data: {created_at, fname, lname, id_num, employee_num, job_position, site}}} = item;
    return <React.Fragment key={id}>
        <div className="td fixed-flex min-w-180">{employee_num || 'N/A'}</div>
        <div className="td">{lname}</div>
        <div className="td">{fname}</div>
        <div className="td fixed-flex min-w-180">{id_num}</div>
        <div className="td">{site ? site.name : ''}</div>
        <div className="td"><ClearableInput idx={n} name="signature" type="signature" placeholder="Type here" required className="form-control" onChange={this.form.onChange}/></div>
    </React.Fragment>;
}

export default NewRiskAssessmentTrainingDialog;
