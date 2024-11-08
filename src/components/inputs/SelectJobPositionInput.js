import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {execWhen} from '../../utils/Utils';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import NewJobPositionDialog
    from "../../views/plugins/plugin_hr_management/Employees/dialogs/JobPositionsDialog/NewJobPositionDialog";

@observer
class SelectInput extends ASelectInput {

    @observable
    state = {
        lists: {
            list: []
        },
        props: null,
        loaded: null
    };

    constructor(props) {
        super(props);

        this.onAdd = this.onAdd.bind(this);

        this.onProcessValue = this.onProcessValue.bind(this);
        this.renderer = this.renderer.bind(this);
    }

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if (defaultValue) {
            if (isArray(defaultValue) || isObservableArray(defaultValue)) {
                return defaultValue.map(value => {
                    if (isString(value)) {
                        return {value, label: value};
                    } else if (value.label && value.value) {
                        return value;
                    } else {
                        let {name, data} = value;
                        const label = name || data.name;
//                        console.log('selectedVal', label)
                        return {value, label};
                    }
                });
            } else {
                if (defaultValue.label && defaultValue.value) {
                    return defaultValue;
                }
                let {name, data} = defaultValue;
                const label = name || data.name;
                console.log('selectedVal', label)
                return {value: defaultValue, label};
            }
        }
        return null;
    }

    async componentDidMount() {
        let {type, className = ''} = this.props;
        className += ` SelectJobPositionInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "job_position",
            type: type || "select",
            placeholder: "Job Position...",
            values: this.list,
            returnValue: true,
            add: true,
            renderer: this.renderer,
            onProcessValue: this.onProcessValue,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
        this.state.loaded = true;
    }

    onAdd(e, btn) {
        this.refs.newDialog.open().then(value => {
            this.list.push(value);
            this.refs.input.onChange({label: value.data.name, value});
        });
    }

    onProcessValue(_v) {
//        console.log('_v', this.props.name, _v)
        return execWhen(() => !!this.state.loaded && !!_v).then(() => {
            const {list} = this.state.lists;
//            console.log('_v list', this.props.name, list.slice())
            const item = list.filter(v => !!v).find(({label, value}) => {
                if (isString(value) && !isString(_v)) {
                    return value === (_v.id || _v.value.id);
                } else if (!isString(value) && isString(_v)) {
                    return value.id === _v;
                } else if (isString(value) && isString(_v)) {
                    return value === _v;
                }
                try {
                    return value.id === (_v.id || _v.value.id);
                } catch (e) {
                    return false;
                }
            });
            return item;
        });
    }

    renderer(v) {
        if (isNullable(v)) {
            return null;
        }
        if (isString(v)) {
            return v;
        }
        if (v.label && v.value) {
            return v.label;
        }
        if (isArray(v) || isObservableArray(v)) {
            return <>
                {v.filter(v => !isNullable(v)).map((v) => {
                    let label;
                    if (isString(v)) {
                        label = v;
                    } else if (v.label && v.value) {
                        label = v.label;
                    } else {
                        let {name, data} = v;
                        label = name || data.name;
                    }
                    return <Grid key={label} item><Chip label={label} size="small"/></Grid>;
                })}
            </>
        }
        let {name, data} = v;
        return name || data.name;
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        const {parentClassName} = this.props;

        return <div
            className={'col-lg-12 clearable-field-control form-control select_multiple form-control-add-btn h-auto padding-0 no-border pull-left flex' + (parentClassName ? ` ${parentClassName}` : '')}>
            <ClearableInput {...props}/>
            <NewJobPositionDialog ref="newDialog"/>
            <Button className="btn btn-primary fixed-flex" onClick={this.onAdd}>
                <i className="fa fa-plus"/> Add New
            </Button>
        </div>;
    }
}

function onSelectLoad() {
    const listByLogged = sockets.of('job-positions').fn('listByLogged');

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
