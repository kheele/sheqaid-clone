//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from 'utils/Utils';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {
    ActionsButton,
    Button,
    ClearableInput,
    SelectJobPositionInput,
    SelectUserInput
} from 'components/inputs';
import {TData, THead, TRow} from 'components/tables';

import NewToolboxTalkDialog from './dialogs/NewToolboxTalkDialog';
import EditToolboxTalkDialog from './dialogs/EditToolboxTalkDialog';
import ProfileToolboxTalkDialog from './dialogs/ProfileToolboxTalkDialog';

import ToolboxTalkSubjectCategoryDialog from "./dialogs/ToolboxTalkDialogs/ToolboxTalkSubjectCategoryDialog";
import ExportToolboxTalksDialog from "./dialogs/ExportToolboxTalksDialog";

import style from "./ToolboxTalksTab.lazy.css";
import ToolboxTalkAttendanceRegisterDialog from "./dialogs/ToolboxTalkDialogs/ToolboxTalkAttendanceRegisterDialog";
//</editor-fold>

@observer
class ToolboxTalksTab extends React.Component {
    //<editor-fold desc="fields">
    path;
    pageKey = "ToolboxTalksTab";

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

        this.path = props.path + 'toolbox-talks/';

        this.onExportAll = this.onExportAll.bind(this);
        this.onViewSubjectCategories = this.onViewSubjectCategories.bind(this);
        this.onCreateAttendanceRegister = this.onCreateAttendanceRegister.bind(this);

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

    // <editor-fold defaultstate="collapsed" desc="onViewSubjectCategories">
    onViewSubjectCategories(e, btn) {
        const {getDialogByRef} = this.refs.root;
        const toolboxTalkSubjectCategoryDialog = getDialogByRef('toolboxTalkSubjectCategoryDialog');
        toolboxTalkSubjectCategoryDialog.open();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCreateAttendanceRegister">
    onCreateAttendanceRegister(e, btn) {
        const {getDialogByRef} = this.refs.root;
        const toolboxTalkAttendanceRegisterDialog = getDialogByRef('toolboxTalkAttendanceRegisterDialog');
        toolboxTalkAttendanceRegisterDialog.open();
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
            <Button className="btn btn-primary pull-right" onClick={this.onViewSubjectCategories}>
                Subject Categories
            </Button>
            <Button className="btn btn-primary pull-right" onClick={this.onCreateAttendanceRegister}>
                Attendance Registers
            </Button>
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
            <TData flex={110}>Date Created</TData>
            <TData flex={100}>Status</TData>
            <TData flex={120}>Accreditation</TData>
            <TData>Training Conductor</TData>
            <TData>Job Title</TData>
            <TData>Course</TData>
            <TData flex={100}>Requirement</TData>
            <TData flex={60} className="padding-l-0 padding-r-0"/>
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
            <TData flex={110}>{Dates.formatDate(created_at)}</TData>
            <TData flex={100}>{status || 'N/A'}</TData>
            <TData flex={120}>{training_provider_requirement || 'N/A'}</TData>
            <TData>{hr ? ((hr.fname || hr.data.fname) + ' ' + (hr.lname || hr.data.lname)) : 'N/A'}</TData>
            <TData>{job_title ? job_title.name : 'N/A'}</TData>
            <TData>{course_or_module}</TData>
            <TData flex={100}>{requirement || 'N/A'}</TData>
            <TData flex={50} className="padding-l-10 padding-r-0">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </TData>
        </TRow>;
    }

    //<editor-fold desc="render">
    render() {
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Toolbox Talks"
            pageTitleSingular="toolbox talk"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewToolboxTalkDialog ref="newDialog"/>
            <EditToolboxTalkDialog ref="editDialog"/>
            <ProfileToolboxTalkDialog ref="profileDialog"/>

            <ToolboxTalkSubjectCategoryDialog ref="toolboxTalkSubjectCategoryDialog"/>
            <ToolboxTalkAttendanceRegisterDialog ref="toolboxTalkAttendanceRegisterDialog"/>
            <ExportToolboxTalksDialog ref="exportDialog"/>
        </APageListReadWrite>;
    }
    //</editor-fold>
}

export default ToolboxTalksTab;
