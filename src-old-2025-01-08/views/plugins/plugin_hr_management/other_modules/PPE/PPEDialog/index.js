// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from "@mui/material";
import {findByIdOrgDashboardStatsByLogged} from "mutations/employeeOrgDashboard";

import style from "./PPEDialog.lazy.css";
import {Button} from "components/inputs";
import {PageTitle} from "components";
import ADialogList from "../../../../../ADialogList";

import PPEDailyComplianceDialog from "../PPEDailyComplianceDialog";
import PPEDisposalsDialog from "../PPEDisposalsDialog";
import PPEFitTestsDialog from "../PPEFitTestsDialog";
import PPEInspectionsDialog from "../PPEInspectionsDialog";
import PPEInventoryDialog from "../PPEInventoryDialog";
import PPEItemDialog from "../PPEItemDialog";
import PPEMaintenanceDialog from "../PPEMaintenanceDialog";
import PPERequisitionsDialog from "../PPERequisitionsDialog";
import PPEReturnsDialog from "../PPEReturnsDialog";
import PPESupplierDialog from "../PPESupplierDialog";
import PPETaskComplianceDialog from "../PPETaskComplianceDialog";
import PPETypeDialog from "../PPETypeDialog";

// </editor-fold>

@observer
class PPEDialog extends ADialogList {
    pageKey = "PPEDialog";

    @observable selfState = {
        data: DATA_LOAD_STATUS.LOADING,
    };

    constructor(props) {
        super(props);

        this.onViewPPETypes = this.onViewPPETypes.bind(this);
        this.onViewItems = this.onViewItems.bind(this);
        this.onViewInventory = this.onViewInventory.bind(this);
        this.onViewPPESizes = this.onViewPPESizes.bind(this);
        this.onViewSuppliers = this.onViewSuppliers.bind(this);
        this.onViewDisposals = this.onViewDisposals.bind(this);
        this.onViewReturns = this.onViewReturns.bind(this);
        this.onViewRequisitions = this.onViewRequisitions.bind(this);
        this.onViewMaintenance = this.onViewMaintenance.bind(this);
        this.onViewInspections = this.onViewInspections.bind(this);
        this.onViewFitTests = this.onViewFitTests.bind(this);
        this.onViewDailyCompliance = this.onViewDailyCompliance.bind(this);
        this.onViewTaskCompliance = this.onViewTaskCompliance.bind(this);

        this.update = this.update.bind(this);
        this.load = this.load.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        this.update();
    }

    onViewDailyCompliance() {
        this.refs.ppeDailyComplianceDialog.open();
    }

    onViewDisposals() {
        this.refs.ppeDisposalsDialog.open();
    }

    onViewFitTests() {
        this.refs.ppeFitTestsDialog.open();
    }

    onViewInspections() {
        this.refs.ppeInspectionsDialog.open();
    }

    onViewInventory() {
        this.refs.ppeInventoryDialog.open();
    }

    onViewItems() {
        this.refs.ppeItemsDialog.open();
    }

    onViewMaintenance() {
        this.refs.ppeMaintenanceDialog.open();
    }

    onViewRequisitions() {
        this.refs.ppeRequisitionsDialog.open();
    }

    onViewReturns() {
        this.refs.ppeReturnsDialog.open();
    }

    onViewPPESizes() {

    }

    onViewSuppliers() {
        this.refs.ppeSuppliersDialog.open();
    }

    onViewTaskCompliance() {
        this.refs.ppeTaskComplianceDialog.open();
    }

    onViewPPETypes() {
        this.refs.ppeTypesDialog.open();
    }

    update() {
        const {selfState} = this;
        selfState.data = DATA_LOAD_STATUS.LOADING;

        this.load().then(res => {
            console.log('res', res && res.data)
            if (res) {
                selfState.data = res.data || res;
            }
        }).catch(err => {
            console.error(err);
            selfState.data = DATA_LOAD_STATUS.ERROR;
        });
    }

    load() {
        return findByIdOrgDashboardStatsByLogged();
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isContractor, isContractorView} = storage.is;

        return <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" text="PPE Types" onClick={this.onViewPPETypes}/>
            <Button className="btn btn-primary pull-right" text="PPE Items" onClick={this.onViewItems}/>
            <Button className="btn btn-primary pull-right" text="Inventory" onClick={this.onViewInventory}/>
            {/*<Button className="btn btn-primary pull-right" text="PPE Sizes" onClick={this.onViewPPESizes}/>*/}
            <Button className="btn btn-primary pull-right" text="Suppliers" onClick={this.onViewSuppliers}/>
            <Button className="btn btn-primary pull-right" text="Disposals" onClick={this.onViewDisposals}/>
            <Button className="btn btn-primary pull-right" text="Returns" onClick={this.onViewReturns}/>
            <Button className="btn btn-primary pull-right" text="Requisitions" onClick={this.onViewRequisitions}/>
            <Button className="btn btn-primary pull-right" text="Maintenance" onClick={this.onViewMaintenance}/>
            <Button className="btn btn-primary pull-right" text="Inspections" onClick={this.onViewInspections}/>
            <Button className="btn btn-primary pull-right" text="Fit Tests" onClick={this.onViewFitTests}/>
            <Button className="btn btn-primary pull-right" text="Daily Compliance"
                    onClick={this.onViewDailyCompliance}/>
            <Button className="btn btn-primary pull-right" text="Task Compliance" onClick={this.onViewTaskCompliance}/>
        </div>;
    }

    // </editor-fold>

    renderPage() {
        const {data} = this.selfState;
        if (isNullable(data) || data === DATA_LOAD_STATUS.LOADING) {
            return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
                <CircularProgress/>
            </div>;
        }

        if (data === DATA_LOAD_STATUS.ERROR) {
            return null;
        }

        const {
            onViewDialog,
            onViewActiveTab, onViewRemovedTab,
            onViewTeams, onViewDepartments, onViewJobPositions, onViewJobCategories, onViewSupervisors
        } = this.props;

        const {isEmployee, isContractorViewVisited} = storage.is;

        return <div className="DashboardTab row margin-0 -margin-t-50 h-full">
            <PageTitle title="PPE Management" renderBackBtn={this.renderBackBtn}>
                {this.renderLeftButtons()}
            </PageTitle>
            {/*<TopGridCounter*/}
            {/*    ref="topStats"*/}
            {/*    data={data}*/}
            {/*/>*/}
            {/*<GridGraphsVerticalBarChart*/}
            {/*    ref="gridGraphsVerticalBarChart"*/}
            {/*    data={data}*/}
            {/*    list={this.tiles}*/}
            {/*    onViewDialog={onViewDialog}*/}
            {/*/>*/}

            <PPEDailyComplianceDialog ref="ppeDailyComplianceDialog"/>
            <PPEDisposalsDialog ref="ppeDisposalsDialog"/>
            <PPEFitTestsDialog ref="ppeFitTestsDialog"/>
            <PPEInspectionsDialog ref="ppeInspectionsDialog"/>
            <PPEInventoryDialog ref="ppeInventoryDialog"/>
            <PPEItemDialog ref="ppeItemsDialog"/>
            <PPEMaintenanceDialog ref="ppeMaintenanceDialog"/>
            <PPERequisitionsDialog ref="ppeRequisitionsDialog"/>
            <PPEReturnsDialog ref="ppeReturnsDialog"/>
            <PPESupplierDialog ref="ppeSuppliersDialog"/>
            <PPETaskComplianceDialog ref="ppeTaskComplianceDialog"/>
            <PPETypeDialog ref="ppeTypesDialog"/>
        </div>;
    }
}

export default PPEDialog;
