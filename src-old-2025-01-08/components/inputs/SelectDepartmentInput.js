import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import NewDepartmentDialog
    from "../../views/plugins/plugin_hr_management/Employees/dialogs/DepartmentsDialog/NewDepartmentDialog";

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
            console.log('selectedVal', label)
            return {value: defaultValue, label};
        }
        return null;
    }

    async componentDidMount() {
        this.reload();
    }

    async reload() {
        let {className = ''} = this.props;
        className += ` SelectDepartmentInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "department",
            type: "select",
            placeholder: "Department...",
            values: this.list,
            returnValue: true,
            add: true,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
    }

    onAdd(e, btn) {
        this.refs.newDialog.open().then(value => ({label: value.data.name, value})).then(async value => {
            await this.reload();
            this.refs.input.onChange(value);
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
                <NewDepartmentDialog ref="newDialog"/>
                <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                    <i className="fa fa-plus"/> Add New
                </Button>
            </>}
        </div>;
    }
}

function onSelectLoad() {
    const listByLogged = sockets.of('departments').fn('listByLogged');

    return listByLogged({
        exact_orgs: true,
        exact_orgs_company: true,
        //
        limit: 0,
        offset: 0,
    }).then(res => {
        return res.map(value => {
            return {label: value.data.name, value};
        });
    });
}

export default SelectInput;
