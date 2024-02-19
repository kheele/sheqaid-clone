import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

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
    
    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectPPETypeInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "ppe_type",
            type: "select",
            placeholder: "PPE Type...",
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
            let {name, data} = defaultValue;
            const label = data ? data.name : name;
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

function onSelectLoad() {
    const listByLogged = sockets.of('ppe-types').fn('listByLogged');

    return listByLogged({
        exact_orgs: true,
        //
        limit: 0,
        offset: 0,
    }).then(res => {
        return res.map(value => {
            const {name, unit, profile_pic} = value.data;
            let label = name;
            return {label, value};
        });
    });
}

export default SelectInput;
