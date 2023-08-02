import React from "react";
import {observer} from 'mobx-react';

import style from "./EmergencyDrillMatrixDialog.lazy.css";

import {Dates} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewDialog from "./NewEmergencyDrillMatrixDialog";
import ProfileDialog from './ProfileEmergencyDrillMatrixDialog';

@observer
class EmergencyDrillMatrixDialog extends ADialogList {

    path;
    pageKey = "EmergencyDrillMatrixDialog";
    title = "Emergency Drill Matrix";

    constructor(props) {
        super(props);
        
        this.path = props.path + "matrix/";

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
            <ClearableInput name="date" type="date" placeholder="Date..." className="fixed-flex min-w-280 form-control" onChange={onChange}/>
            <ClearableInput name="title" type="text" placeholder="Title" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-180">Date</div>
            <div className="td">Title</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {title, date, list}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-180">{Dates.formatDate(date)}</div>
            <div className="td">{title}</div>
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
            listCountTopTitle="emergency drill matrix"
            pageTitleSingular="emergency drill matrix"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }

}

export default EmergencyDrillMatrixDialog;
