// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import {ActionsButton, Button, ClearableInput} from 'components/inputs';
import {TRow} from 'components/tables';

import AttendanceByTeamDialog from './AttendanceByTeamDialog';
import AttendanceByDepartmentDialog from './AttendanceByDepartmentDialog';

import style from "./AttendanceDialog.lazy.css";

// </editor-fold>

@observer
class AttendanceDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = 'plugin_sheq_assist/employees/';
    pageKey = "AttendanceDialog";
    title = "Attendance";
    
    @observable
    selfState = {
        isTeamView: true
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onChangeViewBy = this.onChangeViewBy.bind(this);
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
    
    onChangeViewBy(evt, btn) {
        const {action} = btn.props;
        this.selfState.isTeamView = action === "Teams";
    }
    
    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
        const {selfState} = this;
        return <React.Fragment>
            <div className="ViewByPanel">
                <ViewByPanel state={selfState} onChange={this.onChangeViewBy}/>
            </div>
            <ListViewByTeam state={selfState} path={this.path}/>
            <ListViewByDepartment state={selfState} path={this.path}/>
        </React.Fragment>;
    }
    // </editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="ViewByPanel">
@observer
class ViewByPanel extends React.Component {
    
    render() {
        const {state: {isTeamView}, onChange} = this.props;
        return <React.Fragment>
            <Button action="Teams" className={"btn btn-primary fixed-flex " + (isTeamView ? '_888' : '')} onClick={onChange}>
                View By Teams
            </Button>
            <Button action="Departments" className={"btn btn-primary fixed-flex " + (!isTeamView ? '_888' : '')} onClick={onChange}>
                View By Departments
            </Button>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListViewByTeam">
@observer
class ListViewByTeam extends React.Component {
    
    pageKey = "ListViewByTeam";
    path;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'teams/';
        
        this.onView = this.onView.bind(this);
        
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    // </editor-fold>
    
    onView(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.listDialog.open(item);
    }

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return null;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, supervisor: {lname, fname, data}, name}} = item;
//        console.log(item)
        return <TRow key={id}>
            <div className="td">
                <h6 className="font-size-13 font-bold">Supervisor</h6>
                {(lname || data.lname) + " " + (fname || data.fname)}
            </div>
            <div className="td">
                <h6 className="font-size-13 font-bold">Team Name</h6>
                {name}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} id={id} className="btn btn-primary pull-right w-40" icon="eye" onClick={this.onView}/>
            </div>
        </TRow>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isTeamView} = this.props.state;
        if(!isTeamView) return null;
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            pageId={this.pageKey + '-page'}
            listCountTopTitle="team"
            pageTitleSingular="team"
            path={this.path}
            noAnimation={true}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            
            <AttendanceByTeamDialog ref="listDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListViewByDepartment">
@observer
class ListViewByDepartment extends React.Component {
    
    pageKey = "ListViewByDepartment";
    path;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'departments/';
        
        this.onView = this.onView.bind(this);
        
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    // </editor-fold>

    onView(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.listDialog.open(item);
    }

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return null;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, name}} = item;
        return <TRow key={id}>
            <div className="td">
                <h6 className="font-size-13 font-bold">Department Name</h6>
                {name}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} id={id} className="btn btn-primary pull-right w-40" icon="eye" onClick={this.onView}/>
            </div>
        </TRow>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isTeamView} = this.props.state;
        if(isTeamView) return null;
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            pageId={this.pageKey + '-page'}
            listCountTopTitle="department"
            pageTitleSingular="department"
            path={this.path}
            noAnimation={true}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            
            <AttendanceByDepartmentDialog ref="listDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}
// </editor-fold>

export default AttendanceDialog;
