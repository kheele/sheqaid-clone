import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import listAllCountry from "../../mutations/all/Country/listAllCountry";

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
    
    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectCountryCurrencyInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "currency_country",
            type: "select",
            placeholder: "Currency...",
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
        if(!option) return false;
        const {label, value} = option;
        let {data: {name, phone_code, iso2, currency,currency_name, currency_symbol,}} = value;
        return `${name} ${iso2} ${phone_code} ${currency} ${currency_name} ${currency_symbol}`
    }
    
    renderItem(option, n) {
        if(!option) return null;
        const {label, value} = option;
        let {data: {name, phone_code, iso2, currency,currency_name, currency_symbol,}} = value;
        return {
            label: <div className="SelectCountryCodeInput-label flex flex-left max-w-300">
                <span className="flex flex-left font-size-16">({currency_name})</span>
                <img src={getFlag(iso2)} className="fixed-flex min-w-30 margin-r-10"/>
                <span className="flex flex-left font-size-16">{name}</span>
            </div>,
            value
        };
    }
    
    renderer(option) {
        const {label, value} = option;
        const {data: {name, phone_code, iso2, currency, currency_name, currency_symbol,}} = value;
        return <div className="SelectCountryCodeInput-label flex flex-left max-w-300">
            <span className="flex flex-left font-size-16">({currency_name})</span>
            <img src={getFlag(iso2)} className="fixed-flex min-w-30 margin-r-10"/>
            <span className="flex flex-left font-size-16">{name}</span>
        </div>;
    }
    
    @computed
    get selectedItem() {
        let {defaultValue} = this.props;
        if(defaultValue) {
            if(defaultValue.label && defaultValue.value) {
                return {...defaultValue};
            }
            const defCountry = this.list.find(({value: {data: {iso2, name, phone_code}}}) => {
                return (defaultValue === iso2 || defaultValue === name || defaultValue === phone_code || defaultValue === `+${phone_code}`);
            });
            if(defCountry) {
                defaultValue = defCountry.value;
            }
            let {name, phone_code, iso2, currency,currency_name, currency_symbol,} = defaultValue.data || defaultValue;
            const label = <div className="SelectCountryCodeInput-label flex flex-left">
                <span className="flex flex-left font-size-16">({currency_name})</span>
                <img src={getFlag(iso2)} className="fixed-flex min-w-30 margin-r-10"/>
                <span className="flex flex-left font-size-16">{name}</span>
            </div>;
            return {value: {...defaultValue}, label};
        }
        return null;
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
    return listAllCountry().then(res => {
        console.log('listAllCountry', res)
        return res.map(value => {
            return {label: value.data.name, value};
        });
    });
}

export default SelectInput;
