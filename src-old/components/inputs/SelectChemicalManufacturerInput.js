import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from '../../components/inputs';

import ASelectInput from '../../components/inputs/ASelectInput';

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
    const res = await Promise.all([neonBinding.events.emit("plugin_sheq_assist/Hazardous_Chemical_Substances/chemical-inventory/manufacturer/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    }),
    neonBinding.events.emit("plugin_sheq_assist/Hazardous_Chemical_Substances/msds/manufacturer/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    })]);
    return res.reduce((a1, a2) => [...a1, ...a2], []);
}

export default SelectInput;
