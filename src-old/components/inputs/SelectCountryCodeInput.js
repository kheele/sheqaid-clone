import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import CountryList from '../../utils/CountryList.json';

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
        
        this.onFilter = this.onFilter.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderer = this.renderer.bind(this);
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
        if(!option) return false;
        const {label, value} = option;
        let {data: {name, dialCode, isoCode, flag}} = value;
        return `${name} ${isoCode} ${dialCode}`;
    }
    
    renderItem(value, n) {
        let {data: {name, dialCode, isoCode, flag}} = value;
        const label = <div className="SelectCountryCodeInput-label flex flex-left max-w-300">
            <img src={flag} className="fixed-flex min-w-30 margin-r-10"/>
            <span className="flex flex-left font-size-16">{name.trim()} ({dialCode})</span>
        </div>;
        return {label, value};
    }
    
    renderer(option) {
        const {label, value} = option;
        const {data: {name, dialCode, isoCode, flag}} = value;
        return <div className="SelectCountryCodeInput-label flex flex-left max-w-300">
            <img src={flag} className="fixed-flex min-w-30"/>
            <span className="flex flex-left font-size-16">{dialCode}</span>
        </div>;
    }

    @computed
    get selectedItem() {
        let {defaultValue} = this.props;
        if(defaultValue) {
            if(defaultValue.label && defaultValue.value) {
                return {...defaultValue};
            }
            const defCountry = CountryList.find(({data: v}) => {
                return (defaultValue === v.isoCode || defaultValue === v.name || defaultValue === v.dialCode || defaultValue === `+${v.dialCode}`);
            });
            if(defCountry) {
                defaultValue = defCountry;
            }
            let {data: {name, dialCode, isoCode, flag}} = defaultValue;
            const label = <div className="SelectCountryCodeInput-label flex flex-left">
                <img src={flag} className="fixed-flex min-w-30"/>
                <span className="flex flex-left font-size-16">{dialCode}</span>
            </div>;
            return {value: {...defaultValue}, label};
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
    return CountryList;
}

export default SelectInput;
