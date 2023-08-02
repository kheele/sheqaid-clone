//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from '../../../../utils/Utils';
import APageListReadWrite from "../../../../views/APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import {ConfirmDialog} from '../../../../components/dialogs';
import {
    ActionsButton,
    Button,
    ClearableInput,
    SelectJobPositionInput,
    SelectUserInput
} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewTrainingMatrixDialog from './dialogs/NewTrainingMatrixDialog';
import EditTrainingMatrixDialog from './dialogs/EditTrainingMatrixDialog';
import ProfileTrainingMatrixDialog from './dialogs/ProfileTrainingMatrixDialog';

import ExportTrainingMatrixDialog from "./dialogs/ExportTrainingMatrixDialog";

import style from "./TrainingMatrixTab.lazy.css";

//</editor-fold>

@observer
class TrainingMatrixTab extends React.Component {
    //<editor-fold desc="fields">
    path;
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
            training_provider_requirement: [{text: "Accredited", value: "Accredited"}, {
                text: "Non-Accredited",
                value: "Non-Accredited"
            }]
        },
        loadedSelectLists: false
    };
    //</editor-fold>

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'training-matrix/';

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

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <div className="col-lg-12 controls">
                <ClearableInput name="training_provider_requirement" type="radio" placeholder="Accreditation"
                                className="col-lg-4 select_radio-vertical form-control" onChange={onChange}
                                values={this.state.lists.training_provider_requirement}/>
                <ClearableInput name="requirement" type="radio" placeholder="Requirement"
                                className="col-lg-8 form-control" onChange={onChange}
                                values={this.state.lists.requirement}/>
                <ClearableInput name="status" type="radio" placeholder="Status"
                                className="col-lg-8 margin-t-10 form-control" onChange={onChange}
                                values={this.state.lists.status}/>
            </div>
            <div className="controls fixed-flex min-w-400">
                <SelectUserInput name="hr" placeholder="Training Conductor..." defaultUser required
                                 className="col-lg-12 form-control" onChange={onChange}/>
                <SelectJobPositionInput name="job_title" placeholder="Job Position For Training..." required
                                        className="col-lg-12 margin-t-10 form-control" onChange={onChange}/>
                <ClearableInput name="course_or_module" type="text" placeholder="Course"
                                className="col-lg-12 margin-t-10 form-control" onChange={onChange}/>
            </div>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-110">Date Created</div>
            <div className="td fixed-flex min-w-100">Status</div>
            <div className="td fixed-flex min-w-120">Accreditation</div>
            <div className="td">Training Conductor</div>
            <div className="td">Job Title</div>
            <div className="td">Course</div>
            <div className="td fixed-flex min-w-100">Requirement</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at,
                status,
                training_provider_requirement,
                institution_conducting_training,
                hr,
                job_title,
                course_or_module,
                requirement,
                certificate_expiration
            }
        } = item;
        console.log(item)
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-100">{status || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{training_provider_requirement || 'N/A'}</div>
            <div className="td">{hr ? ((hr.fname || hr.data.fname) + ' ' + (hr.lname || hr.data.lname)) : 'N/A'}</div>
            <div className="td">{job_title ? job_title.filter(v => !!v).map(({name}) => name).join(', ') : 'N/A'}</div>
            <div className="td">
                {isObject(course_or_module) ? (course_or_module.name || course_or_module.data.name) : (course_or_module || 'N/A')}
            </div>
            <div className="td fixed-flex min-w-100">{requirement || 'N/A'}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

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
            path={this.path}
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
