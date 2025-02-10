// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from "mobx";

import Form from "utils/Form";
import {execWhen} from "utils/Utils";
import {ClearableInput, ProfileField} from "components/inputs";

// </editor-fold>

@observer
class AControls extends React.Component {
    path = "plugin_sheq_assist/17_Incident_Investigation/man-hours/";

    //<editor-fold desc="fields">
    @observable state = {
        lists: {
            managers_time_travelled_opts: [{label: "Hours", value: "Hours"}, {label: "Minutes", value: "Minutes"}],
            employees_time_travelled_opts: [{label: "Hours", value: "Hours"}, {label: "Minutes", value: "Minutes"}],
            contractors_time_travelled_opts: [{label: "Hours", value: "Hours"}, {label: "Minutes", value: "Minutes"}],
            managers_num_of_days_per_month: ["21", "21.75", "22"].map(value => {
                return {value, label: value};
            }),
            employees_num_of_days_per_month: ["21", "21.75", "22"].map(value => {
                return {value, label: value};
            }),
            contractors_num_of_days_per_month: ["21", "21.75", "22"].map(value => {
                return {value, label: value};
            }),
        }
    }
    //</editor-fold>

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onChangeImpl = this.onChangeImpl.bind(this);

        this.form = new Form();
        this.form.addChangeMany(['num_of_managers', 'hrs_worked_by_managers', 'managers_num_of_days_per_month', 'managers_absent_hrs',
            'managers_time_travelled', 'managers_time_travelled_opts', 'transport_num_of_managers'], this.onChangeManagers.bind(this));
        this.form.addChangeMany(['num_of_employees', 'hrs_worked_by_employees', 'employees_num_of_days_per_month', 'employees_absent_hrs',
            'employees_time_travelled', 'employees_time_travelled_opts', 'transport_num_of_employees'], this.onChangeEmployees.bind(this));
        this.form.addChangeMany(['num_of_contractors', 'hrs_worked_by_contractors', 'contractors_num_of_days_per_month', 'contractors_absent_hrs',
            'contractors_time_travelled', 'contractors_time_travelled_opts', 'transport_num_of_contractors'], this.onChangeContractors.bind(this));
        this.form.addChangeMany(['overtime1_score', 'overtime2_score', 'overtime1', 'overtime2'], this.onChangeOvertime.bind(this));
    }

    //</editor-fold>

    //<editor-fold desc="onChangeImpl">
    onChangeImpl(group, el, name, val) {
        if(name.contains("_num_of_days_per_month")) {
            val = parseFloat(val, 10);
        }
        execWhen(() => {
            const {
                [`rowPanel1_${group}`]: rowPanel1,
                [`rowPanel2_${group}`]: rowPanel2,
                [`rowPanel3_${group}`]: rowPanel3
            } = this.refs;
            if (!rowPanel1 || !rowPanel2 || !rowPanel3) return false;

            const {
                [`num_of_${group}`]: num_of_group,
                [`hrs_worked_by_${group}`]: hrs_worked_by_group,
                [`${group}_num_of_days_per_month`]: group_num_of_days_per_month,
                [`${group}_absent_hrs`]: group_absent_hrs,
                [`${group}_sub_total_hrs`]: group_sub_total_hrs,
            } = rowPanel1.refs;
            const {
                [`transport_num_of_${group}`]: transport_num_of_group,
                [`${group}_time_travelled`]: group_time_travelled,
                [`${group}_time_travelled_opts`]: group_time_travelled_opts,
                [`${group}_transport_hrs`]: group_transport_hrs,
            } = rowPanel2.refs;
            const {
                [`${group}_num_of_days_lost`]: group_num_of_days_lost,
                //
                [`${group}_total_hrs`]: group_total_hrs,
            } = rowPanel3.refs;

            return num_of_group &&
                hrs_worked_by_group &&
                group_absent_hrs &&
                group_sub_total_hrs &&
                group_time_travelled &&
                group_time_travelled_opts &&
                transport_num_of_group &&
                group_transport_hrs &&
                group_num_of_days_lost &&
                group_num_of_days_per_month &&
                //
                group_total_hrs;
        }).then(() => {
            const {
                [`rowPanel1_${group}`]: rowPanel1,
                [`rowPanel2_${group}`]: rowPanel2,
                [`rowPanel3_${group}`]: rowPanel3
            } = this.refs;

            const {
                [`num_of_${group}`]: num_of_group,
                [`hrs_worked_by_${group}`]: hrs_worked_by_group,
                [`${group}_num_of_days_per_month`]: group_num_of_days_per_month,
                [`${group}_absent_hrs`]: group_absent_hrs,
                [`${group}_sub_total_hrs`]: group_sub_total_hrs,
            } = rowPanel1.refs;
            const {
                [`transport_num_of_${group}`]: transport_num_of_group,
                [`${group}_time_travelled`]: group_time_travelled,
                [`${group}_time_travelled_opts`]: group_time_travelled_opts,
                [`${group}_transport_hrs`]: group_transport_hrs,
            } = rowPanel2.refs;
            const {
                [`${group}_num_of_days_lost`]: group_num_of_days_lost,
                //
                [`${group}_total_hrs`]: group_total_hrs,
            } = rowPanel3.refs;

            let group_time_travelled_val = 0;
            if (group_time_travelled_opts.value === 'Minutes') {
                group_time_travelled_val = (group_time_travelled.hasValue ? group_time_travelled.value : 0) / 60;
            } else {
                group_time_travelled_val = (group_time_travelled.hasValue ? group_time_travelled.value : 0);
            }

            const group_transport_hrs_total = (transport_num_of_group.hasValue ? transport_num_of_group.value : 0) * group_time_travelled_val;
            group_transport_hrs.setEditable(true);
            group_transport_hrs.onChange(group_transport_hrs_total);
            group_transport_hrs.setEditable(false);

            let {value: days_per_month} = group_num_of_days_per_month;
            if(isString(days_per_month)) {
                days_per_month = parseFloat(days_per_month);
            } else if(isObject(days_per_month)) {
                days_per_month = parseFloat(days_per_month.value);
            } else {
                days_per_month = 0;
            }

            const sub_total = (
                    (num_of_group.hasValue ? num_of_group.value : 0) *
                    (group_num_of_days_per_month.hasValue ? days_per_month : 0) *
                    (hrs_worked_by_group.hasValue ? hrs_worked_by_group.value : 0)
                ) -
                (group_absent_hrs.hasValue ? group_absent_hrs.value : 0);
            group_sub_total_hrs.setEditable(true);
            group_sub_total_hrs.onChange(sub_total);
            group_sub_total_hrs.setEditable(false);

            const total = sub_total + group_transport_hrs_total;
            group_total_hrs.setEditable(true);
            group_total_hrs.onChange(total);
            group_total_hrs.setEditable(false);

            this.onCalculateTotal();
        });
    }

    //</editor-fold>

    //<editor-fold desc="onChangeManagers">
    onChangeManagers(el, name, val) {
        this.onChangeImpl("managers", el, name, val);
    }

    //</editor-fold>

    //<editor-fold desc="onChangeEmployees">
    onChangeEmployees(el, name, val) {
        this.onChangeImpl("employees", el, name, val);
    }

    //</editor-fold>

    //<editor-fold desc="onChangeContractors">
    onChangeContractors(el, name, val) {
        this.onChangeImpl("contractors", el, name, val);
    }

    //</editor-fold>

    //<editor-fold desc="onChangeOvertime">
    onChangeOvertime(el, name, val) {
        execWhen(() => {
            const {
                overtime1_score,
                overtime1,
                overtime2_score,
                overtime2,
                //
                overtime1_total_hrs,
                overtime2_total_hrs
            } = this.refs;

            return overtime1_score &&
                overtime1 &&
                overtime2_score &&
                overtime2 &&
                //
                overtime1_total_hrs &&
                overtime2_total_hrs
        }).then(() => {
            const {
                overtime1_score,
                overtime1,
                overtime2_score,
                overtime2,
                //
                overtime1_total_hrs,
                overtime2_total_hrs
            } = this.refs;

            // console.log(overtime1_score.value, parseFloat(overtime1_score.value))
            const total1 = (overtime1.hasValue ? overtime1.value : 0) *
                (overtime1_score.hasValue ? parseFloat(overtime1_score.value.replace(",", ".")) : 0);
            overtime1_total_hrs.setEditable(true);
            overtime1_total_hrs.onChange(total1);
            overtime1_total_hrs.setEditable(false);

            // console.log(overtime2_score.value, parseFloat(overtime2_score.value))
            const total2 = (overtime2.hasValue ? overtime2.value : 0) *
                (overtime2_score.hasValue ? parseFloat(overtime2_score.value.replace(",", ".")) : 0);
            overtime2_total_hrs.setEditable(true);
            overtime2_total_hrs.onChange(total2);
            overtime2_total_hrs.setEditable(false);

            this.onCalculateTotal();
        });
    }

    //</editor-fold>

    //<editor-fold desc="onCalculateTotal">
    onCalculateTotal() {
        execWhen(() => {
            const {rowPanel3_managers, rowPanel3_employees, rowPanel3_contractors} = this.refs;
            if (!rowPanel3_managers || !rowPanel3_employees || !rowPanel3_contractors) return false;

            const {managers_total_hrs} = rowPanel3_managers.refs;
            const {employees_total_hrs} = rowPanel3_employees.refs;
            const {contractors_total_hrs} = rowPanel3_contractors.refs;

            const {
                overtime1_total_hrs,
                overtime2_total_hrs,
                //
                total_hrs_worked
            } = this.refs;

            return managers_total_hrs &&
                employees_total_hrs &&
                contractors_total_hrs &&
                overtime1_total_hrs &&
                overtime2_total_hrs &&
                //
                total_hrs_worked;
        }).then(() => {
            const {rowPanel3_managers, rowPanel3_employees, rowPanel3_contractors} = this.refs;

            const {managers_total_hrs} = rowPanel3_managers.refs;
            const {employees_total_hrs} = rowPanel3_employees.refs;
            const {contractors_total_hrs} = rowPanel3_contractors.refs;

            const {
                overtime1_total_hrs,
                overtime2_total_hrs,
                //
                total_hrs_worked
            } = this.refs;

            const total = (managers_total_hrs.hasValue ? managers_total_hrs.value : 0) +
                (employees_total_hrs.hasValue ? employees_total_hrs.value : 0) +
                (contractors_total_hrs.hasValue ? contractors_total_hrs.value : 0) +
                (overtime1_total_hrs.hasValue ? overtime1_total_hrs.value : 0) +
                (overtime2_total_hrs.hasValue ? overtime2_total_hrs.value : 0);

            total_hrs_worked.setEditable(true);
            total_hrs_worked.onChange(total);
            total_hrs_worked.setEditable(false);
        });
    }

    //</editor-fold>

}

//<editor-fold desc="Sign">
@observer
class Sign extends React.Component {
    render() {
        let {className = ''} = this.props;
        className += ' fixed-flex padding-10 margin-0 margin-t-10 flex flex-center';
        return <h1 className={className}>{this.props.value}</h1>;
    }
}

//</editor-fold>

//<editor-fold desc="RowPanel1">
@observer
class RowPanel1 extends React.Component {

    render() {
        const {lists, item, group, readonly, onChange} = this.props;

        const {data} = item || {};
        const {
            [`num_of_${group}`]: num_of_group,
            [`hrs_worked_by_${group}`]: hrs_worked_by_group,
            [`${group}_num_of_days_per_month`]: group_num_of_days_per_month,
            [`${group}_absent_hrs`]: group_absent_hrs,
            [`${group}_sub_total_hrs`]: group_sub_total_hrs,
        } = data || {};

        if (readonly) {
            return <>
                <ProfileField
                    ref={`num_of_${group}`}
                    name={`num_of_${group}`}
                    value={num_of_group || '0'}
                    type="number"
                    title={`# Of ${group === 'managers' ? 'Managers' : 'Employees'}`}
                    className="fixed-flex min-w-150 margin-r-0"
                />
                <Sign value="X"/>
                <ProfileField
                    ref={`hrs_worked_by_${group}`}
                    name={`hrs_worked_by_${group}`}
                    value={hrs_worked_by_group || '0'}
                    type="number"
                    title="Hrs Worked"
                    className="margin-r-0"
                />
                <Sign value="X"/>
                <ProfileField
                    ref={`${group}_num_of_days_per_month`}
                    name={`${group}_num_of_days_per_month`}
                    value={group_num_of_days_per_month || '0'}
                    type="number"
                    title="Days Per Month"
                    className=""
                />
                <Sign value="-"/>
                <ProfileField
                    ref={`${group}_absent_hrs`}
                    name={`${group}_absent_hrs`}
                    value={group_absent_hrs || '0'} type="number"
                    title="Absent Hrs"
                    className="margin-r-0"
                />
                <Sign value="="/>
                <ProfileField
                    ref={`${group}_sub_total_hrs`}
                    name={`${group}_sub_total_hrs`}
                    value={group_sub_total_hrs || '0'}
                    type="number"
                    title="Sub-Total Hrs"
                    isEditable={false}
                    className="fixed-flex min-w-150"
                />
            </>;
        }

        return <>
            <ClearableInput
                ref={`num_of_${group}`}
                name={`num_of_${group}`}
                type="number"
                placeholder={`# Of ${group === 'managers' ? 'Managers' : 'Employees'}`} required
                isClearable={false}
                defaultValue={num_of_group}
                className="fixed-flex min-w-160 form-control"
                onChange={onChange}
            />
            <Sign value="X" className="font-size-24"/>
            <ClearableInput
                ref={`hrs_worked_by_${group}`}
                name={`hrs_worked_by_${group}`}
                type="number"
                placeholder="Hrs Worked" required
                isClearable={false}
                defaultValue={hrs_worked_by_group}
                className="fixed-flex min-w-140 form-control"
                onChange={onChange}
            />
            <Sign value="X" className="font-size-24"/>
            <ClearableInput
                ref={`${group}_num_of_days_per_month`}
                name={`${group}_num_of_days_per_month`}
                type="select"
                placeholder="Days Per Month..."
                isClearable={false}
                defaultValue={group_num_of_days_per_month}
                className="fixed-flex min-w-180 form-control days_per_month"
                onChange={onChange}
                values={lists[`${group}_num_of_days_per_month`]}
                returnValue add
            />
            <Sign value="-"/>
            <ClearableInput
                ref={`${group}_absent_hrs`}
                name={`${group}_absent_hrs`}
                type="number"
                placeholder="Absent Hrs" required
                defaultValue={group_absent_hrs || 0}
                isClearable={false}
                className="form-control"
                onChange={onChange}
            />
            <Sign value="="/>
            <ClearableInput
                ref={`${group}_sub_total_hrs`}
                name={`${group}_sub_total_hrs`}
                type="number"
                placeholder="Sub-Total Hrs"
                defaultValue={group_sub_total_hrs || 0}
                isEditable={false} isClearable={false}
                className="fixed-flex min-w-145 form-control totals"
                onChange={onChange}
            />
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="RowPanel2">
@observer
class RowPanel2 extends React.Component {

    render() {
        const {lists, item, group, readonly, onChange} = this.props;

        const {data} = item || {};
        const {
            [`transport_num_of_${group}`]: transport_num_of_group,
            [`${group}_time_travelled`]: group_time_travelled,
            [`${group}_time_travelled_opts`]: group_time_travelled_opts,
            [`${group}_transport_hrs`]: group_transport_hrs,
        } = data || {};

        if (readonly) {
            return <>
                <ProfileField
                    ref={`transport_num_of_${group}`}
                    name={`transport_num_of_${group}`}
                    type="number"
                    title={`# Of ${group === 'managers' ? 'Managers' : 'Employees'}`}
                    value={transport_num_of_group || '0'}
                    className="fixed-flex min-w-150"
                />
                <Sign value="X"/>
                <ProfileField
                    ref={`${group}_time_travelled`}
                    name={`${group}_time_travelled`}
                    type="number"
                    title="Time Travelled"
                    value={(group_time_travelled || '0') + ' ' + (group_time_travelled_opts || "Hrs").replace("ou", "")}
                    className="col-lg-3"
                />
                <Sign value="="/>
                <ProfileField
                    ref={`${group}_transport_hrs`}
                    name={`${group}_transport_hrs`}
                    type="number"
                    title="Transport Hrs" value={group_transport_hrs || '0'}
                    className="fixed-flex min-w-150 totals"
                />
            </>;
        }

        return <>
            <ClearableInput
                ref={`transport_num_of_${group}`}
                name={`transport_num_of_${group}`}
                type="number"
                placeholder={`# Of ${group === 'managers' ? 'Managers' : 'Employees'}`} required
                isClearable={false}
                defaultValue={transport_num_of_group}
                className="fixed-flex min-w-160 form-control"
                onChange={onChange}
            />
            <Sign value="X" className="font-size-24"/>
            <ClearableInput
                ref={`${group}_time_travelled`}
                name={`${group}_time_travelled`}
                type="number"
                placeholder="Time Travelled" required
                isClearable={false}
                defaultValue={group_time_travelled}
                className="col-lg-3 form-control no-border-r no-border-radius-r"
                onChange={onChange}
            />
            <ClearableInput
                ref={`${group}_time_travelled_opts`}
                name={`${group}_time_travelled_opts`}
                type="select"
                placeholder="Hours / Minutes..."
                defaultValue={group_time_travelled_opts || "Hours"}
                isClearable={false}
                className="col-lg-3 time-travelled-opts form-control no-border-l no-border-radius-l -margin-l-10"
                onChange={onChange}
                values={lists[`${group}_time_travelled_opts`]} returnValue
            />
            <Sign value="="/>
            <ClearableInput
                ref={`${group}_transport_hrs`}
                name={`${group}_transport_hrs`}
                type="number"
                placeholder="Transport Hrs" required
                isClearable={false}
                defaultValue={group_transport_hrs}
                className="fixed-flex min-w-145 form-control totals"
                onChange={onChange}
            />
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="RowPanel3">
@observer
class RowPanel3 extends React.Component {

    render() {
        const {group, item, readonly, onChange} = this.props;

        const {data} = item || {};
        const {
            [`${group}_num_of_days_lost`]: group_num_of_days_lost,
            //
            [`${group}_total_hrs`]: group_total_hrs,
        } = data || {};

        if (readonly) {
            return <>
                <ProfileField
                    ref={`${group}_num_of_days_lost`}
                    name={`${group}_num_of_days_lost`}
                    value={group_num_of_days_lost || '0'}
                    type="number"
                    title="# Of Days Lost"
                    className="col-lg-4"
                />
                <ProfileField
                    ref={`${group}_total_hrs`}
                    name={`${group}_total_hrs`}
                    value={group_total_hrs || '0'}
                    type="number"
                    title="Total Hours"
                    className="fixed-flex min-w-150"
                />
            </>;
        }

        return <>
            <ClearableInput
                ref={`${group}_num_of_days_lost`}
                name={`${group}_num_of_days_lost`}
                type="number"
                placeholder="# Of Days Lost" required
                isClearable={false}
                defaultValue={group_num_of_days_lost}
                className="fixed-flex min-w-190 form-control"
                onChange={onChange}
            />
            <ClearableInput
                ref={`${group}_total_hrs`}
                name={`${group}_total_hrs`}
                type="number"
                placeholder="Total Hours"
                isEditable={false} isClearable={false}
                defaultValue={group_total_hrs}
                required
                className="fixed-flex employees_total_hrs min-w-145 form-control totals"
                onChange={onChange}
            />
        </>;
    }
}

//</editor-fold>

export {
    AControls, Sign, RowPanel1, RowPanel2, RowPanel3,
};
//582