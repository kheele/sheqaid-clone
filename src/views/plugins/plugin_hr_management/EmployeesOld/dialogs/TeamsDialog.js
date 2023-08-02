// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTeamDialog from "./NewTeamDialog";
import ProfileTeamDialog from "./ProfileTeamDialog";
import EditTeamDialog from "./EditTeamDialog";

import style from "./TeamsDialog.lazy.css";

// </editor-fold>

@observer
class TeamsDialog extends ADialogList {
    path;
    pageKey = "TeamsDialog";
    title = "Teams";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'teams/';
        
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

    // <editor-fold defaultstate="collapsed" desc="renderFuns">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Teams";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Team Name" className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Date Created</div>
            <div className="td">Supervisor</div>
            <div className="td">Team Name</div>
            <div className="td fixed-flex min-w-100">Employees</div>
            <div className="td fixed-flex min-w-100">PPEs</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, supervisor: {lname, fname, data}, name, list, ppe_list}} = item;
//        console.log(item)
        return <TRow key={id}>
            <div className="td">{Dates.formatDate(created_at)}</div>
            <div className="td">{(lname || data.lname) + " " + (fname || data.fname)}</div>
            <div className="td">{name}</div>
            <div className="td fixed-flex min-w-100">{list ? list.length : 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{ppe_list ? ppe_list.length : 'N/A'}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="team"
            pageTitleSingular="team"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewTeamDialog ref="newDialog" path={this.path}/>
            <ProfileTeamDialog ref="profileDialog" path={this.path}/>
            <EditTeamDialog ref="editDialog" path={this.path}/>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default TeamsDialog;
