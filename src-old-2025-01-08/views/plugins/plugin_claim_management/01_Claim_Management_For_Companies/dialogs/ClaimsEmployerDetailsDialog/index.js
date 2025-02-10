import React from "react";
import {observer} from 'mobx-react';

import {AsyncTD} from 'views/plugins/components';

import {Dates} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewDialog from './NewDialog';
import EditDialog from './EditDialog';
import ProfileDialog from './ProfileDialog';

import style from "./ClaimsEmployerDetailsDialog.lazy.css";
import byLogged from "./Query/List/listAllClaimsEmployerDetailsByLogged";
import updateClaimsEmployerDetails
	from "mutations/all/COIDA/ClaimsEmployerDetails/updateClaimsEmployerDetails";

@observer
class ClaimsEmployerDetailsDialog extends ADialogList {
	pageKey = "ClaimsEmployerDetailsDialog";
	title = "Employer Details";
	
	constructor(props) {
		super(props);
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.onRemoved = this.onRemoved.bind(this);

		this.renderFilterNode = this.renderFilterNode.bind(this);
	}
	
	componentWillMount() {
		style.use();
	}
	
	componentWillUnmount() {
		style.unuse();
	}
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			company_name,
		} = filterData || {};
		
		const limit = 50;
		
		const args = {
			company_name,
			removed: false,
			//
			limit,
			//
			exact_orgs: true,
		};
		
		if (!isNew) {
			args.offset = this.refs.root.list.length;
		} else {
			args.offset = 0;
		}
		
		return byLogged(args).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>

	onRemoved(item) {
		this.refs.root.list.removeIf((v, n) => v.id === item.id);
	}

	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		// const permissionKey = "_01_Claim_Management_For_Companies";
		// return <Options idx={idx} permissionOtherKey={permissionKey}>
		return <Options idx={idx}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
		</Options>;
	}
	
	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="company_name" type="text" placeholder="Company Name" className="form-control" onChange={onChange}/>
		</div>;
	}
	
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td fixed-flex min-w-80"></div>
			<div className="td">Company Name</div>
			<div className="td fixed-flex min-w-120">Reg. No.</div>
			<div className="td">Contact Person</div>
			<div className="td">Email Address</div>
			<div className="td">Situation of Business/Farm</div>
			<div className="td">Nature of Business, Trade or Industry</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {id,
			data: {
				created_at,
				client,
				company_name,
				company_reg_num,
				company_contact_person,
				email,
				company_location,
				company_nature
			}
		} = item;
		console.log(item)
		return <TRow key={id}>
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div
				className="td fixed-flex min-w-80">{RenderUtils.renderImage(client && client.profile_pic, '100%')}</div>
			<div className="td">{company_name}</div>
			<div className="td fixed-flex min-w-120">{company_reg_num}</div>
			<div className="td">{company_contact_person ? company_contact_person.full_name : "N/A"}</div>
			<div className="td">{email}</div>
			<div className="td">{company_location}</div>
			<div className="td">{company_nature}</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}
	
	renderPage() {
		// const {onLoadList} = this.props;
		return <APageListReadWrite
			ref="root"
			page={this}
			hasBackBtn={false}
			createBtnTitle="Create"
			pageId={this.pageKey + '-page'}
			listCountTopTitle="employer details"
			pageTitleSingular="employer details"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog" onSoftDelete={updateClaimsEmployerDetails}/>
			
			<NewDialog ref="newDialog"/>
			<ProfileDialog ref="profileDialog" onRemoved={this.onRemoved}/>
			<EditDialog ref="editDialog" onRemoved={this.onRemoved}/>
		</APageListReadWrite>;
	}
	
}

export default ClaimsEmployerDetailsDialog;
