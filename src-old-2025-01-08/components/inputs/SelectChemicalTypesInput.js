import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from '../../components/inputs';

import ASelectInput from '../../components/inputs/ASelectInput';
import listForSelectionChemicalCategories
    from "../../views/plugins/plugin_sheq_assist/13_2_3_Hazardous_Chemical_Substances/listForSelectionChemicalCategories";
import listForSelectionChemicalTypes
    from "../../views/plugins/plugin_sheq_assist/13_2_3_Hazardous_Chemical_Substances/listForSelectionChemicalTypes";

@observer
class SelectInput extends ASelectInput {

    @observable
    state = {
        lists: {
            list: ['Herbicide', 'Pesticide']
        },
        props: null
    };
    
    constructor(props) {
        super(props);
    }
    
    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectChemicalTypesInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "type",
            type: "select",
            placeholder: "Type...",
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

function onSelectLoad() {
    return listForSelectionChemicalTypes().then(list => {
        console.log('listForSelectionChemicalTypes', list)
        return list.map((value) => {
            return {label: value, value};
        });
    });
}

export default SelectInput;
