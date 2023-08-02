import React from "react";
import {observer} from 'mobx-react';

import {Dates, Permissions} from 'utils/Utils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ImportDepartmentsDialog from "./ImportDepartmentsDialog";
import NewDepartmentDialog from "./NewDepartmentDialog";
import ProfileDepartmentDialog from "./ProfileDepartmentDialog";
import EditDepartmentDialog from "./EditDepartmentDialog";

import style from "./DepartmentsDialog.lazy.css";

@observer
class DepartmentsDialog extends ADialogList {
    path;
    pageKey = "DepartmentsDialog";
    title = "Departments";

    constructor(props) {
        super(props);

        this.path = props.path + 'departments/';
        
	this.onImport = this.onImport.bind(this);
	this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onImport(e, btn) {
        this.refs.importDialog.open().then(list => {
            this.refs.root.list.push(...list);
        });
    }
	
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        if(isReadonly) return null;
        const {permissions_other} = storage.loggedUser.user.data;
        const permissions_other_Departments = (permissions_other || []).find(v => v.key === "Departments");
        
	return <div className="left-buttons pull-left">
            {Permissions.allow(permissions_other_Departments) && <Button className="btn btn-primary pull-right min-w-110" onClick={this.onImport}>
                Import Departments
            </Button>}
	</div>;
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Departments";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Date Created</div>
            <div className="td">Name</div>
            <div className="td fixed-flex min-w-100">PPEs</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, name, ppe_list}} = item;
        return <TRow key={id}>
            <div className="td">{Dates.formatDate(created_at)}</div>
            <div className="td">{name}</div>
            <div className="td fixed-flex min-w-100">{ppe_list ? ppe_list.length : 'N/A'}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="department"
            pageTitleSingular="department"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <ImportDepartmentsDialog ref="importDialog" path={this.path}/>
            <NewDepartmentDialog ref="newDialog" path={this.path}/>
            <ProfileDepartmentDialog ref="profileDialog" path={this.path}/>
            <EditDepartmentDialog ref="editDialog" path={this.path}/>
        </APageListReadWrite>;
    }

}

export default DepartmentsDialog;
