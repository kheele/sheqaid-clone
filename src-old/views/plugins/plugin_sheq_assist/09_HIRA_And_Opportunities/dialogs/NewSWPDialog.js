import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';
import {onSelectLoadSWPCategories, onSelectLoadSWPLocations} from '../../../utils';

import {
    Button,
    ClearableInput,
    PhotoUploadButton,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectUserInput
} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewSWPDialog.lazy.css";

@observer
class NewSWPDialog extends ANewDialog {
    pageKey = "NewSWPDialog";
    title = "Create Written Safe Work Procedure";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/09_HIRA_And_Opportunities/swp/";

    @observable
    state = {
        lists: {
            category: [],
            location: []
        },
        loadedSelectLists: false
    };

    constructor() {
        super();
        
        this.form = new Form();
    }
    
    componentDidMount() {
        const loads = {category: onSelectLoadSWPCategories, location: onSelectLoadSWPLocations};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k].push(...res);
                this.state.lists[k] = this.state.lists[k].distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;
                 
        if (!form.isValid('category')) {
            infoDialog.open('Category is required');
            return;
        }
        if (!form.isValid('work_task')) {
            infoDialog.open('Work Task is required');
            return;
        }
        if (!form.isValid('person_approving_procedure')) {
            infoDialog.open('Person Approving Procedure is required');
            return;
        }
        
        const {
            category, work_task, date_created, location, department, person_approving_procedure, to_be_reviewed_before, sign_sheet_notes,
            photo,
            sign_sheet_name_list,
            potential_hazard_and_possible_cause_list, ppe_required_list, steps_to_perform_task_list,
            notes,
            training_requirement_list
        } = form.data;
        const data = {
            category, work_task, person_approving_procedure: {id: person_approving_procedure.id, fname: person_approving_procedure.data.fname, lname: person_approving_procedure.data.lname}
        };
        
        if(date_created) {
            data.date_created = date_created.getTime();
        }
        if(location) {
            data.location = location;
        }
        if(department) {
            if(department.id) {
                const {id, data: {name}} = department;
                data.department = {id, name};
            } else {
                data.department = department;
            }
        }
        if(to_be_reviewed_before) {
            data.to_be_reviewed_before = to_be_reviewed_before.getTime();
        }
        if(sign_sheet_notes) {
            data.sign_sheet_notes = sign_sheet_notes;
        }
        if(photo) {
            data.photo = photo.path;
        }
                
        if(sign_sheet_name_list) {
            data.sign_sheet_name_list = sign_sheet_name_list.map((v, n) => {
                const {id, data: {fname, lname}} = v.employee;
                return {employee:{id, fname, lname}};
            });
        }
        if(potential_hazard_and_possible_cause_list) {
            data.potential_hazard_and_possible_cause_list = potential_hazard_and_possible_cause_list;
        }
        if(ppe_required_list) {
            data.ppe_required_list = ppe_required_list;
        }
        if(steps_to_perform_task_list) {
            data.steps_to_perform_task_list = steps_to_perform_task_list;
        }
        
        if(notes) {
            data.notes = notes;
        }
        
        if(training_requirement_list) {
            data.training_requirement_list = training_requirement_list;
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
    
    get defaultPersonApprovingProcedure() {
        const {user, user: {data: {fname, lname}}} = storage.loggedUser;
        return {label: fname + " " + lname, value: user};
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row col-lg-6 min-h-425">
                    <div className="row sec-group">
                        <SelectWrapper state={this.state} name="category" placeholder="Category..." className="col-lg-12 form-control" onChange={this.form.onChange} values="category"/>
                        <ClearableInput name="work_task" type="text" placeholder="Work Task" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        
                        <ClearableInput name="date_created" type="date" placeholder="Date Created..." defaultValue={new Date()} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectWrapper state={this.state} name="location" placeholder="Area activity takes place" className="col-lg-12 form-control" onChange={this.form.onChange} values="location"/>
                        <SelectDepartmentInput name="department" placeholder="Department activity takes place..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        
                        <SelectUserInput name="person_approving_procedure" placeholder="Person Approving Procedure..." defaultValue={this.defaultPersonApprovingProcedure} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="to_be_reviewed_before" type="date" placeholder="To Be Reviewed Before..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
        
                        <ClearableInput name="sign_sheet_notes" type="textarea" placeholder="Notes for Sign Sheet" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-6 min-h-425 pull-right">
                    <label>Reference Photo</label>
                    <div className="row sec-group h-370">
                        <PhotoUploadButton name="photo" buttonTitle="Upload Reference Photo" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List Potential Hazards and Possible Causes</label>
                    <div className="row sec-group">
                        <NewPotentialHazardAndPossibleCauseListTable name="potential_hazard_and_possible_cause_list" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List PPE Required</label>
                    <div className="row sec-group">
                        <NewPPERequiredListTable name="ppe_required_list" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Steps To Perform This Task Safely</label>
                    <div className="row sec-group">
                        <NewStepsToPerformTaskListTable name="steps_to_perform_task_list" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Additional Notes at the end of <b>Potential Hazards</b></label>
                    <div className="row sec-group">
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Training Requirements and Reference Information</label>
                    <div className="row sec-group">
                        <NewTrainingRequirementListTable name="training_requirement_list" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List of Names To Appear On WSWP Sign Sheet</label>
                    <div className="row sec-group">
                        <NewSignSheetListTable name="sign_sheet_name_list" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

@observer
class SelectWrapper extends React.Component {
    
    render() {
        const {state, name, placeholder, className, onChange, values} = this.props;
        if(!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} required className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

@observer
class ANewListTable extends ATableSavable {
    @observable
    selfState = {
        
    };
    constructor(props) {
        super(props);
        this.insertAt = this.insertAt.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
		<div className="td"><span>{item.text}</span></div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new" className="padding-l-0">
                <div className="td fixed-flex min-w-20"></div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="text" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        return (<Table className="w-full padding-0 margin-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td">{this.title}</div>
                <div className="td fixed-flex min-w-70 padding-0"></div>
            </THead>
            <TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class NewSignSheetListTable extends ATableSavable {
    @observable
    selfState = {
    };
    constructor(props) {
        super(props);

        this.insertAt = this.insertAt.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            const {id, data: {fname, lname}} = item.employee;
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
		<div className="td"><span>{lname + ' ' + fname}</span></div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new" className="padding-l-0">
                <div className="td fixed-flex min-w-20"></div>
		<div className="td">
                    <SelectEmployeeInput ref={this.onSetRef} name="employee" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange}/>
                </div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        return (<Table className="w-full padding-0 margin-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td">Employee</div>
                <div className="td fixed-flex min-w-70 padding-0"></div>
            </THead>
            <TBody ref="body" title="Names To Appear On WSWP Sign Sheet" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class NewPotentialHazardAndPossibleCauseListTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
            ratings: [
                {text: 'Low', value: 'Low', checked: false}, 
                {text: 'Medium', value: 'Medium', checked: false}, 
                {text: 'High', value: 'High', checked: false}
            ]
        }
    };
    constructor(props) {
        super(props);
        
        this.onChangeInternal = this.onChangeInternal.bind(this);
        
        this.state.list = [
            {hazard: "Loose handle / rough handle", cause: "Poor maintanance or wear and tear", rating: "Medium"},
            {hazard: "Impact with other workers", cause: "Working too close together", rating: "High"},
            {hazard: "Underground obstacles", cause: "Preliminary investigation not done", rating: "High"},
            {hazard: "Strike with foot", cause: "Worker distracted by others", rating: "Medium"},
            {hazard: "Back or body strain", cause: "Incorrect posture, worker not suitable", rating: "Medium"},
            {hazard: "Respiratory impairment", cause: "Dust, fine, coarse, toxic", rating: "Medium"},
            {hazard: "Injury by spades in transit", cause: "Spades not secured to vehicle", rating: "Low"},
            {hazard: "Hand impact / repetitive strain", cause: "Ground too hard, worker not taking breaks", rating: "Medium"},
            {hazard: "Heat fatigue", cause: "Outdoor exposure", rating: "Medium"},
            null
        ];
        
        this.insertAt = this.insertAt.bind(this);
    }

    onChangeInternal() {
        const {name} = this.props;
        const list = toJS(this.list);
        this.onChange(list, name, this);
        this.props.onChange && this.props.onChange(list, name, this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
		<div className="td"><span>{item.hazard}</span></div>
		<div className="td"><span>{item.cause}</span></div>
		<div className="td fixed-flex min-w-295"><span>{item.rating}</span></div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new" className="padding-l-0">
                <div className="td fixed-flex min-w-20"></div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="hazard" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="cause" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-295">
                    <ClearableInput ref={this.onSetRef} name="rating" type="radio" required className="form-control" onChange={this.onChange} values={this.selfState.lists.ratings}/>
		</div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        return (<Table className="w-full padding-0 margin-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td">Potential Hazard</div>
                <div className="td">Possible Cause</div>
                <div className="td fixed-flex min-w-295">Risk Rating</div>
                <div className="td fixed-flex min-w-70 padding-0"></div>
            </THead>
            <TBody ref="body" title="Potential Hazards and Possible Causes" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class NewPPERequiredListTable extends ANewListTable {
    title = "PPE Required";
    constructor(props) {
        super(props);
    }
}

@observer
class NewStepsToPerformTaskListTable extends ANewListTable {
    title = "Steps To Perform This Task Safely";
    constructor(props) {
        super(props);
    }
}

@observer
class NewTrainingRequirementListTable extends ANewListTable {
    title = "Training Requirement and Reference Information";
    constructor(props) {
        super(props);
    }
}

export default NewSWPDialog;
