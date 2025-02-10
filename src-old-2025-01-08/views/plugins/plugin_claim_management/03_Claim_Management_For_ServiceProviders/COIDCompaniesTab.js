import React from "react";
import {observer} from 'mobx-react';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

//import NewClaimsCOIDProviderDialog from './dialogs/NewClaimsCOIDProviderDialog';
//import ProfileClaimsCOIDProviderDialog from './dialogs/ProfileClaimsCOIDProviderDialog';
//import EditClaimsCOIDProviderDialog from './dialogs/EditClaimsCOIDProviderDialog';
import style from "./COIDCompaniesTab.lazy.css";

@observer
class COIDCompaniesTab extends React.Component {

    path;
    pageKey = "COIDCompaniesTab";

    constructor(props) {
        super(props, style);

        this.path = props.path + 'coid-provider/companies/';

        this.onRemove = this.onRemove.bind(this);
        this.onAcceptRequest = this.onAcceptRequest.bind(this);
        this.onDeclineRequest = this.onDeclineRequest.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onRemove(evt, btn) {
        const {idx} = btn.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id: sender_company_id, data: {created_at, name, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        
        progressDialog.open();
        neonBinding.events.emit(`${this.path}requests/remove`, sender_company_id).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The company was not found.");
            } else if(res === 'ALREADY_REMOVED') {
                infoDialog.open("The company has already been removed.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res === true) {
                request.data.status = 'RecipientRemoved';
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(idx, item);
                });
                infoDialog.open("Company successfully removed.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    
    onAcceptRequest(evt, btn) {
        const {idx} = btn.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id: sender_company_id, data: {created_at, name, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        
        progressDialog.open();
        neonBinding.events.emit(`${this.path}requests/accept`, sender_company_id).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The company was not found.");
            } else if(res === 'ALREADY_SENT') {
                infoDialog.open("The request has already been sent.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res === true) {
                request.data.status = 'Accepted';
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(idx, item);
                });
                infoDialog.open("Request successfully accepted.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    
    onDeclineRequest(evt, btn) {
        const {idx} = btn.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id: sender_company_id, data: {created_at, name, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        progressDialog.open();
        neonBinding.events.emit(`${this.path}requests/decline`, sender_company_id).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The company was not found.");
            } else if(res === 'NOT_FOUND_REQUEST') {
                infoDialog.open("The request no longer exist.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res === true) {
                request.data.status = 'Declined';
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(idx, item);
                });
                infoDialog.open("Request successfully declined.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {id: sender_company_id, data: {created_at, name, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        
        const remove = status === 'Accepted';
        const acceptRequest = status === 'New';
        const declineRequest = status === 'New';
        
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {(remove || acceptRequest || declineRequest) && <hr />}
            {remove && <NavItem onClick={this.onRemove} faIconLeft="check" title="Remove"/>}
            {acceptRequest && <NavItem onClick={this.onAcceptRequest} faIconLeft="check" title="Accept Request"/>}
            {declineRequest && <NavItem onClick={this.onDeclineRequest} faIconLeft="ban" title="Decline Request"/>}
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="name" type="text" placeholder="Name" className="col-lg-12 form-control margin-b-10" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Company Name</div>
            <div className="td fixed-flex min-w-120">Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        console.log(item)
        const {id: sender_company_id, data: {created_at, name, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        return <TRow key={"item-" + n}>
            <div className="td">{name}</div>
            <div className="td fixed-flex min-w-120">{status}</div>
            
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            pageId={this.pageKey + "-tab"}
            pageTitle="Companies"
            pageTitleSingular="company"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
        </APageListReadWrite>;
    }
}

export default COIDCompaniesTab;
