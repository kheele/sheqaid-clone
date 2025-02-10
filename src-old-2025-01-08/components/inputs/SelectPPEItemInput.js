import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import NewPPEItemDialog
    from "../../views/plugins/plugin_hr_management/other_modules/PPE/PPEItemDialog/NewPPEItemDialog";
import {listPPEItems} from "mutations/listByLogged";

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
            const {ppe_type: {name, unit}, serial_num, profile_pic} = defaultValue.data || defaultValue;
            const label = `${name} - ${serial_num}`;
            return {value: defaultValue, label};
        }
        return null;
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectPPEItemInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "ppe_item",
            type: "select",
            placeholder: "PPE Item...",
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
            const {ppe_type: {name, unit}, serial_num, profile_pic} = value.data;
            const label = `${name} - ${serial_num}`;
            this.refs.input.onChange({label, value});
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
                <NewPPEItemDialog ref="newDialog"/>
                <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                    <i className="fa fa-plus"/> Add New
                </Button>
            </>}
        </div>;
    }
}

function onSelectLoad() {
    return listPPEItems({
        exact_orgs: true,
        //
        limit: 0,
        offset: 0,
    }).then(res => {
        return res.map(value => {
            const {ppe_type: {name, unit}, serial_num, profile_pic} = value.data;
            let label = `${name} - ${serial_num}`;
            return {label, value};
        });
    });
}

export default SelectInput;
