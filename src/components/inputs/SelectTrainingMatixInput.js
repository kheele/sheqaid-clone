import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';

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
    
    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectTrainingMatixInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "training",
            type: "select",
            placeholder: "Training Matrix...",
            values: this.list,
            returnValue: true,
            add: false,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
    }

    @computed
    get selectedItem() {
        let {defaultValue: _defaultValue} = this.props;
        if(_defaultValue) {
            if(_defaultValue.label && _defaultValue.value) {
                return _defaultValue;
            }
            const defaultValue = this.list.find(v => v.value.id === _defaultValue.id);
            // console.log('defaultValue', defaultValue, _defaultValue, this.list.map(v => v.value.id).slice())
            if(!defaultValue) {
                return null;
            }
            if(defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {name, course_or_module, data} = defaultValue;
            let label = data ? data.name : name;
            if(name) {
                label = name;
            } else if(course_or_module) {
                label = course_or_module.name || (course_or_module.data && course_or_module.data.name);
            } else if(data) {
                label = data.name;
            }
            console.log('selectedVal', label, defaultValue)
            return {value: defaultValue, label};
        }
        return null;
    }
    
    render() {
        const {props} = this.state;
        if(!props) return null;

        return <ClearableInput {...props}/>;
    }
}

function onSelectLoad() {
    return neonBinding.events.emit("plugin_sheq_assist/05_Trainings/training-matrix/list", {limit: -1}).then(res => {
        return res.map(value => {
//            console.log('value', value)
            const {course_or_module: {data, name}, unit_standard} = value.data;
            return {label: (name || data.name) + (unit_standard ? (' (' + unit_standard + ')') : ''), value};
        }).distinct();
    });
}

export default SelectInput;
