import React from "react";
import {observer} from 'mobx-react';

import NavItem from '../../../../components/navs/NavItem';

import NewPositiveApprovalDialog from './dialogs/NewPositiveApprovalDialog';
//import ProfilePositiveDialog from './dialogs/ProfilePositiveDialog';
import EmployeePositiveDialog from './dialogs/EmployeePositiveDialog';

import ATab from './ATab_1';
import ATabEmployee from './ATabEmployee';

import style from "./PositiveUnApprovedTab.lazy.css";

@observer
class PositiveUnApprovedTab extends React.Component {
    path;
    pageKey = "PositiveUnApprovedTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'unapproved/';
        
        this.onApprove = this.onApprove.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onApprove(e, el) {
        const {idx} = el.props;
        console.log(this.refs.root)
        const item = this.refs.root.refs.root.list[idx];
        this.refs.approveDialog.open(item).then(res => {
            
        });
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options location="top" idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="writable" onClick={this.onApprove} faIconLeft="check" title="Approve Case"/>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View Profile"/>
            <NavItem action="view" onClick={this.onViewStatus} faIconLeft="eye" title="View Details"/>
        </Options>;
    }

    render() {
        const {permissionKey} = this.props;
        const props = {
            ref: "root",
            pageId: this.pageKey + "-tab",
            pageTitle: "Positive Cases (Not Approved)",
            pageTitleSingular: "positive case (not approved)",
            path: this.path,
            permissionKey
        };
        let Elem;
        if(!storage.is.isEmployee) {
            Elem = ATab;
            props.renderPopoverOptions = this.renderPopoverOptions;
            props.EmployeeDialog = EmployeePositiveDialog;
        } else {
            Elem = ATabEmployee;
        }
        return <div className="row margin-0 pos-absolute flex">
            <Elem {...props}/>
            <NewPositiveApprovalDialog ref="approveDialog"/>
        </div>;
    }
}

export default PositiveUnApprovedTab;
