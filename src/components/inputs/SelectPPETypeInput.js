import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import NewPPEDialog from "../../views/plugins/plugin_hr_management/other_modules/PPE/PPEDialog/NewPPEDialog";

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

        this.onAdd = this.onAdd.bind(this);
    }

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {name, data} = defaultValue;
            const label = data ? data.name : name;
            return {value: defaultValue, label};
        }
        return null;
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

    onAdd(e, btn) {
        this.refs.newDialog.open().then(value => {
            this.list.push(value);
            this.refs.input.onChange({label: value.data.name, value});
        });
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        const {parentClassName} = this.props;

        return <div
            className={'col-lg-12 form-control-add-btn h-auto padding-0 no-border pull-left flex' + (parentClassName ? ` ${parentClassName}` : '')}>
            <ClearableInput {...props}/>
            <NewPPEDialog ref="newDialog"/>
            <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                <i className="fa fa-plus"/> Add New
            </Button>
        </div>;
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
            const {name: label, unit, profile_pic} = value.data;
            return {label, value};
        });
    });
}

export default SelectInput;
