import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import byLogged from "views/plugins/plugin_sheq_assist/13_2_3_Hazardous_Chemical_Substances/InventoryProductTab/Query/List/listAllInventoryProductsByLogged";

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
        className += ` SelectChemicalProductInput`;

        const res = await onAsyncSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "chemical_product",
            type: "select",
            placeholder: "Chemical Product...",
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
            let {name, data} = defaultValue;
            let label;
            if(data) {
                label = data.name;
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
            const {id, data: {name}} = value;
            return {label: name, value};
        });
    });
}

export default SelectInput;
