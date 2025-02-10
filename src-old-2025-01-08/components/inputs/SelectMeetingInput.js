import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {onAsyncSelectLoadImpl} from '../../utils/AsyncSelect';
import {ClearableInput} from '../../components/inputs';

import ASelectInput from '../../components/inputs/ASelectInput';

@observer
class SelectInput extends ASelectInput {

    @observable
    state = {
        lists: {
            list: []
        },
        props: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectMeetingInput`;
        
        const {meetingType} = this.props;
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "meeting",
            type: "select",
            placeholder: "Meeting (Agenda)...",
            onAsyncSelectLoad: onAsyncSelectLoad(meetingType),
            returnValue: true,
//            add: true,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };        
    }

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            return {value: defaultValue, label: defaultValue};
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if(!props) return null;

        delete props.meetingType;

        return <ClearableInput {...props}/>;
    }
}

function onAsyncSelectLoad(meetingType = 'Other') {
    const path = {
        Safety: 'plugin_sheq_assist/06_Communication_And_Participation/safety-meeting/list/search_by_name',
        Management: 'plugin_sheq_assist/06_Communication_And_Participation/management-meeting/list/search_by_name',
        Other: 'plugin_sheq_assist/06_Communication_And_Participation/meeting/list/search_by_name'
    }[meetingType];

    return value => onAsyncSelectLoadImpl(path, value, value => {
            return {label: value.data.title, value};
        });
}

//function onAsyncSelectLoadMeetings(value) {
//    return onAsyncSelectLoadImpl("calendar/meetings/list/search_by_name", value, value => {
//        return {label: value.data.title, value};
//    });
//}

export default SelectInput;
