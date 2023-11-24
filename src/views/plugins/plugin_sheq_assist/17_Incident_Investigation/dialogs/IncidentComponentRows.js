// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import {Dates} from 'utils/Utils';

import {ActionsButton, Button,} from 'components/inputs';
import {Table, TBody, THead, TRow} from 'components/tables';
import MKBox from "components/MK/MKBox";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentStatus">
@observer
class IncidentStatus extends React.Component {

    @computed get status() {
        let {
            data: {
                status_closed,
                status_approved,
                status_approved_investigation,
                status_awaiting_approval,
                status_investigating,
                status_awaiting_investigation_approval,
                investigation,
            },
        } = this.props.item;

        const {
            investigation_team_list = [],
        } = investigation || {};

        const AssignedInvestigator = !!investigation_team_list && investigation_team_list.isNotEmpty();
        const isInvestigating = !!investigation;

        if (status_closed) {
            return ['Closed Incident'];
        } else if (status_investigating) {
            return ['Investigating'];
        } else if (status_awaiting_approval) {
            return ['Awaiting Approval'];
        } else {
            const status = [];
            if (status_awaiting_investigation_approval) {
                status.push('Awaiting Investigation Approval');
            }
            if (status_approved) {
                status.push('Approved Incident');
            }
            if (status_approved_investigation) {
                status.push('Approved Investigation');
            }
            if (AssignedInvestigator) {
                status.push('Assigned Investigator');
            }
            return status;
        }
    }

    render() {
        const {item} = this.props;
        const {status} = this;

        return <div key={new Date().getTime()} className="td fixed-flex min-w-140">
            <h6 className="xs-shown font-size-13">Status</h6>
            {status.map(v => <span>{v}</span>)}
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentInvestigationStatus">
@observer
class IncidentInvestigationStatus extends React.Component {

    @computed get status() {
        let {
            data: {
                status_closed,
                status_approved,
                status_approved_investigation,
                status_awaiting_approval,
                status_investigating,
                status_awaiting_investigation_approval,
                investigation,
            },
        } = this.props.item;

        const {
            investigation_team_list = [],
        } = investigation || {};

        const AssignedInvestigator = !!investigation_team_list && investigation_team_list.isNotEmpty();
        const isInvestigating = !!investigation;

        if (status_closed) {
            return ['Closed Incident'];
        } else if (status_investigating) {
            return ['Investigating'];
        } else if (status_awaiting_approval) {
            return ['Awaiting Approval'];
        } else {
            const status = [];
            if (status_awaiting_investigation_approval) {
                status.push('Awaiting Investigation Approval');
            }
            if (status_approved_investigation) {
                status.push('Approved Investigation');
            }
            if (AssignedInvestigator) {
                status.push('Assigned Investigator');
            }
            return status;
        }
    }

    render() {
        const {item} = this.props;
        const {status} = this;

        return <div key={new Date().getTime()} className="td fixed-flex min-w-140">
            <h6 className="xs-shown font-size-13">Status</h6>
            {status.map(v => <span>{v}</span>)}
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentTableRow">
@observer
class IncidentTableRow extends React.Component {

    render() {
        const {item, idx, onRenderActionCell, className, onClick} = this.props;

        let {
            id,
            data: {
                created_at,
                client, project, site,
                investigation,
                //
                severity,//{consequence, likelihood}
                incident_date,
                short_desc,
                location,
                exact_location,
                //
                category_list,
                sub_category_list,
                sector_list,
                activity_list,
                //
            }
        } = item;

        const __className = (className || "") + " w-full";

        return <TRow key={id} className={__className}>
            <div className="td fixed-flex min-w-50">{id}</div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Incident Date</h6>
                {Dates.formatDate(incident_date) || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Risk Rating</h6>
                {severity ? severity.risk_rating : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Category</h6>
                {category_list ? <Grid container spacing={1} columns={4}>{
                    category_list.map(({category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
                </Grid> : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Sub-Category</h6>
                {sub_category_list ? <Grid container spacing={1} columns={4}>{
                    sub_category_list.map(({sub_category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
                </Grid> : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Short Description</h6>
                {short_desc || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Exact Location</h6>
                {exact_location || 'N/A'}
            </div>
            <IncidentStatus key={new Date().getTime()} item={item}/>
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentQuickTableRow">
@observer
class IncidentQuickTableRow extends React.Component {

    render() {
        const {item, idx, onRenderActionCell, className, onClick} = this.props;

        let {
            id,
            data: {
                created_at,
                //
                company,
                client,
                project,
                site,
                //
                logged_user,
                logged_employee,
                //Step 2 (Incident Details)
                latitude,
                longitude,
                exact_location,
                short_desc,
                //Step 3 (Date & Time)
                incident_date,
                incident_time,
                date_reported,
                time_reported,
                time_shift,
                //Step 4 (Incident Category)
                category_list,
                //Step 5 (Injury Report)
                person_reporting,
                //Step 6 (Injury Details)
                person_injured,
                nature_of_injury_list,
                bodily_injury_location_list,
                injury_mechanism_list,
                //6.2 Motor Vehicle
                is_vehicle_incident,
                driver,
                driver_email,
                driver_phone,
                vehicle_make,
                vehicle_reg_num,
                //6.3 Incident Severity
                severity,
                //Step 7 (Media Details)
                image_list,
                video_list,
            }
        } = item;

        const __className = (className || "") + " w-full";

        return <TRow key={id} className={__className}>
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td fixed-flex min-w-180">
                <h6 className="xs-shown font-size-13">Date && Time</h6>
                {(incident_date || incident_time) ? <Chip
                    label={<>{Dates.formatDate(incident_date)}<br/>{incident_time}</>} size="medium"
                /> : 'N/A'}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Severity</h6>
                {severity || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Category</h6>
                {category_list ? <Grid container spacing={1} columns={4}>{
                    category_list.map(({category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
                </Grid> : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Reported By</h6>
                {person_reporting && person_reporting.full_name || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Person Injured</h6>
                {person_injured && person_injured.full_name || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-160">
                <h6 className="xs-shown font-size-13">Asset</h6>
                {is_vehicle_incident ? `${vehicle_make ? `${vehicle_make}${vehicle_reg_num ? `(${vehicle_reg_num})` : ''}` : vehicle_reg_num || 'N/A'}` : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Driver</h6>
                {driver && driver.full_name || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Description</h6>
                {short_desc || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Location</h6>
                {(latitude && longitude) || exact_location ? <Grid container spacing={1} columns={4}>
                    {latitude && longitude && <Grid item>
                        <Chip label={latitude + ', ' + longitude} size="small"/>
                    </Grid>}
                    {exact_location && <Grid item>
                        <Chip label={exact_location} size="small"/>
                    </Grid>}
                </Grid> : 'N/A'}
            </div>
            {/*<IncidentStatus key={new Date().getTime()} item={item}/>*/}
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentInvestigationTableRow">
@observer
class IncidentInvestigationTableRow extends React.Component {

    render() {
        const {item, idx, onRenderActionCell, className, onClick} = this.props;

        let {
            id,
            data: {
                created_at,
                client, project, site,
                investigation, investigation: {
                    //1

                    //2
                    investigation_team_list,//
                    due_date,//
                    //3
                    investigation_details,//
                    investigation_findings_list,//
                    investigation_findings_further_desc,//
                    document_list,//
                    //4
                    severity,//{consequence, likelihood}
                    //5
                    cause_analysis,//
                    //7
                    distribution_list,//
                    //8
                    weather_condition_list,//
                    //9
                    protective_equipment_worn_list,//
                    //10
                    class_list,//
                    //11
                    environment_list,//
                    //12
                    estimated_costs_damages,//
                    estimated_costs_medical,//
                    estimated_costs_salaries_wages,//
                    estimated_costs_investigations,//
                    estimated_costs_others,//
                },
                //
                group,
                incident_date,
                short_desc,
                location,
                exact_location,
                //
                category_list,
                sub_category_list,
                sector_list,
                activity_list,
                //
            }
        } = item;

        console.log('Investigations', item)

        const __className = (className || "") + " w-full";

        return <TRow key={id} className={__className}>
            <div className="td fixed-flex min-w-50">{id}</div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Incident Date</h6>
                {Dates.formatDate(incident_date) || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Due Date</h6>
                {Dates.formatDate(due_date) || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Risk Rating</h6>
                {severity ? severity.risk_rating : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Category</h6>
                {category_list ? <Grid container spacing={1} columns={4}>{
                    category_list.map(({category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
                </Grid> : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Sub-Category</h6>
                {sub_category_list ? <Grid container spacing={1} columns={4}>{
                    sub_category_list.map(({sub_category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
                </Grid> : 'N/A'}
           </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Short Description</h6>
                {short_desc || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Exact Location</h6>
                {exact_location || 'N/A'}
            </div>
            <IncidentInvestigationStatus key={new Date().getTime()} item={item}/>
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentCorrectiveActionsTableRow">
@observer
class IncidentCorrectiveActionsTableRow extends React.Component {

    render() {
        const {item, idx, onRenderActionCell, className, onClick} = this.props;

        let {
            id,
            data: {
                created_at,
                client, project, site,
                investigation: {
                    //1

                    //2
                    investigation_team_list,//
                    due_date,//
                    //3
                    investigation_details,//
                    investigation_findings_list,//
                    investigation_findings_further_desc,//
                    document_list,//
                    //4
                    severity,//{consequence, likelihood}
                    //5
                    cause_analysis,//
                    //7
                    distribution_list,//
                    //8
                    weather_condition_list,//
                    //9
                    protective_equipment_worn_list,//
                    //10
                    class_list,//
                    //11
                    environment_list,//
                    //12
                    estimated_costs_damages,//
                    estimated_costs_medical,//
                    estimated_costs_salaries_wages,//
                    estimated_costs_investigations,//
                    estimated_costs_others,//
                },
                //
                group,
                incident_date,
                short_desc,
                location,
                exact_location,
                //
                category_list,
                sub_category_list,
                sector_list,
                activity_list,
                //
            }
        } = item;

        const {immediate_analysis, root_analysis} = cause_analysis;

        const {
            sub_standard_practices_or_unsafe_acts,
            sub_standard_practices_or_unsafe_conditions,
            custom_sub_standard_practices_or_unsafe_acts,
            custom_sub_standard_practices_or_unsafe_conditions,
        } = immediate_analysis || {};
        const {
            custom_job_factors,
            custom_personal_factors,
            job_factors,
            personal_factors,
        } = root_analysis || {};

        const corrective_actions = ((...args) => args.filter(v => !!v).map(v => ((...args) => args.filter(v => !!v))(
            v.corrective_action_list_job_factors,
            v.corrective_action_list_personal_factors,
            v.corrective_action_list_custom_job_factors,
            v.corrective_action_list_custom_personal_factors,
        )).reduce((a1, a2) => [...a1, ...a2], []))(
            sub_standard_practices_or_unsafe_acts,
            sub_standard_practices_or_unsafe_conditions,
            custom_sub_standard_practices_or_unsafe_acts,
            custom_sub_standard_practices_or_unsafe_conditions,
            custom_job_factors,
            custom_personal_factors,
            job_factors,
            personal_factors,
        );

        console.log('CorrectiveActions', item, corrective_actions.slice())

        const __className = (className || "") + " w-full";

        const onLoadSubList = () => Promise.resolve();
        const renderSubItem = (n1, onClick) => {
            const {
                group,
                sub_group,
                cause_name,
                text,
                cost,
                responsible_person,
                date_completed
            } = corrective_actions[n1];
            return <TRow key={"item-" + n + '-' + n1}>
                <div className="td fixed-flex min-w-120"><span>{group}</span></div>
                <div className="td"><span>{sub_group}</span></div>
                <div className="td"><span>{cause_name}</span></div>
                <div className="td"><span>{text}</span></div>
                <div className="td fixed-flex min-w-80"><span>R {cost || 0}</span></div>
                <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} corrective_actions={corrective_actions}
                                   className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>
            </TRow>;
        };

        return <>
            <TRow key={id} className="tr-table">
                <TRow key={"item-" + id}>
                    <div className="td fixed-flex min-w-120">
                        <h6 className="xs-shown font-size-13">Incident Date</h6>
                        {Dates.formatDate(incident_date) || 'N/A'}
                    </div>
                    <div className="td fixed-flex min-w-120">
                        <h6 className="xs-shown font-size-13">Incident Date</h6>
                        {Dates.formatDate(due_date) || 'N/A'}
                    </div>
                    <div className="td">
                        <h6 className="xs-shown font-size-13">Group</h6>
                        {group || 'N/A'}
                    </div>
                    <div className="td">
                        <h6 className="xs-shown font-size-13">Category</h6>
                        {category_list ? category_list.map(({category: {name}}) => (<span>{name}</span>)) : 'N/A'}
                    </div>
                    <div className="td">
                        <h6 className="xs-shown font-size-13">Sub-Category</h6>
                        {sub_category_list ? sub_category_list.map(({sub_category: {name}}) => (
                            <span>{name}</span>)) : 'N/A'}
                    </div>
                    <div className="td">
                        <h6 className="xs-shown font-size-13">Activities</h6>
                        {activity_list ? activity_list.map(({activity: {name}}) => (<span>{name}</span>)) : 'N/A'}
                    </div>
                    <div className="td">
                        <h6 className="xs-shown font-size-13">Description</h6>
                        {short_desc || 'N/A'}
                    </div>
                    <div className="td">
                        <h6 className="xs-shown font-size-13">Location</h6>
                        {exact_location || 'N/A'}
                    </div>

                    <div className="td fixed-flex padding-l-0 padding-r-0 min-w-160">
                        <Button idx={idx} className="btn btn-primary pull-right w-150" onClick={this.onClick}>
                            Corrective Actions<i className="fa icon-right fa-angle-down"/>
                        </Button>
                    </div>
                    {/*{onRenderActionCell && onRenderActionCell(item, idx)}*/}
                    {/*{!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">*/}
                    {/*    <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>*/}
                    {/*</div>}*/}
                </TRow>
                <Table>
                    <THead>
                        <div className="td fixed-flex min-w-120">Cause Type</div>
                        <div className="td">Cause Sub-Type</div>
                        <div className="td">Cause</div>
                        <div className="td">Corrective Action</div>
                        <div className="td fixed-flex min-w-80">Cost</div>
                        <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
                    </THead>
                    <TBody renderItem={renderSubItem} list={corrective_actions} onLoadList={onLoadSubList}
                           onClick={onClick}/>
                </Table>
            </TRow>
        </>;
    }
}

// </editor-fold>

export {
    IncidentStatus,
    IncidentTableRow, IncidentQuickTableRow, IncidentInvestigationTableRow, IncidentCorrectiveActionsTableRow,
};
