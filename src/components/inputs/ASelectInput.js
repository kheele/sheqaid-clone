import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {createValueSetter, execWhen} from '../../utils/Utils';
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";

@observer
class ASelectInput extends React.Component {

    @observable state = {};

    constructor(props) {
        super(props);

        this.rendererImpl = this.rendererImpl.bind(this);
        
        createValueSetter.call(this.state);
        execWhen(() => this.refs.input).then(ref => {
            ref.parentWrapper = this;
        });
    }
    
    onChange(el, val) {
        this.value = val;
    }

    get refName() {
        const {input} = this;
        console.log(this)
        const {_reactInternals: {ref}} = this;
        return ref._stringRef;
    }

    @computed
    get list() {
        return this.state.lists.list;
    }

    set list(value) {
        const {lists} = this.state;
        lists.list = value || [];
        execWhen(() => this.state.props).then(props => {
            props.values = this.listMapped || this.list;
        });
    }

    @computed
    get value() {
        const {input} = this.refs;
        return input && input.value;
    }
    
    set value(value) {
        execWhen(() => this.refs.input).then(ref => {
            ref.hide();
            ref.onChange(value);
            ref.show();
        });
        // console.log(`${this.props.name} - set value`, value)
    }
    
    @computed
    get hasValue() {
        const {input} = this.refs;
        return input && input.hasValue;
    }
    
    hide() {
        const {input} = this.refs;
        input && input.hide();
        return this;
    }

    show() {
        const {input} = this.refs;
        input && input.show();
        return this;
    }
    
    setError() {
        const {input} = this.refs;
        return input && input.setError && input.setError();
    }

    clearError() {
        const {input} = this.refs;
        return input && input.clearError && input.clearError();
    }
    
    reset(evt) {
        const {input} = this.refs;
        return input && input.reset && input.reset(evt);
    }
    
    setEditable(bool) {
        const {input} = this.refs;
        return input && input.setEditable && input.setEditable(bool);
    }

    rendererImpl(v, getLabel) {
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
                        label = getLabel(v);
                    }
                    return <Grid key={label} item><Chip label={label} size="small"/></Grid>;
                })}
            </>
        }
        return getLabel(v);
    }
}

export default ASelectInput;
