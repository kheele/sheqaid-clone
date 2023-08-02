import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput, ProfileField} from './';

import ASelectInput from './ASelectInput';
import {Dates} from "utils/Dates";
import trainingMatrixStore from "mutations/all/TrainingMatrix";

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
        let {className = '', readonly} = this.props;
        className += ` SelectTrainingMatrixInput`;

        if (readonly) {
            this.state.props = {
                ref: "input",
                key: new Date().getTime(),
                name: "training_matrix",
                title: "Training Matrix...",
                ...this.props,
                value: this.selectedItem,
                className
            };
        } else {
            const res = await onSelectLoad();
            this.state.lists.list = res.distinct();

            this.state.props = {
                ref: "input",
                key: new Date().getTime(),
                name: "training_matrix",
                type: "select",
                placeholder: "Training Matrix...",
                values: this.list,
                returnValue: true,
                add: false,
                ...this.props,
                defaultValue: this.selectedItem,
                className
            };
        }
    }

    @computed
    get selectedItem() {
        let {readonly, defaultValue: _defaultValue, value} = this.props;
        if(readonly) {
            if(_defaultValue || value) {
                value = value || _defaultValue;
                let {course_or_module, unit_standard, date_range, data} = value;
                course_or_module = course_or_module || data.course_or_module;
                let {name, data: data2} = course_or_module;
                name = name || data2.name;
                return name;
            }
            return "N/A";
        }
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
            let {course_or_module, unit_standard, date_range, data} = defaultValue;
            // let label = data ? data.name : name;
            // if(name) {
            //     label = name;
            // } else if(course_or_module) {
            //     label = course_or_module.name || (course_or_module.data && course_or_module.data.name);
            // } else if(data) {
            //     label = data.name;
            // }
            course_or_module = course_or_module || data.course_or_module;
            let {name, data: data2} = course_or_module;
            name = name || data2.name;
            unit_standard = unit_standard || data.unit_standard;
            date_range = date_range || data.date_range;
            const label = <div className="flex">
                <span className="fixed-flex">{name}</span>
                {unit_standard && <span className="fixed-flex">{unit_standard}</span>}
                {date_range && <span className="fixed-flex">
                        {Dates.formatDate(date_range.start)} - {Dates.formatDate(date_range.end)}
                    </span>}
            </div>;
            console.log('selectedVal', label, defaultValue)
            return {value: defaultValue, label};
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if (!props) return null;
        let {readonly} = this.props;

        if (readonly) {
            return <ProfileField {...props} />;
        }

        return <ClearableInput {...props}/>;
    }
}

function onSelectLoad() {
    return trainingMatrixStore.listForSelectionByLogged().then(res => {
        return res.filter(v => !!v.data.course).map(value => {
            const {course: {name}, unit_standard, date_range_start, date_range_end} = value.data;
            return {label: name +
                    (unit_standard ? ` (${unit_standard})` : '') +
                    (date_range_start ? (' (' + Dates.formatDate(date_range_start) + '-' + Dates.formatDate(date_range_end) + ')') : ''), value};
        });
    });
}

export default SelectInput;
