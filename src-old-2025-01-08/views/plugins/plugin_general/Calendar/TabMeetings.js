import React from "react";
import {observer} from 'mobx-react';

import {calculateRightPos, execWhen} from 'utils/Utils';
import {renderLeftButtonsForExpiryOnly_firebase} from 'utils/ComponentUtils';

import {Button} from 'components/inputs';
import {TabledTopPanel} from 'components/tables';
import Popover from 'components/popovers/Popover';
import NavItem from 'components/navs/NavItem';

import ATab from './ATab';
import BigCalendarWrapper from './BigCalendarWrapper';
import DataSource from './data';

import NewMeetingDialog from './NewMeetingDialog';
import ProfileMeetingDialog from './ProfileMeetingDialog.js';

import style from "./TabMeetings.lazy.css";

@observer
class Main extends ATab {

    constructor(props) {
        super(props, style);
        this.classNames += " LeftButtonsForExpiryOnlyPage";

        this.onYearDateClickOpts = this.onYearDateClickOpts.bind(this);
        this.onNewMeeting = this.onNewMeeting.bind(this);
        this.onSelectMeetingType = this.onSelectMeetingType.bind(this);
    }

    onYearDateClickOpts(e, el) {
        const {onComplete, action, date, pos: {top, right}} = el.props;
        if (action === 'Create') {
            setTimeout(() => {
                this.refs.popover.settings({
                    style: {left: "auto", right, top, width: 'auto', minWidth: 200},
                    contentNode: <div>
                        <NavItem key={0} onClick={this.onSelectMeetingType} date={date} type="Safety" title="Schedule Safety Meeting"/>
                        <NavItem key={1} onClick={this.onSelectMeetingType} date={date} type="Management" title="Schedule Management Meeting"/>
                        <NavItem key={2} onClick={this.onSelectMeetingType} date={date} type="General" title="Schedule General Meeting"/>
                    </div>
                }).open();
            }, 500);
            onComplete && onComplete(false);
        } else if (action === 'View') {
            if(onComplete)  {
                onComplete(true);
            }
            //This function MUST run in the next event loop
            //to avoid using the same event loop with onComplete
            setTimeout(() => this.onLoadList());
        }
    }

    onSelectEvent(event) {
        const {profileDialog} = this.refs;
        const {key, item} = event;
        console.log(event)
        switch (key) {
            case 'Management':
                profileDialog.open(item, key);
                break;
            case 'Safety':
                profileDialog.open(item, key);
                break;
            case 'General':
                profileDialog.open(item, key);
                break;
        }
    }

    onYearDateClick(e, date) {
        return new Promise((resolve, reject) => {
            const {top} = $(e.target).offset();
            const right = calculateRightPos(e.target);
            const pos = {top, right};
            this.refs.popover.settings({
                style: {left: "auto", right, top, width: 'auto', minWidth: 200},
                contentNode: <div>
                    <NavItem key={0} onClick={this.onYearDateClickOpts} date={date} onComplete={resolve} pos={pos} action="View" title="View Meetings"/>
                    <NavItem key={1} onClick={this.onYearDateClickOpts} date={date} onComplete={resolve} pos={pos} action="Create" title="Schedule Meeting"/>
                </div>
            }).open();
        });
    }

    onNewMeeting(e) {
        const {left} = $(e.target).offset();
        this.refs.popover.settings({
            style: {left, top: 60, width: 'auto', minWidth: 200},
            contentNode: <div>
                <NavItem key={0} onClick={this.onSelectMeetingType} type="Safety" title="Schedule Safety Meeting"/>
                <NavItem key={1} onClick={this.onSelectMeetingType} type="Management" title="Schedule Management Meeting"/>
                <NavItem key={2} onClick={this.onSelectMeetingType} type="General" title="Schedule General Meeting"/>
            </div>
        }).open();
    }

    onSelectMeetingType(e, elem) {
        const {type, date} = elem.props;
        let promise;
        if (date) {
            promise = this.refs.newMeetingDialog.extraProp('date', date).open(type);
        } else {
            promise = this.refs.newMeetingDialog.open(type);
        }
        promise.then(item => {
            this.state.list.pushFirst(item);
        });
    }

    onLoadList() {
        execWhen(() => !!this.refs.bigCalendarWrapper).then(() => {
            const {bigCalendarWrapper: {selectedDate, selectedView}} = this.refs;
            DataSource.meetings.load(this.state, selectedDate, selectedView);
        });
    }
    
    update() {
        this.onLoadList();
    }

    render() {
        return (<div id="TabMeetings-page" className={this.classNames + " TabMeetings-page calendar-page"}>
            <div className="page-title">
                <h3>Calendar</h3>
                <TabledTopPanel ref="tabledTopPanel" titleSinglar="Event" titlePlural="events">
                    {renderLeftButtonsForExpiryOnly_firebase.call(this)}
                    <Button className="btn btn-primary pull-right" type="Safety" onClick={this.onSelectMeetingType}>
                        <i className="fa fa-plus"/> Safety Meeting
                    </Button>
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10" type="Management" onClick={this.onSelectMeetingType}>
                        <i className="fa fa-plus"/> Management Meeting
                    </Button>
                    <Button className="btn btn-primary pull-right" type="General" onClick={this.onSelectMeetingType}>
                        <i className="fa fa-plus"/> General Meeting
                    </Button>
                </TabledTopPanel>	
                <div className="clearfix"/>
            </div>
            <BigCalendarWrapper 
                ref="bigCalendarWrapper"
                state={this.state} 
                onSelectEvent={this.onSelectEvent}
                onYearDateClick={this.onYearDateClick} 
                onYearMonthClick={this.onYearMonthClick}/>
        
            <NewMeetingDialog ref="newMeetingDialog"/>
            <ProfileMeetingDialog ref="profileDialog"/>
            <Popover key="popover" ref="popover"/>
        </div>);
    }
}

export default Main;