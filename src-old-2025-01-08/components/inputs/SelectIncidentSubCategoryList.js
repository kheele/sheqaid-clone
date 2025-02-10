import {observer} from "mobx-react";
import React from "react";
import {ClearableInput} from "./index";
import {computed, isObservableArray, observable} from "mobx";
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import ASelectInput from "./ASelectInput";
import {execWhen} from "../../utils/UtilsFuns";

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

        this.renderer = this.renderer.bind(this);
    }

    async componentDidMount() {
        let {className = '', type, vertical} = this.props;
        className += ` SelectIncidentSubCategoryInput`;
        if(type === 'checkbox' && vertical) {
            className += ` min-h-75`;
        }

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "sub_category_list",
            type: type || "select_multi",
            placeholder: "Sub-Category (Optional)...",
            values: this.listMapped,
            groupBy: ({value}) => value.category.name,
            returnValue: true,
            add: false,
            renderer: this.renderer,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
        this.state.loaded = true;
    }

    @computed
    get listMapped() {
        const {type} = this.props;
        return this.state.lists.list.map((value) => ({[type === 'checkbox' ? 'text' : 'label']: value.name || value.data.name, value}));
    }

    set list(value) {
        const {lists} = this.state;
        if(value && value.isNotEmpty()) {
            const oldList = [...lists.list.slice()];
            lists.list = value;
            execWhen(() => this.state.props).then(props => {
                console.log('new value: ', value.slice(), 'old value: ', this.value && this.value.slice(), 'oldList: ', oldList.slice())
                props.values = this.listMapped;
            });
        } else {
            lists.list = [];
            execWhen(() => this.state.props).then(props => {
                props.values = this.list;
            });
        }
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
                return {value: defaultValue, label: defaultValue};
            }
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        return <ClearableInput {...props}/>;
    }
}

export default SelectInput;