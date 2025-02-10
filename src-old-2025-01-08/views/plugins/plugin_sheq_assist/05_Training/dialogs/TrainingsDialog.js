import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import style from "./TrainingsDialog.lazy.css";

@observer
class TrainingsDialog extends ADialogList {
    path = {path: 'plugin_sheq_assist/05_Trainings/training-matrix/list/search_by', data: null};
    pageKey = "TrainingsDialog";

    constructor(props) {
        super(props);

    }
    
    open(key, value){
        this.path.data = {key, value};
        this.title = 'Training Matrix (' + value + ')';
        return super.open();
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
        return <div className="col-lg-12 controls">
            <ClearableInput name="status" type="text" placeholder="Status" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="requirement" type="text" placeholder="Requirement" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="training_provider_requirement" type="text" placeholder="Accreditation" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="hr" type="text" placeholder="HR" className="col-lg-6 form-control" onChange={onChange}/>
            <ClearableInput name="course_or_module" type="text" placeholder="Course" className="col-lg-6 form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-110">Date Created</div>
            <div className="td fixed-flex min-w-100">Status</div>
            <div className="td fixed-flex min-w-120">Accreditation</div>
            <div className="td">HR</div>
            <div className="td">Job Title</div>
            <div className="td">Course</div>
            <div className="td fixed-flex min-w-100">Requirement</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        let {id, created_at, data:{status, training_provider_requirement, hr, job_title, course_or_module, requirement, certificate_expiration}} = item;
        course_or_module = isObject(course_or_module) ? (course_or_module.name || course_or_module.data.name) : (course_or_module || 'N/A');
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-100">{status}</div>
            <div className="td fixed-flex min-w-120">{training_provider_requirement}</div>
            <div className="td">{hr.fname + ' ' + hr.lname}</div>
            <div className="td">{job_title}</div>
            <div className="td">{course_or_module}</div>
            <div className="td fixed-flex min-w-100">{requirement}</div>
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
            hasCreateBtn={() => false}
            pageId={this.pageKey + '-page'}
            listCountTopTitle="training matrix"
            pageTitleSingular="training matrix"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
        </APageListReadWrite>;
    }

}

export default TrainingsDialog;
