import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import NewTeamDialog from "../../views/plugins/plugin_hr_management/Employees/dialogs/TeamsDialog/NewTeamDialog";

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
        this.reload();
    }

    async reload() {
        let {className = ''} = this.props;
        className += ` SelectTeamInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "team",
            type: "select",
            placeholder: "Team...",
            values: this.list,
            returnValue: true,
            add: false,
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

        const {parentClassName} = this.props;

        return <div
            className={'col-lg-12 clearable-field-control form-control select_multiple form-control-add-btn h-auto padding-0 no-border pull-left flex' + (parentClassName ? ` ${parentClassName}` : '')}>
            <ClearableInput {...props}/>
            <NewTeamDialog ref="newDialog"/>
            <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                <i className="fa fa-plus"/> Add New
            </Button>
        </div>;
    }
}

function onSelectLoad() {
    const listByLogged = sockets.of('teams').fn('listByLogged');

    return listByLogged({
        exact_orgs: true,
        //
        limit: 0,
        offset: 0,
    }).then(res => {
        return res.map(value => {
            const {name, supervisor, site, project, client} = value.data;
            let label = name;
            if (supervisor) {
                const {fname, lname, data} = supervisor;
                label += `-${lname || data.lname} ${fname || data.fname}`;
            }
            return {label, value};
        });
    });
}

export default SelectInput;
