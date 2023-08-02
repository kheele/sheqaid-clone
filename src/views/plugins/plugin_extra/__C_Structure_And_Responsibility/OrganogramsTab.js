import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./OrganogramsTab.lazy.css";

import {calculateRightPos, Dates} from "utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, Clickable} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewOrganogramDialog from './dialogs/NewOrganogramDialog';
import ProfileOrganogramDialog from './dialogs/ProfileOrganogramDialog';
import EditOrganogramDialog from './dialogs/EditOrganogramDialog';

@observer
class OrganogramsTab extends React.Component {

    path;
    pageKey = "OrganogramsTab";
    @observable
    state = {
        lists: {
            target: [{label: 'Company', value: 'Client'}, {label: 'Project', value: 'Project'}, {label: 'Site', value: 'Site'}],
            types: [{value: "Upload", text: "PDF / Spreadsheet", checked: false}, {value: "Type", text: "Typed", checked: false}]
        }
    };

    constructor(props) {
        super(props);

        this.path = props.path + 'organograms/';
        
        this.onViewByDoc = this.onViewByDoc.bind(this);
        
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
    
    onViewByDoc(e, btn) {
        const {idx} = btn.props;
        this.refs.root.onView(e, btn);
    }
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        const {isHasProjects} = storage.is;
        if(isHasProjects) {
            return <div className="col-lg-12 controls flex">
                <ClearableInput name="type" type="radio" placeholder="Source" className="fixed-flex min-w-400 form-control" onChange={onChange} values={this.state.lists.types} returnValue/>
                <ClearableInput name="_target" type="select" placeholder="Target..." className="fixed-flex min-w-270 form-control" onChange={onChange} values={this.state.lists.target} returnValue/>
                <ClearableInput name="name" type="text" placeholder="Company/Client, Project, Site Name" className="form-control" onChange={onChange}/>
            </div>;
        }
        return <div className="col-lg-12 controls">
            <ClearableInput name="type" type="radio" placeholder="Source" className="col-lg-12 form-control" onChange={onChange} values={this.state.lists.types} returnValue/>
        </div>;
    }

    renderTHead() {
        const {isHasProjects} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Source</div>
            <div className="td">Target</div>
            {isHasProjects && <div className="td">Company</div>}
            {isHasProjects && <div className="td">Project</div>}
            {isHasProjects && <div className="td">Site</div>}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, _target, client, project, site, type, doc, list}} = item;
//        console.log('Organogram', item)
        const {isHasProjects} = storage.is;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{doc ? <Clickable idx={n} onClick={this.onViewByDoc}><a href="#">PDF / Spreadsheet</a></Clickable> : "Typed"}</div>
            <div className="td">{_target === "Client" ? "Company" : _target}</div>
            
            {isHasProjects && RenderUtils.renderOrgTD(client, null, 'Company')}
            {isHasProjects && RenderUtils.renderOrgTD(project, null, 'Project')}
            {isHasProjects && RenderUtils.renderOrgTD(site, null, 'Site')}
            
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                <RemovedListWarning idx={n} list={list}/>
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
            pageTitle="Organograms"
            pageTitleSingular="organogram"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <ProfileOrganogramDialog ref="profileDialog"/>
            <NewOrganogramDialog ref="newDialog"/>
            <EditOrganogramDialog ref="editDialog"/>
        </APageListReadWrite>;
    }
}

@observer
class RemovedListWarning extends React.Component {
    
    @observable state = {
        removedListCount: 0
    };
    
    constructor(props) {
        super(props);

        this.onRemovedListShowWarningMsg = this.onRemovedListShowWarningMsg.bind(this);
    }
    
    componentDidMount() {
        const {list} = this.props;
        if(!list || list.isEmpty()) return;
        
        const removedList = [];
        list.forEach(({employee, employeeReportedTo, employee_list, team}) => {
            if(employee && employee.data.removed) {
                removedList.push(employee.id);
            }
            if(employeeReportedTo && employeeReportedTo.data.removed) {
                removedList.push(employeeReportedTo.id);
            }
            if(employee_list) {
                const removedMembers = employee_list.filter(({data: {removed}}) => removed).map(({id}) => id);
                removedList.push(...removedMembers);
            }
        });
        this.state.removedListCount = removedList.distinct().length;
    }

    onRemovedListShowWarningMsg(evt) {
        const {idx, getPopover} = this.props;
        let elem = window.$(evt.target);
        
        const offset = elem.offset();
        const style = {left: "auto", right: calculateRightPos(elem[0], false) + 10, top: offset.top, width: 290};
        popover.settings({
            style, 
            isDialog: false,
            contentNode: <div>
                <p className="nav-item padding-10 margin-0">
                    <b>{this.state.removedListCount}</b> employee(s) have been removed.<br/>
                    Please remove/replace them from this organogram.
                </p>
            </div>
        }).open();
    }
    
    render() {
        if(this.state.removedListCount === 0) return null;
        return <i className="fa fa-warning" onClick={this.onRemovedListShowWarningMsg}/>;
    }
}

export default OrganogramsTab;
