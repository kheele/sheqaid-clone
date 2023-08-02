// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditTrainingPlanDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditTrainingPlanDialog extends AEditDialog {
    pageKey = "EditTrainingPlanDialog";
    title = "Edit Training Plan";

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
            select_employees: [
                {text: "1 Employee", value: "1Employee", checked: false}, 
                {text: "Job Position(s)", value: "JobPositions", checked: false}, 
                {text: "Course(s)", value: "Courses", checked: false}, 
                {text: "Year(s)", value: "Years", checked: false}
            ]
        },
        select_employees: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("select_employees", this.onChangeSelectEmployees.bind(this));
    }
    // </editor-fold>

    onChangeSelectEmployees(el, val) {
        this.state.select_employees = val;
    }
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {isConsultant} = storage.is;
        
        //1
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        
        //2
        if (!form.isValid('select_employees')) {
            infoDialog.open('One of these options:\n1. 1 Employee;\n2. Job Position(s);\n3. Course(s);\n1. Year(s)]\nis required');
            return;
        }
        if (form.get('select_employees') === "1Employee" && !form.isValid('employee')) {
            infoDialog.open('Please Select An Employee');
            return;
        }
        if (form.get('select_employees') === "JobPositions" && !form.isValid('job_position_list')) {
            infoDialog.open('At least 1 Job Position is required');
            return;
        }
        if (form.get('select_employees') === "Courses" && !form.isValid('course_or_module_list')) {
            infoDialog.open('At least 1 Course is required');
            return;
        }
        if (form.get('select_employees') === "Years" && !form.isValid('training_year_list')) {
            infoDialog.open('At least 1 Training Year is required');
            return;
        }
        
        const {
            //1
            client, project, site,
            //2
            employee, course_or_module_list, job_position_list, training_year_list,
            //3
            
        } = form.data;
        const data = {};
        
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
                
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)            
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
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
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    client, project, site,
                    list
                }
            }
        } = this;
        
        const {isConsultant, isNoProjects} = storage.is;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {!isNoProjects && <Row 
                    rendered  
                    active
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} showAll required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} showAll required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required showAll className={"col-lg-12 form-control"} onChange={this.form.onChange}/>
                </Row>}
                <Row 
                    rendered 
                    active={isNoProjects}
                    idx={1}
                    title="1. Training Plan & Employee(s)" 
                    onFormOpen={onFormOpen} 
                    onFormBack={!isNoProjects && onFormBack} 
                >
                    <ClearableInput name="select_employees" type="radio" placeholder="Select Per" required horizontal className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.select_employees}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default EditTrainingPlanDialog;
