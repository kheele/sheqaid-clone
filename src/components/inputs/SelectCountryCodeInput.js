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

        this.onFilter = this.onFilter.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderer = this.renderer.bind(this);
    }

    @computed
    get selectedItem() {
        let {defaultValue} = this.props;
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return {...defaultValue};
            }
            const defCountry = this.list.find(({value: {data: {iso2, name, phone_code}}}) => {
                return (defaultValue === iso2 || defaultValue === name || defaultValue === phone_code || defaultValue === `+${phone_code}`);
            });
            if (defCountry) {
                defaultValue = defCountry.value;
            }
            let {name, phone_code, iso2} = defaultValue.data || defaultValue;
            const label = <div className="SelectCountryCodeInput-label flex flex-left">
                <img src={getFlag(iso2)} className="fixed-flex min-w-30"/>
                <span className="flex flex-left font-size-16">{phone_code}</span>
            </div>;
            return {value: {...defaultValue}, label};
        }
        return null;
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectCountryCodeInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "phone_code",
            type: "select",
            placeholder: "Country...",
            values: this.list,
            returnValue: true,
            add: false,
            renderItem: this.renderItem,
            renderer: this.renderer,
            onFilter: this.onFilter,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
    }

    onFilter(option) {
        if (!option) return false;
        const {label, value} = option;
        let {data: {name, phone_code, iso2, flag}} = value;
        return `${name} ${iso2} ${phone_code}`;
    }

    renderItem(option, n) {
        if (!option) return null;
        const {label, value} = option;
        let {data: {name, phone_code, iso2}} = value;
        return {
            label: <div className="SelectCountryCodeInput-label flex flex-left max-w-300">
                <img src={getFlag(iso2)} className="fixed-flex min-w-30 margin-r-10"/>
                <span className="flex flex-left font-size-16">{name.trim()} ({phone_code})</span>
            </div>,
            value
        };
    }

    renderer(option) {
        const {label, value} = option;
        const {data: {name, phone_code, iso2}} = value;
        return <div className="SelectCountryCodeInput-label flex flex-left max-w-300">
            <img src={getFlag(iso2)} className="fixed-flex min-w-30"/>
            <span className="flex flex-left font-size-16">({phone_code})</span>
        </div>;
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

async function onSelectLoad() {
    return listCountries().then(res => {
        console.log('listCountries', res)
        return res.map(value => {
            return {label: value.data.name, value};
        });
    });
}

export default SelectInput;
