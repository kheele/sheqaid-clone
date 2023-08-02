import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';

@observer
class SelectInput extends ASelectInput {

    @observable
    state = {
        lists: {
            list: []
        },
        yearStart: new Date().getFullYear(),
        yearEnd: 2000,
        props: null,
        loaded: null
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        let {className = '', start: _start = new Date().getFullYear(), end: _end = 2000} = this.props;
        className += ` SelectYearInput`;

        _start && (this.state.yearStart = _start);
        _end && (this.state.yearEnd = _end);

        const {yearStart: start, yearEnd: end} = this.state;
        this.state.lists.list = await onSelectLoad({start, end});

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "year",
            type: "select",
            placeholder: "Year...",
            values: this.list,
            returnValue: true,
            add: false,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
        this.state.loaded = true;
    }

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if(defaultValue) {
            if(isArray(defaultValue) || isObservableArray(defaultValue)) {
                return defaultValue.map(value => {
                    if(isString(value)) {
                        return {value, label: value};
                    } else if(value.label && value.value) {
                        return value;
                    } else {
                        let {name, data} = value;
                        const label = name || data.name;
//                        console.log('selectedVal', label)
                        return {value, label};
                    }
                });
            } else {
                if(defaultValue.label && defaultValue.value) {
                    return defaultValue;
                }
                let {name, data} = defaultValue;
                const label = name || data.name;
                console.log('selectedVal', label)
                return {value: defaultValue, label};
            }
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if(!props) return null;

        return <ClearableInput {...props}/>;
    }
}

function onSelectLoad({start, end = 2000}) {
    return new Promise((resolve, reject) => {
        const list = [];
        for (let value = start; value >= end; value--) {
            list.push({label: value, value});
        }

        resolve(list);
    });
}

export default SelectInput;
