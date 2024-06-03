import React from "react";
import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';

import { ClearableInput } from './';

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

    componentDidMount() {
        let { className = '', type, isOHSDocs } = this.props;
        className += ` SelectModuleInput form-control clearable-form-control`;

        const { selectedClientModules: { [this.key]: list } } = storage.selected;

        if (isOHSDocs) {
            this.state.lists.list = list.filter(({ module: { key } }) => this.includedOHSDocList.contains(key)).map(value => ({ label: value.module.title, value }));
        } else {
            this.state.lists.list = list.filter(({ module: { key } }) => this.includedList.contains(key)).map(value => ({ label: value.module.title, value }));
        }

        console.log('list', this.list.slice())

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "module",
            type: type || "select",
            placeholder: "Module(s)...",
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
        const { defaultValue } = this.props;
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            if (isString(defaultValue)) {
                return this.list.find(({ label, value: { module: { key } } }) => key === defaultValue);
            }
            let { title } = defaultValue.module;
            const label = title;
            console.log('selectedVal', label)
            return { value: defaultValue, label };
        }
        return null;
    }

    render() {
        const { props } = this.state;
        if (!props) return null;
        const { isOHSDocs } = props;
        if (isOHSDocs) {
            if (this.includedOHSDocList.isEmpty()) return null;
        } else {
            if (this.includedList.isEmpty()) return null;
        }

        return <ClearableInput {...props} />;
    }
}

export default SelectInput;
