import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {onSelectLoadSWPCategories, onSelectLoadSWPLocations} from 'views/plugins/utils';

import {Dates} from "utils/Utils";
import {
    Button,
    ClearableInput,
    PhotoUploadButton,
    SelectDepartmentInput,
    SelectEmployeeInput
} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {AEditDialog} from 'components/dialogs';

import style from "./EditSWPDialog.lazy.css";

@observer
class EditSWPDialog extends AEditDialog {
    pageKey = "EditSWPDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Written Safe Work Procedure";
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
            category, work_task
        };
        if(person_approving_procedure && person_approving_procedure.data) {
            const {id, data: {fname, lname}} = person_approving_procedure;
            data.person_approving_procedure = {id, fname, lname};
        }
        if(date_created) {
            data.date_created = date_created.getTime();
        }
        if(location) {
            data.location = location;
        }
        if(department && department.data) {
            const {id, data: {name}} = department;
            data.department = {id, name};
        }
        if(to_be_reviewed_before) {
            data.to_be_reviewed_before = to_be_reviewed_before.getTime();
        }
        if(sign_sheet_notes) {
            data.sign_sheet_notes = sign_sheet_notes;
        }
        if(photo && isString(photo.path)) {
            data.photo = photo.path;
        }
                
        if(sign_sheet_name_list) {
            data.sign_sheet_name_list = sign_sheet_name_list.map((v, n) => {
                const {id, data, fname, lname} = v.employee;
                return {employee:{id, fname: fname || data.fname, lname: lname || data.lname}};
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
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        let {
            props: {dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at,
                    category, work_task, date_created, location, department, person_approving_procedure, to_be_reviewed_before, sign_sheet_notes,
                    photo,
                    sign_sheet_name_list,
                    potential_hazard_and_possible_cause_list, ppe_required_list, steps_to_perform_task_list,
                    notes,
                    training_requirement_list
                }
            }
        } = this;
        
        if(department) {
            department = {label: department.name, value: department};
        }
        
        person_approving_procedure = {label: (person_approving_procedure.fname || person_approving_procedure.data.fname) + ' ' + (person_approving_procedure.lname || person_approving_procedure.data.lname), value: person_approving_procedure};
        
        console.log(this.item)
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row col-lg-6 min-h-425">
                    <div className="row sec-group">
                        <SelectWrapper state={this.state} name="category" placeholder="Category..." defaultValue={category} className="col-lg-12 form-control" onChange={this.form.onChange} values="category"/>
                        <ClearableInput name="work_task" type="text" placeholder="Work Task" defaultValue={work_task} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        
                        <ClearableInput name="date_created" type="date" placeholder="Date Created..." defaultValue={Dates.parse(date_created)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectWrapper state={this.state} name="location" placeholder="Area activity takes place" defaultValue={location} className="col-lg-12 form-control" onChange={this.form.onChange} values="location"/>
                        <SelectDepartmentInput name="department" placeholder="Department activity takes place..." defaultValue={department} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        
                        <SelectEmployeeInput name="person_approving_procedure" placeholder="Person Approving Procedure..." defaultValue={person_approving_procedure} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="to_be_reviewed_before" type="date" placeholder="To Be Reviewed Before..." defaultValue={Dates.parse(to_be_reviewed_before)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
        
                        <ClearableInput name="sign_sheet_notes" type="textarea" placeholder="Notes for Sign Sheet" defaultValue={sign_sheet_notes} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-6 min-h-425 pull-right">
                    <label>Reference Photo</label>
                    <div className="row sec-group h-370">
                        <PhotoUploadButton name="photo" buttonTitle="Upload Reference Photo" defaultValue={photo} className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List Potential Hazards and Possible Causes</label>
                    <div className="row sec-group">
                        <NewPotentialHazardAndPossibleCauseListTable name="potential_hazard_and_possible_cause_list" defaultValue={potential_hazard_and_possible_cause_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List PPE Required</label>
                    <div className="row sec-group">
                        <NewPPERequiredListTable name="ppe_required_list" defaultValue={ppe_required_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Steps To Perform This Task Safely</label>
                    <div className="row sec-group">
                        <NewStepsToPerformTaskListTable name="steps_to_perform_task_list" defaultValue={steps_to_perform_task_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Additional Notes at the end of <b>Potential Hazards</b></label>
                    <div className="row sec-group">
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Training Requirements and Reference Information</label>
                    <div className="row sec-group">
                        <NewTrainingRequirementListTable name="training_requirement_list" defaultValue={training_requirement_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List of Names To Appear On WSWP Sign Sheet</label>
                    <div className="row sec-group">
                        <NewSignSheetListTable name="sign_sheet_name_list" defaultValue={sign_sheet_name_list || []} onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

@observer
class SelectWrapper extends React.Component {
    
    render() {
        const {state, name, placeholder, defaultValue, className, onChange, values} = this.props;
        if(!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} defaultValue={defaultValue} required className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

@observer
class ANewListTable extends ATableSavable {
    @observable
    selfState = {
        
    };
    constructor(props) {
        super(props);
        
        this.state.list.push(null);
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

        this.state.list.push(null);
        
        this.insertAt = this.insertAt.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            const {id, data, fname, lname} = item.employee;
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
		<div className="td"><span>{(lname || data.lname) + ' ' + (fname || data.fname)}</span></div>
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
                    <SelectEmployeeInput ref={this.onSetRef} name="employee" placeholder="Type here..." required className="form-control" onChange={this.onChange}/>
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
        
        this.state.list.push(null);
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

export default EditSWPDialog;
