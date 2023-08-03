import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import byLogged from "views/plugins/plugin_sheq_assist/13_2_3_Hazardous_Chemical_Substances/HazchemSheetTab/Query/List/listAllHazchemSheetsByLogged";

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
        className += ` SelectHazchemSheetInput`;

        const res = await onAsyncSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "hazchem_sheet",
            type: "select",
            placeholder: "Hazchem Sheet...",
            values: this.list,
            // onAsyncSelectLoad: onAsyncSelectLoad,
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

function onAsyncSelectLoad() {
    const args = {
        removed: false,
        //
        limit: 0,
        //
        exact_orgs: true,
    };

    return byLogged(args).then(list => {
        console.log('listForSelectionByLogged', list)
        return list.map((value) => {
            const {id, data: {product,}} = value;
            return {label: product.name, value};
        });
    });
}

export default SelectInput;
