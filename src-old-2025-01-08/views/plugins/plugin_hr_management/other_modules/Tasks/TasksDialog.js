// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {renderExpiryDateGreyOrGreenSpan, renderLeftButtonsForTasksExpiryOnly} from 'utils/ComponentUtils';
import {Dates} from 'utils/Utils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, DateRangeInput, SelectEmployeeInput, SelectUserInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTaskDialog from 'views/plugins/plugin_general/Calendar/NewTaskDialog';
import ProfileTaskDialog from 'views/plugins/plugin_general/Calendar/ProfileTaskDialog';
import EditTaskDialog from 'views/plugins/plugin_general/Calendar/EditTaskDialog';

import style from "./TasksDialog.lazy.css";

// </editor-fold>

@observer
class TasksDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = 'plugin_sheq_assist/calendar/tasks/';
    pageKey = "TasksDialog";
    title = "Tasks";

    @observable
    selfState = {
        lists: {
            categories: ['General Task', 'Specific Task', 'NCR Action'],
            expiry_date: [{label: 'Expired', value: -1}, {label: '1 month', value: 1}, {
                label: '2 months',
                value: 2
            }, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.classNames += "LeftButtonsForExpiryOnlyPage";

        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {isRemoved} = this.props;
        const permissionKey = "Tasks";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {!isRemoved && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {!isRemoved && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls padding-r-10 grid-lg-3 grid-gap-5">
            <SelectEmployeeInput name="person_assigned" placeholder="Task Assigned To..." className="form-control"
                                 onChange={onChange} addButton={false}/>
            <SelectUserInput name="assigned_by" placeholder="Task Assigned By..." defaultUser className="form-control"
                             onChange={onChange} addButton={false}/>
            <ClearableInput name="category" type="select" placeholder="Task Category..." className="form-control"
                            onChange={onChange} values={this.selfState.lists.categories} returnValue/>
            <ClearableInput name="type" type="text" placeholder="Type Of Task" className="form-control"
                            onChange={onChange}/>
            <DateRangeInput name="date_range" className="form-control" placeholder="" onChange={onChange}>
                <label className="min-w-100">Start Date</label>
                <label className="min-w-100">End Date</label>
            </DateRangeInput>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-140">Date Created</div>
            <div className="td">Task Assigned By</div>
            <div className="td">Task Assigned To</div>
            <div className="td">Type Of Task</div>
            <div className="td fixed-flex min-w-140">Task Category</div>
            <div className="td fixed-flex min-w-100">Start Date</div>
            <div className="td fixed-flex min-w-100">Due Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, desc, category, type, person_assigned, assigned_by, start, end}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-140">{Dates.formatDate(created_at)}</div>
            <div className="td">{assigned_by ? (assigned_by.lname + ' ' + assigned_by.fname) : 'N/A'}</div>
            <div className="td">{person_assigned.lname + ' ' + person_assigned.fname}</div>
            <div className="td">{type}</div>
            <div className="td fixed-flex min-w-140">{category}</div>
            <div className="td fixed-flex min-w-100">{Dates.formatDate(start)}</div>
            <div className="td fixed-flex min-w-100">{renderExpiryDateGreyOrGreenSpan(end)}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        const {onLoadList, isRemoved} = this.props;
        return <APageListReadWrite
            ref="root"
            page={this}
            hasBackBtn={false}
            hasCreateBtn={() => !isRemoved}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="task"
            pageTitleSingular="task"
            path={this.path}
            onLoadList={onLoadList}
            noAnimation={true}
            renderLeftButtons={renderLeftButtonsForTasksExpiryOnly}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewTaskDialog ref="newDialog"/>
            <ProfileTaskDialog ref="profileDialog"/>
            <EditTaskDialog ref="editDialog"/>
        </APageListReadWrite>;
    }

}

export default TasksDialog;
