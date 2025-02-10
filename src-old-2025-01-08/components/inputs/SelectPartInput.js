import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import {onAsyncSelectLoadImpl} from "../../utils/AsyncSelect";

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
        className += ` SelectPartInput`;
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "part",
            type: "select",
            placeholder: "Asset Part...",
            returnValue: true,
            add: false,
            onAsyncSelectLoad,
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
            let {name, asset, asset_type, part_photo, data} = defaultValue;
            let label;
            if(data) {
                label = data.name + ' (' + data.asset_type + ')';
            } else {
                label = name + ' (' + asset_type + ')';
            }
//            console.log('selectedVal', label)
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
    return onAsyncSelectLoadImpl("plugin_sheq_assist/19_Maintenance/parts/list/search_by_name", value, value => {
        let {name, asset, asset_type, part_photo} = value.data;
        const label = name + ' (' + asset_type + ')';;
        return {label, value};
    });
}

export default SelectInput;
