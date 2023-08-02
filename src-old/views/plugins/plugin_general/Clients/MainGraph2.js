import React from "react";
import {observer} from 'mobx-react';

import {Dates, execWhen} from '../../../../utils/Utils';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import {ConfirmDialog} from '../../../../components/dialogs';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Main.lazy.css";
import listAllUser from "../../../../mutations/all/User/listAllUser";
import listAllClient from "../../../../mutations/all/Client/listAllClient";
import listAllClientByLoggedCompany from "../../../../mutations/all/Client/listAllClientByLoggedCompany";

@observer
class Main extends React.Component {
    static key = 'Clients';

    path = "plugin_sheq_assist/clients/";
    pageKey = "Clients";

    constructor(props) {
        super(props);

        this.onRemoved = this.onRemoved.bind(this);
        this.hasCreateBtn = this.hasCreateBtn.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onLoadList(page, isNew) {
        return listAllClientByLoggedCompany();
    }
    
    onRemoved(item) {
        storage.list.clients.removeIf(val => val.id === item.id);
    }
    
    hasCreateBtn() {
        const {isTrial} = storage.is;
        if(isTrial) {
            return execWhen(() => this.refs.root).then(root => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(root.list.length < 3);
                    }, 100);
                });
            });
        } else {
            return true;
        }
    }

    renderLeftButtons() {
        const {isTrial, isConsultant} = storage.is;
	return <div className="left-buttons pull-left">
            {isConsultant && isTrial && <label className="max-warning min-w-130">
                Max. Of 3 Companies Allowed
            </label>}
	</div>;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Clients";
        const {key} = pluginManager.selected;
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" onClick={defaultView.onOpenPage} faIconLeft="plus" title="Create Site" plugin={key} module="Sites" args={"New&client=" + idx} />
            <NavItem action="writable" onClick={defaultView.onOpenPage} faIconLeft="plus" title="Create Project" plugin={key} module="Projects" args={"New&client=" + idx} />
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Company Name" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td">Date Created</div>
            <div className="td">Company Name</div>
            <div className="td">Projects</div>
            <div className="td">Sites</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, name, project_list_aggregate, site_list_aggregate}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td">{Dates.formatDate(created_at)}</div>
            <div className="td">{name}</div>
            <div className="td">{project_list_aggregate.aggregate.count}</div>
            <div className="td">{site_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Companies / Clients"
            pageTitleSingular="company / client"
            onLoadList={this.onLoadList}
            onRemoved={this.onRemoved}
            hasCreateBtn={this.hasCreateBtn}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            loadOnScrolled={false}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog"/>
            <EditDialog ref="editDialog"/>
        </APageListReadWrite>;
    }
}

export default Main;//313, 237
