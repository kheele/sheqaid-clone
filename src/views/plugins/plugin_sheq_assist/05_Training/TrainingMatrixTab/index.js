//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {
    ActionsButton,
    Button,
    ClearableInput, SelectEmployeeInput,
    SelectJobPositionInput, SelectTrainingCourseInput,
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTrainingMatrixDialog from './forms/NewTrainingMatrixDialog';
import EditTrainingMatrixDialog from './forms/EditTrainingMatrixDialog';
import ProfileTrainingMatrixDialog from './forms/ProfileTrainingMatrixDialog';

import ExportTrainingMatrixDialog from "./forms/ExportTrainingMatrixDialog";

import style from "./TrainingMatrixTab.lazy.css";
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import {CostBtn} from "../TrainingPlanTab/Components";
import {
    byClient,
    byCompany,
    byProject,
    bySite
} from "./Query/List/listAllTrainingMatrixByLogged";

//</editor-fold>

@observer
class TrainingMatrixTab extends React.Component {
    //<editor-fold desc="fields">
    pageKey = "TrainingMatrixTab";

    @observable
    state = {
        lists: {
            status: [{text: "Outstanding", value: "Outstanding", checked: false}, {
                text: "Completed",
                value: "Completed",
                checked: false
            }],
            requirement: [{text: "Compulsory", value: "Compulsory"}, {text: "Optional", value: "Optional"}],
            provider_requirement: [{text: "Accredited", value: "Accredited"}, {
                text: "Non-Accredited",
                value: "Non-Accredited"
            }],
            training_frequency: ['Non-Expiry', '5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly']
        },
        loadedSelectLists: false
    };
    //</editor-fold>

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onExportAll = this.onExportAll.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    //</editor-fold>

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;

        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            job_position_id,
            trainer_id,
            course_id,
            unit_standard,
            provider_requirement,
            requirement,
            status,
        } = filterData || {};

        const limit = 50;

        const args = {
            job_position_id,
            trainer_id,
            course_id,
            unit_standard,
            provider_requirement,
            requirement,
            status,
            //
            limit,
        };

        if (!isNew) {
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

    //<editor-fold desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-4 grid-gap-5 -margin-b-35">
            <ClearableInput name="provider_requirement" type="radio" placeholder="Accreditation"
                            className="col-lg-3 select_radio-vertical form-control" onChange={onChange}
                            values={this.state.lists.provider_requirement}/>
            <ClearableInput name="requirement" type="radio" placeholder="Requirement"
                            className="col-lg-3 form-control" onChange={onChange}
                            values={this.state.lists.requirement}/>
            <ClearableInput name="status" type="radio" placeholder="Status"
                            className="col-lg-3 margin-t-10 form-control" onChange={onChange}
                            values={this.state.lists.status}/>
            <ClearableInput name="training_frequency" type="select" placeholder="Training Frequency..."
                            className="col-lg-3 margin-t-10 form-control" onChange={onChange}
                            values={this.state.lists.training_frequency}/>
            <SelectEmployeeInput name="trainer" placeholder="Training Conductor..."
                                 className="col-lg-3 form-control" onChange={onChange}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position For Training..."
                                    className="col-lg-3 margin-t-10 form-control" onChange={onChange}/>
            <SelectTrainingCourseInput name="course" placeholder="Course..."
                                       className="col-lg-3 margin-t-10 form-control" onChange={onChange}/>
            <ClearableInput name="unit_standard" type="text" placeholder="Unit Standard"
                            className="col-lg-3 margin-t-10 form-control" onChange={onChange}/>
        </div>;
    }

    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td">Course</div>
            <div className="td fixed-flex min-w-120">Status</div>
            <div className="td fixed-flex min-w-140">Accreditation</div>
            <div className="td">Training Conductor</div>
            <div className="td">Job Position(s)</div>
            <div className="td fixed-flex min-w-150">Requirement</div>
            <div className="td fixed-flex min-w-140">Total Cost</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at,
                status,
                cost,
                provider_requirement,
                institution_conducting_training,
                trainer,
                job_position_list,
                course,
                requirement,
                certificate_expiration,
                training_plan_list,
            }
        } = item;

        console.log(item)

        return <TRow key={"item-" + id}>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td">{course && course.name || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{status || 'N/A'}</div>
            <div className="td fixed-flex min-w-140">{provider_requirement || 'N/A'}</div>
            <div className="td">{trainer ? (trainer.fname + ' ' + trainer.lname) : 'N/A'}</div>
            <div className="td">
                {
                    job_position_list ? job_position_list.map(({id, job_position: {name}}) => <Grid key={id} item><Chip
                        label={name} size="small"/></Grid>) : 'N/A'
                }
            </div>
            <div className="td fixed-flex min-w-150">{requirement || 'N/A'}</div>
            <div className="td fixed-flex min-w-140">
                <CostBtn cost={cost}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {showInductionOption} = this.props;
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Training Matrix"
            pageTitleSingular="training matrix"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewTrainingMatrixDialog ref="newDialog" showInductionOption={showInductionOption}/>
            <EditTrainingMatrixDialog ref="editDialog" showInductionOption={showInductionOption}/>
            <ProfileTrainingMatrixDialog ref="profileDialog" showInductionOption={showInductionOption}/>

            <ExportTrainingMatrixDialog ref="exportDialog"/>
        </APageListReadWrite>;
    }

    //</editor-fold>
}

export default TrainingMatrixTab;
