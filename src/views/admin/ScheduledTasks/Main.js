import React from "react";
import {observer} from 'mobx-react';

import {Dates} from '../../../utils/Utils';
import APageListReadWrite from "../../APageListReadWrite";
import NavItem from '../../../components/navs/NavItem';
import {ConfirmDialog} from '../../../components/dialogs';
import {ActionsButton, ClearableInput} from '../../../components/inputs';
import {THead, TRow} from '../../../components/tables';

import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Main.lazy.css";

@observer
class Main extends React.Component {
    static key = 'ScheduledTasks';

    pageKey = "ScheduledTasks";
    
    path = "admin/scheduled-tasks/";

    constructor(props) {
        super(props);
        
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "ScheduledTasks";
        const {key} = pluginManager.selected;
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-lg-4 grid-xs-6 grid-gap-5">
            <ClearableInput name="group_name" type="text" placeholder="Group Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="group_key" type="text" placeholder="Group Key" className="form-control" onChange={onChange}/>
            <ClearableInput name="id" type="text" placeholder="ID" className="form-control" onChange={onChange}/>
            <ClearableInput name="status" type="text" placeholder="Status" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Group Name</div>
            <div className="td">Group Key</div>
            <div className="td">ID</div>
            <div className="td fixed-flex min-w-120">Performed At</div>
            <div className="td fixed-flex min-w-90">Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {group_name, group_key, performedAt, status}} = item;
        return <TRow key={id}>
            <div className="td">{group_name}</div>
            <div className="td">{group_key}</div>
            <div className="td">{id}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDateTime(performedAt) || 'N/A'}</div>
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
            pageTitle="Scheduled Task Management"
            pageTitleSingular="scheduled task"
            hasCreateBtn={() => true}
            path={this.path}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog"/>
            <EditDialog ref="editDialog"/>
        </APageListReadWrite>;
    }
}

export default Main;
