import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import NewPPEInventoryDialog
    from "../../views/plugins/plugin_hr_management/other_modules/PPE/PPEInventoryDialog/NewPPEInventoryDialog";
import {listPPEInventory} from "mutations/listByLogged";

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
            let {location, data} = defaultValue;
            const label = data ? data.location : location;
            return {value: defaultValue, label};
        }
        return null;
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectPPEInventoryInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "ppe_inventory",
            type: "select",
            placeholder: "PPE Inventory...",
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
            this.refs.input.onChange({label: value.data.location, value});
        });
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        const {parentClassName, addButton = true} = this.props;

        let className = 'col-lg-12 clearable-field-control form-control select_multiple h-auto padding-0 no-border pull-left flex' + (parentClassName ? ` ${parentClassName}` : '');
        if (addButton) {
            className += ' form-control-add-btn';
        }

        return <div className={className}>
            <ClearableInput {...props}/>
            {addButton && <>
                <NewPPEInventoryDialog ref="newDialog"/>
                <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                    <i className="fa fa-plus"/> Add New
                </Button>
            </>}
        </div>;
    }
}

function onSelectLoad() {
    return listPPEInventory({
        exact_orgs: true,
        //
        limit: 0,
        offset: 0,
    }).then(res => {
        return res.map(value => {
            const {location: label,} = value.data;
            return {label, value};
        });
    });
}

export default SelectInput;
