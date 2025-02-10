import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import {listCities} from "mutations/list";

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

        if (!zone) {
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

        if (!country) {
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
            const {name, data} = defaultValue;
            const label = name || data.name;
            console.log('selectedVal', label)
            return {value: defaultValue, label};
        }
        return null;
    }

    //</editor-fold>

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

    //</editor-fold>

    //<editor-fold desc="setLoad">
    setLoad(props, res) {
        this.state.lists.list = res.distinct();
        console.log('SelectCityInput', this.list.length);

        this.state.props = {
            isClearable: true,
            readonly: false,
            returnValue: true,
            ...props,
            values: this.list,
            defaultValue: this.selectedItem,
        };
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
    return listCities({zone_id: zone.id}).then(onSelectLoadCb);
}

function onSelectLoadByCountry(country) {
    return listCities({country_iso2: country.data.iso2}).then(onSelectLoadCb);
}

export default SelectInput;
