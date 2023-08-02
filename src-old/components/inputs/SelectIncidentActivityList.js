import {observer} from "mobx-react";
import React from "react";
import {ClearableInput} from "./index";
import {computed} from "mobx";

@observer
class SelectIncidentActivityList extends React.Component {

    @computed
    get list() {
        const {values} = this.props;
        return values ? values.options : [];
    }

    render() {
        const {
            onChange, values, defaultValue,
            placeholder = "Activities (Optional)",
            refName = "activity_list",
            name = "activity_list",
            type = "select_multi",
            add = true,
            className = "col-lg-12 form-control",
            vertical = 2
        } = this.props;
        const {list} = this;
        if(list.isEmpty()) {
            return <ClearableInput ref={refName} name={name} type={type}
                                   placeholder={placeholder}
                                   vertical={vertical} className={className}
                                   readonly
                                   values={values.options} add={false}/>;
        }
        return <ClearableInput key={new Date().getTime()} ref={refName} name={name} type={type} defaultValue={defaultValue}
                               placeholder={placeholder}
                               vertical={vertical} className={className} onChange={onChange}
                               values={list} returnValue add={add}/>;
    }
}

export default SelectIncidentActivityList;