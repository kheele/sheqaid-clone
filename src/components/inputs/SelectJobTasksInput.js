import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import NewJobTaskDialog
    from "../../views/plugins/plugin_hr_management/Employees/dialogs/JobTaskCategoriesDialog/NewJobTaskCategoryDialog";
import {listJobTasks} from "mutations/listByLogged";

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
            const {name, data,} = defaultValue;
            const label = name || data.name;
            return {value: defaultValue, label};
        }
        return null;
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectJobTasksInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "job_task",
            type: "select",
            placeholder: "Job Task...",
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
            const {name: label,} = value.data;
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
                <NewJobTaskDialog ref="newDialog"/>
                <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                    <i className="fa fa-plus"/> Add New
                </Button>
            </>}
        </div>;
    }
}

function onSelectLoad() {
    return listJobTasks({
        exact_orgs: true,
        //
        limit: 0,
        offset: 0,
    }).then(res => {
        return res.map(value => {
            const {name: label,} = value.data;
            return {label, value};
        });
    });
}

export default SelectInput;
