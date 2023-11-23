// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, toJS} from 'mobx';

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
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

import {getDocsStatus, getWClStatus} from '../../ClaimFuns';

import ChatBtn from '../../dialogs/ChatBtn';
import AClaimsTab from '../AClaimsTab';

import NewClaimsClientDialog from '../dialogs/NewClaimsClientDialog';
import ProfileClaimsClientDialog from '../dialogs/ProfileClaimsClientDialog';
import EditClaimsClientDialog from '../dialogs/EditClaimsClientDialog';

import NewDialog from '../dialogs/ClaimsEmployerDetailsDialog/NewDialog';
import ClaimsEmployerDetailsDialog from '../dialogs/ClaimsEmployerDetailsDialog';

import ExportClaimsDialog from '../dialogs/ExportClaimsDialog.js';

import style from "./ClaimsClientTab.lazy.css";
import updateClaimsClient from "mutations/all/COIDA/ClaimsClient/updateClaimsClient";
import findByIdClaimsClient from "mutations/all/COIDA/ClaimsClient/findByIdClaimsClient";
import findBySenderIdClaimsProviderRequest
	from "mutations/all/COIDA/ClaimsProviderRequest/findBySenderIdClaimsProviderRequest";
import insertClaimsProviderMessage
	from "mutations/all/COIDA/ClaimsProviderMessage/insertClaimsProviderMessage";

// </editor-fold>

@observer
class ClaimsClientTab extends AClaimsTab {
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	pageKey = "ClaimsClientTab";
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
			]
		}
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props, style);
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.onExport = this.onExport.bind(this);
		
		this.onClickChat = this.onClickChat.bind(this);
		this.onAddClaimNum = this.onAddClaimNum.bind(this);
		this.onSendEmail = this.onSendEmail.bind(this);
		this.onApproveToClaimProvider = this.onApproveToClaimProvider.bind(this);
		this.onCreateEmployerDetails = this.onCreateEmployerDetails.bind(this);
		this.onViewEmployerDetails = this.onViewEmployerDetails.bind(this);
		this.onEmployerDetailsOptions = this.onEmployerDetailsOptions.bind(this);
		this.renderLeftButtons = this.renderLeftButtons.bind(this);
	}
	
	// </editor-fold>
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			employee,
			occupation,
			status,
			claim_status,
			//
			accident_date_range,
			resume_date_range,
			// year,
			mcr_ref_num,
			claim_number,
			// injury_disease,
			// injury_type,
		} = filterData || {};

		const listByLogged = sockets.of('claims/clients').fn('listByLogged');

		return listByLogged({
			employee,
			occupation,
			status,
			claim_status,
			//
			accident_date_range,
			resume_date_range,
			// year,
			mcr_ref_num,
			claim_number,
			// injury_disease,
			// injury_type,
			//
			exact_orgs: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>
	
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
			newMsg.claim_id = item.id;
			insertClaimsProviderMessage(newMsg).then(res => {
				console.log("claim chat res", res)
			});
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onCreateEmployerDetails">
	onCreateEmployerDetails(e, el) {
		this.refs.newClaimsEmployerDetailsDialog.open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onViewEmployerDetails">
	onViewEmployerDetails(e, el) {
		this.refs.claimsEmployerDetailsDialog.open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onEmployerDetailsOptions">
	onEmployerDetailsOptions(e, el) {
//        const {permissions_other} = storage.loggedUser.user.data;
//        const perms = permissions_other || [];
//        const permissions_other_Medicals = perms.find(v => v.key === "Medicals");
//        const c_Medicals = Permissions.allow(permissions_other_Medicals) ? "allowed" : "disallowed";
		
		const jqElem = $(el.getDOMNode());
		const {left} = jqElem.offset();
		this.refs.popover.settings({
			style: {left, top: 60, width: 'auto', minWidth: 200},
			isDialog: true,
			contentNode: <div>
				<NavItem onClick={this.onCreateEmployerDetails} title="Create Employer Details"/>
				<NavItem onClick={this.onViewEmployerDetails} title="View Employer Details"/>
			</div>
		}).open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onAddClaimNum">
	onAddClaimNum(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		const {id, data: {wcl_2, wcl_4}} = item;
		if (!wcl_2) {
			infoDialog.open('W.Cl.2 is missing');
			return;
		}
		if (!wcl_4 || (Object.keys(wcl_4).isEmpty() && !wcl_4.external_doc)) {
			infoDialog.open('W.Cl.4 is missing');
			return;
		}
		
		inputDialog.open("Add Claim Number").then(claim_number => {
			if (!claim_number) return;
			if (claim_number.replaceAll(' ', '').isEmpty()) {
				infoDialog.open('Claim Number is required');
				return;
			}
			
			progressDialog.open();
			updateClaimsClient({id, claim_number}).then(res => {
				console.log("res", res)
				if (res === 'NOT_FOUND') {
					infoDialog.open("The claim no longer exist.");
				} else if (res) {
					item.data.claim_number = claim_number;
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
	
	// <editor-fold defaultstate="collapsed" desc="onSendEmail">
	onSendEmail(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		const {id, data: {wcl_2}} = item;
		if (!wcl_2 || Object.keys(wcl_2).isEmpty()) {
			infoDialog.open('W.Cl.2 is missing');
			return;
		}
		
		inputDialog.open("Send To Medical Practitioner Email Address").then(doctor_email => {
			if (!doctor_email) return;
			if (doctor_email.replaceAll(' ', '').isEmpty()) {
				infoDialog.open('Medical Practitioner Email Address is required');
				return;
			}
			if (!doctor_email.isEmailAddress()) {
				infoDialog.open('Please enter a valid Email Address');
				return;
			}
			
			progressDialog.open();
			
			updateClaimsClient({id, doctor_email}).then(res => {
				console.log("res", res)
				if (res === 'NOT_FOUND') {
					infoDialog.open("The claim no longer exist.");
				} else if (res) {
					item.data.doctor_email = doctor_email;
					setTimeout(() => {
						list.removeIf(v => v.id === item.id);
						list.insertAt(idx, item);
					});
					infoDialog.open("Claim successfully sent with email.");
				} else {
					infoDialog.open("An error occurred. Please try again.");
				}
			}).finally(() => {
				progressDialog.close();
			});
		});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onApproveToClaimProvider">
	onApproveToClaimProvider(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		const {id, data: {wcl_2, wcl_4}} = item;
		if (!wcl_2 || Object.keys(wcl_2).isEmpty()) {
			infoDialog.open('W.Cl.2 is missing');
			return;
		}
		if (!wcl_4 || (Object.keys(wcl_4).isEmpty() && !wcl_4.external_doc)) {
			infoDialog.open('W.Cl.4 is missing');
			return;
		}
		
		progressDialog.open();
		
		findByIdClaimsClient(id).then(async res => {
			if (!res) return "NOT_FOUND";
			
			let {
				company: {id: sender_company_id},
				client_id, project_id, site_id
			} = storage.loggedUser;
			
			sender_company_id = client_id || sender_company_id;
			
			const request = await findBySenderIdClaimsProviderRequest({sender_company_id});
			console.log('findBySenderIdClaimsProviderRequest', request)
			if (!request) {
				return 'REQUEST_NOT_FOUND';
			}
			
			const {data: {receipient_coid_provider_id}} = request;
			
			return updateClaimsClient({id, receipient_coid_provider_id});
		}).then(res => {
			console.log("res", res)
			if (res === 'NOT_FOUND') {
				infoDialog.open("The claim no longer exist.");
			} else if (res === 'REQUEST_NOT_FOUND') {
				infoDialog.open("The claim request no longer exist.");
			} else if (isObject(res)) {
				extendObservable(item.data, res.data);
				setTimeout(() => {
					list.removeIf(v => v.id === item.id);
					list.insertAt(idx, item);
				});
				infoDialog.open("Claim successfully approved.");
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
			<Button className={"btn btn-primary fixed-flex pull-right"} onClick={this.onEmployerDetailsOptions}>
				Employer Details <i className="fa fa-angle-down icon-right"/>
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
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
			<hr/>
			<NavItem idx={idx} onClick={this.onAddClaimNum} faIconLeft="plus"
			         title={`${claim_number ? 'Edit' : 'Add'} Claim Number`}/>
			<hr/>
			<NavItem idx={idx} onClick={this.onSendEmail} faIconLeft="send"
			         title={`${doctor_email ? 'Resend' : 'Send'} To Medical Center`}/>
			{!receipient_coid_provider && <NavItem idx={idx} onClick={this.onApproveToClaimProvider} faIconLeft="send"
			                                       title="Approve To Claim Provider"/>}
		</Options>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderFilterNodeFirst">
	renderFilterNodeFirst(onChange) {
		return <>
			<SelectEmployeeInput name="employee" placeholder="Employee..." required
			                     className="col-lg-3 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}/>
			<SelectJobPositionInput name="occupation" placeholder="Occupation..." required
			                        className="col-lg-3 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}/>
			<ClearableInput name="status" type="select" placeholder="Status..."
			                className="col-lg-3 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}
			                values={this.state.lists.status} returnValue/>
			<ClearableInput name="claim_status" type="select" placeholder="Claim Status..."
			                className="col-lg-3 col-sm-6 col-xs-12 form-control margin-b-10" onChange={onChange}
			                values={this.state.lists.claim_status} returnValue/>
		</>;
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
				company, client, project, site,
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
		
		const {date_resumed_work} = wcl_2 || {};
		console.log('Claim', toJS(item))
		
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
			<div className="td w-auto">{(client || company) ? (client || company).name : "N/A"}</div>
			<div className="td w-auto">{employee ? employee.full_name : "N/A"}</div>
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
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>
			<Popover key="popover" ref="popover"/>
			
			<NewClaimsClientDialog ref="newDialog"/>
			<ProfileClaimsClientDialog ref="profileDialog"/>
			<EditClaimsClientDialog ref="editDialog"/>
			
			<NewDialog ref="newClaimsEmployerDetailsDialog"/>
			<ClaimsEmployerDetailsDialog ref="claimsEmployerDetailsDialog"/>
			
			<ExportClaimsDialog ref="exportClaimsDialog"/>
		</APageListReadWrite>;
	}
	
	// </editor-fold>
}

export default ClaimsClientTab;
