import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import listByCountryCity from "../../mutations/all/City/listByCountryCity";
import listByZoneCity from "../../mutations/all/City/listByZoneCity";

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
        className += ` SelectCityInput`;

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "city",
            type: "select",
            placeholder: "City...",
            add: false,
            ...this.props,
            isClearable: false,
            readonly: true,
            className,
        };
    }

    //<editor-fold desc="setLoad">
    setLoad(props, res) {
        this.state.lists.list = res.distinct();

        this.state.props = {
            isClearable: true,
            readonly: false,
            returnValue: true,
            ...props,
            values: this.list,
            defaultValue: this.selectedItem,
        };
    }
    //</editor-fold>

    //<editor-fold desc="zone">
    set zone(zone) {
        let {className = ''} = this.props;
        className += ` SelectCityInput`;

        const props = {
            ref: "input",
            key: new Date().getTime(),
            name: "city",
            type: "select",
            placeholder: "City...",
            add: false,
            ...this.props,
            className,
        };

        if(!zone) {
            this.state.props = {
                isClearable: false,
                readonly: true,
                ...props,
            };
            return;
        }

        (async () => {
            const res = await onSelectLoadByZone(zone);
            this.setLoad(props, res);
        })();
    }
    //</editor-fold>

    //<editor-fold desc="country">
    set country(country) {
        let {className = ''} = this.props;
        className += ` SelectCityInput`;

        const props = {
            ref: "input",
            key: new Date().getTime(),
            name: "city",
            type: "select",
            placeholder: "City...",
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
            const res = await onSelectLoadByCountry(country);
            this.setLoad(props, res);
        })();
    }
    //</editor-fold>

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
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
        if (!props) return null;

        return <ClearableInput {...props}/>;
    }
}

function onSelectLoadCb(res) {
    return res.map(value => {
        return {label: value.data.name, value};
    });
};

function onSelectLoadByZone(zone) {
    return listByZoneCity(zone.id).then(onSelectLoadCb);
}

function onSelectLoadByCountry(country) {
    return listByCountryCity(country.data.iso2).then(onSelectLoadCb);
}

export default SelectInput;
