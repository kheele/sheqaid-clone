import React from "react";
import {observer} from 'mobx-react';
import {ClearableInput} from './';

import style from "./DateRangeInput.lazy.css";

@observer
class DateRangeInput extends React.Component {

    state = {
        start: null,
        end: null
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onChange(val, name, el) {
        const {onChange} = this.props;
        let value;
        if (val) {
            this.state[name] = val;
            value = this.state;
            
        } else {
            delete this.state[name];
            value = null;
        }

        onChange && onChange(value, this.props.name, this);
    }

    render() {
        let {placeholder, vertical, placeholderWidthClass, startRequired, endRequired, defaultValue, className, children} = this.props;
        className = className || "";
        if(vertical) {
            className += " vertical";
        }

        children = children ? React.Children.map(children, ch => ch) : [];
        return <div className={"DateRangeInput flex " + className}>
            {placeholder && <label className={"fixed-flex placeholder-label" + (placeholderWidthClass ? (" " + placeholderWidthClass) : "")}>{placeholder}</label>}
            {children.length > 0 && children[0]}
            <ClearableInput name="start" type="date" placeholder="dd-mm-yyyy" defaultValue={defaultValue && defaultValue.start} required={startRequired} className="form-control" onChange={this.onChange}/>
            <hr/>
            {children.length === 2 && children[1]}
            <ClearableInput name="end" type="date" placeholder="dd-mm-yyyy" defaultValue={defaultValue && defaultValue.end} required={endRequired} className="form-control" onChange={this.onChange}/>
        </div>;
    }
}

export default DateRangeInput;
