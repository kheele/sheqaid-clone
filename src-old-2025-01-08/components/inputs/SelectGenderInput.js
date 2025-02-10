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
            list: ['Male', 'Female']
        },
        props: null
    };
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectGenderInput`;
        
        this.state.props = {
            ref: "input",
            key: "gender",
            name: "gender",
            type: "select",
            placeholder: "Gender...",
            values: this.list,
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

export default SelectInput;
