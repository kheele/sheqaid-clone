import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import {listTrainingCourses} from "../../mutations/listByLogged";
import NewTrainingRegistryDialog
    from "../../views/plugins/plugin_sheq_assist/05_Training/TrainingRegistryTab/forms/NewTrainingRegistryDialog";

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

        this.onLoadList = this.onLoadList.bind(this);
    }

    @computed
    get selectedItem() {
        let {defaultValue: _defaultValue} = this.props;
        if (_defaultValue) {
            if (_defaultValue.label && _defaultValue.value) {
                return _defaultValue;
            }
            const defaultValue = this.list.find(v => v.value.id === _defaultValue.id);
            // console.log('defaultValue', defaultValue, _defaultValue, this.list.map(v => v.value.id).slice())
            if (!defaultValue) {
                return null;
            }
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {data: {name: label}} = defaultValue;
            // const label = data ? data.name : name;
            console.log('selectedVal', label, defaultValue)
            return {value: defaultValue, label};
        }
        return null;
    }

    async componentDidMount() {
        this.reload();
    }

    async reload() {
        let {className = ''} = this.props;
        className += ` SelectTrainingCourseInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "course_or_module",
            type: "select",
            placeholder: "Course...",
            values: this.list,
            returnValue: true,
            add: false,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };

        this.state.loaded = true;
    }

    onAdd(e, btn) {
        this.refs.newDialog.open().then(value => ({label: value.data.name, value})).then(async value => {
            await this.reload();
            this.refs.input.onChange(value);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onLoadList">
    onLoadList(promise) {
        const {input} = this.refs;
        if (input) {
            return input.onLoadList(promise);
        }
        return Promise.reject('onLoadList not defined');
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
                <NewTrainingRegistryDialog ref="newDialog"/>
                <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                    <i className="fa fa-plus"/> Add New
                </Button>
            </>}
        </div>;
    }
}

function onSelectLoad() {
    return listTrainingCourses().then(res => {
        return res.map(value => {
            const {name, unit_standard} = value.data;
            return {label: name + (unit_standard ? ` (${unit_standard})` : ''), value};
        });
    });
}

export default SelectInput;
