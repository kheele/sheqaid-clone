import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "../../../../utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewNCRDialog from './dialogs/NewNCRDialog.js';
import ProfileNCRDialog from './dialogs/ProfileNCRDialog.js';

import style from "./NCRTab.lazy.css";

@observer
class NCRTab extends React.Component {
    path;
    pageKey = "NCRTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'ncr/';

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
            <ClearableInput name="non_conformance_num" type="text" placeholder="Non-Conformance No." className="form-control" onChange={onChange}/>
            <ClearableInput name="identified_by" type="text" placeholder="Identified By" className="form-control" onChange={onChange}/>
            <ClearableInput name="department_or_area" type="text" placeholder="Department / Area" className="form-control" onChange={onChange}/>
            <ClearableInput name="date_recorded" type="date" placeholder="Date Recorded..." className="form-control fixed-flex min-w-220" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex td-date">Date Recorded</div>
            <div className="td">Non-Conformance No.</div>
            <div className="td">Identified By</div>
            <div className="td">Department / Area</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, date_recorded, non_conformance_num, identified_by, department_or_area}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex td-date">{Dates.formatDate(date_recorded)}</div>
            <div className="td">{non_conformance_num}</div>
            <div className="td">{identified_by}</div>
            <div className="td">{department_or_area}</div>
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
            pageTitle="Non-Conformance Report"
            pageTitleSingular="non-conformance report"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewNCRDialog ref="newDialog"/>
            <ProfileNCRDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default NCRTab;
