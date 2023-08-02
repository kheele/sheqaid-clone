// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {renderLeftButtonsForTeamAttendanceOnly} from '../../../../../utils/ComponentUtils';
import {execWhen} from '../../../../../utils/Utils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import {ActionsButton} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

import style from "./AttendanceTeamDialog.lazy.css";

// </editor-fold>

@observer
class AttendanceTeamDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "AttendanceTeamDialog";
    title = "Attendance Team";
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onAction = this.onAction.bind(this);
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
    
    onLoadList(root, isNew) {
        return execWhen(() => this.state.defaultList);
    }
    
    onAction(evt, btn) {
//        const {action} = btn.props;
//        this.state.isTeamView = action === "Teams";
    }
        
    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Last Name</div>
            <div className="td">First Name</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-180"></div>
        </THead>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const action = this.extraProp('action');
        
        const item = this.refs.root.list[n];
        const {id, data: {lname, fname}} = item;
        return <TRow key={id}>
            <div className="td">{lname}</div>
            <div className="td">{fname}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-170">
            	<ActionsButton idx={n} action="lost" className="btn btn-primary pull-right min-w-40" icon="times" onClick={this.onAction}/>
            	<ActionsButton idx={n} action="over" className="btn btn-primary pull-right min-w-40" icon="times" onClick={this.onAction}/>
            	<ActionsButton idx={n} action="no_hrs" className="btn btn-primary pull-right min-w-40" icon="times" onClick={this.onAction}/>
            	<ActionsButton idx={n} action="paid" className="btn btn-primary pull-right min-w-40" icon="times" onClick={this.onAction}/>
            </div>
        </TRow>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="employee"
            pageTitleSingular="employee"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={renderLeftButtonsForTeamAttendanceOnly}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
        </APageListReadWrite>;
    }
    // </editor-fold>

}

export default AttendanceTeamDialog;
