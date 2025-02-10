import {observer} from "mobx-react";
import React from "react";
import {ClearableInput} from "./index";
import {computed, isObservableArray, observable} from "mobx";
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import GQLClient from "graphql/GQLClient";
import ASelectInput from "./ASelectInput";

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
        className += ` SelectIncidentCategoryInput`;
        if(type === 'checkbox' && vertical) {
            className += ` min-h-75`;
        }

        const res = await onSelectLoad(type);
        this.state.lists.list = res.distinct();

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "category_list",
            type: type || "select",
            placeholder: "Incident Category...",
            values: this.list,
            returnValue: true,
            add: false,
            renderer: this.renderer,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
        this.state.loaded = true;
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
                console.log('selectedItem', defaultValue.slice())
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

function onSelectLoad(type) {
    return byLogged().then(res => {
        return res.map(value => {
            return {[type === 'checkbox' ? 'text' : 'label']: value.data.name, value};
        });
    });
}

async function byLogged() {
    return GQLClient
    .query({
        query: `
      query listAllIncidentCategoryByLoggedQuery {
        sheq_incident_investigation_categories(
          order_by: {name: asc},
        ) {
            id
            name
            incident_list_aggregate{
                aggregate{
                    count
                }
            }
            sub_category_list{
                id
                name
                category{
                    name
                }
                incident_list_aggregate{
                    aggregate{
                        count
                    }
                }
            }
        }
      }
    `,
    });
}

export default SelectInput;