// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
// </editor-fold>
import Form from 'utils/Form';
import {Dates} from 'utils/Utils';

import style from "./ExportFilteredData.lazy.css";

@observer
class ExportFilteredData extends React.Component {
    
    componentWillMount() {
        style.use();
    }
    
    componentWillUnmount() {
        style.unuse();
    }
    
    @computed get values() {
        const {filterData, onGetRef} = this.props;
        return Object.keys(filterData).
                filter(key => key !== 'onGetRef').
                filter(key => filterData[key] !== null).
                map(key => { 
                    return {key, ref: onGetRef(key)};
                }).
                filter(({key, ref}) => Form.hasVal(ref.value)).
                map(({key, ref}) => {
                    let {props, value} = ref;
                    const title = props.placeholder.replace('...', '');
                    if(isDate(value)) {
                        value = Dates.formatDate(value);
                    } else if(isObject(value)) {
                        if(value.name || (value.data && value.data.name)) {
                            value = value.name || value.data.name;
                        } else if((value.fname && value.lname) || (value.data && value.data.fname && value.data.lname)) {
                            value = `${value.lname || value.data.lname} ${value.fname || value.data.fname}`;
                        } else if(isString(value.value)) {
                            value = value.value;
                        } else if(value.label) {
                            value = value.label;
                        }
                    }
                    return {key, title, value};
                });
    }
    
    @computed get valuesRenderer() {
        return this.values.map(({title, value}) => <span className="flex-column">
            {title}<b>{value}</b>
        </span>);
    }
    
    render() {
        const {valuesRenderer} = this;
        return <div className="ExportFilteredData">
            <label className="margin-0">Filter:</label>
            {valuesRenderer}
        </div>;
    }
}

export default ExportFilteredData;
