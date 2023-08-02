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
        className += ` SelectHazchemSheetInput`;
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "hazchem_sheet",
            type: "select",
            placeholder: "Hazchem Sheet...",
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
            let {product = {}, msds = {}, data} = defaultValue;
            let label;
            if(data) {
                const {product: _product = {}} = data;
                label = _product.name || (_product.data && _product.data.name);
            } else {
                label = (product.name || (product.data && product.data.name)) || 
                        (msds.name || (msds.data && msds.data.name));
            }
            console.log('selectedItem', label, defaultValue)
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
    return onAsyncSelectLoadImpl("plugin_sheq_assist/Hazardous_Chemical_Substances/hazchem-sheet/list/search_by_name", value, value => {
        return {label: value.data.product.name, value};
    });
}

export default SelectInput;
