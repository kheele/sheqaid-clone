import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from 'utils/Utils';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {
    ActionsButton,
    ClearableInput, SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTrainingCourseInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTrainingRegisterDialog from './forms/NewTrainingRegisterDialog';
import ProfileTrainingRegisterDialog from './forms/ProfileTrainingRegisterDialog';

import style from "./TrainingRegisterTab.lazy.css";
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";

@observer
class TrainingRegisterTab extends React.Component {

    pageKey = "TrainingRegisterTab";
    @observable
    state = {
        lists: {
            register_type: [
                {text: 'Upload Document', value: 'Upload', checked: false},
                {text: 'Add List', value: 'Type', checked: false}
            ]
        }
    };

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            job_position_list,
            trainer_list,
            course_list,
            unit_standard,
            date,
        } = filterData || {};

        const listByLogged = sockets.of('trainings/register').fn('listByLogged');

        return listByLogged({
            job_position_list,
            trainer_list,
            course_list,
            unit_standard,
            date,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        return <div className="left-buttons pull-left">
            {this.props.onRenderCompetenciesBtb()}
        </div>;
    }

    // </editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-5 grid-gap-5">
            <SelectJobPositionInput name="job_position_list" type="select_multi" placeholder="Job Position(s) For Training..."
                                    className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="trainer_list" type="select_multi" placeholder="Training Conductor(s)..."
                                 className="form-control" onChange={onChange}/>
            <SelectTrainingCourseInput name="course_list" type="select_multi" placeholder="Course(s)..."
                                       className="form-control" onChange={onChange}/>
            <ClearableInput name="unit_standard" type="text" placeholder="Unit Standard"
                            className="form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Register Date..."
                            className="form-control fixed-flex min-w-185" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td fixed-flex min-w-110">Register Date</div>
            <div className="td">Training</div>
            <div className="td">Job Positions</div>
            <div className="td">Trainer</div>
            <div className="td fixed-flex min-w-120">Year</div>
            <div className="td fixed-flex min-w-120">Time</div>
            <div className="td fixed-flex min-w-120">Duration</div>
            <div className="td fixed-flex min-w-100">Attendants</div>
            <div className="td fixed-flex min-w-140">Attendance Rate</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        let {
            id, data: {
                created_at,
                client, project, site,
                training_matrix = {},
                trainer,
                institution_conducting_training,
                time_or_duration,
                time_from,
                time_to,
                date,
                list_proof,
                list_table,
                list_table_keys,
                training_plan_list = [],
            }
        } = item;

        console.log('item', item)

        let {data: {course_or_module, job_title}} = training_matrix;
        course_or_module = isObject(course_or_module) ? (course_or_module.name || course_or_module.data.name) : course_or_module;
        const training_plan_attendants = training_plan_list;
        const year = training_plan_list.map(({data: {year}}) => year)[0];
        console.log('training_plan_list', training_plan_list.slice().map(({data: {year}}) => year))
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
            <div className="td">{course_or_module}</div>
            <div className="td">
                <Grid container spacing={1} columns={4}>
                    {job_title.map(({id, name, data}) => <Grid item><Chip label={name || data.name} size="small"/></Grid>)}
                </Grid>
            </div>
            <div className="td">{trainer.lname} {trainer.fname}</div>
            <div className="td fixed-flex min-w-120">{year || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{time_from} - {time_to}</div>
            <div className="td fixed-flex min-w-120">{time_or_duration}</div>
            <div className="td fixed-flex min-w-100">{list_table ? list_table.length : 'Uploaded'}</div>
            <div className="td fixed-flex min-w-140">{list_table ? (list_table.length / training_plan_attendants.length * 100).toFixed(0) + '%' : 'N/A'}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Training Register"
            pageTitleSingular="training register"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewTrainingRegisterDialog ref="newDialog"/>
            <ProfileTrainingRegisterDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default TrainingRegisterTab;
