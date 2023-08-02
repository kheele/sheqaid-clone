import React from "react";
import {observer} from 'mobx-react';

import style from "./AMeetingTab.lazy.css";

import {Dates} from '../../../../utils/Utils';
import {MeetingList} from '../../../../components/page-lists';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import {ConfirmDialog} from '../../../../components/dialogs';
import {Button, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewMinutesDialog from './dialogs/NewMinutesDialog';
import ProfileMinutesDialog from './dialogs/ProfileMinutesDialog';
import NewMeetingDialog from '../../plugin_general/Calendar/NewMeetingDialog';
import ProfileMeetingDialog from '../../plugin_general/Calendar/ProfileMeetingDialog.js';

@observer
class AMeetingTab extends React.Component {
    pageKey = "AMeetingTab";

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {permissionKey} = this.props;
        return <div id={this.pageKey + "-tab"} className={this.pageKey + "-tab page-content AContentSide-container"}>
            <Minutes permissionKey={permissionKey} path={this.path} meetingType={this.meetingType}/>
            <UpcomingMeetings permissionKey={permissionKey} path={this.path} meetingType={this.meetingType}/>
        </div>;
    }
}

@observer
class Minutes extends React.Component {

    path;
    pageKey = "Minutes";

    constructor(props) {
        super(props);

        this.path = props.path + "minutes/";

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="date" type="date" placeholder="Date..." className="fixed-flex min-w-185 form-control" onChange={onChange}/>
            <ClearableInput name="title" type="text" placeholder="Agenda" className="form-control" onChange={onChange}/>
            <ClearableInput name="participants" type="text" placeholder="Participant(s) Name(s)" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Agenda</div>
            <div className="td fixed-flex"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, doc, meeting, type}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{meeting.title}</div>
            <div className="td fixed-flex">
                <Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-bars"/>
		</Button>
            </div>
        </TRow>;
    }

    render() {
        const {meetingType} = this.props;
        //const {cost, completed_trainings, outstanding_trainings, accredited_trainings, non_accredited_trainings} = this.state.counts;
        return <div className="content-side Minutes">
            <h4>Minutes</h4>
            <div>
                <APageListReadWrite 
                    hasBackBtn={false}
                    ref="root"
                    page={this}
                    createBtnTitle="Add Minutes"
                    pageId={this.pageKey}
                    pageTitle="Minutes"
                    pageTitleSingular="minutes"
                    path={this.path}
                    noAnimation={true}
                    filterNodeFloat
                    renderPopoverOptions={this.renderPopoverOptions}
                    renderFilterNode={this.renderFilterNode}
                    renderTHead={this.renderTHead}
                    renderItem={this.renderItem}>
                    <ConfirmDialog ref="removeDialog"/>
                    
                    <NewMinutesDialog ref="newDialog" path={this.path + "minutes/"} title={"Create " + meetingType + " Meeting Minutes"} meetingType={meetingType}/>
                    <ProfileMinutesDialog ref="profileDialog" path={this.path + "minutes/"} title={meetingType + " Meeting Minutes"} meetingType={meetingType}/>
                </APageListReadWrite>
            </div>
        </div>;
    }
}

@observer
class UpcomingMeetings extends React.Component {

    path;
    pageKey = "UpcomingMeetings";

    constructor(props) {
        super(props);

        this.path = props.path;

        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>*/}
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="date" type="date" placeholder="Date..." className="fixed-flex min-w-185 form-control" onChange={onChange}/>
            <ClearableInput name="title" type="text" placeholder="Agenda" className="form-control" onChange={onChange}/>
            <ClearableInput name="participants" type="text" placeholder="Participant(s) Name(s)" className="form-control" onChange={onChange}/>
        </div>;
    }

    get action() {
        return <React.Fragment><i className="fa fa-bars"/></React.Fragment>;
    }

    render() {
        const {meetingType} = this.props;
        //const {cost, completed_trainings, outstanding_trainings, accredited_trainings, non_accredited_trainings} = this.state.counts;

        return <div className="content-side UpcomingMeetings">
        <h4>Meetings</h4>
        <div>
            <MeetingList 
                listPage={this}
                hasCreateBtn={() => true}
                pageTitle="Meetings"
                createBtnTitle="Schedule Meeting"
                path={this.path}
                filterNodeFloat
                renderPopoverOptions={this.renderPopoverOptions}
                renderFilterNode={this.renderFilterNode}
                action={this.action}>
                <ConfirmDialog ref="removeDialog"/>
                
                <NewMeetingDialog ref="newDialog" path={this.path} title={"Schedule " + meetingType + " Meeting"} meetingType={meetingType}/>
                <ProfileMeetingDialog ref="profileDialog" path={this.path} title={meetingType + " Meeting"} meetingType={meetingType}/>
            </MeetingList>
        </div>
    </div>;
    }
}

export default AMeetingTab;
