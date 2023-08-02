import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import departmentStore from "../../mutations/all/Department";

@observer
class SelectInput extends ASelectInput {

    @observable
    state = {
        lists: {
            list: ['Company Certificate', 'Company Insurance', 'Company Registration', 'Company Regulatory Body']
        },
        props: null
    };
    
    constructor(props) {
        super(props);
    }
    
    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectDocumentCategoryInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list.push(...res.distinct());
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "category",
            type: "select",
            placeholder: "Document Category...",
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
        const {defaultValue} = this.props;
        if(defaultValue) {
            if(defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            if(isString(defaultValue)) {
                return {value: defaultValue, label: defaultValue};
            }
            let {name, data} = defaultValue;
            const label = data ? data.name : name;
            console.log('selectedVal', label)
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
    // return documentCat.listForSelectionByLogged().then(res => {
    return neonBinding.events.emit("plugin_sheq_assist/document-categories/list").then(res => {
        return res.map(({data: {name}}) => {
            return {label: name, value: name};
        });
    });
}

export default SelectInput;
