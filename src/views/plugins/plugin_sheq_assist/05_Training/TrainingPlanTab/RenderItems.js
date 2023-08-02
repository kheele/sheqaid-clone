// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import 'react-alice-carousel/lib/alice-carousel.css';
import {TRow} from "components/tables";
import Chip from "@material-ui/core/Chip";
import Avatar from "@mui/material/Avatar";
import {Grid} from "@material-ui/core";
import {ActionsButton, Clickable} from "components/inputs";
import {CostBtn, HasWarnings, ResultsTD, StatusTD, YearsTD} from "./Components";
import {computed} from "mobx";
// </editor-fold>

//<editor-fold desc="RenderEmployee">
@observer
class RenderEmployee extends React.Component {
    @computed get isViewTargetEmployee() {
        const {props: {target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'employee';
    }

    render() {
        const {item, view, target_view, idx, onShowWarningMsg, onClick, onViewTarget, onViewCourseList} = this.props;

        const {
            // group,
            // group: {data: {lname, fname, profile_pic}},
            // list,
            // cost,
            // results,
            // status,
            // course_list,
            // year_list,
            // status_outstanding,
            // status_completed,
            // status_not_started,
            // results_failed,
            // results_passed,
            // results_average,

            id,
            data: {
                lname,
                fname,
                profile_pic,
                job_position,
                course_list_count,
                training_cost,
                year_list,
            }
        } = item;
        // console.log('RenderEmployee', item)
        return <TRow key={id} className="w-full">
            {!this.isViewTargetEmployee && <div className="td">
                <Clickable id={id} item={item} target="employee" onClick={onViewTarget}>
                    <Chip
                        avatar={<Avatar
                            alt={lname + ' ' + fname}
                            src={profile_pic && profile_pic.dlUrls && profile_pic.dlUrls[0]}
                        />}
                        label={lname + ' ' + fname}
                    />
                </Clickable>
            </div>}
            <div className="td">{job_position && job_position.name || 'N/A'}</div>
            <div className="td padding-t-5 padding-b-5">
                <Clickable item={item} target="course" onClick={onViewCourseList}>
                    <Chip label={course_list_count.aggregate.count || 'N/A'} size="medium"/>
                </Clickable>
                {/*<Grid container spacing={1} columns={4}>*/}
                {/*    {course_list.map((item) => <Grid item>*/}
                {/*        <Clickable id={item.id} item={item} target="course" onClick={onViewTarget}>*/}
                {/*            <Chip label={item.name} size="small"/>*/}
                {/*        </Clickable>*/}
                {/*    </Grid>)}*/}
                {/*</Grid>*/}
            </div>
            <YearsTD value={year_list} onViewTarget={onViewTarget}/>
            <StatusTD item={item} isViewEmployee={true}/>
            <ResultsTD item={item} isViewEmployee={true}/>
            {/*<div className="td fixed-flex min-w-140">*/}
            {/*    <CostBtn cost={training_cost.aggregate.sum.cost}/>*/}
            {/*</div>*/}
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                <HasWarnings item={item} view={view} idx={idx} onClick={onShowWarningMsg}/>
            </div>
        </TRow>;
    }
}
//</editor-fold>

//<editor-fold desc="RenderJobPosition">
@observer
class RenderJobPosition extends React.Component {
    @computed get isViewTargetJobPosition() {
        const {props: {target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'job_position';
    }

    render() {
        const {item, view, target_view, idx, onShowWarningMsg, onClick, onViewTarget, onViewEmployeeList, onViewCourseList} = this.props;

        const {
            group,
            group: {data: {name}},
            list,
            cost,
            results,
            status,
            employee_list,
            course_list,
            year_list,
            status_outstanding,
            status_completed,
            status_not_started,
            results_failed,
            results_passed,
            results_average,
        } = item;
        console.log('RenderJobPosition', group)
        return <TRow key={group.id} className="w-full">
            {!this.isViewTargetJobPosition && <div className="td">
                <Clickable id={group.id} item={group} target="job_position" onClick={onViewTarget}>
                    <Chip label={name} size="small"/>
                </Clickable>
            </div>}
            <div className="td padding-t-5 padding-b-5">
                <Clickable item={item} target="course" onClick={onViewCourseList}>
                    <Chip label={course_list.length || 'N/A'} size="medium"/>
                </Clickable>
                {/*<Grid container spacing={1} columns={4}>*/}
                {/*    {course_list.map((item) => <Grid item>*/}
                {/*        <Clickable id={item.id} item={item} target="course" onClick={onViewTarget}>*/}
                {/*            <Chip label={item.name} size="small"/>*/}
                {/*        </Clickable>*/}
                {/*    </Grid>)}*/}
                {/*</Grid>*/}
            </div>
            <div className="td fixed-flex min-w-120">
                <Clickable item={item} target="job_position" onClick={onViewEmployeeList}>
                    <Chip label={employee_list.length} size="medium"/>
                </Clickable>
            </div>
            <YearsTD value={year_list} onViewTarget={onViewTarget}/>
            <StatusTD item={item} isViewJobPosition={true}/>
            <ResultsTD item={item} isViewJobPosition={true}/>
            <div className="td fixed-flex min-w-140">
                <CostBtn cost={cost}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                <HasWarnings item={item} view={view} idx={idx} onClick={onShowWarningMsg}/>
            </div>
        </TRow>;
    }
}
//</editor-fold>

//<editor-fold desc="RenderCourse">
@observer
class RenderCourse extends React.Component {
    @computed get isViewTargetCourse() {
        const {props: {target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'course';
    }

    render() {
        const {item, view, target_view, idx, onShowWarningMsg, onClick, onViewTarget, onViewEmployeeList, onViewJobPositionList} = this.props;

        const {
            // group,
            // group: {data: {name}},
            // list,
            // cost,
            // results,
            // status,
            // employee_list,
            // job_position_list,
            // year_list,
            // status_outstanding,
            // status_completed,
            // status_not_started,
            // results_failed,
            // results_passed,
            // results_average,

          id,
          data: {
              name,
              job_position_list_count,
              training_cost,
              employee_list_count,
              year_list,
          }
        } = item;
        // console.log('RenderCourse', item)
        return <TRow key={id} className="w-full">
            {!this.isViewTargetCourse && <div className="td">
                <Clickable id={id} item={item} target="course" onClick={onViewTarget}>
                    <Chip label={name} size="small"/>
                </Clickable>
            </div>}
            <div className="td padding-t-5 padding-b-5">
                <Clickable item={item} target="course" onClick={onViewJobPositionList}>
                    <Chip label={job_position_list_count.aggregate.count || 'N/A'} size="medium"/>
                </Clickable>
                {/*<Grid container spacing={1} columns={4}>*/}
                {/*    {job_position_list.map((item) => <Grid item>*/}
                {/*        <Clickable id={item.id} item={item} target="job_position" onClick={onViewTarget}>*/}
                {/*            <Chip label={item.name} size="small"/>*/}
                {/*        </Clickable>*/}
                {/*    </Grid>)}*/}
                {/*</Grid>*/}
            </div>
            <div className="td fixed-flex min-w-120">
                <Clickable item={item} target="course" onClick={onViewEmployeeList}>
                    <Chip label={employee_list_count.aggregate.count || 'N/A'} size="medium"/>
                </Clickable>
            </div>
            <YearsTD value={year_list} onViewTarget={onViewTarget}/>
            <StatusTD item={item} isViewCourse={true}/>
            <ResultsTD item={item} isViewCourse={true}/>
            <div className="td fixed-flex min-w-140">
                <CostBtn cost={training_cost.aggregate.sum.cost}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                <HasWarnings item={item} view={view} idx={idx} onClick={onShowWarningMsg}/>
            </div>
        </TRow>;
    }
}
//</editor-fold>

//<editor-fold desc="RenderYear">
@observer
class RenderYear extends React.Component {
    @computed get isViewTargetYear() {
        const {props: {target_view}} = this;
        const {id, target} = target_view || {};
        return target === 'year';
    }

    render() {
        const {item, view, target_view, idx, onShowWarningMsg, onClick, onViewTarget, onViewEmployeeList, onViewCourseList, onViewJobPositionList} = this.props;

        const {
            group,
            list,
            cost,
            results,
            status,
            employee_list,
            job_position_list,
            course_list,
            status_outstanding,
            status_completed,
            status_not_started,
            results_failed,
            results_passed,
            results_average,
        } = item;
        // console.log('RenderYear', group)
        return <TRow key={group} className="w-full">
            {!this.isViewTargetYear && <div className="td fixed-flex min-w-120">
                <Clickable id={group} item={group} target="year" onClick={onViewTarget}>
                    <Chip label={group} size="small"/>
                </Clickable>
            </div>}
            <div className="td padding-t-5 padding-b-5">
                <Clickable item={item} target="course" onClick={onViewCourseList}>
                    <Chip label={course_list.length || 'N/A'} size="medium"/>
                </Clickable>
                {/*<Grid container spacing={1} columns={4}>*/}
                {/*    {course_list.map((item) => <Grid item>*/}
                {/*        <Clickable id={item.id} item={item} target="course" onClick={onViewTarget}>*/}
                {/*            <Chip label={item.name} size="small"/>*/}
                {/*        </Clickable>*/}
                {/*    </Grid>)}*/}
                {/*</Grid>*/}
            </div>
            <div className="td padding-t-5 padding-b-5">
                <Clickable item={item} target="course" onClick={onViewJobPositionList}>
                    <Chip label={job_position_list.length || 'N/A'} size="medium"/>
                </Clickable>
                {/*<Grid container spacing={1} columns={4}>*/}
                {/*    {job_position_list.map((item) => <Grid item>*/}
                {/*        <Clickable id={item.id} item={item} target="job_position" onClick={onViewTarget}>*/}
                {/*            <Chip label={item.name} size="small"/>*/}
                {/*        </Clickable>*/}
                {/*    </Grid>)}*/}
                {/*</Grid>*/}
            </div>
            <div className="td fixed-flex min-w-120">
                <Clickable item={item} target="year" onClick={onViewEmployeeList}>
                    <Chip label={employee_list.length} size="medium"/>
                </Clickable>
            </div>
            <StatusTD item={item} isViewYear={true}/>
            <ResultsTD item={item} isViewYear={true}/>
            <div className="td fixed-flex min-w-140">
                <CostBtn cost={cost}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                <HasWarnings item={item} view={view} idx={idx} onClick={onShowWarningMsg}/>
            </div>
        </TRow>;
    }
}
//</editor-fold>

export {RenderEmployee, RenderJobPosition, RenderCourse, RenderYear};