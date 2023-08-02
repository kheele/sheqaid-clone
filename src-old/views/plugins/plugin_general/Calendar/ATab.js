import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

@observer
class ATab extends React.Component {
    path = "plugin_sheq_assist/calendar/";
    
    @observable
    state = {
        dataLoaded: false,
        dataError: false,
        list: []
    };

    constructor(props, style) {
        super(props);
        this.style = style;

	this.onSelectEvent = this.onSelectEvent.bind(this);
	this.onYearDateClick = this.onYearDateClick.bind(this);
	this.onYearMonthClick = this.onYearMonthClick.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
    }

    componentWillMount() {
        this.style.use();
    }

    componentDidMount() {
        this.onLoadList();
    }
    
    componentWillUnmount() {
        this.style.unuse();
    }
    
    onYearDateClick(e, date) {
        this.onLoadList();
    }

    onYearMonthClick(e, date) {
        this.onLoadList();
    }
    
}

export default ATab;