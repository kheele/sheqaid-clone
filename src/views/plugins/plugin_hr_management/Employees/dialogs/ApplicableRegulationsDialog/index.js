// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../../ADialogList";
import {
    Button,
    ClearableInput,
    DateRangeInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectPPEItemInput,
    SelectPPETypeInput,
    SelectTeamInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewApplicableRegulationDialog from './NewApplicableRegulationDialog';
import EditApplicableRegulationDialog from './EditApplicableRegulationDialog';
import ProfileApplicableRegulationDialog from './ProfileApplicableRegulationDialog';

import style from "./ApplicableRegulationDialog.lazy.css";
import ApplicableRegulationRenderRow from "./ApplicableRegulationRenderRow";
import {listApplicableRegulations} from "mutations/listByLogged";
import ExportDialog from "components/exports/ExportDialog";
import {exportExcelApplicableRegulations} from "mutations/exportExcel";
import SelectComplianceRequirementsInput from "../../../../../../components/inputs/SelectComplianceRequirementsInput";
import SelectJobTasksInput from "../../../../../../components/inputs/SelectJobTasksInput";
import {Tabs} from "../../../../../../components/tabs";
import ActiveTab from "../ActiveTab";
import RemovedTab from "../RemovedTab";

// </editor-fold>

@observer
class ApplicableRegulationDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "ApplicableRegulationDialog";
    title = "Applicable Regulations";
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
            code,
            desc,
            jurisdiction,
            effective_date_range,
            compliance_requirement_id,
            job_task_id,
            ppe_item_id,
            ppe_type_id, //
            team_id,
            department_id,
            job_position_id,
            employee_id,
        } = filterData || {};

        return {
            listByLogged: listApplicableRegulations,
            attrs: {
                code,
                desc,
                jurisdiction,
                effective_date_range,
                compliance_requirement_id,
                job_task_id,
                ppe_item_id,
                ppe_type_id, //
                team_id,
                department_id,
                job_position_id,
                employee_id, //
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
            <ClearableInput name="code" type="text" placeholder="Code"
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}/>
            <ClearableInput name="desc" type="text" placeholder="Description"
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}/>
            <ClearableInput name="jurisdiction" type="text" placeholder="Jurisdiction"
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}/>

            <SelectComplianceRequirementsInput name="compliance_requirement" className="col-lg-12 form-control"
                                               parentClassName="margin-0"
                                               onChange={onChange} addButton={false}/>
            <SelectJobTasksInput name="job_task" className="col-lg-12 form-control"
                                 parentClassName="margin-0"
                                 onChange={onChange} addButton={false}/>

            <SelectPPETypeInput name="ppe_type" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={onChange} addButton={false}/>
            <SelectPPEItemInput name="ppe_item" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={onChange} addButton={false}/>

            <DateRangeInput name="effective_date_range" placeholder="Effective Date"
                            vertical
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}
            >
                <label className="min-w-60">From</label>
                <label className="min-w-45">To</label>
            </DateRangeInput>
        </>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="code" type="text" placeholder="Code" className="col-lg-4 form-control"
                            onChange={onChange}/>
            <ClearableInput name="desc" type="text" placeholder="Description" className="col-lg-4 form-control"
                            onChange={onChange}/>
            <ClearableInput name="jurisdiction" type="text" placeholder="Jurisdiction" className="col-lg-4 form-control"
                            onChange={onChange}/>

            <SelectComplianceRequirementsInput name="compliance_requirement" className="col-lg-12 form-control"
                                               parentClassName="col-lg-3 margin-t-10"
                                               onChange={onChange} addButton={false}/>
            <SelectJobTasksInput name="job_task" className="col-lg-12 form-control"
                                 parentClassName="col-lg-3 margin-t-10"
                                 onChange={onChange} addButton={false}/>

            <SelectPPETypeInput name="ppe_type" className="col-lg-12 form-control"
                                parentClassName="col-lg-3 margin-t-10"
                                onChange={onChange} addButton={false}/>
            <SelectPPEItemInput name="ppe_item" className="col-lg-12 form-control"
                                parentClassName="col-lg-3 margin-t-10"
                                onChange={onChange} addButton={false}/>

            <SelectEmployeeInput name="employee" placeholder="Employee..." className="col-lg-3 margin-t-10 form-control"
                                 onChange={onChange} addButton={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control"
                             parentClassName="col-lg-3 margin-t-10" onChange={onChange}
                             addButton={false}/>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control"
                                   parentClassName="col-lg-3 margin-t-10"
                                   onChange={onChange} addButton={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control"
                                    parentClassName="col-lg-3 margin-t-10"
                                    onChange={onChange} addButton={false}/>
            <DateRangeInput name="effective_date_range" placeholder="Effective Date"
                            className="col-lg-12 margin-t-10 form-control"
                            vertical
                            onChange={onChange}>
                <label className="min-w-100">Start Date</label>
                <label className="min-w-100">End Date</label>
            </DateRangeInput>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td">Code</div>
            <div className="td">Description</div>
            <div className="td">Jurisdiction</div>
            <div className="td fixed-flex min-w-220">Compliance Requirements</div>
            <div className="td fixed-flex min-w-160">Effective Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(item, idx, onClick, onView) {
        return <ApplicableRegulationRenderRow key={item.id} idx={idx} item={item} onView={onView}
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
            exportFn: exportExcelApplicableRegulations,
            renderTHead,
            renderItem,
            ProfileDialog: ProfileApplicableRegulationDialog,
            ExportDialog,
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
                NewDialog={NewApplicableRegulationDialog}
                EditDialog={EditApplicableRegulationDialog}
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

export default ApplicableRegulationDialog;
//280