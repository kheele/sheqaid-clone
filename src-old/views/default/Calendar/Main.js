import React from "react";
import {observer} from 'mobx-react';
import {autorun, observable, when} from 'mobx';

import {Calendar as BigCalendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'

import APage from "../../APage";
import {Button} from '../../../components/inputs';
import {TabledTopPanel} from '../../../components/tables';
import {ListLoaderState} from '../../../components/lists';

import NewMeetingDialog from './dialogs/NewMeetingDialog';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = 'Calendar';
    static title = 'Calendar';
    static faIconLeft = 'calendar';

    path = "plugin_common_modules/calendar/";

    @observable
    state = {
        dataLoaded: false,
        dataError: false,
        list: []
    };

    constructor(props) {
        super(props);

        this.onNewMeeting = this.onNewMeeting.bind(this);
        this.onNew = this.onNew.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentDidMount() {
        super.componentDidMount();

        when(() => this.state.dataLoaded, () => {
            //app.onPageComplete();
        });

        autorun(() => {
            if (!this.state.dataLoaded)
                return;
            this.refs.tabledTopPanel.setList(this.state.list);
            console.log('APageList.componentDidMount.autorun', this.state.list.length)
        });

        this.onLoadList();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
    }

    onNewMeeting() {
        this.refs.newMeetingDialog.open().then(item => {
            this.state.list.pushFirst(item);
        });
    }

    onNew() {
        this.refs.newMeetingDialog.open(item => {
            this.state.list.pushFirst(item);
        });
    }

    onLoadList() {
        neonBinding.events.emit(this.path + "list").then(res => {
            this.state.list.pushAll(res.map(v => {
                v.start = new Date(v.start);
                v.end = new Date(v.end);
                return v;
            }));
            this.state.dataError = false;
            this.state.dataLoaded = true;
        }).catch(e => {
            console.log(e);
            this.state.dataError = true;
            this.state.dataLoaded = true;
        });
        neonBinding.events.emit("plugin_common_modules/calendar/meetings/list").then(res => {
            this.state.list.pushAll(res.map(v => {
                v.start = new Date(v.data.start);
                v.end = new Date(v.data.end);
                v.title = v.data.title;
                return v;
            }));
            this.state.dataError = false;
            this.state.dataLoaded = true;
        }).catch(e => {
            console.log(e);
            this.state.dataError = true;
            this.state.dataLoaded = true;
        });
    }

    render() {
        return (<div id="calendar-page" className={this.classNames + " calendar-page"}>
            <div className="page-title">
                {this.renderBackBtn()}
                <h3>Calendar</h3>
                <TabledTopPanel ref="tabledTopPanel" titleSinglar="Event" titlePlural="events">
                    <Button className="btn btn-primary pull-right top-btn-nav__create" onClick={this.onNewMeeting}>
                        <i className="fa fa-plus"/>Create Todo
                    </Button>
                    <Button className="btn btn-primary pull-right top-btn-nav__create" onClick={this.onNew}>
                        <i className="fa fa-plus"/>Create Event
                    </Button>
                    <Button className="btn btn-primary pull-right top-btn-nav__create" onClick={this.onNew}>
                        <i className="fa fa-plus"/>Schedule Meeting
                    </Button>
                </TabledTopPanel>	
                <div className="clearfix"/>
            </div>
            <BigCalendarWrapper state={this.state}/>
        
            <NewMeetingDialog ref="newMeetingDialog" path="plugin_common_modules/calendar/meetings/" title="Schedule Meeting"/>
        </div>);
    }
}

@observer
class BigCalendarWrapper extends React.Component {

    constructor() {
        super();

        //this.onLoadList = this.onLoadList.bind(this);
    }

    render() {
        const {state} = this.props;
        if (!state.dataLoaded || state.list.isEmpty() || state.dataError) {
            return <ListLoaderState onChange={this.onChange} onLoad={this.onLoad} state={state} title='Events'/>;
        }

        // Setup the localizer by providing the moment (or globalize) Object
        // to the correct localizer.
        const localizer = momentLocalizer(moment) // or globalizeLocalizer

        console.log(state)
        return <BigCalendar
            localizer={localizer}
            events={state.list}
            startAccessor="start"
            endAccessor="end"
            />;
    }
}

export default Main;