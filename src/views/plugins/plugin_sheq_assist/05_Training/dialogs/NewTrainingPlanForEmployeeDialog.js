// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
    ClearableInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTrainingCourseInput
} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewTrainingPlanForEmployeeDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewTrainingPlanForEmployeeDialog extends ANewDialog {
    pageKey = "NewTrainingPlanForEmployeeDialog";
    title = "Create Training Plan";
    className = 'ANewTableFormDialog';

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
    path = "plugin_sheq_assist/05_Trainings/training-plan/";
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            status: ['Completed', 'Awaiting Certificate', 'Incomplete', 'Progress', 'Upcoming'].map(text => {
                return {text, value: text, checked: false};
            })
        },
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));
        this.form.addChangeOne("job_position", this.onChangeJobPosition.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeEmployee">
    onChangeEmployee(val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.job_position).then(job_position_ref => {
            if(val) {
                let {optional_info} = val.data;
                if(optional_info && optional_info.job_position) {
                    const {job_position, job_position: {name, data}} = optional_info;
                    job_position_ref.onChange({label: name || data.name, value: job_position});
                }
            } else {
                job_position_ref.reset();
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeJobPosition">
    onChangeJobPosition(val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.course).then(course_ref => {
            if(val) {
                const {id} = val;
                const path = "plugin_sheq_assist/05_Trainings/training-registry/list/filter";
                const filterData = {job_position_list: [{id}]};
                const promise = neonBinding.events.emit(path, filterData).then(res => {
                    return res.map(value => {
                        const {name, unit_standard} = value.data;
                        return {label: name + (unit_standard ? (' (' + unit_standard + ')') : ''), value};
                    });
                });
                course_ref.onLoadList(promise);
            } else {
                course_ref.reset();
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('job_position')) {
                infoDialog.open('Job Position is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('course')) {
                infoDialog.open('Course is required');
                return;
            }
            if (!form.isValid('year')) {
                infoDialog.open('Year is required');
                return;
            }
            if (!form.isValid('status')) {
                infoDialog.open('Status is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        
        //1
        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('job_position')) {
            infoDialog.open('Job Position is required');
            return;
        }
        //2
        if (!form.isValid('course')) {
            infoDialog.open('Course is required');
            return;
        }
        if (!form.isValid('year')) {
            infoDialog.open('Year is required');
            return;
        }
        if (!form.isValid('status')) {
            infoDialog.open('Status is required');
            return;
        }

        const {
            employee: {id, data: {fname, lname}}, 
            job_position, course, 
            year, status, cost_center
        } = form.data;
        const data = {
            employee: {id, fname, lname}, 
            job_position: {id: job_position.id, name: job_position.data.name},
            course: {id: course.id, name: course.data.name}, 
            year, status
        };

        if(cost_center) {
            data.cost_center = cost_center;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create/employee", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
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
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {item} = this;
        let employeeDefault = null;
        if(item) {
            const {id, fname, lname, data} = item;
            employeeDefault = {label: (lname || data.lname) + ' ' + (fname || data.fname), value: item};
        }
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    active
                    rendered 
                    idx={1}
                    title="1. Employee Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <SelectEmployeeInput name="employee" placeholder="Employee..." required defaultValue={employeeDefault} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="col-lg-12 form-control" onChange={this.form.onChange} add={false}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Training Plan Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <SelectTrainingCourseInput name="course" placeholder="Course..." className="col-lg-12 form-control" onChange={this.form.onChange} add={false}/>
                    <ClearableInput name="year" type="number" placeholder="Year" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="status" type="radio" placeholder="Status" required vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.status} returnValue/>
                    <ClearableInput name="cost_center" type="text" placeholder="Cost Center" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default NewTrainingPlanForEmployeeDialog;
