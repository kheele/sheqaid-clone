import React from "react";
import {observer} from 'mobx-react';

import {calculateRightPos, execWhen} from '../../../../utils/Utils';
import {renderLeftButtonsForExpiryOnly} from '../../../../utils/ComponentUtils';

import {Button} from '../../../../components/inputs';
import {TabledTopPanel} from '../../../../components/tables';
import Popover from '../../../../components/popovers/Popover';
import NavItem from '../../../../components/navs/NavItem';

import ATab from './ATab';
import BigCalendarWrapper from './BigCalendarWrapper';
import DataSource from './data';

import NewTaskDialog from './NewTaskDialog';
import ProfileTaskDialog from './ProfileTaskDialog';

import style from "./TabTasks.lazy.css";

@observer
class Main extends ATab {

    constructor(props) {
        super(props, style);
        this.classNames += " LeftButtonsForExpiryOnlyPage";

        this.onYearDateClickOpts = this.onYearDateClickOpts.bind(this);
        this.onNewTask = this.onNewTask.bind(this);
    }

    onYearDateClickOpts(e, el) {
        const {onComplete, action, date} = el.props;
        if (action === 'Create') {
            this.onNewTask(e, date);
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
            case 'Employee_Task':
                profileDialog.open(item);
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
                    <NavItem key={0} onClick={this.onYearDateClickOpts} date={date} onComplete={resolve} action="View" title="View Tasks"/>
                    <NavItem key={1} onClick={this.onYearDateClickOpts} date={date} onComplete={resolve} action="Create" title="Schedule Task"/>
                </div>
            }).open();
        });
    }

    onNewTask(e, elem){
        const date = isDate(elem) ? elem : elem.props.date;
        let promise;
        if(date) {
            promise = this.refs.newTaskDialog.extraProp('date', date).open();
        } else {
            promise = this.refs.newTaskDialog.open();
        }
        promise.then(item => {
            this.state.list.pushFirst(item);
        });
    }

    onLoadList() {
        execWhen(() => !!this.refs.bigCalendarWrapper).then(() => {
            const {bigCalendarWrapper: {selectedDate, selectedView}} = this.refs;
            DataSource.tasks.load(this.state, selectedDate, selectedView);
        });
    }
    
    update() {
        this.onLoadList();
    }

    render() {
        return (<div id="TabTasks-page" className={this.classNames + " TabTasks-page calendar-page"}>
            <div className="page-title">
                <h3>Calendar</h3>
                <TabledTopPanel ref="tabledTopPanel" titleSinglar="Event" titlePlural="events">
                    {renderLeftButtonsForExpiryOnly.call(this)}
                    <Button className="btn btn-primary pull-right top-btn-nav__create" onClick={this.onNewTask}>
                        <i className="fa fa-plus"/> Task
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
            
            <NewTaskDialog ref="newTaskDialog"/>
            <ProfileTaskDialog ref="profileDialog"/>
            <Popover key="popover" ref="popover"/>
        </div>);
    }
}

export default Main;