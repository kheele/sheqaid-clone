import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import listByCountryZone from "../../mutations/all/Zone/listByCountryZone";

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
        className += ` SelectZoneInput`;

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "zone",
            type: "select",
            placeholder: "Province...",
            add: false,
            ...this.props,
            isClearable: false,
            readonly: true,
            className,
        };
    }

    set country(country) {
        let {className = ''} = this.props;
        className += ` SelectZoneInput`;

        const props = {
            ref: "input",
            key: new Date().getTime(),
            name: "zone",
            type: "select",
            placeholder: "Province...",
            add: false,
            ...this.props,
            className,
        };

        if(!country) {
            this.state.props = {
                isClearable: false,
                readonly: true,
                ...props,
            };
            return;
        }

        (async () => {
            const res = await onSelectLoad(country);
            this.state.lists.list = res.distinct();

            this.state.props = {
                isClearable: true,
                readonly: false,
                returnValue: true,
                ...props,
                values: this.list,
                defaultValue: this.selectedItem,
            };
        })();
    }

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if(defaultValue) {
            if(defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {data: {name: label}} = defaultValue;
            console.log('selectedVal', label)
            return {value: defaultValue, label};
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if(!props) {
            return <ClearableInput {...props}/>;
        }

        return <ClearableInput {...props}/>;
    }
}

function onSelectLoad(country) {
    return listByCountryZone(country.data.iso2).then(res => {
        return res.map(value => {
            return {label: value.data.name, value};
        });
    });
}

export default SelectInput;
