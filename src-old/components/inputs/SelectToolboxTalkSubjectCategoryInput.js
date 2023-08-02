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
            list: [
                'Safety', 'Health', 'Environment', 'Quality', 'Risk', 'Company Procedure', 'Company Policy',
            ]
        },
        props: null
    };

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectToolboxTalkSubjectCategoryInput`;

        const res = await onSelectLoad();
        this.state.lists.list.push(...res);

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "subject_category",
            type: "select",
            placeholder: "Subject Category...",
            values: this.list,
            returnValue: true,
            add: true,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
    }

    // <editor-fold defaultstate="collapsed" desc="onLoadList">
    onLoadList(promise) {
        const {input} = this.refs;
        if (input) {
            return input.onLoadList(promise);
        }
        return Promise.reject('onLoadList not defined');
    }

    // </editor-fold>

    @computed
    get selectedItem() {
        let {defaultValue: _defaultValue} = this.props;
        if (_defaultValue) {
            if (_defaultValue.label && _defaultValue.value) {
                return _defaultValue;
            }
            const defaultValue = this.list.find(v => v.value.id === _defaultValue.id);
            // console.log('defaultValue', defaultValue, _defaultValue, this.list.map(v => v.value.id).slice())
            if (!defaultValue) {
                return null;
            }
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {data: {name: label}} = defaultValue;
            // const label = data ? data.name : name;
            console.log('selectedVal', label, defaultValue)
            return {value: defaultValue, label};
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        return <ClearableInput {...props}/>;
    }
}

async function onSelectLoad() {
    return neonBinding.events.emit("plugin_sheq_assist/05_Trainings/toolbox-talks/subject-categories/list").then(res => {
        return res.map(({data: {name: value}}) => {
            return {label: value, value};
        }).distinct();
    });
}

export default SelectInput;
