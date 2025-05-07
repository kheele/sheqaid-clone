import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {ProfileField} from 'components/inputs';

@observer
class ContractDetails extends React.Component {

    @observable
    state = {
        lists: {
            working_schedules: []
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {defaultValue} = this.props;
        const {
            contract_type,
            start_date,
            expiry_date,
            end_of_trial_period,
            start_time,
            end_time,
            daily_working_hours,
            notes,
        } = defaultValue || {};

        return <>
            <div className="row sec-group margin-0">
                <hr className="margin-b-10 hor-center w-200"/>
                <label className="margin-b-0 w-full bg-white padding-10">Contract Terms</label>
                <ProfileField title="Contract Type" name="contract_type" value={contract_type} className="col-lg-12"/>
                <ProfileField title="Start Date" name="start_date" value={start_date} type="date" className="col-lg-6"/>
                <ProfileField title="End Date" name="expiry_date" value={expiry_date} type="date" className="col-lg-6"/>
                <ProfileField title="End Of Trial Period" name="end_of_trial_period" value={end_of_trial_period}
                              type="date" className="col-lg-6"/>
            </div>
            <div className="row sec-group margin-0">
                <hr className="margin-b-10 hor-center w-200"/>
                <label className="margin-b-0 w-full bg-white padding-10">Working Schedule</label>
                <ProfileField name="start_time" type="time" placeholder="Start Time" value={start_time}
                              className="col-lg-6"/>
                <ProfileField name="end_time" type="time" placeholder="End Time" value={end_time} className="col-lg-6"/>
                <ProfileField name="daily_working_hours" type="number" placeholder="Daily Working Hours"
                              value={daily_working_hours} className="col-lg-6"/>
            </div>
            <div className="row sec-group margin-0">
                <hr className="margin-b-10 hor-center w-200"/>
                <label className="margin-b-0 w-full bg-white padding-10">Notes</label>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
            </div>
        </>;
    }
}

@observer
class SalaryInfo extends React.Component {

    @observable
    state = {
        lists: {
            payment_types: [{text: 'Salary (Fixed Payment)', value: 'Salary', checked: false}, {
                text: 'Hourly Wage',
                value: 'Wage',
                checked: false
            }],
            salary_intervals: [
                {text: 'Weekly', value: 'Weekly', checked: false},
                {text: 'Bi-Weekly', value: 'Bi-Weekly', checked: false},
                {text: 'Monthly', value: 'Monthly', checked: false}
            ],
            wage_types: []
        }
    };

    constructor(props) {
        super(props);
    }

    get item() {
        return this.props.item;
    }

    render() {
        const {defaultValue} = this.props;
        let {
            payment_type,
            salary_interval,
            salary,
            wage,
            deductible, deductible_list,
        } = defaultValue || {};

        salary = salary ? salary.toCurrency('R') : "N/A";
        deductible_list = deductible_list || deductible && deductible.list;

        return <>
            <div className="row sec-group margin-0">
                <ProfileField title="Payment Type" name="payment_type" value={payment_type}
                              className={"col-lg-" + (payment_type === "Salary" ? "6" : "6")}/>
                {payment_type === "Salary" &&
                    <ProfileField title="Salary Interval" name="salary_interval" value={salary_interval}
                                  className="col-lg-6"/>}
                {payment_type === "Salary" &&
                    <ProfileField title="Salary" name="salary" value={salary} className="col-lg-6"/>}
                {payment_type === "Wage" && <ProfileField title="Wage" name="wage" value={wage} className="col-lg-6"/>}
            </div>
            <Deductibles defaultValue={deductible_list}/>
        </>;
    }
}

@observer
class Deductibles extends React.Component {

    constructor(props) {
        super(props);
    }

    @computed
    get list() {
        return (this.props.defaultValue || []).filter(v => !!v && !!v.value);
    }

    @computed
    get calculate() {
        const {list} = this;
        const l = list.filter(({text, value}) => text && value).map(({value}) => value);
        const total = l.reduce((n1, n2) => n1 + n2, 0);
        return total;
    }

    render() {
        return <div className="row sec-group margin-0">
            <hr className="margin-r-10"/>
            <label className="w-full bg-white padding-10">Deductibles</label>
            <div className="row margin-l-0 margin-r-0">
                {this.list.isEmpty() && "N/A"}
                {this.list.map((item, n) => <Deductible item={item}/>)}
            </div>
            {!this.list.isEmpty() && <hr className="hor-center w-100"/>}
            {!this.list.isEmpty() &&
                <label className="hor-center margin-b-15">Deductibles Total : {this.calculate.toCurrency('R')}</label>}
        </div>;
    }
}

@observer
class Deductible extends React.Component {

    render() {
        const {text, value} = this.props.item;
        return <ProfileField name="value" value={value.toCurrency('R')} placeholder={text} className="col-lg-6"/>;
    }
}

export {ContractDetails, SalaryInfo};
