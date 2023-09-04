import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import listForSelectionDocumentCategoriesByLogged
    from "views/plugins/common/documents/Query/List/listForSelectionDocumentCategoriesByLogged";

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
        className += ` SelectDocumentCategoryInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "category",
            type: "select",
            placeholder: "Document Category...",
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
            if(isString(defaultValue)) {
                return {value: defaultValue, label: defaultValue};
            }
            let {name, data} = defaultValue;
            const label = data ? data.name : name;
            console.log('selectedVal', label)
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
    const args = {
        removed: false,
        //
        limit: 0,
        //
        exact_orgs: true,
    };

    return listForSelectionDocumentCategoriesByLogged(args).then(list => {
        // console.log('listForSelectionByLogged', list)
        return list.map((value) => {
            const {id, data: {name,}} = value;
            return {label: name, value};
        });
    });
}

export default SelectInput;
