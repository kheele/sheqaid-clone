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

        // const res = await onSelectLoad();
        // this.state.lists.list.push(...res);

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

    @computed
    get selectedItem() {
        let {defaultValue: _defaultValue} = this.props;
        if (_defaultValue) {
            if (_defaultValue.label && _defaultValue.value) {
                return _defaultValue;
            }
            const defaultValue = this.list.find(v => v.value === _defaultValue);
            // console.log('defaultValue', defaultValue, _defaultValue, this.list.map(v => v.value.id).slice())
            if (!defaultValue) {
                return null;
            }
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            // const label = data ? data.name : name;
            console.log('selectedVal', defaultValue)
            return {value: defaultValue, label: defaultValue};
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        return <ClearableInput {...props}/>;
    }
}

export default SelectInput;
