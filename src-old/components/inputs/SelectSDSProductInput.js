import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {onAsyncSelectLoadImpl} from '../../utils/AsyncSelect';

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
    
    componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectSDSProductInput`;
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "sds",
            type: "select",
            placeholder: "Safety Data Sheet (SDS)...",
            onAsyncSelectLoad: onAsyncSelectLoad,
            returnValue: true,
            add: false,
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
            let {name, data} = defaultValue;
            let label;
            if(data) {
                const {product = {}} = data;
                label = product.name || (product.data && product.data.name);
            } else {
                label = name;
            }
//            console.log('selectedItem', label, defaultValue)
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

function onAsyncSelectLoad(value) {
    return onAsyncSelectLoadImpl("plugin_sheq_assist/Hazardous_Chemical_Substances/msds/list/search_by_name", value, value => {
        return {label: value.data.name, value};
    });
}

export default SelectInput;
