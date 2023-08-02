import React from "react";
import {observer} from 'mobx-react';

import {execWhen} from 'utils/Utils';
import {renderLeftButtonsForExpiryOnly_firebase} from 'utils/ComponentUtils';
import {TabledTopPanel} from 'components/tables';
import Popover from 'components/popovers/Popover';

import ATab from './ATab';
import BigCalendarWrapper from './BigCalendarWrapper';
import DataSource from './data';

import ProfileCompetencyCertificateDialog from "views/plugins/plugin_hr_management/Competencies/forms/ProfileDialog";
import ProfileContractDialog from "views/plugins/plugin_hr_management/Contracts/forms/ProfileDialog";
import ProfileMedicalFitnessCertificateDialog from "views/plugins/plugin_hr_management/Medicals/forms/ProfileDialog";
import ProfileWarningDialog from "views/plugins/plugin_hr_management/Warnings/forms/ProfileDialog";

import style from "./TabExpiredEmployeeDocs.lazy.css";

@observer
class Main extends ATab {

    constructor(props) {
        super(props, style);
        this.classNames += " LeftButtonsForExpiryOnlyPage";
    }

    onSelectEvent(event) {
        const {profileMedicalFitnessCertificateDialog, profileCompetencyCertificateDialog, profileContractDialog, profileWarningDialog} = this.refs;
        const {key, item} = event;
        console.log(event)
        switch (key) {
            case 'Contract':
                profileContractDialog.open(item);
                break;
            case 'Competency':
                profileCompetencyCertificateDialog.open(item);
                break;
            case 'Medical':
                profileMedicalFitnessCertificateDialog.open(item);
                break;
            case 'Warning':
                profileWarningDialog.open(item);
                break;
        }
    }

    onLoadList() {
        execWhen(() => !!this.refs.bigCalendarWrapper).then(() => {
            const {bigCalendarWrapper: {selectedDate, selectedView}} = this.refs;
            DataSource.employees.load(this.state, selectedDate, selectedView);
        });
    }
    
    update() {
        this.onLoadList();
    }

    render() {
        return (<div id="TabExpiredEmployeeDocs-page" className={this.classNames + " TabExpiredEmployeeDocs-page calendar-page"}>
            <div className="page-title">
                <h3>Calendar</h3>
                <TabledTopPanel ref="tabledTopPanel" titleSinglar="Event" titlePlural="events">
                    {renderLeftButtonsForExpiryOnly_firebase.call(this)}
                </TabledTopPanel>	
                <div className="clearfix"/>
            </div>
            <BigCalendarWrapper 
                ref="bigCalendarWrapper"
                state={this.state} 
                onSelectEvent={this.onSelectEvent}
                onYearDateClick={this.onYearDateClick} 
                onYearMonthClick={this.onYearMonthClick}/>
        
            <ProfileMedicalFitnessCertificateDialog ref="profileMedicalFitnessCertificateDialog"/>
            <ProfileCompetencyCertificateDialog ref="profileCompetencyCertificateDialog"/>
            <ProfileContractDialog ref="profileContractDialog"/>
            <ProfileWarningDialog ref="profileWarningDialog"/>
        
            <Popover key="popover" ref="popover"/>
        </div>);
    }
}

export default Main;