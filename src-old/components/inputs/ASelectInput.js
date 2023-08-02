import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {createValueSetter, execWhen} from '../../utils/Utils';

@observer
class ASelectInput extends React.Component {

    constructor(props) {
        super(props);
        
        createValueSetter.call(this);
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

    @computed
    get value() {
        const {input} = this.refs;
        return input && input.value;
    }
    
    set value(value) {
        execWhen(() => this.refs.input).then(ref => ref.onChange(value));
        console.log(`${this.props.name} - set value`, value)
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
    
}

export default ASelectInput;
