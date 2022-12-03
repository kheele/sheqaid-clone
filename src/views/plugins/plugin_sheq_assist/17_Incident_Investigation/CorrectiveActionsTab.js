import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from "../../../../utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import {ActionsButton, Button} from '../../../../components/inputs';
import {Table, TBody, THead, TRow} from '../../../../components/tables';

//import NewFormDialog from './dialogs/NewFormDialog.js';
//import EditFormDialog from './dialogs/EditFormDialog.js';
//import ProfileFormDialog from './dialogs/ProfileFormDialog.js';
import style from "./CorrectiveActionsTab.lazy.css";
import StateLists from "./dialogs/IncidentForms/StateLists";

@observer
class CorrectiveActionsTab extends React.Component {
    path;
    pageKey = "CorrectiveActionsTab";
    
    @observable
    state = {
        lists: StateLists,
    }

    constructor(props) {
        super(props);

        this.path = props.path + 'corrective-actions/';

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onClick(e, btn) {
        $(btn.getDOMNode()).closest('.tr-table').find('.table').toggleClass("active");
    }
    
    renderPopoverOptions(_idx, _actions, e, btn) {
        const {idx, corrective_actions} = btn.props;
        const item = corrective_actions[idx];
        let {group, sub_group, cause_name, text, cost, responsible_person, date_completed, status = []} = item;
        status = isArray(status) || isObservableArray(status) ? status : [];
        const onView = (e, el) => {
            
        };
        const onEdit = (e, el) => {
            
        };
        const onRemove = (e, el) => {
            
        };
        
        const onProgressNotes = (e, el) => {
            const {idx} = el.props;
            const item = this.refs.root.list[idx]; 
    //        this.refs.newInvestigationDialog.open(item);
        };
    
        const onCloseCorrectiveAction = (e, el) => {
            const {idx} = el.props;
            const item = this.refs.root.list[idx];    
    //        const {investigation} = item.data;
            confirmDialog.open("Are you sure you want to close the corrective action?").then(res => {
                if(res === 1) {
    //                progressDialog.open("Closing the corrective action...");
    //                neonBinding.events.emit(this.path + "add-status", item.id, "ClosedCorrectiveAction").then(res => {
    //                    progressDialog.close();
    //                    console.log("res", res)
    //                    if(!investigation.status) {
    //                        extendObservable(investigation, {status: ['ClosedCorrectiveAction']});
    //                    }
    //                    setTimeout(() => {
    //                        investigation.status.push('ClosedCorrectiveAction');
    //                    }, 2000);
    //                    infoDialog.open("Corrective Action successfully closed.");
    //                    infoDialog.close(2000);
    //                });   
                }
            });
        };
    
        const onReOpen = (e, el) => {
    //        const {investigation} = item.data; 
            confirmDialog.open("Are you sure you want to re-open the corrective action?").then(res => {
                if(res === 1) {
    //                progressDialog.open("Re-opening the corrective action...");
    //                neonBinding.events.emit(this.path + "remove-status", item.id, "ClosedCorrectiveAction").then(res => {
    //                    progressDialog.close();
    //                    console.log("res", res)
    //                    setTimeout(() => {
    //                        investigation.status.remove('ClosedCorrectiveAction');
    //                    });
    //                    infoDialog.open("Corrective Action successfully re-opened.");
    //                    infoDialog.close(2000);
    //                });   
                }
            })
        };
        
        const {Options} = _actions;
        
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            {!status.contains('ClosedCorrectiveAction') && <React.Fragment>
                <NavItem action="writable" idx={idx} onClick={onProgressNotes} faIconLeft="edit" title="Progress Notes"/>
            </React.Fragment>}
                
            {!status.contains('ClosedCorrectiveAction') && <NavItem action="writable" idx={idx} onClick={onCloseCorrectiveAction} faIconLeft="ban" title="Close Corrective Action"/>}
            {status.contains('ClosedCorrectiveAction') && <NavItem action="writable" idx={idx} onClick={onReOpen} faIconLeft="edit" title="Re-Open Corrective Action"/>}
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            {/*<ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="radio" placeholder="Type" className="form-control" onChange={onChange} values={this.state.lists.type}/>
            <ClearableInput name="scheduled" type="radio" placeholder="Scheduled" className="form-control" onChange={onChange} values={this.state.lists.scheduled}/>*/}
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Incident Date</div>
            <div className="td fixed-flex min-w-140">Investigation Date</div>
            <div className="td">Group</div>
            <div className="td">Category</div>
            <div className="td">Sub-Category</div>
            <div className="td">Sector(s)</div>
            <div className="td">Activities</div>
            <div className="td">Description</div>
            <div className="td">Location</div>
            <div className="td fixed-flex min-w-170 padding-l-0 padding-r-0"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        let {id, data: {
                created_at, status,
                classification,
                investigation, investigation: {sec5_data: {corrective_actions}},
                sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data, 
                sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data, 
//                sec1_data: {category_list, sector_list, group, short_desc},//1
//                sec2_data: {sub_category_list, activity_list},//2
//                sec3_data: {type},//3
//                sec4_data: {secondary_type_list},//4
//                sec5_data: {person_involved_list},//5
//                sec6_data: {person_reporting},//6
//                sec7_data: {person_reported_to, date_reported},//7
//                sec8_data: {witness_list},//8
//                sec9_data: {investigation_date, investigation_time, exact_location},//9
//                sec10_data: {document_list, desc},//10
//                sec11_data: {person_injured, injured_person_dob, injured_person_gender, nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list},//11
//                sec12_data: {test_undertaken, test_type_list, test_type_drug_undertaken, test_type_alcohol_undertaken, test_type_mobile_device_undertaken},//12
//                sec13_data: {is_vehicle_investigation, is_infringement_issued, did_police_attend_scene, collision_reported_to_police_station, have_charges_been_laid},//13
//                sec14_data: {consequence, frequency, risk_rating},//15
//                sec15_data: {distribution_list}//16
            }
        } = item;
        
        if(classification) {
            sec1_data = classification.sec1_data || sec1_data;
            sec2_data = classification.sec2_data || sec2_data;
            sec3_data = classification.sec3_data || sec3_data;
            sec4_data = classification.sec4_data || sec4_data;
        }
        
        let investigation_due_date = null;
        if(investigation && investigation.sec1_data && investigation.sec1_data.investigation_due_date) {
            investigation_due_date = investigation.sec1_data.investigation_due_date;
        } else if(classification && classification.sec5_data && classification.sec5_data.investigation_due_date) {
            investigation_due_date = classification.sec5_data.investigation_due_date;
        }
        
        const onLoadSubList = () => Promise.resolve();
        const renderSubItem = (n1, onClick) => {
            const {group, sub_group, cause_name, text, cost, responsible_person, date_completed} = corrective_actions[n1];
            return <TRow key={"item-" + n + '-' + n1}>
                <div className="td fixed-flex min-w-120"><span>{group}</span></div>
                <div className="td"><span>{sub_group}</span></div>
                <div className="td"><span>{cause_name}</span></div>
                <div className="td"><span>{text}</span></div>
                <div className="td fixed-flex min-w-80"><span>R {cost || 0}</span></div>
                <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={n} corrective_actions={corrective_actions} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>
            </TRow>;
        };
        
        console.log('CorrectiveActions', item)
        return <React.Fragment>
            <TRow key={"item-" + n} className="tr-table">
                <TRow key={"item-" + n}>
                    <div className="td fixed-flex min-w-120">{sec9_data && sec9_data.incident_date ? Dates.formatDate(sec9_data.incident_date) : 'N/A'}</div>
                    <div className="td fixed-flex min-w-140">{investigation_due_date ? Dates.formatDate(investigation_due_date) : 'N/A'}</div>
                    <div className="td">{sec1_data && sec1_data.group || 'N/A'}</div>
                    <div className="td">{sec1_data && sec1_data.category_list ? sec1_data.category_list.map(v => <span>{v}</span>) : 'N/A'}</div>
                    <div className="td">{sec2_data && sec2_data.sub_category_list ? sec2_data.sub_category_list.map(v => <span>{v}</span>) : 'N/A'}</div>
                    <div className="td">{sec1_data && sec1_data.sector_list ? sec1_data.sector_list.map(v => <span>{v}</span>) : 'N/A'}</div>
                    <div className="td">{sec2_data && sec2_data.activity_list ? sec2_data.activity_list.map(v => <span>{v}</span>) : 'N/A'}</div>
                    <div className="td">{sec1_data && sec1_data.short_desc ? sec1_data.short_desc : 'N/A'}</div>
                    <div className="td">{sec9_data && sec9_data.exact_location ? sec9_data.exact_location : 'N/A'}</div>
                    <div className="td fixed-flex padding-l-0 padding-r-0 min-w-160">
                        <Button idx={n} className="btn btn-primary pull-right w-150" onClick={this.onClick}>
                            Corrective Actions<i className="fa icon-right fa-angle-down"/>
                        </Button>
                    </div>
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
                    <TBody renderItem={renderSubItem} list={corrective_actions} onLoadList={onLoadSubList} onClick={onClick}/>
                </Table>
            </TRow>
        </React.Fragment>;
    }

    render() {
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Corrective Actions"
            pageTitleSingular="corrective action"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            {/*Permissions.allowRemove(permissions_other_ContractorForms) && !storage.is.isEmployee && <ConfirmDialog ref="removeDialog"/>*/}
            {/*Permissions.allowCreate(permissions_other_ContractorForms) && !storage.is.isEmployee && <NewFormDialog ref="newDialog"/>*/}
            {/*Permissions.allowView(permissions_other_ContractorForms) && <ProfileFormDialog ref="profileDialog"/>*/}
            {/*<ConfirmDialog ref="removeDialog"/>
            <NewFormDialog ref="newDialog"/>
            <EditFormDialog ref="editDialog"/>
            <ProfileFormDialog ref="profileDialog"/>*/}
        </APageListReadWrite>;
    }
}

export default CorrectiveActionsTab;
