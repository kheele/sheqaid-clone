import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import {Dates} from "../../../../utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewTemplateDialog from './dialogs/NewTemplateDialog.js';
import EditTemplateDialog from './dialogs/EditTemplateDialog.js';
import ProfileTemplateDialog from './dialogs/ProfileTemplateDialog.js';

import NewScheduleDialog from './dialogs/NewScheduleDialog.js';

import style from "./TemplatesTab.lazy.css";

@observer
class TemplatesTab extends React.Component {
    path;
    pageKey = "TemplatesTab";
    
    @observable
    state = {
        lists: {
            scheduled: [{text: "Yes", value: "Yes"}, {text: "No", value: "No"}],
            type: [{text: "Checklist", value: "Checklist"}, {text: "Inspection", value: "Inspection"}, {text: "Register", value: "Register"}]
        }
    }

    constructor(props) {
        super(props);

        this.path = props.path + 'forms/';

        this.onCopy = this.onCopy.bind(this);
        this.onSchedule = this.onSchedule.bind(this);
        this.onStart = this.onStart.bind(this);
        
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
    
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }

    onSchedule(evt, elem) {
        const {idx, action} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.newScheduleDialog.open(item);
    }

    onStart(evt, elem) {
        const {idx, action} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.newScheduleDialog.open(item);
    }
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {id, data: {created_at, form: {name, type, desc, questions}, scheduled}} = item;
        
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} action={type} onClick={this.onSchedule} faIconLeft="plus" title={"Schedule " + type}/>
            <NavItem action="writable" idx={idx} action={type} onClick={this.onStart} faIconLeft="plus" title={"Start " + type}/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="radio" placeholder="Type" className="form-control" onChange={onChange} values={this.state.lists.type}/>
            <ClearableInput name="scheduled" type="radio" placeholder="Scheduled" className="form-control" onChange={onChange} values={this.state.lists.scheduled}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Name</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-100">Type</div>
            <div className="td fixed-flex min-w-80">Visibility</div>
            <div className="td fixed-flex min-w-80">Scheduled</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, form: {name, type, desc, questions}, company, scheduled}} = item;
//        console.log('form', item)
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{name}</div>
            <div className="td">{desc || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{type}</div>
            <div className="td fixed-flex min-w-80">{company ? "Private" : "Public"}</div>
            <div className="td fixed-flex min-w-80">{scheduled ? "Yes" : "No"}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Templates"
            pageTitleSingular="template"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewTemplateDialog ref="newDialog"/>
            <EditTemplateDialog ref="editDialog"/>
            <ProfileTemplateDialog ref="profileDialog"/>
            
            <NewScheduleDialog ref="newScheduleDialog"/>
        </APageListReadWrite>;
    }
}

export default TemplatesTab;
