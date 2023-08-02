import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import {Calendar as BigCalendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {ListLoaderState} from 'components/lists';

import CalendarYearView from './CalendarYearView';

@observer
class BigCalendarWrapper extends React.Component {

    @observable state = {
        view: 'year', 
        defaultView: 'year',
        date: new Date()
    };
    
    constructor() {
        super();

	this.onView = this.onView.bind(this);
	this.onNavigate = this.onNavigate.bind(this);
	this.onSelectEvent = this.onSelectEvent.bind(this);
	this.onYearDateClick = this.onYearDateClick.bind(this);
	this.onYearMonthClick = this.onYearMonthClick.bind(this);
    }
    
    onView(view) {
        this.state.view = view;
    }
    
    onNavigate(date) {
        this.state.date = date;
    }
    
    onSelectEvent(event) {
        const {onSelectEvent} = this.props;
        onSelectEvent && onSelectEvent(event);
    }

    onYearDateClick(e, momentDate) {
        let {onYearDateClick} = this.props;
        if(onYearDateClick) {
            onYearDateClick = onYearDateClick(e, momentDate.toDate());
            if(onYearDateClick instanceof Promise) {
                onYearDateClick.then(open => {
                    if(open) {
                        this.state.view = 'day';
                        this.state.date = momentDate.toDate();
                    }
                });
                return;
            }
        }
        this.state.view = 'day';
        this.state.date = momentDate.toDate();
    }

    onYearMonthClick(e, momentDate) {
        const {onYearMonthClick} = this.props;
        onYearMonthClick && onYearMonthClick(e, momentDate.format('MMMM'));
        this.state.view = 'month';
        this.state.date = momentDate.toDate();
    }
    
    get selectedDate() {
        return this.state.date;
    }
    
    get selectedView() {
        return this.state.view;
    }

    render() {
        const {state} = this.props;
        if (!state.dataLoaded || state.dataError) {
            return <ListLoaderState onChange={this.onChange} onLoad={this.onLoad} state={state} title='Events'/>;
        }

        // Setup the localizer by providing the moment (or globalize) Object
        // to the correct localizer.
        const localizer = momentLocalizer(moment) // or globalizeLocalizer
        localizer.formats.yearHeaderFormat = 'YYYY';

        const list = toJS(state.list);
        console.log('BigCalendarWrapper', list)
        return <BigCalendar
            localizer={localizer}
            events={list}
            date={this.state.date}
            onYearDateClick={this.onYearDateClick}
            onYearMonthClick={this.onYearMonthClick}
            defaultView={this.state.defaultView}
            view={this.state.view}
            onView={this.onView}
            onNavigate={this.onNavigate}
            onSelectEvent={this.onSelectEvent}
            views={{
                day: true,
                week: true,
                month: true,
                year: CalendarYearView
              }}
            messages={{ year: 'Year' }}
            startAccessor="start"
            endAccessor="end"
            />;
    }
}

export default BigCalendarWrapper;