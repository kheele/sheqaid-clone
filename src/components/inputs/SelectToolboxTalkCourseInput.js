import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import byLogged
    from "views/plugins/plugin_sheq_assist/05_Training/ToolboxTalksTab/forms/ToolboxTalkDialogs/ToolboxTalkSubjectCategoryDialog/Query/List/listAllToolboxTalkSubjectCategoryByLogged";

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

        this.onLoadList = this.onLoadList.bind(this);
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectToolboxTalkCourseInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res;

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "subject",
            type: "select",
            placeholder: "Subject...",
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

function onSelectLoad() {
    const args = {
        //
        limit: 0,
        offset: 0,
    };
    return byLogged(args).then(res => {
        return res.map(value => {
            return {label: value.data.name, value};
        });
    });
}

export default SelectInput;
