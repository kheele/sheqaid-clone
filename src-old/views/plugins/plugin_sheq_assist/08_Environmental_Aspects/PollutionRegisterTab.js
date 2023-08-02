import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "../../../../utils/Utils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewPollutionRegisterDialog from './dialogs/NewPollutionRegisterDialog.js';
import ProfilePollutionRegisterDialog from './dialogs/ProfilePollutionRegisterDialog.js';

import style from "./PollutionRegisterTab.lazy.css";

@observer
class PollutionRegisterTab extends React.Component {
    path;
    pageKey = "PollutionRegisterTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'pollution-register/';

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
            <ClearableInput name="surveyed_by" type="text" placeholder="Surveyed By" className="form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Survey Date..." className="form-control fixed-flex min-w-280" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-160">Date Created</div>
            <div className="td fixed-flex min-w-160">Survey Date</div>
            <div className="td">Surveyed By</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, date, surveyed_by}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(date)}</div>
            <div className="td">{surveyed_by.fname + ' ' + surveyed_by.lname}</div>
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
            pageTitle="Pollution Survey Register"
            pageTitleSingular="pollution survey register"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewPollutionRegisterDialog ref="newDialog"/>
            <ProfilePollutionRegisterDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default PollutionRegisterTab;
