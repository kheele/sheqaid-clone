// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ActionsButton, Button, ClearableInput, SelectJobPositionInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTrainingRegistryDialog from '../dialogs/NewTrainingRegistryDialog';
import EditTrainingRegistryDialog from '../dialogs/EditTrainingRegistryDialog';
import ProfileTrainingRegistryDialog from '../dialogs/ProfileTrainingRegistryDialog';

import ExportTrainingCoursesDialog from "../dialogs/ExportTrainingCoursesDialog";

import style from "./TrainingRegistryTab.lazy.css";
import Avatar from "@mui/material/Avatar";
import Chip from "@material-ui/core/Chip";
import {Stack} from "@mui/material";
import {Grid} from "@material-ui/core";
import {CostBtn} from "../TrainingPlanTab/Components";
import {byClient, byCompany, byProject, bySite} from "./Query/List/listAllCourseByLogged";

// </editor-fold>

@observer
class TrainingRegistryTab extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "TrainingRegistryTab";
    @observable
    state = {
        lists: {
            sector_list: ['Chemicals', 'Construction', 'Fire Management', 'Harvesting', 'Manufacturing', 'Mining', 'Silviculture', 'Transport', 'Other'],
            frequency: ['5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
            provider: ["Internal", "External"]
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onExportAll = this.onExportAll.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
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

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;

        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
            unit_standard,
            frequency,
            provider,
            job_position_id,
            sector_id,
        } = filterData || {};

        const limit = 50;

        const args = {
            name,
            unit_standard,
            frequency,
            provider,
            job_position_id,
            sector_id,
            //
            limit,
        };

        if(!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        let fn;

        if (selectedSite) {
            args.site_id = selectedSite.id;
            fn = bySite;
        } else if (selectedProject) {
            args.project_id = selectedProject.id;
            fn = byProject;
        } else if (selectedClient) {
            args.client_id = selectedClient.id;
            fn = byClient;
        } else {
            args.company_id = sess_company_id;
            fn = byCompany;
        }

        return fn(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onExportAll">
    onExportAll(e, btn) {
        const {getDialogByRef} = this.refs.root;
        const exportDialog = getDialogByRef('exportDialog');
        exportDialog.open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee;// || isContractorView;
        return <div className="left-buttons pull-left">
            {this.props.onRenderCompetenciesBtb()}
            {!isReadonly && <Button className="btn btn-primary pull-right" onClick={this.onExportAll}>
                Export
            </Button>}
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-4 grid-gap-5 -margin-b-35">
            <ClearableInput name="name" type="text" placeholder="Course" className="form-control"
                            onChange={onChange}/>
            <ClearableInput name="unit_standard" type="text" placeholder="Unit Standard"
                            className="form-control" onChange={onChange}/>
            <ClearableInput name="frequency" type="select" placeholder="Frequency..." className="form-control"
                            onChange={onChange} values={this.state.lists.frequency} returnValue/>
            <ClearableInput name="provider" type="select" placeholder="Provider..." className="form-control"
                            onChange={onChange} values={this.state.lists.provider} returnValue/>
            <SelectJobPositionInput name="job_position" type="select" placeholder="Job Position..."
                                    className="form-control" onChange={onChange}/>
            <ClearableInput name="sector" type="select" placeholder="Sector..." className="form-control"
                            onChange={onChange} values={this.state.lists.sector_list} returnValue/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td">Course</div>
            <div className="td">Job Position(s)</div>
            <div className="td">Sector(s)</div>
            <div className="td fixed-flex min-w-90">Frequency</div>
            <div className="td fixed-flex min-w-90">Provider</div>
            <div className="td fixed-flex min-w-120">Unit Standard</div>
            <div className="td">Unit Standard Description</div>
            <div className="td fixed-flex min-w-140">Total Cost</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const {isConsultant, isHasProjects, isContractor} = storage.is;
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at,
                client, project, site,
                //1
                name,
                job_position_list,
                sector_list,
                frequency,
                provider,
                //2
                unit_standard,
                unit_standard_desc,
                training_matrix_list = [],//[{id, cost, institution_conducting_training, trainer}]
            }
        } = item;

        const cost = training_matrix_list.
        filter(({cost}) => !!cost).
        map(({cost}) => parseFloat(cost.replace("$", "").replace(",", ""))).
        reduce((n1, n2) => n1 + n2, 0);

        console.log('item', item)

        return <TRow key={"item-" + id}>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td">{name}</div>
            <div className="td padding-t-5 padding-b-5">
                <Grid container spacing={1} columns={4}>
                    {job_position_list.map(({id, job_position: {name}}) => <Grid key={id} item><Chip label={name} size="small"/></Grid>)}
                </Grid>
            </div>
            <div className="td padding-t-5 padding-b-5">
                <Grid container spacing={1} columns={4}>
                    {sector_list.map(({id, sector: {name}}) => <Grid key={id} item><Chip label={name} size="small"/></Grid>)}
                </Grid>
            </div>
            <div className="td fixed-flex min-w-90">{frequency}</div>
            <div className="td fixed-flex min-w-90">{provider}</div>
            <div className="td fixed-flex min-w-120">{unit_standard}</div>
            <div className="td">{unit_standard_desc}</div>
            <div className="td fixed-flex min-w-140">
                <CostBtn cost={cost}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Training Registry"
            pageTitleSingular="training registry"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewTrainingRegistryDialog ref="newDialog"/>
            <EditTrainingRegistryDialog ref="editDialog"/>
            <ProfileTrainingRegistryDialog ref="profileDialog"/>

            <ExportTrainingCoursesDialog ref="exportDialog"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

export default TrainingRegistryTab;
