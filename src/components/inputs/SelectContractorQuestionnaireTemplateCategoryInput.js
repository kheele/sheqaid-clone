import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from '../../components/inputs';

import ASelectInput from '../../components/inputs/ASelectInput';

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
        className += ` SelectContractorQuestionnaireTemplateCategoryInput`;
        
        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "category",
            type: "select",
            placeholder: "Category...",
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
            return {value: defaultValue, label: defaultValue};
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
    const listByLogged = sockets.of('contractors/template-categories').fn('listByLogged');
    
    return listByLogged().then(list => {
        console.log('list', list);
        return list.map((value) => {
            return {label: value, value};
        });
    });
}

export default SelectInput;
