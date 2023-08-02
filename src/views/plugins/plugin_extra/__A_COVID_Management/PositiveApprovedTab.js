import React from "react";
import {observer} from 'mobx-react';

import Popover from 'components/popovers/Popover';
import NavItem from 'components/navs/NavItem';

import NewReturnToWorkDialog from './dialogs/NewReturnToWorkDialog';
//import ProfilePositiveDialog from './dialogs/ProfilePositiveDialog';
import EmployeePositiveDialog from './dialogs/EmployeePositiveDialog';

import ListPositiveDialog from './dialogs/ListPositiveDialog';

import ATab from './ATab_1';
import ATabEmployee from './ATabEmployee';

import style from "./PositiveApprovedTab.lazy.css";

@observer
class PositiveApprovedTab extends React.Component {
    path;
    pageKey = "PositiveApprovedTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'approved/';
        
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onSubmitDataOptions = this.onSubmitDataOptions.bind(this);
        
        this.onReturnToWork = this.onReturnToWork.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onReturnToWork(e, el) {
        const {idx} = el.props;
        console.log(this.refs.root)
        const item = this.refs.root.refs.root.list[idx];
        this.refs.returnToWorkDialog.open(item).then(res => {
            
        });
    }
        
    onSelectOption(e, elem) {
        const {value} = elem.props;
        this.onSuccess(value);
    }
    
    onSubmitDataOptions(e, el) {
        return new Promise((resolve, reject) => {
            this.onSuccess = resolve;
            const jqElem = $(el.getDOMNode());
            const {left, top} = jqElem.offset();
            this.refs.popover.settings({
                style: {left, top: top + jqElem.outerHeight() + 10, width: 170, minWidth: 170},
                isDialog: true,
                contentNode: <div className="ATabPopoveContent">
                    <p className="bg-f5f5f5 padding-5 text-center -margin-t-10 margin-b-0 -margin-l-10 -margin-r-10">--- Select ---</p>
                    <hr className="margin-t-0 margin-b-0 -margin-l-10 -margin-r-10"/>
                    <NavItem key={0} onClick={this.onSelectOption} value="API" title="API Submission"/>
                    <p className="bg-f5f5f5 padding-5 text-center margin-t-0 margin-b-0 -margin-l-10 -margin-r-10">
                        --- Create Report ---
                        <i className="hor-center font-size-13">(Spreadsheet)</i>
                    </p>
                    <NavItem key={1} onClick={this.onSelectOption} value="Internal" title="Internal Report"/>
                    <NavItem key={2} onClick={this.onSelectOption} value="External" title="External Report"/>
                </div>
            }).open();
        });
    }
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options location="top" idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="writable" onClick={this.onReturnToWork} faIconLeft="check" title="Return To Work"/>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View Profile"/>
            <NavItem action="view" onClick={this.onViewStatus} faIconLeft="eye" title="View Details"/>
        </Options>;
    }

    render() {
        const {permissionKey} = this.props;
        const props = {
            ref: "root",
            pageId: this.pageKey + "-tab",
            pageTitle: "Positive Cases (Approved)",
            pageTitleSingular: "positive case (approved)",
            path: this.path,
            permissionKey
        };
        let Elem;
        if(!storage.is.isEmployee) {
            Elem = ATab;
            props.renderPopoverOptions = this.renderPopoverOptions;
            props.EmployeeDialog = EmployeePositiveDialog;
            props.ListDialog = ListPositiveDialog;
            props.onSubmitDataOptions = this.onSubmitDataOptions;
            props.apiSubmissionFnName = 'submitTestData';
        } else {
            Elem = ATabEmployee;
        }
        return <div className="row margin-0 pos-absolute flex">
            <Elem {...props}/>
            <NewReturnToWorkDialog ref="returnToWorkDialog"/>
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}

export default PositiveApprovedTab;
