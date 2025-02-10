// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../../ADialogList";
import {
    Button,
    ClearableInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectPPEItemInput,
    SelectPPETypeInput,
    SelectTeamInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewComplianceRequirementDialog from './NewComplianceRequirementDialog';
import EditComplianceRequirementDialog from './EditComplianceRequirementDialog';
import ProfileComplianceRequirementDialog from './ProfileComplianceRequirementDialog';

import style from "./ComplianceRequirementDialog.lazy.css";
import ComplianceRequirementRenderRow from "./ComplianceRequirementRenderRow";
import {listComplianceRequirements} from "mutations/listByLogged";
import ExportDialog from "components/exports/ExportDialog";
import {exportExcelComplianceRequirements} from "mutations/exportExcel";
import SelectApplicableRegulationsInput from "../../../../../../components/inputs/SelectApplicableRegulationsInput";
import {Tabs} from "../../../../../../components/tabs";
import ActiveTab from "../ActiveTab";
import RemovedTab from "../RemovedTab";

// </editor-fold>

@observer
class ComplianceRequirementDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "ComplianceRequirementDialog";
    title = "Compliance Requirements";
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onExport = this.onExport.bind(this);

        this.onBuildQuery = this.onBuildQuery.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="onBuildQuery">
    onBuildQuery(filterData = {}) {
        const {
            name,
            regulation_id,
            job_task_id,
            ppe_item_id,
            ppe_type_id,
            //
            team_id,
            department_id,
            job_position_id,
            employee_id,
        } = filterData || {};

        return {
            onList: listComplianceRequirements,
            attrs: {
                name,
                regulation_id,
                job_task_id,
                ppe_item_id,
                ppe_type_id,
                //
                team_id,
                department_id,
                job_position_id,
                employee_id,
                exact_orgs_company: true,
            },
        };
    }

    //</editor-fold>

    //<editor-fold desc="onSoftDeleteProhibit">
    onSoftDeleteProhibit(item) {
        const {id, data: {job_task_list_aggregate}} = item;
        const prohibit = job_task_list_aggregate.aggregate.count > 0;
        if (prohibit) {
            infoDialog.open(<p>
                The Job Task Category can't be removed while<br/>
                there are job tasks attached to it.<br/><br/>
                Please first remove the job tasks or assign<br/>
                them to other Job Task Categories before removing<br/>
                this Job Task Category.
            </p>);
        }
        return prohibit;
    }

    //</editor-fold>

    onExport() {
        const {activeTab} = this.refs.mainTabs.refs.tabContent;
        activeTab.onExport();
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <div className="left-buttons pull-left">
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onExport}>
                Export
            </Button>
        </div>;
    }

    // </editor-fold>

    renderExportFilterNode(onChange) {
        return <>
            <ClearableInput name="name" type="text" placeholder="Name" className="margin-0 form-control"
                            onChange={onChange}/>
            <SelectApplicableRegulationsInput
                name="regulation"
                placeholder="Applicable Regulation..."
                className="col-lg-12 form-control"
                parentClassName="margin-0"
                onChange={onChange}
                addButton={false}
            />
            <SelectPPETypeInput name="ppe_type" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={onChange} addButton={false}/>
            <SelectPPEItemInput name="ppe_item" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={onChange} addButton={false}/>
        </>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-4 grid-gap-10">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control"
                            onChange={onChange}/>
            <SelectApplicableRegulationsInput name="regulation" placeholder="Applicable Regulation..."
                                              className="form-control"
                                              onChange={onChange} addButton={false}/>
            <SelectPPETypeInput name="ppe_type" className="col-lg-12 form-control"
                                onChange={onChange} addButton={false}/>
            <SelectPPEItemInput name="ppe_item" className="col-lg-12 form-control"
                                onChange={onChange} addButton={false}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control"
                                 onChange={onChange} addButton={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}
                             addButton={false}/>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control"
                                   onChange={onChange} addButton={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control"
                                    onChange={onChange} addButton={false}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td">Compliance Requirement</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-200">Applicable Regulations</div>
            <div className="td fixed-flex min-w-110">Job Tasks</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(item, idx, onClick, onView) {
        return <ComplianceRequirementRenderRow key={item.id} idx={idx} item={item} onView={onView}
                                               onClick={onClick}/>;
    }

    //<editor-fold desc="renderPage">
    renderPage() {
        const {
            onUpdate,
            onBuildQuery,
            titleSingular,
            title,
            permissionKey,
            renderFilterNode,
            renderExportFilterNode,
            renderTHead,
            renderItem
        } = this;

        const props = {
            onUpdate,
            onBuildQuery,
            titleSingular,
            titlePlural: title,
            renderFilterNode,
            renderExportFilterNode,
            exportFn: exportExcelComplianceRequirements,
            renderTHead,
            renderItem,
            ProfileDialog: ProfileComplianceRequirementDialog,
            ExportDialog: ExportDialog,
            permissionKey,
        };

        return <Tabs
            key="tabs"
            ref="mainTabs"
            permissionKey={permissionKey}
            index={this.state.index}
            onChange={this.onChange}
        >
            <ActiveTab
                ref="activeTab"
                title="Active"
                onSoftDeleteProhibit={this.onSoftDeleteProhibit}
                renderLeftButtons={this.renderLeftButtons}
                NewDialog={NewComplianceRequirementDialog}
                EditDialog={EditComplianceRequirementDialog}
                {...props}
            />
            <RemovedTab
                ref="removedTab"
                title="Removed"
                {...props}
            />
        </Tabs>;
    }

    //</editor-fold>

}

export default ComplianceRequirementDialog;
//237