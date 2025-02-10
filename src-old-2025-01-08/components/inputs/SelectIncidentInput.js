import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';
import {onAsyncSelectLoadImpl} from "../../utils/AsyncSelect";
import {Dates} from "../../utils/Dates";
import {TRow} from "../tables";
import {
    IncidentStatus
} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentComponentRows";

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

    componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectIncidentInput`;

        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "incident",
            type: "select",
            placeholder: "Incident...",
            onAsyncSelectLoad,
            returnValue: true,
            add: false,
            ...this.props,
            defaultValue: this.selectedItem,
            className
        };
    }

    @computed
    get selectedItem() {
        const {defaultValue} = this.props;
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {name, data} = defaultValue;
            const label = data ? data.name : name;
            console.log('selectedVal', label)
            return {value: defaultValue, label};
        }
        return null;
    }

    render() {
        const {props} = this.state;
        if (!props) return null;

        return <ClearableInput {...props}/>;
    }
}

function onAsyncSelectLoad(value) {
    return onAsyncSelectLoadImpl("plugin_sheq_assist/17_Incident_Investigation/list/search_by_name", value, value => {
        let {
            id, data: {
                created_at, status,
                client, project, site,
                classification,
                investigation,
                sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data,
                sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data,
//                sec1_data: {category_list, short_desc},//1
//                sec2_data: {sub_category_list},//2
//                sec3_data: {type},//3
//                sec4_data: {secondary_type_list},//4
//                sec5_data: {person_involved_list},//5
//                sec6_data: {person_reporting},//6
//                sec7_data: {person_reported_to, date_reported, time_reported},//7
//                sec8_data: {witness_list},//8
//                sec9_data: {incident_date, incident_time, exact_location},//9
//                sec10_data: {document_list, desc},//10
//                sec11_data: {person_injured, injured_person_dob, injured_person_gender, nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list},//11
//                sec12_data: {test_undertaken, test_type_list, test_type_drug_undertaken, test_type_alcohol_undertaken, test_type_mobile_device_undertaken},//12
//                sec13_data: {is_vehicle_incident, is_infringement_issued, did_police_attend_scene, collision_reported_to_police_station, have_charges_been_laid},//13
//                sec14_data: {consequence, frequency, risk_rating},//15
//                sec15_data: {distribution_list}//16
            }
        } = value;
        if (classification) {
            sec1_data = classification.sec1_data || sec1_data;
            sec2_data = classification.sec2_data || sec2_data;
            sec3_data = classification.sec3_data || sec3_data;
            sec4_data = classification.sec4_data || sec4_data;
        }

        const label = <TRow className="w-full">
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Incident Date</h6>
                {sec9_data && sec9_data.incident_date ? Dates.formatDate(sec9_data.incident_date) : 'N/A'}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Type</h6>
                {sec3_data && sec3_data.type ? sec3_data.type : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Category</h6>
                {sec1_data && sec1_data.category_list ? sec1_data.category_list.map(v =>
                    <span>{isString(v) ? v : v.value}</span>) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Description</h6>
                {sec1_data && sec1_data.short_desc ? sec1_data.short_desc : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Location</h6>
                {sec9_data && sec9_data.exact_location ? sec9_data.exact_location : 'N/A'}
            </div>
            <IncidentStatus key={new Date().getTime()} item={item}/>
        </TRow>;
        return {label, value};
    });
}

export default SelectInput;
