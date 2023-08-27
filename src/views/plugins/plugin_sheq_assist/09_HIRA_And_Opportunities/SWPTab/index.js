import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./SWPTab.lazy.css";

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, SelectDepartmentInput, SelectEmployeeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AsyncTD} from 'views/plugins/components';

import NewSWPDialog from './forms/NewSWPDialog';
import ProfileSWPDialog from './forms/ProfileSWPDialog';
import EditSWPDialog from './forms/EditSWPDialog';
import byLogged from "./Query/List/listAllSWPByLogged";

@observer
class SWPTab extends React.Component {

    pageKey = "SWPTab";
    @observable
    state = {
        lists: {
        }
    };

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

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

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            //
            category,
            work_task,
            location,
            department,
            person_approving_procedure,
        } = filterData || {};

        const limit = 50;

        const args = {
            removed: false,
            //
            category,
            work_task,
            location,
            department,
            person_approving_procedure,
            //
            limit,
            //
            exact_orgs: true,
        };

        if(!isNew) {
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

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="category" type="text" placeholder="Category" className="form-control" onChange={onChange}/>
            <ClearableInput name="work_task" type="text" placeholder="Work Task" className="form-control" onChange={onChange}/>
            <ClearableInput name="location" type="text" placeholder="Location" className="form-control" onChange={onChange}/>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="person_approving_procedure" placeholder="Person Approving..." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Category</div>
            <div className="td">Work Task</div>
            <div className="td">Location</div>
            <div className="td">Department</div>
            <div className="td">Person Approving</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, category, work_task, location, department, person_approving_procedure, doc}} = item;
        console.log('swp', item)
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-40">{id}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{category}</div>
            <div className="td">{work_task}</div>
            <div className="td">{location}</div>
            <div className="td">{department ? department.name : "N/A"}</div>
            <div className="td">{person_approving_procedure && person_approving_procedure.full_name || "N/A"}</div>
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
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Safe Work Procedure"
            pageTitleSingular="safe work procedure"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <ProfileSWPDialog ref="profileDialog"/>
            <NewSWPDialog ref="newDialog"/>
            <EditSWPDialog ref="editDialog"/>
        </APageListReadWrite>;
    }
}

export default SWPTab;
