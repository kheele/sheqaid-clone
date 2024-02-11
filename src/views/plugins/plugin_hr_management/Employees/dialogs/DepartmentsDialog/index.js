import React from "react";
import {observer} from 'mobx-react';

import {Dates, getRandomRolor, Permissions} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ImportDepartmentsDialog from "./ImportDepartmentsDialog";
import NewDepartmentDialog from "./NewDepartmentDialog";
import ProfileDepartmentDialog from "./ProfileDepartmentDialog";
import EditDepartmentDialog from "./EditDepartmentDialog";

import style from "./DepartmentsDialog.lazy.css";
import AggregateStat from "components/AggregateStat";
import updateDepartment from "mutations/all/Department/updateDepartment";

@observer
class DepartmentsDialog extends ADialogList {
    path;
    pageKey = "DepartmentsDialog";
    title = "Departments";

    constructor(props) {
        super(props);

        this.path = props.path + 'departments/';

        this.onLoadList = this.onLoadList.bind(this);

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

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        const listByLogged = sockets.of('departments').fn('listByLogged');

        return listByLogged({
            name,
            //
            exact_orgs: true,
            exact_orgs_company: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>
    
    onSoftDeleteProhibit(item) {
        const {id, data: {employee_list_aggregate}} = item;
        const prohibit = employee_list_aggregate.aggregate.count > 0;
        if(prohibit) {
            infoDialog.open(<p>
                The Department can't be removed while<br />
                there are employees attached to it.<br /><br />
                Please first remove the employees or assign<br />
                them to other Department(s) before removing<br />
                this Department.
            </p>);
        }
        return prohibit;
    }
    
    onImport(e, btn) {
        this.refs.importDialog.open().then(list => {
            this.refs.root.list.push(...list);
        });
    }

    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        if (isReadonly) return null;
        const {permissions_other} = storage.loggedUser.user.data;
        const permissions_other_Departments = (permissions_other || []).find(v => v.key === "Departments");

        return <div className="left-buttons pull-left">
            {Permissions.allow(permissions_other_Departments) &&
                <Button className="btn btn-primary pull-right min-w-110" onClick={this.onImport}>
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
        const {isConsultant} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Name</div>
            {isConsultant && <div className="td">Company</div>}
            <div className="td fixed-flex min-w-300">Stats</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at, name,
                company, client, project, site,
                ppe_list_aggregate, employee_list_aggregate, responsible_document_list_aggregate
            }
        } = item;

        const {isConsultant} = storage.is;

        return <TRow key={id}>
            <div className="td fixed-flex min-w-50">{id}</div>
            <div className="td">{name}</div>
            {isConsultant && <div className="td">
                {client ? (client.name || client.data.name) : 'All'}
            </div>}
            <div className="td fixed-flex min-w-300 flex td-stats">
                <StatsPanel item={item}/>
            </div>
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
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateDepartment}/>

            <ImportDepartmentsDialog ref="importDialog" path={this.path}/>
            <NewDepartmentDialog ref="newDialog" path={this.path}/>
            <ProfileDepartmentDialog ref="profileDialog" onSoftDelete={updateDepartment}/>
            <EditDepartmentDialog ref="editDialog" path={this.path}/>
        </APageListReadWrite>;
    }

}

// <editor-fold defaultstate="collapsed" desc="StatsPanel">
@observer
class StatsPanel extends React.Component {

    render() {
        const {
            data: {
                employee_list_aggregate, ppe_list_aggregate, responsible_document_list_aggregate,
            }
        } = this.props.item;

        return <>
            <AggregateStat title="Employees" className="h-70" value={employee_list_aggregate}/>
            <AggregateStat title="PPE" className="h-70" value={ppe_list_aggregate}/>
            <AggregateStat title="Documents Responsible" className="h-70" value={responsible_document_list_aggregate}/>
        </>;
    }
}

// </editor-fold>

export default DepartmentsDialog;
