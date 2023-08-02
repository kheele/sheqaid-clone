import {observer} from "mobx-react";
import React from "react";
import {ClearableInput} from "./index";
import {computed, isObservableArray, observable} from "mobx";
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import GQLClient from "graphql/GQLClient";

@observer
class SelectInput extends React.Component {

    @observable
    state = {
        lists: {
            list: []
        },
        props: null
    };

    constructor(props) {
        super(props);

        this.renderer = this.renderer.bind(this);
    }

    async componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectIncidentNatureOfInjuryInput`;

        const res = await onSelectLoad();
        this.state.lists.list = res.distinct();

        const {type} = this.props;

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "nature_of_injury_list",
            type: type || "select_multi",
            placeholder: "Nature Of Injury...",
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

function onSelectLoad() {
    return byLogged().then(res => {
        return res.map(value => {
            return {label: value.data.name, value};
        });
    });
}

async function byLogged() {
    return GQLClient
    .query({
        query: `
      query listAllIncidentNatureOfInjuryByLoggedQuery {
        sheq_incident_investigation_injury_list(
          where: {type: {_eq: "Nature"}},
          order_by: {name: asc},
        ) {
            id
            name
            incident_list_aggregate{
                aggregate{
                    count
                }
            }
        }
      }
    `,
    });
}

export default SelectInput;