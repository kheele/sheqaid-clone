import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import style from "./ProfileSWPDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileSWPDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Written Safe Work Procedure";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        
    };
    
    constructor(props) {
        super(props);
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
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row col-lg-6 min-h-760">
                    <div className="row sec-group">
                        <ProfileField name="category" type="select" placeholder="Category" value={category} required className="col-lg-12"/>
                        <ProfileField name="work_task" type="text" placeholder="Work Task" value={work_task} required className="col-lg-12"/>
                        
                        <ProfileField name="date_created" type="date" placeholder="Date Created" value={date_created} required className="col-lg-12"/>
                        <ProfileField name="location" type="select" placeholder="Area activity takes place" value={location} required className="col-lg-12"/>
                        <ProfileField name="department" type="select" placeholder="Department activity takes place" value={department} renderer={v => v.name} required className="col-lg-12"/>
        
                        <ProfileField name="person_approving_procedure" type="select" placeholder="Person Approving Procedure" value={person_approving_procedure} renderer={v => (v.lname || v.data.lname) + ' ' + (v.fname || v.data.fname)} required className="col-lg-12"/>
                        <ProfileField name="to_be_reviewed_before" type="date" placeholder="To Be Reviewed Before" value={to_be_reviewed_before} required className="col-lg-12"/>
        
                        <ProfileField name="sign_sheet_notes" type="textarea" placeholder="Notes for Sign Sheet" value={sign_sheet_notes} required className="col-lg-12"/>
                    </div>
                </div>
                <div className="row col-lg-6 h-760 pull-right">
                    <ProfileField name="photo" type="file" placeholder="Reference Photo" value={photo} className="col-lg-12 w-full h-full"/>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List Potential Hazards and Possible Causes</label>
                    <div className="row sec-group">
                        <NewPotentialHazardAndPossibleCauseListTable name="potential_hazard_and_possible_cause_list" defaultValue={potential_hazard_and_possible_cause_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List PPE Required</label>
                    <div className="row sec-group">
                        <NewPPERequiredListTable name="ppe_required_list" defaultValue={ppe_required_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Steps To Perform This Task Safely</label>
                    <div className="row sec-group">
                        <NewStepsToPerformTaskListTable name="steps_to_perform_task_list" defaultValue={steps_to_perform_task_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Additional Notes at the end of <b>Potential Hazards</b></label>
                    <div className="row sec-group">
                        <ProfileField name="notes" type="textarea" value={notes} className="col-lg-12"/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Training Requirements and Reference Information</label>
                    <div className="row sec-group">
                        <NewTrainingRequirementListTable name="training_requirement_list" defaultValue={training_requirement_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>List of Names To Appear On WSWP Sign Sheet</label>
                    <div className="row sec-group">
                        <NewSignSheetListTable name="sign_sheet_name_list" defaultValue={sign_sheet_name_list || []}/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

@observer
class ANewListTable extends ATableSavable {
    @observable
    selfState = {
        
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-20"><span>{n + 1}</span></div>
            <div className="td padding-l-0 padding-r-0">{item.text}</div>
        </TRow>;
    }

    render() {
        return (<Table className="w-full padding-0 margin-0 min-h-130">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td padding-l-0 padding-r-0">{this.title}</div>
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
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {id, data, fname, lname} = item.employee;
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-20"><span>{n + 1}</span></div>
            <div className="td padding-l-0 padding-r-0">{(lname || data.lname) + ' ' + (fname || data.fname)}</div>
        </TRow>;
    }

    render() {
        return (<Table className="w-full padding-0 margin-0 min-h-130">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td padding-l-0 padding-r-0">Employee</div>
            </THead>
            <TBody ref="body" title="Names To Appear On WSWP Sign Sheet" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}
@observer
class NewPotentialHazardAndPossibleCauseListTable extends ATableSavable {
    @observable
    selfState = {
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-20"><span>{n + 1}</span></div>
            <div className="td">{item.hazard}</div>
            <div className="td">{item.cause}</div>
            <div className="td fixed-flex min-w-190 padding-l-0 padding-r-0">{item.rating}</div>
        </TRow>;
    }

    render() {
        return (<Table className="w-full padding-0 margin-0 min-h-130">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td">Potential Hazard</div>
                <div className="td">Possible Cause</div>
                <div className="td fixed-flex min-w-200 padding-l-0 padding-r-0">Risk Rating</div>
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

export default ProfileDialog;
