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
        className += ` SelectContractorInput`;
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "contractor",
            type: "select",
            placeholder: "Contractor...",
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
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {name, data} = defaultValue;
            const label = name || data.name;
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
    return onAsyncSelectLoadImpl("plugin_sheq_assist/contractors/list/search_by_name", value, value => {
        const {name} = value.data;
        return {label: name, value};
    });
}

export default SelectInput;
