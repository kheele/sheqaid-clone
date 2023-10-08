import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from '../../../../../components/navs/NavItem';
import {ActionsButton, ClearableInput} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

import style from "./COIDServiceProvidersTab.lazy.css";

@observer
class COIDServiceProvidersTab extends React.Component {

    path;
    pageKey = "COIDServiceProvidersTab";
    
    @observable
    state = {
    };

    constructor(props) {
        super(props, style);
        
        this.path = props.path + 'companies/coid-provider/';

        this.onRemove = this.onRemove.bind(this);
        this.onSendRequest = this.onSendRequest.bind(this);
        this.onCancelRequest = this.onCancelRequest.bind(this);
        
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
        const {id: receipient_coid_provider_id, data: {created_at, name, address, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        
        progressDialog.open();
        neonBinding.events.emit(`${this.path}requests/remove`, receipient_coid_provider_id).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The company was not found.");
            } else if(res === 'ALREADY_REMOVED') {
                infoDialog.open("The company has already been removed.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res === true) {
                request.data.status = 'SenderRemoved';
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(idx, item);
                });
                infoDialog.open("Company successfully removed.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
//            if(user.id === this.item.id) {
//                extendObservable(user.data, data);
//                storage.update.updateDBUser(storage.loggedUser);
//            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    
    onSendRequest(evt, btn) {
        const {idx} = btn.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id: receipient_coid_provider_id, data: {created_at, name, address, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        
        progressDialog.open();
        neonBinding.events.emit(`${this.path}requests/send`, receipient_coid_provider_id).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The company was not found.");
            } else if(res === 'ALREADY_SENT') {
                infoDialog.open("The request has already been sent.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res) {
                item.data.request = res;
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(idx, item);
                });
                infoDialog.open("Request successfully sent.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    
    onCancelRequest(evt, btn) {
        const {idx} = btn.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id: receipient_coid_provider_id, data: {created_at, name, address, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        
        progressDialog.open();
        neonBinding.events.emit(`${this.path}requests/cancel`, receipient_coid_provider_id).then(res => {
            console.log("res", res)
            if(res === 'NOT_FOUND') {
                infoDialog.open("The company was not found.");
            } else if(res === 'NOT_FOUND_REQUEST') {
                infoDialog.open("The request no longer exist.");
            } else if(res === 'UPDATE_ERROR') {
                infoDialog.open("An error occurred. Please try again.");
            } else if(res === true) {
                request.data.status = 'Cancelled';
                setTimeout(() => {
                    list.removeIf(v => v.id === item.id);
                    list.insertAt(idx, item);
                });
                infoDialog.open("Request successfully cancelled.");
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {id: receipient_coid_provider_id, data: {created_at, name, address, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        
        const remove = status === 'Accepted';
        const sendRequest = status !== 'New' && status !== 'Accepted' && status !== 'Declined' && status !== 'RecipientRemoved';
        const cancelRequest = status === 'New';
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {(remove || sendRequest || cancelRequest) && <hr />}
            {remove && <NavItem onClick={this.onRemove} faIconLeft="check" title="Remove"/>}
            {sendRequest && <NavItem onClick={this.onSendRequest} faIconLeft="send" title="Send Request"/>}
            {cancelRequest && <NavItem onClick={this.onCancelRequest} faIconLeft="ban" title="Cancel Request"/>}
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="name" type="text" placeholder="Name" className="col-lg-12 form-control margin-b-10" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Service Provider Name</div>
            <div className="td">Address</div>
            <div className="td fixed-flex min-w-120">Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];        
        const {id: receipient_coid_provider_id, data: {created_at, name, address, request = {}}} = item;
        const {data = {}} = request;
        const {status = 'N/A'} = data;
        console.log(item)
        return <TRow key={"item-" + n}>
            <div className="td">{name}</div>
            <div className="td">{address || 'N/A'}</div>
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
            pageTitle="COID Service Providers"
            pageTitleSingular="coid provider"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
        </APageListReadWrite>;
    }
}

export default COIDServiceProvidersTab;
