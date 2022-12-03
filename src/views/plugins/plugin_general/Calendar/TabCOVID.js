import React from "react";
import {observer} from 'mobx-react';

import {execWhen} from '../../../../utils/Utils';
import {renderLeftButtonsForExpiryOnly} from '../../../../utils/ComponentUtils';
import {TabledTopPanel} from '../../../../components/tables';
import Popover from '../../../../components/popovers/Popover';

import ATab from './ATab';
import BigCalendarWrapper from './BigCalendarWrapper';
import DataSource from './data';

import ProfileDialog from "../../common/documents/ProfileDialog";

import style from "./TabCOVID.lazy.css";

@observer
class Main extends ATab {

    constructor(props) {
        super(props, style);
        this.classNames += " LeftButtonsForExpiryOnlyPage";
    }
    
    onSelectEvent(event) {
        const {profileDialog} = this.refs;
        const {key, displayTitle, item} = event;
        console.log(event)
        switch (key) {
            case 'COVID_Management_Document':
                profileDialog.open(item, displayTitle);
                break;
        }
    }

    onLoadList() {
        execWhen(() => !!this.refs.bigCalendarWrapper).then(() => {
            const {bigCalendarWrapper: {selectedDate, selectedView}} = this.refs;
            DataSource.covid.load(this.state, selectedDate, selectedView);
        });        
    }
    
    update() {
        this.onLoadList();
    }

    render() {
        return (<div id="TabCOVID-page" className={this.classNames + " TabCOVID-page calendar-page"}>
            <div className="page-title">
                <h3>Calendar</h3>
                <TabledTopPanel ref="tabledTopPanel" titleSinglar="Event" titlePlural="events">
                    {renderLeftButtonsForExpiryOnly.call(this)}
                </TabledTopPanel>	
                <div className="clearfix"/>
            </div>
            <BigCalendarWrapper 
                ref="bigCalendarWrapper"
                state={this.state} 
                onSelectEvent={this.onSelectEvent}
                onYearDateClick={this.onYearDateClick} 
                onYearMonthClick={this.onYearMonthClick}/>
            
            <ProfileDialog ref="profileDialog"/>            
            <Popover key="popover" ref="popover"/>
        </div>);
    }
}

export default Main;