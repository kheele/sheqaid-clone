import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import {listCountries} from "mutations/list";

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

    @computed
    get selectedItem() {
        let {defaultValue} = this.props;
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            const defCountry = this.list.find(({value: {id, data: {iso2, name, phone_code}}}) => {
                if (defaultValue === iso2 || defaultValue === name || defaultValue === phone_code || defaultValue === `+${phone_code}`) {
                    return true;
                }
                if (defaultValue.id === id) {
                    return true;
                }
            });
            if (defCountry) {
                defaultValue = defCountry.value;
            }
            let {name, phone_code, iso2} = defaultValue.data || defaultValue;
            const label = <div className="SelectCountryCodeInput-label flex flex-left">
                <img src={getFlag(iso2)} className="fixed-flex min-w-30"/>
                <span className="flex flex-left font-size-16">({iso2.toUpperCase()}) {name}</span>
            </div>;
            return {value: {...defaultValue}, label};
        }
        return null;
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectCountryInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        console.log('SelectCountryInput', this.state.lists.list.length);

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "country",
            type: "select",
            placeholder: "Country...",
            values: this.list,
            returnValue: true,
            add: false,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        return <ClearableInput {...props}/>;
    }
}

function getFlag(iso2) {
    return `https://cdn.kcak11.com/CountryFlags/countries/${iso2.toLowerCase()}.svg`;
}

function onSelectLoad() {
    return listCountries().then(res => {
        return res.map(value => {
            return {label: value.data.name, value};
        });
    });
}

export default SelectInput;
