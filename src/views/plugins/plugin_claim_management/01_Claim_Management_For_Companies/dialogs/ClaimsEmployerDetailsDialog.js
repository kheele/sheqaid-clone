import React from "react";
import {observer} from 'mobx-react';

import {AsyncTD} from 'views/plugins/components';

import {Dates} from 'utils/Utils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewClaimsEmployerDetailsDialog from './NewClaimsEmployerDetailsDialog';
import EditClaimsEmployerDetailsDialog from './EditClaimsEmployerDetailsDialog';
import ProfileClaimsEmployerDetailsDialog from './ProfileClaimsEmployerDetailsDialog';

import style from "./ClaimsEmployerDetailsDialog.lazy.css";

@observer
class ClaimsEmployerDetailsDialog extends ADialogList {
    path = "plugin_sheq_assist/COIDA_Management/claims/client/employer-details/";
    pageKey = "ClaimsEmployerDetailsDialog";
    title = "Employer Details";
    
    constructor(props) {
        super(props);

        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "__D_COIDA_Management";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Company Name" className="form-control" onChange={onChange}/>
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
        const {id, data: {created_at, client, company_name, company_reg_num, company_contact_person, email, company_location, company_nature}} = item;
        console.log(item)
	return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-80">{RenderUtils.renderImage(client && client.data && client.data.profile_pic, '100%')}</div>
            <div className="td">{company_name}</div>
            <div className="td fixed-flex min-w-120">{company_reg_num}</div>
            <AsyncTD title="Contact Person" defaultValue={company_contact_person} renderer={v => `${v.lname || v.data.lname} ${v.fname || v.data.fname}`}/>
            <div className="td">{email}</div>
            <div className="td">{company_location}</div>
            <div className="td">{company_nature}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        const {onLoadList} = this.props;
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="employer details"
            pageTitleSingular="employer details"
            path={this.path}
            onLoadList={onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewClaimsEmployerDetailsDialog ref="newDialog"/>
            <ProfileClaimsEmployerDetailsDialog ref="profileDialog"/>
            <EditClaimsEmployerDetailsDialog ref="editDialog"/>
        </APageListReadWrite>;
    }

}

export default ClaimsEmployerDetailsDialog;
