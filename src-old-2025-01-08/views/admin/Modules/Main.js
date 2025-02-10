import React from "react";
import {observer} from 'mobx-react';
import APageListReadWrite from "../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Main.lazy.css";

@observer
class Main extends React.Component {
    static key = 'Modules';

    pageKey = "Modules";
    
    state = {
        lists: {
            app: ['Admin', 'Client'].map(label => {
                return {label, value: label};
            }),
            status: ['Installed', 'Not Installed', 'Upcoming'].map(label => {
                return {label, value: label.replace(' ', '')};
            })
        }
    };

    constructor(props) {
        super(props);
        
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    async onLoadListFilter(list, filterData, data) {
        const {app, status, name} = filterData;
        return list.filter(({data}) => {
            if(app && data.app === app) {
                return true;
            }
            if(status && data.status === status) {
                return true;
            }
            if(name && data.name && data.name.toLowerCase().startsWith(name.toLowerCase())) {
                return true;
            }
            return false;
        });
    }
    
    async onLoadList(page, isNew) {
        const {listAll} = pluginManager;
        return listAll;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Clients";
        const {key} = pluginManager.selected;
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="app" type="select" placeholder="Application..." className="form-control" onChange={onChange} values={this.state.lists.app} returnValue/>
            <ClearableInput name="status" type="select" placeholder="Status..." className="form-control" onChange={onChange} values={this.state.lists.status} returnValue/>
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Application</div>
            <div className="td">Group</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-105">Companies</div>
            <div className="td fixed-flex min-w-85">Installed</div>
            <div className="td fixed-flex min-w-120">Non-Installed</div>
            <div className="td fixed-flex min-w-100">Upcoming</div>
            <div className="td fixed-flex min-w-60">Total</div>
            <div className="td fixed-flex min-w-105">Has Update</div>
            <div className="td fixed-flex min-w-90">Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {app, title, key, desc, modules = [], status}} = item;
        const company_list_ids = modules.map(v => (v.company_list || []).map(v => v.id).distinct()).
                reduce((a1, a2) => [...a1, ...a2], []).distinct();
        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{app}</div>
            <div className="td">{title}</div>
            <div className="td">{desc}</div>
            <div className="td fixed-flex min-w-105">{company_list_ids.length}</div>
            <div className="td fixed-flex min-w-85">{modules.filter(val => val.status === 'Installed').length}</div>
            <div className="td fixed-flex min-w-120">{modules.filter(val => val.status === 'NotInstalled').length}</div>
            <div className="td fixed-flex min-w-100">{modules.filter(val => val.status === 'Upcoming').length}</div>
            <div className="td fixed-flex min-w-60">{modules.length}</div>
            <div className="td fixed-flex min-w-105">{modules.filter(val => val.has_update).length}</div>
            <div className="td fixed-flex min-w-90">{status}</div>
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
            pageTitle="Module Management"
            pageTitleSingular="module"
            hasCreateBtn={() => true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            onLoadListFilter={this.onLoadListFilter}
            onLoadList={this.onLoadList}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog"/>
            <EditDialog ref="editDialog"/>
        </APageListReadWrite>;
    }
}

export default Main;//313, 237
