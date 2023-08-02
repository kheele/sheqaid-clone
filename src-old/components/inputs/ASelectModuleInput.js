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

    componentWillMount() {
        const {selectedClientModules: {[this.key]: list}} = storage.selected;
        this.state.lists.list = list;
    }

    componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectModuleInput form-control clearable-form-control`;

        const {values} = this;

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "module",
            type: "select",
            placeholder: "Module...",
            values,
            returnValue: true,
            add: true,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
    }

    get values() {
        return this.list.filter(({key}) => this.includedList.contains(key)).map(value => ({label: value.title, value}));
    }

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if(defaultValue) {
            if(defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            if(isString(defaultValue)) {
                return {value: defaultValue, label: defaultValue};
            }
            let {title} = defaultValue;
            const label = title;
            console.log('selectedVal', label)
            return {value: defaultValue, label};
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if(!props) return null;
        if(this.includedList.isEmpty()) return null;

        return <ClearableInput {...props}/>;
    }
}

export default SelectInput;
