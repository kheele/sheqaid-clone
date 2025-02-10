// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';

import {Dates, execWhen} from 'utils/Utils';
import {Button, ClearableInput} from 'components/inputs';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {THead, TRow} from 'components/tables';

import ProfileScreeningDialog from './ProfileScreeningDialog';
import EditScreeningDialog from './EditScreeningDialog';

import ProfilePositiveDialog from "./ProfilePositiveDialog";
import EditPositiveDialog from "./EditPositiveDialog";

//import ProfileReturnToWorkDialog from "./ProfileReturnToWorkDialog";
//import EditReturnToWorkDialog from "./EditReturnToWorkDialog";
import ProfileVulnerableDialog from "./ProfileVulnerableDialog";
import EditVulnerableDialog from "./EditVulnerableDialog";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeScreeningList">
@observer
class EmployeeScreeningList extends React.Component {

    @observable
    state = {
        lists: {
            consent: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
            symptoms_status: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}]
        }
    };
    
    constructor(props) {
        super(props);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);

        this.form = new Form();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="consent" type="radio" placeholder="Consent" className="form-control fixed-flex min-w-265" onChange={onChange} values={this.state.lists.consent}/>
            <ClearableInput name="symptoms_status" type="radio" placeholder="Symptoms Present" className="form-control fixed-flex min-w-340" onChange={onChange} values={this.state.lists.symptoms_status}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        const {renderEmployee} = this.props;
        return <THead>
            {renderEmployee && <div className="td">Employee</div>}
            <div className="td fixed-flex min-w-110">Date</div>
            <div className="td fixed-flex min-w-120">Consent</div>
            <div className="td fixed-flex min-w-160">Symptoms Present</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const {renderEmployee} = this.props;
        const item = this.refs.root.list[n];
        const {id, data: {created_at, employee, date, consent, business_id, sex, age, province, district, job_category, symptoms_status}} = item;
        console.log('EmployeeLists EmployeeScreeningList', item)
        
        return <TRow key={"item-" + n}>
            {renderEmployee && <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {employee.lname || employee.data.lname} {employee.fname || employee.data.fname}
            </div>}
            <div className="td fixed-flex min-w-110">
                <h6 className="xs-shown font-size-13">Date</h6>
                {Dates.formatDate(date)}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Consent</h6>
                {(isObject(consent) ? consent.value : consent) || 'No'}
            </div>
            <div className="td fixed-flex min-w-160">
                <h6 className="xs-shown font-size-13">Symptoms Present</h6>
                {symptoms_status}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <Button idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        const {props: {list}} = this;        
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            reateBtnTitle="Create"
            pageId="page-list"
            pageTitle="Screening Checklists"
            pageTitleSingular="screening checklist"
            list={list}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
                    
            <ProfileScreeningDialog ref="profileDialog"/>
            <EditScreeningDialog ref="editDialog"/>
        </APageListReadWrite>;
    }

}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeePositiveCaseList">
@observer
class EmployeePositiveCaseList extends React.Component {

    @observable
    state = {
        lists: {
            test_types: ["PCR", "Antigen", "Antibody", "Unknown"],
            symptoms_positive: ["Yes", "No", "Unknown"],
            test_result_actions: ['Sick Leave', 'Self-Isolation', 'Isolation at quarantine site', 'Hospitalisation'],
            vulnerability_status: ["Yes", "No"],
            exposure_info: ['Work Contacts', 'Community Contacts', 'Family Contacts', 'Large Events Contacts', 'Travel history from a designated hotspot', 'Public transport', 'Unknown'],
            reporting_action_del: ["Yes", "No", "Not Applicable"],
            reporting_action_coid: ["Yes", "No", "Not Applicable"],
            reporting_action_dmre: ["Yes", "No", "Not Applicable"],
        }
    };
    
    constructor(props) {
        super(props);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        
        this.form = new Form();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="test_type" type="select" placeholder="Test Type..." className="form-control fixed-flex min-w-160" onChange={onChange} values={this.state.lists.test_types} returnValue/>
            <ClearableInput name="symptom_positive" type="select" placeholder="Symptom Positive..." className="form-control fixed-flex min-w-220" onChange={onChange} values={this.state.lists.symptoms_positive} returnValue/>
            <ClearableInput name="vulnerability_status" type="select" placeholder="Vulnerability Status..." className="form-control fixed-flex min-w-220" onChange={onChange} values={this.state.lists.vulnerability_status} returnValue/>
            <ClearableInput name="exposure_info" type="select" placeholder="Exposure Information..." className="form-control fixed-flex min-w-240" onChange={onChange} values={this.state.lists.exposure_info} returnValue/>
            <ClearableInput name="test_date" type="date" placeholder="Test Date..." className="form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        const {renderEmployee} = this.props;
        return <THead>
            {renderEmployee && <div className="td">Employee</div>}
            <div className="td fixed-flex min-w-110">Date</div>
            <div className="td fixed-flex min-w-140">Test Type (Date)</div>
            <div className="td fixed-flex min-w-150">Symptoms Positive</div>
            <div className="td fixed-flex min-w-160">High Risk Contacts</div>
            <div className="td fixed-flex min-w-160">Vulnerability Status</div>
            <div className="td">Positive Test Result Action</div>
            <div className="td">Exposure Information</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const {renderEmployee} = this.props;
        const item = this.refs.root.list[n];
        const {id, data: {created_at, employee, date, test_type, test_date, symptom_positive, high_risk_contacts_num, vulnerability_status, positive_test_result_action, exposure_info,
            reporting_action_del, reporting_action_coid, reporting_action_dmre}} = item;
        return <TRow key={"item-" + n}>
            {renderEmployee && <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {employee.lname || employee.data.lname} {employee.fname || employee.data.fname}
            </div>}
            <div className="td fixed-flex min-w-110">
                <h6 className="xs-shown font-size-13">Date</h6>
                {Dates.formatDate(date)}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Test Type (Date)</h6>
                {test_type} ({Dates.formatDate(test_date)})
            </div>
            <div className="td fixed-flex min-w-150">
                <h6 className="xs-shown font-size-13">Symptoms Positive</h6>
                {symptom_positive}
            </div>
            <div className="td fixed-flex min-w-160">
                <h6 className="xs-shown font-size-13">High Risk Contacts</h6>
                {high_risk_contacts_num}
            </div>
            <div className="td fixed-flex min-w-160">
                <h6 className="xs-shown font-size-13">Vulnerability Status</h6>
                {vulnerability_status}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Positive Test Result Action</h6>
                {positive_test_result_action}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Exposure Information</h6>
                {exposure_info}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <Button idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        const {props: {list}} = this;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId="page-list"
            pageTitle="Positive Cases"
            pageTitleSingular="positive case"
            list={list}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
                    
            <ProfilePositiveDialog ref="profileDialog"/>
            <EditPositiveDialog ref="editDialog"/>
        </APageListReadWrite>;
    }

}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeVulnerabilityCaseList">
@observer
class EmployeeVulnerabilityCaseList extends React.Component {

    @observable
    state = {
        lists: {
            vulnerability_status: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}]
        }
    };
    
    constructor(props) {
        super(props);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);

        this.form = new Form();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="vulnerability_status" type="radio" placeholder="Vulnerability Status" className="form-control fixed-flex min-w-355" onChange={onChange} values={this.state.lists.vulnerability_status}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        const {renderEmployee} = this.props;
        return <THead>
            {renderEmployee && <div className="td">Employee</div>}
            <div className="td fixed-flex min-w-110">Date</div>
            <div className="td fixed-flex min-w-160">Vulnerability Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const {renderEmployee} = this.props;
        const item = this.refs.root.list[n];
        const {id, data: {created_at, employee, date, vulnerability_status}} = item;
        return <TRow key={"item-" + n}>
            {renderEmployee && <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {employee.lname || employee.data.lname} {employee.fname || employee.data.fname}
            </div>}
            <div className="td fixed-flex min-w-110">
                <h6 className="xs-shown font-size-13">Date</h6>
                {Dates.formatDate(date)}
            </div>
            <div className="td fixed-flex min-w-160">
                <h6 className="xs-shown font-size-13">Vulnerability Status</h6>
                {vulnerability_status}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <Button idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        const {props: {list}} = this;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId="page-list"
            pageTitle="Vulnerability Cases"
            pageTitleSingular="vulnerability case"
            list={list}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
                    
            <ProfileVulnerableDialog ref="profileDialog"/>                    
            <EditVulnerableDialog ref="editDialog"/>
        </APageListReadWrite>;
    }

}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeReturnToWorkCaseList">
@observer
class EmployeeReturnToWorkCaseList extends React.Component {

    @observable
    state = {
        lists: {
            hospitalised: ["Yes", "No", "Unknown"],
            hospital_types: ["Public", "Private", "Unknown"],
            outcome: ["Discharge", "Death"],
            compensation_claim: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
            return_to_work_fitness: [
                'Fit for Job Description', 'Fit with Accommodation', 'Fit with restrictions', 
                'Temporarily unfit for Job Description', 'Unfit for review', 'Permanently Unfit'
            ]
        }
    };
    
    constructor(props) {
        super(props);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);

        this.form = new Form();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="outcome" type="select" placeholder="Outcome..." className="form-control fixed-flex min-w-160" onChange={onChange} values={this.state.lists.outcome} returnValue/>
            <ClearableInput name="hospitalised" type="select" placeholder="Hospitalised..." className="form-control fixed-flex min-w-165" onChange={onChange} values={this.state.lists.hospitalised} returnValue/>
            <ClearableInput name="outcome_date" type="date" placeholder="Outcome Date..." className="form-control" onChange={onChange}/>
            <ClearableInput name="admission_date" type="date" placeholder="Admission Date..." className="form-control" onChange={onChange}/>
            <ClearableInput name="return_to_work_date" type="date" placeholder="Return To Work Date..." className="form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        const {renderEmployee} = this.props;
        return <THead>
            {renderEmployee && <div className="td">Employee</div>}
            <div className="td fixed-flex min-w-110">Date</div>
            <div className="td fixed-flex min-w-200">Outcome (Date)</div>
            <div className="td fixed-flex min-w-180">Hospitalised (Type)</div>
            <div className="td fixed-flex min-w-150">Admission Date</div>
            <div className="td">Return To Work Fitness</div>
            <div className="td fixed-flex min-w-170">Return To Work Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const {renderEmployee} = this.props;
        const item = this.refs.root.list[n];
        const {id, data: {created_at, employee, date, hospitalised, hospital_type, admission_date, outcome, outcome_date, return_to_work_date, return_to_work_fitness, compensation_claim, percentage_disablement, claim_ref_num}} = item;
        console.log(item)
        return <TRow key={"item-" + n}>
            {renderEmployee && <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {employee.lname || employee.data.lname} {employee.fname || employee.data.fname}
            </div>}
            <div className="td fixed-flex min-w-110">
                <h6 className="xs-shown font-size-13">Date</h6>
                {Dates.formatDate(date)}
            </div>
            <div className="td fixed-flex min-w-200">
                <h6 className="xs-shown font-size-13">Outcome (Date)</h6>
                {outcome} ({Dates.formatDate(outcome_date)})
            </div>
            <div className="td fixed-flex min-w-180">
                <h6 className="xs-shown font-size-13">Hospitalised (Type)</h6>
                {hospitalised}{hospitalised === "Yes" && (" (" + hospital_type + ")")}
            </div>
            <div className="td fixed-flex min-w-150">
                <h6 className="xs-shown font-size-13">Admission Date</h6>
                {Dates.formatDate(admission_date)}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Return To Work Fitness</h6>
                {return_to_work_fitness}
            </div>
            <div className="td fixed-flex min-w-170">
                <h6 className="xs-shown font-size-13">Return To Work Date</h6>
                {Dates.formatDate(return_to_work_date)}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <Button idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        const {props: {list}} = this;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId="page-list"
            pageTitle="Return To Work Cases"
            pageTitleSingular="return to work case"
            list={list}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
                    
        </APageListReadWrite>;
    }
    
}
// </editor-fold>

@observer
class TopButtons extends React.Component {
    @observable state = {
        action: null
    };
    
    componentDidMount() {
        const {dialog, state} = this.props;
        
        execWhen(() => dialog.extraProp('action')).then(action => {
            this.state.action = action;
        });
    }
    
    @computed get action() {
        return this.state.action;
    }
    
    render() {
        const {action, props: {state, onCancel, onSubmit, onRef}} = this;
        if(!state.item) return null;
        return <React.Fragment>
            <Button key={`cancel${new Date().getTime()}`} ref={ref => onRef(ref, 'cancel')} className="btn btn-primary cancel min-w-70" onClick={onCancel}>Cancel</Button>
            {action !== 'View' && <Button key={`${action}${new Date().getTime()}`} ref={ref => onRef(ref, 'submit')} text={action} className="btn btn-primary save min-w-70" onClick={onSubmit}/>}
            {action === 'View' && <Button key={`Submit${new Date().getTime()}`} ref={ref => onRef(ref, 'submit')} text="Submit" className="btn btn-primary save min-w-70" onClick={onSubmit}/>}
            {action === 'View' && <Button key={`Print${new Date().getTime()}`} ref={ref => onRef(ref, 'print')} text="Print" className="btn btn-primary save min-w-70" onClick={onSubmit}/>}
        </React.Fragment>;
    }
}

export {
    TopButtons,
    EmployeeScreeningList, EmployeePositiveCaseList, EmployeeVulnerabilityCaseList, EmployeeReturnToWorkCaseList
};
