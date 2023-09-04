import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from '../../components/inputs';

import ASelectInput from '../../components/inputs/ASelectInput';
import listForSelectionChemicalTypes
    from "../../views/plugins/plugin_sheq_assist/13_2_3_Hazardous_Chemical_Substances/listForSelectionChemicalTypes";
import listForSelectionChemicalManufacturers
    from "../../views/plugins/plugin_sheq_assist/13_2_3_Hazardous_Chemical_Substances/listForSelectionChemicalManufacturers";

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
        className += ` SelectChemicalManufacturerInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "manufacturer",
            type: "select",
            placeholder: "Manufacturer...",
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
            return {value: defaultValue, label: defaultValue};
        }
        return null;
    }
    
    render() {
        const {props} = this.state;
        if(!props) return null;

        return <ClearableInput {...props}/>;
    }
}

async function onSelectLoad() {
    return listForSelectionChemicalManufacturers().then(list => {
        console.log('listForSelectionChemicalManufacturers', list)
        return list.map((value) => {
            return {label: value, value};
        });
    });
}

export default SelectInput;
