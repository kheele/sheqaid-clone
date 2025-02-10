// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {toJS} from 'mobx';

import {Dates} from "utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    Button,
    ClearableInput,
    SelectEmployeeInput,
    SelectJobPositionInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {getDocsStatus, getWClStatus} from '../ClaimFuns';

import {AsyncTD} from 'views/plugins/components';

import ChatBtn from '../dialogs/ChatBtn';
import AClaimsTab from './AClaimsTab';

import ProfileClaimsCOIDProviderDialog from './dialogs/ProfileClaimsCOIDProviderDialog';

import ExportClaimsDialog from './dialogs/ExportClaimsDialog.js';

import style from "./ClaimsCOIDProviderTab.lazy.css";

// </editor-fold>

@observer
class ClaimsCOIDProviderTab extends AClaimsTab {

    // <editor-fold defaultstate="collapsed" desc="fields">
    path;
    pageKey = "ClaimsCOIDProviderTab";
    selfState = {
        lists: {
            claim_status: [
                'Old Claim - No Data On CompEasy',
                'Not Employed',
                'Reject',
                'Liability Repudiated',
                'Accepted',
                'Liability Accepted',
                'Wait on info',
                'Adjudication still Pending',
                'Request Claim no'
            ],
            status: [
                'Submit - CF',
                'Pending'
            ]
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);

        this.path = props.path + 'claims/coid-provider/';
        
        this.onExport = this.onExport.bind(this);
        
        this.onClickChat = this.onClickChat.bind(this);
        this.onAddClaimNum = this.onAddClaimNum.bind(this);
        this.onChangeClaimStatus = this.onChangeClaimStatus.bind(this);
        this.renderClaimStatusItem = this.renderClaimStatusItem.bind(this);
        this.onSelectClaimStatus = this.onSelectClaimStatus.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.renderStatusItem = this.renderStatusItem.bind(this);
        this.onSelectStatus = this.onSelectStatus.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(e, btn) {
        this.refs.exportClaimsDialog.open();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onClickChat">
    onClickChat(btn) {
        const {idx} = btn.props;
        const {list} = this.refs.root;
        const item = list[idx];
        
        chatBoxClaims.setActiveItem(item, btn, newMsg => {
            const {id, data: {message_list_provider}} = item;
            const path = "plugin_sheq_assist/COIDA_Management/claims/client/chat";
            neonBinding.events.emit(path, id, message_list_provider).then(res => {
                console.log("claim chat res", res)
            });
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onAddClaimNum">
    onAddClaimNum(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id, data: {wcl_2, wcl_4}} = item;
        if(!wcl_2 || Object.keys(wcl_2).isEmpty()) {
            infoDialog.open('W.Cl.2 is missing');
            return;
        }
        if(!wcl_4 || (Object.keys(wcl_4).isEmpty() && !wcl_4.external_doc)) {
            infoDialog.open('W.Cl.4 is missing');
            return;
        }
        
        inputDialog.open("Add Claim Number").then(text => {
            if(!text) return;
            if(text.replaceAll(' ', '').isEmpty()) {
                infoDialog.open('Claim Number is required');
                return;
            }
            
            progressDialog.open();
            neonBinding.events.emit(`${this.path}add-claim-number`, id, text).then(res => {
                console.log("res", res)
                if(res === 'NOT_FOUND') {
                    infoDialog.open("The claim no longer exist.");
                } else if(res === 'ALREADY_REMOVED') {
                    infoDialog.open("The company has already been removed.");
                } else if(res === 'UPDATE_ERROR') {
                    infoDialog.open("An error occurred. Please try again.");
                } else if(res === true) {
                    item.data.claim_number = text;
                    setTimeout(() => {
                        list.removeIf(v => v.id === item.id);
                        list.insertAt(idx, item);
                    });
                    infoDialog.open("Claim number successfully added/updated.");
                } else {
                    infoDialog.open("An error occurred. Please try again.");
                }
            }).finally(() => {
                progressDialog.close();
            });
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeClaimStatus, renderClaimStatusItem, onSelectClaimStatus">
    onChangeClaimStatus(e, el) {
        const {idx} = el.props;
        this.selectedClaimIdx = idx;
        const item = this.refs.root.list[idx];
        const {id, data: {wcl_2, wcl_4}} = item;
        if(!wcl_2 || Object.keys(wcl_2).isEmpty()) {
            infoDialog.open('W.Cl.2 is missing');
            return;
        }
        if(!wcl_4 || (Object.keys(wcl_4).isEmpty() && !wcl_4.external_doc)) {
            infoDialog.open('W.Cl.4 is missing');
            return;
        }
        
        const {lists: {claim_status: list}} = this.selfState;
        
        this.refs.popover.settings({
            style: {width: 'auto', minWidth: 200},
            isDialog: true,
            className: 'center-popover',
            contentNode: <div className="ATabPopoveContent">
                <p className="padding-t-10 text-center">--- Select ---</p>
                <hr className="margin-t-0 margin-b-0"/>
                {list.map(this.renderClaimStatusItem)}
            </div>
        }).open();
    }
    
    renderClaimStatusItem(item, n) {
        return <NavItem key={n} idx={n} onClick={this.onSelectClaimStatus} title={item}/>;
    }
    
    onSelectClaimStatus(e, elem) {
        const {title} = elem.props;
        const {list} = this.refs.root;
        const item = list[this.selectedClaimIdx];
        const {id, data: {wcl_2, wcl_4}} = item;
        
        progressDialog.open();
        neonBinding.events.emit(`${this.path}claim-status`, id, title).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The claim no longer exist.");
            } else if(res === 'ALREADY_REMOVED') {
                infoDialog.open("The company has already been removed.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res === true) {
                item.data.claim_status = title;
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(this.selectedClaimIdx, item);
                    delete this.selectedClaimIdx;
                });
                infoDialog.open("Claim Status successfully added/updated.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeStatus, renderStatusItem, onSelectStatus">
    onChangeStatus(e, el) {
        const {idx} = el.props;
        this.selectedClaimIdx = idx;
        const item = this.refs.root.list[idx];
        const {id, data: {wcl_2, wcl_4}} = item;
        if(!wcl_2 || Object.keys(wcl_2).isEmpty()) {
            infoDialog.open('W.Cl.2 is missing');
            return;
        }
        if(!wcl_4 || (Object.keys(wcl_4).isEmpty() && !wcl_4.external_doc)) {
            infoDialog.open('W.Cl.4 is missing');
            return;
        }
        
        const {lists: {status: list}} = this.selfState;
        
        this.refs.popover.settings({
            style: {width: 'auto', minWidth: 200},
            isDialog: true,
            className: 'center-popover',
            contentNode: <div className="ATabPopoveContent">
                <p className="padding-t-10 text-center">--- Select ---</p>
                <hr className="margin-t-0 margin-b-0"/>
                {list.map(this.renderStatusItem)}
            </div>
        }).open();
    }
    
    renderStatusItem(item, n) {
        return <NavItem key={n} idx={n} onClick={this.onSelectStatus} title={item}/>;
    }
    
    onSelectStatus(e, elem) {
        const {title} = elem.props;
        const {list} = this.refs.root;
        const item = list[this.selectedClaimIdx];
        const {id, data: {wcl_2, wcl_4}} = item;
        
        progressDialog.open();
        neonBinding.events.emit(`${this.path}status`, id, title).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The claim no longer exist.");
            } else if(res === 'ALREADY_REMOVED') {
                infoDialog.open("The company has already been removed.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res === true) {
                item.data.status = title;
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(this.selectedClaimIdx, item);
                    delete this.selectedClaimIdx;
                });
                infoDialog.open("Status successfully added/updated.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isContractorView} = storage.is;
        
//        const {permissions_other} = storage.loggedUser.user.data;
//        //
//        const permissions_other_Medicals = (permissions_other || []).find(v => v.key === "Medicals");
//        const c_Medicals = Permissions.allow(permissions_other_Medicals) ? "allowed" : "disallowed";
        
//        const writable = storage.is.isContractor || !isContractorView;
	return <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>
	</div>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {
            id, data: {
                claim_number, doctor_email, receipient_coid_provider, message_list_provider = []
            }
        } = item;
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <hr />
            <NavItem idx={idx} onClick={this.onAddClaimNum} faIconLeft="plus" title={`${claim_number ? 'Edit' : 'Add'} Claim Number`}/>
            <hr />
            <NavItem idx={idx} onClick={this.onChangeClaimStatus} faIconLeft="plus" title="Change Claim Status"/>
            <NavItem idx={idx} onClick={this.onChangeStatus} faIconLeft="plus" title="Change Status"/>
        </Options>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderFilterNodeFirst">
    renderFilterNodeFirst(onChange) {
        return <React.Fragment>
            <SelectEmployeeInput name="employee" placeholder="Employee..." required className="col-lg-4 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}/>
            <SelectJobPositionInput name="occupation" placeholder="Occupation..." required className="col-lg-4 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}/>
            <ClearableInput name="status" type="select" placeholder="Status..." className="col-lg-2 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange} values={this.state.lists.status} returnValue/>
            <ClearableInput name="claim_status" type="select" placeholder="Claim Status..." className="col-lg-2 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange} values={this.state.lists.claim_status} returnValue/>
        </React.Fragment>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-30"></div>
            <div className="td fixed-flex min-w-55">ID #</div>
            <div className="td fixed-flex min-w-100">Ref #</div>
            <div className="td fixed-flex min-w-100">Claim #</div>
            <div className="td fixed-flex min-w-100">Accident Date</div>
            <div className="td fixed-flex min-w-100">Resume Date</div>
            <div className="td fixed-flex min-w-110">Status</div>
            <div className="td fixed-flex min-w-140">Claim Status</div>
            <div className="td w-auto">Company</div>
            <div className="td w-auto">Employee</div>
            <div className="td fixed-flex min-w-110">Injury/Disease</div>
            <div className="td fixed-flex min-w-150">Documents</div>
            <div className="td fixed-flex min-w-160">W.Cl Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id, 
            data: {
                created_at, 
                client, project, site,
                //
                employee, employee_id, 
                claim_number,
                accident_date,
                //
                wcl_2 = {}, 
                wcl_4 = {}, 
                wcl_5_list = [], 
                wcl_6 = {}, 
                annexture_1 = {},
                //
                ref_num,
                status,
                claim_status,
                message_list_provider = []
            }
        } = item;
        
        const {date_resumed_work} = wcl_2;
        console.log('ClaimsCOIDProvider', toJS(item))
        
        return <TRow key={"item-" + n} className="w-full">
            <div className="td fixed-flex min-w-30 padding-0">
                <ChatBtn idx={n} item={item} onClick={this.onClickChat}/>
            </div>
            <div className="td fixed-flex min-w-55 padding-0">{id}</div>
            <div className="td fixed-flex min-w-100 padding-0">
                {ref_num || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-100">{claim_number || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{Dates.formatDate(accident_date) || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{Dates.formatDate(date_resumed_work) || 'N/A'}</div>
            <div className="td fixed-flex min-w-110">{status || 'N/A'}</div>
            <div className="td fixed-flex min-w-140">{claim_status || 'N/A'}</div>
            <div className="td w-auto">{client ? (client.name || client.data.name) : 'N/A'}</div>
            <AsyncTD 
                title="Employee Name" 
                defaultValue={employee} 
                renderer={v => `${v.lname || v.data.lname} ${v.fname || v.data.fname}`}
                className="w-auto"
            />
            <div className="td fixed-flex min-w-110">Injury</div>
            <div className="td fixed-flex grid-1 min-w-150 padding-t-3">{getDocsStatus(item)}</div>
            <div className="td fixed-flex grid-2 min-w-160 padding-t-3">{getWClStatus(item)}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Client Claims"
            pageTitleSingular="claim"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            <Popover key="popover" ref="popover"/>
            
            <ProfileClaimsCOIDProviderDialog ref="profileDialog"/>
            
            <ExportClaimsDialog ref="exportClaimsDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}

export default ClaimsCOIDProviderTab;
