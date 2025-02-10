import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewEvaluationRecordDialog from './dialogs/NewEvaluationRecordDialog.js';
import ProfileEvaluationRecordDialog from './dialogs/ProfileEvaluationRecordDialog.js';

import style from "./EvaluationRecordTab.lazy.css";

@observer
class EvaluationRecordTab extends React.Component {
    path;
    pageKey = "EvaluationRecordTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'evaluation-record/';

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
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
            <ClearableInput name="method_of_announcing_emergency" type="text" placeholder="Method Of Announcing Emergency" className="form-control" onChange={onChange}/>
            <ClearableInput name="training_date" type="date" placeholder="Training Date..." className="form-control fixed-flex min-w-280" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-140">Training Date</div>
            <div className="td fixed-flex min-w-140">Starting Time</div>
            <div className="td fixed-flex min-w-140">Ending Time</div>
            <div className="td">Method Of Announcing Emergency</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, training_date, starting_time, ending_time, method_of_announcing_emergency}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-140">{Dates.formatDate(training_date)}</div>
            <div className="td fixed-flex min-w-140">{starting_time}</div>
            <div className="td fixed-flex min-w-140">{ending_time}</div>
            <div className="td">{method_of_announcing_emergency}</div>
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
            pageTitle="Evacuation Record"
            pageTitleSingular="evacuation record"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewEvaluationRecordDialog ref="newDialog"/>
            <ProfileEvaluationRecordDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default EvaluationRecordTab;
