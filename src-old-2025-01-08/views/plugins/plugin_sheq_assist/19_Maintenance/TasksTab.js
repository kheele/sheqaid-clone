import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./TasksTab.lazy.css";

import APageListReadWrite from "views/APageListReadWrite";
import {Dates} from "utils/Utils";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTaskDialog from './dialogs/NewTaskDialog.js';
import ProfileTaskDialog from './dialogs/ProfileTaskDialog.js';

@observer
class TasksTab extends React.Component {
    path;
    pageKey = "TasksTab";

    @observable
    state = {
    };
    
    constructor(props) {
        super(props);

        this.path = props.path + 'tasks/';

        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="title" type="text" placeholder="Title" className="form-control" onChange={onChange}/>
            <ClearableInput name="start" type="date" placeholder="Starts On..." className="fixed-flex min-w-180 form-control" onChange={onChange}/>
            <ClearableInput name="end" type="date" placeholder="Ends On..." className="fixed-flex min-w-180 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Task</div>
            <div className="td fixed-flex min-w-120">Starts On</div>
            <div className="td fixed-flex min-w-120">Ends On</div>
            <div className="td fixed-flex min-w-70 padding-l-0 padding-r-0"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, title, desc, start, end}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td td-task">{title}{desc && <p className="margin-t-5 margin-b-0">{desc}</p>}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(start)}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(end)}</div>
            <div className="td fixed-flex min-w-60 padding-l-0 padding-r-0">
                <Button idx={n} className="btn btn-primary pull-right w-40" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Tasks"
            pageTitleSingular="task"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewTaskDialog ref="newDialog"/>
            <ProfileTaskDialog ref="profileDialog"/>        
        </APageListReadWrite>;
    }
}

export default TasksTab;