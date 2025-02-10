import React from "react";
import {observer} from 'mobx-react';

import Popover from 'components/popovers/Popover';
import NavItem from 'components/navs/NavItem';

import NewScreeningDialog from './dialogs/NewScreeningDialog';
//import ProfileScreeningDialog from './dialogs/ProfileScreeningDialog';
import EmployeeScreeningDialog from './dialogs/EmployeeScreeningDialog';

import ListScreeningDialog from './dialogs/ListScreeningDialog';

import ATab from './ATab_1';
import ATabEmployee from './ATabEmployee';

import style from "./ScreeningTab.lazy.css";

@observer
class ScreeningTab extends React.Component {
    path;
    pageKey = "ScreeningTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'screening/';
        
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onSubmitDataOptions = this.onSubmitDataOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
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
    
    render() {
        const {permissionKey} = this.props;
        const props = {
            ref: "root",
            pageId: this.pageKey + "-tab",
            pageTitle: "Screening Cases",
            pageTitleSingular: "screening case",
            path: this.path,
            NewDialog: NewScreeningDialog,
            permissionKey
        };
        let Elem;
        if(!storage.is.isEmployee) {
            Elem = ATab;
            props.EmployeeDialog = EmployeeScreeningDialog;
            props.ListDialog = ListScreeningDialog;
            props.onSubmitDataOptions = this.onSubmitDataOptions;
            props.apiSubmissionFnName = 'submitScreening';
        } else {
            Elem = ATabEmployee;
        }
        return <div className="row margin-0 pos-absolute flex">
            <Elem {...props}/>
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}

export default ScreeningTab;
