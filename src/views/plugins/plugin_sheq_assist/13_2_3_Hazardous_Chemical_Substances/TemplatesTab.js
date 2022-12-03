import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import {Dates, RisksCodes} from "../../../../utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    Button,
    ClearableInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput
} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

//import NewTemplateDialog from './dialogs/NewTemplateDialog.js';
//import EditTemplateDialog from './dialogs/EditTemplateDialog.js';
//import ProfileTemplateDialog from './dialogs/ProfileTemplateDialog.js';
//
//import NewScheduleDialog from './dialogs/NewScheduleDialog.js';
import style from "./TemplatesTab.lazy.css";

@observer
class TemplatesTab extends React.Component {
    path;
    pageKey = "TemplatesTab";
    
    @observable
    state = {
        lists: {
            risk_level: ['Low', 'Medium', 'High', 'Very High'],
            visibility: ['Private', 'Public']
        }
    }

    constructor(props) {
        super(props);

        this.path = props.path + 'msds/templates/';

        this.onCopy = this.onCopy.bind(this);
        this.onUse = this.onUse.bind(this);
        
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
    
    onUse(evt, elem) {
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
            <NavItem action="writable" idx={idx} onClick={this.onUse} faIconLeft="plus" title="Use Template"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Product Name" className="form-control" onChange={onChange}/>
            <SelectChemicalCategoryInput name="category" placeholder="Category..." className="form-control" onChange={onChange}/>
            <SelectChemicalManufacturerInput name="manufacturer" placeholder="Manufacturer..." className="form-control" onChange={onChange}/>
            <ClearableInput name="risk_level" type="select" placeholder="Risk Level..." className="fixed-flex min-w-200 form-control" onChange={onChange} values={this.state.lists.risk_level} returnValue/>
            <ClearableInput name="visibility" type="select" placeholder="Visibility..." className="fixed-flex min-w-200 form-control" onChange={onChange} values={this.state.lists.visibility} returnValue/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-120">Date Identified</div>
            <div className="td">Product Name</div>
            <div className="td fixed-flex min-w-180">Emergency Phone No.</div>
            <div className="td">Category</div>
            <div className="td">Manufacturer</div>
            <div className="td fixed-flex min-w-120">Risk Level</div>
            <div className="td fixed-flex min-w-80">Visibility</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(idx, onClick) {
        const item = this.refs.root.list[idx];
        const {id, data: {created_at, name, category, manufacturer, risk_level, emergency_phone, date_identified, doc, company}} = item;
//        console.log('form', item)
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-120 md-hidden">
                <h6 className="xs-shown font-size-13">Date Created</h6>
                {Dates.formatDate(created_at)}
            </div>
            <div className="td fixed-flex min-w-120 md-hidden">
                <h6 className="xs-shown font-size-13">Date Identified</h6>
                {Dates.formatDate(date_identified)}
            </div>
            <div className="td md-hidden">
                <h6 className="xs-shown font-size-13">Product Name</h6>
                {name}
            </div>
            <div className="td fixed-flex min-w-180 md-hidden">
                <h6 className="xs-shown font-size-13">Emergency Phone No.</h6>
                {emergency_phone}
            </div>
            <div className="td md-hidden">
                <h6 className="xs-shown font-size-13">Category</h6>
                {category}
            </div>
            <div className="td md-hidden">
                <h6 className="xs-shown font-size-13">Manufacturer</h6>
                {manufacturer}
            </div>
            <div className={"td fixed-flex min-w-120 md-hidden " + RisksCodes.colorClassName(risk_level)}>
                <h6 className="xs-shown font-size-13">Risk Level</h6>
                <Button className="btn btn-primary pull-right min-w-40" text={risk_level}/>
            </div>
            <div className="td fixed-flex min-w-80 md-hidden">
                <h6 className="xs-shown font-size-13">Visibility</h6>
                {company ? "Private" : "Public"}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
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
            
            {/*<NewTemplateDialog ref="newDialog"/>
            <EditTemplateDialog ref="editDialog"/>
            <ProfileTemplateDialog ref="profileDialog"/>
            
            <NewScheduleDialog ref="newScheduleDialog"/>*/}
        </APageListReadWrite>;
    }
}

export default TemplatesTab;
