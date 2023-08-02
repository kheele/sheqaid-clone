// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from "mobx";

import ADialogTab from "views/ADialogTab";
import style from "./PlannedJobObservationsDialog.lazy.css";
import Tabs from "components/tabs/Tabs";
import TemplatesTab from "./TemplatesTab";
import ObservationsTab from "./ObservationsTab";
// import DashboardTab from "../../AEmployeeDocDialog/ADashboardTab";
// import ActiveTab from "../../AEmployeeDocDialog/ActiveTab";
// import RemovedTab from "../../AEmployeeDocDialog/RemovedTab";
// </editor-fold>

@observer
class Dialog extends ADialogTab {
    pageKey = "PlannedJobObservations";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    renderPage() {
        const {permissionKey} = this.props;
        const {isEmployee} = storage.is;
        return (<TabWrapper
          ref="tabWrapper"
          // store={this.store}
          // title={this.title}
          // titleSingular={this.titleSingular}
          // permissionKey={permissionKey}
          // isRemoved={isRemoved}
          // NewDialog={NewDialog}
          // ProfileDialog={ProfileDialog}
          // EditDialog={EditDialog}
          // ExportDialog={ExportDialog}
          // module={module}
          //
          // loadDashboard={this.loadDashboard}
          // onBuildQuery={this.onBuildQuery}
          // renderFilterNodeActive={this.renderFilterNodeActive}
          // renderFilterNodeRemoved={this.renderFilterNodeRemoved}
          // renderTHeadActive={this.renderTHeadActive}
          // renderTHeadRemoved={this.renderTHeadRemoved}
          // renderItemActive={this.renderItemActive}
          // renderItemRemoved={this.renderItemRemoved}
          //
          // onViewDialog={this.onViewDialog}
        />);
    }
}

// <editor-fold defaultstate="collapsed" desc="TabWrapper">
@observer
class TabWrapper extends React.Component {

    @observable
    state = {index: 0};

    constructor() {
        super();

        this.onChange = this.onChange.bind(this);

        this.onViewActiveTab = this.onViewActiveTab.bind(this);
        this.onViewRemovedTab = this.onViewRemovedTab.bind(this);
        this.onViewNoExpiry = this.onViewNoExpiry.bind(this);
        this.onViewExpired = this.onViewExpired.bind(this);
        this.onViewMonExpiry = this.onViewMonExpiry.bind(this);
        this.onView2MonExpiry = this.onView2MonExpiry.bind(this);
        this.onView3MonExpiry = this.onView3MonExpiry.bind(this);
        this.onView4MonExpiry = this.onView4MonExpiry.bind(this);
    }

    onChange(index) {
        const {state} = this;
        state.index = index;
    }

    // <editor-fold defaultstate="collapsed" desc="onViewActiveTab, onViewRemovedTab">
    onViewActiveTab() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
    }

    onViewRemovedTab() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(2);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewNoExpiry, onViewExpired, onViewMonExpiry, onView2MonExpiry, onView3MonExpiry, onView4MonExpiry">
    onViewNoExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(2);
    }

    onViewExpired() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(1);
    }

    onViewMonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(3);
    }

    onView2MonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(4);
    }

    onView2MonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(5);
    }

    onView3MonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(6);
    }

    onView4MonExpiry() {
        const {refs: {mainTabs}} = this;
        mainTabs.onChange(7);
    }

    // </editor-fold>

    render() {
        const {
            store,
            title,
            titleSingular,
            permissionKey,
            isRemoved,
            NewDialog, ProfileDialog, EditDialog, ExportDialog, module,
            loadDashboard,
            onBuildQuery,
            renderFilterNodeActive, renderFilterNodeRemoved,
            renderTHeadActive, renderTHeadRemoved,
            renderItemActive, renderItemRemoved,
            onViewDialog,
        } = this.props;

        return (<Tabs key="tabs" ref="mainTabs" permissionKey={permissionKey} index={this.state.index}
                      onChange={this.onChange}>
            {/*<DashboardTab*/}
            {/*  ref="dashboard"*/}
            {/*  title="Dashboard"*/}
            {/*  loadDashboard={loadDashboard}*/}

            {/*  onViewActiveTab={this.onViewActiveTab}*/}
            {/*  onViewRemovedTab={this.onViewRemovedTab}*/}

            {/*  onViewNoExpiry={this.onViewNoExpiry}*/}
            {/*  onViewExpired={this.onViewExpired}*/}
            {/*  onViewMonExpiry={this.onViewMonExpiry}*/}
            {/*  onView2MonExpiry={this.onView2MonExpiry}*/}
            {/*  onView3MonExpiry={this.onView3MonExpiry}*/}
            {/*  onView4MonExpiry={this.onView4MonExpiry}*/}

            {/*  onViewDialog={onViewDialog}*/}
            {/*/>*/}
            <TemplatesTab
              ref="templatesTab"
              title="Templates"
              // titleSingular={titleSingular}
              // titlePlural={title}
              // renderFilterNode={renderFilterNodeActive}
              // renderTHead={renderTHeadActive}
              // renderItem={renderItemActive}
              // NewDialog={NewDialog}
              // ProfileDialog={ProfileDialog}
              // EditDialog={EditDialog}
              // ExportDialog={ExportDialog}
              // module={module}
              // onBuildQuery={onBuildQuery}
            />
            <ObservationsTab
              ref="observationsTab"
              title="Observations"
              // titleSingular={titleSingular}
              // titlePlural={title}
              // renderFilterNode={renderFilterNodeRemoved}
              // renderTHead={renderTHeadRemoved}
              // renderItem={renderItemRemoved}
              // NewDialog={NewDialog}
              // ProfileDialog={ProfileDialog}
              // ExportDialog={ExportDialog}
              // module={module}
              // onBuildQuery={onBuildQuery}
            />
        </Tabs>);
    }
}

// </editor-fold>

export default Dialog;
