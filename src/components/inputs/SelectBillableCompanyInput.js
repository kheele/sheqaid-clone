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
        className += ` SelectBillableCompanyInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "company",
            type: "select",
            placeholder: "Company...",
            values: this.list,
            returnValue: true,
            add: true,
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
//            console.log('selectedVal', label, data)
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
    return neonBinding.events.emit("admin/companies/billable/list").then(res => {
        res.sortBy('data.name');
        return res.map(value => {
            const {name, consultant} = value.data;
            const className = "pull-left margin-0 font-size-12 border-radius-20 padding-5 bg-ddd color-888";
            return {label: <span className="flex grid-gap-5 flex-center">
                    {name} - 
                    {!consultant && <h5 className={className}>Standalone</h5>}
                    {consultant && <h5 className={className}>Consultant</h5>}
                </span>, 
                value
            };
        });
    });
}

export default SelectInput;
