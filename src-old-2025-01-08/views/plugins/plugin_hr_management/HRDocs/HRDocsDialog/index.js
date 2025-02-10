// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from "mobx";

import {PageTitle} from "components";

import ADialogList from "views/ADialogList";
import style from "./DocsDialog.lazy.css";
import Tabs from "components/tabs/Tabs";
import PersonalDocsTab from "./PersonalDocsTab";
import SignableDocsTab from "./SignableDocsTab";
import PolicyDocsTab from "./PolicyDocsTab";
import ProcedureDocsTab from "./ProcedureDocsTab";
import OtherDocsTab from "./OtherDocsTab";
import Dialog from 'components/dialogs/Dialog';

// </editor-fold>

@observer
class DocsDialog extends ADialogList {
    pageKey = "DocsDialog";
    title = "Documents";

    @observable
    selfState = {index: 0};

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange, onNew, onFilter">
    onChange(index) {
        const {selfState} = this;
        selfState.index = index;
    }

    // </editor-fold>

    render() {
        // return <div className="content pos-relative padding-0 row margin-0 h-full">
        //     <PageTitle title="Documents"/>
        //     <Tabs
        //         key="tabs"
        //         ref="mainTabs"
        //         index={this.selfState.index}
        //         onChange={this.onChange}
        //     >
        //         <SignableDocsTab ref="signableDocsTab" title="Signable Documents"/>
        //         <PersonalDocsTab ref="personalDocsTab" title="Personal Documents"/>
        //         <PolicyDocsTab ref="policyDocsTab" title="Policies"/>
        //         <ProcedureDocsTab ref="procedureDocsTab" title="Procedures"/>
        //         <OtherDocsTab ref="otherDocsTab" title="Other Documents"/>
        //     </Tabs>
        // </div>;
        return <Dialog
            key={this.pageKey + '-dialog-'}
            ref="dialog"
            className={this.pageKey + '-dialog ' + this.classNames}
            dialog={this}
        >
            <div className="content pos-relative padding-0 row margin-0 h-full">
                <PageTitle title="Documents"/>
                <Tabs
                    key="tabs"
                    ref="mainTabs"
                    index={this.selfState.index}
                    onChange={this.onChange}
                >
                    <SignableDocsTab ref="signableDocsTab" title="Signable Documents"/>
                    <PersonalDocsTab ref="personalDocsTab" title="Personal Documents"/>
                    <PolicyDocsTab ref="policyDocsTab" title="Policies"/>
                    <ProcedureDocsTab ref="procedureDocsTab" title="Procedures"/>
                    <OtherDocsTab ref="otherDocsTab" title="Other Documents"/>
                </Tabs>
            </div>
        </Dialog>
    }
}

export default DocsDialog;
