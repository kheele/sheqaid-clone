// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import 'react-alice-carousel/lib/alice-carousel.css';
import {TRow} from "../../../../../components/tables";
import Chip from "@material-ui/core/Chip";
import Avatar from "@mui/material/Avatar";
import {Grid} from "@material-ui/core";
import {ActionsButton, Clickable} from "../../../../../components/inputs";
import {CostBtn, HasWarnings, ResultsTD, StatusTD, YearsTD} from "./Components";
import {Button} from "@mui/material";
// </editor-fold>

//<editor-fold desc="RenderEmployee">
@observer
class RenderEmployee extends React.Component {
    render() {
        const {item, view, idx, onShowWarningMsg, onClick, onViewTarget} = this.props;

        const {
            group,
            group: {data: {lname, fname, profile_pic}},
            list,
            cost,
            attendanceRate,
            results,
            status,
            courseList,
            yearList
        } = item;
        return <TRow key={group.id}>
            <div className="td">
                <Clickable id={group.id} item={group} target="employee" onClick={onViewTarget}>
                    <Chip
                        avatar={<Avatar
                            alt={lname + ' ' + fname}
                            src={profile_pic && profile_pic.dlUrls && profile_pic.dlUrls[0]}
                        />}
                        label={lname + ' ' + fname}
                    />
                </Clickable>
            </div>
            <div className="td padding-t-5 padding-b-5">
                <Grid container spacing={1} columns={4}>
                    {courseList.map((item) => <Grid item>
                        <Clickable id={item.id} item={item} target="course" onClick={onViewTarget}>
                            <Chip label={item.data.name} size="small"/>
                        </Clickable>
                    </Grid>)}
                </Grid>
            </div>
            <YearsTD value={yearList} onViewTarget={onViewTarget}/>
            <StatusTD value={status}/>
            <ResultsTD value={results}/>
            <div className="td fixed-flex min-w-120">
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

//<editor-fold desc="RenderJobPosition">
@observer
class RenderJobPosition extends React.Component {
    render() {
        const {item, view, idx, onShowWarningMsg, onClick, onViewTarget} = this.props;

        const {
            group,
            group: {data: {name}},
            list,
            cost,
            attendanceRate,
            results,
            status,
            employeeList,
            courseList,
            yearList
        } = item;
        return <TRow key={group.id}>
            <div className="td">
                <Clickable id={group.id} item={group} target="job_position" onClick={onViewTarget}>
                    <Chip label={name} size="small"/>
                </Clickable>
            </div>
            <div className="td padding-t-5 padding-b-5">
                <Grid container spacing={1} columns={4}>
                    {courseList.map((item) => <Grid item>
                        <Clickable id={item.id} item={item} target="course" onClick={onViewTarget}>
                            <Chip label={item.data.name} size="small"/>
                        </Clickable>
                    </Grid>)}
                </Grid>
            </div>
            <div className="td fixed-flex min-w-120">{employeeList.length}</div>
            <YearsTD value={yearList} onViewTarget={onViewTarget}/>
            <StatusTD value={status}/>
            <ResultsTD value={results}/>
            <div className="td fixed-flex min-w-120">
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
    render() {
        const {item, view, idx, onShowWarningMsg, onClick, onViewTarget} = this.props;

        const {
            group,
            group: {data: {name}},
            list,
            cost,
            attendanceRate,
            results,
            status,
            employeeList,
            jobPositionList,
            yearList
        } = item;
        return <TRow key={group.id}>
            <div className="td">
                <Clickable id={group.id} item={group} target="course" onClick={onViewTarget}>
                    <Chip label={name} size="small"/>
                </Clickable>
            </div>
            <div className="td padding-t-5 padding-b-5">
                <Grid container spacing={1} columns={4}>
                    {jobPositionList.map((item) => <Grid item>
                        <Clickable id={item.id} item={item} target="job_position" onClick={onViewTarget}>
                            <Chip label={item.data.name} size="small"/>
                        </Clickable>
                    </Grid>)}
                </Grid>
            </div>
            <div className="td fixed-flex min-w-120">{employeeList.length}</div>
            <YearsTD value={yearList} onViewTarget={onViewTarget}/>
            <StatusTD value={status}/>
            <ResultsTD value={results}/>
            <div className="td fixed-flex min-w-120">
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

//<editor-fold desc="RenderYear">
@observer
class RenderYear extends React.Component {
    render() {
        const {item, view, idx, onShowWarningMsg, onClick, onViewTarget} = this.props;

        const {
            group,
            list,
            cost,
            attendanceRate,
            results,
            status,
            employeeList,
            jobPositionList,
            courseList
        } = item;
        return <TRow key={group}>
            <div className="td">
                <Clickable id={group} item={group} target="year" onClick={onViewTarget}>
                    <Chip label={group} size="small"/>
                </Clickable>
            </div>
            <div className="td padding-t-5 padding-b-5">
                <Grid container spacing={1} columns={4}>
                    {courseList.map((item) => <Grid item>
                        <Clickable id={item.id} item={item} target="course" onClick={onViewTarget}>
                            <Chip label={item.data.name} size="small"/>
                        </Clickable>
                    </Grid>)}
                </Grid>
            </div>
            <div className="td padding-t-5 padding-b-5">
                <Grid container spacing={1} columns={4}>
                    {jobPositionList.map((item) => <Grid item>
                        <Clickable id={item.id} item={item} target="job_position" onClick={onViewTarget}>
                            <Chip label={item.data.name} size="small"/>
                        </Clickable>
                    </Grid>)}
                </Grid>
            </div>
            <div className="td fixed-flex min-w-120">{employeeList.length}</div>
            <StatusTD value={status}/>
            <ResultsTD value={results}/>
            <div className="td fixed-flex min-w-120">
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