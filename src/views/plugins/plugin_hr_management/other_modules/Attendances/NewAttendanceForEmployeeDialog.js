// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';

import {ANewDialog} from 'components/dialogs';
import {
    Button,
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectTeamInput
} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {SelectTable, THead} from 'components/tables';

import style from "./NewAttendanceForEmployeeDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewAttendanceForEmployeeDialog";
    title = "Attendance";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/attendance/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            week: [1, 2, 3, 4, 5].map(text => {
                text = 'Week ' + text;
                return {text, value: text, checked: false};
            }),
            day: Array.from(Dates.weekDaysStr.values()).map(text => {
                text = text.substring(0, 3);
                return {text, value: text, checked: false};
            })
        },
        team: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("team", this.onChangeTeam.bind(this));
        this.form.addChangeOne("date", this.onChangeDate.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeTeam(el, val) {
        this.state.team = val;
        const {execWhen} = this.props;
        execWhen(() => this.refs.newAttendanceTable).then(newAttendanceTable => {
            if (val) {
                console.log('team', val)
                newAttendanceTable.team = val;
            }
        });
    }

    onChangeDate(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.day && this.refs.week).then(() => {
            const {day: day_ref, week: week_ref} = this.refs;
            if (val) {
//                const {day: day_list, week: week_list} = this.state.lists;
                day_ref.onChange({text: val.getDay(), value: val.getDay(), checked: true});
//                week_ref.onChange();
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            if (!form.isValid('project')) {
                infoDialog.open('Project is required');
                return;
            }
            if (!form.isValid('site')) {
                infoDialog.open('Site is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('project')) {
            infoDialog.open('Project is required');
            return;
        }
        if (!form.isValid('site')) {
            infoDialog.open('Site is required');
            return;
        }

        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('day')) {
            infoDialog.open('Day is required');
            return;
        }
        if (!form.isValid('week')) {
            infoDialog.open('Week is required');
            return;
        }

        const {
            site, project, client,
            date, day, week,
            team,
            signature,
            attendtance_list
        } = form.data;
        const data = {
            client: {id: client.id, name: client.data.name},
            project: {id: project.id, name: project.data.name},
            site: {id: site.id, name: site.data.name},
            team: {id: team.id, name: team.data.name},
            date: date.getTime(), day, week,
            attendtance_list: attendtance_list.map(v => {
                const {id, data: {fname, lname}} = v.employee;
                v.employee = {id, fname, lname};
                if (v.time_in) {
                    v.time_in = v.time_in.getTime();
                }
                if (v.time_out) {
                    v.time_out = v.time_out.getTime();
                }
                if (v.signature) {
                    v.signature = JSON.stringify(v.signature);
                }
                return v;
            })
        };


        if (signature) {
            data.signature = JSON.stringify(signature);
        }

        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "create", data).then(employee_res => {
            console.log("res", employee_res)
            onSaved && onSaved(employee_res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row
                    active
                    rendered
                    idx={0}
                    title="Company / Project / Site"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <SelectClientInput name="client" placeholder="Company..." required
                                       className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." required
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
                </Row>
                <Row
                    rendered
                    idx={1}
                    title="1. Date / Day / Week Details"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <ClearableInput ref="date" name="date" type="date" placeholder="Date..." defaultValue={new Date()}
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="day" name="day" type="radio" placeholder="Day" horizontal readonly
                                    className="col-lg-12 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.day}/>
                    <ClearableInput ref="week" name="week" type="radio" placeholder="Week" horizontal readonly
                                    className="col-lg-12 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.week}/>
                </Row>
                <Row
                    rendered
                    idx={2}
                    title="2. Team & Attendance Details"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <SelectTeamInput name="team" placeholder="Team..." className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
                    <NewAttendanceTable ref="newAttendanceTable" name="attendtance_list" state={this.state}
                                        onChange={this.form.onChange}/>
                    <hr className="margin-0 margin-t-10"/>
                    <ClearableInput name="signature" type="signature" placeholder="Supervisor / Manager Signature"
                                    className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="RenderTimeIn">
@observer
class RenderTimeIn extends React.Component {
    render() {
        const {item} = this.props;
        const {time_in} = item;
        if (!time_in) return null;
        return <span>{Dates.formatTimeExcSec(time_in)}</span>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderTimeOut">
@observer
class RenderTimeOut extends React.Component {
    render() {
        const {item} = this.props;
        const {time_out} = item;
        if (!time_out) return null;
        return <span>{Dates.formatTimeExcSec(time_out)}</span>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderHrs">
@observer
class RenderHrs extends React.Component {
    render() {
        const {item} = this.props;
        const {time_in, time_out} = item;
        let hrs;
        if (time_out && time_in) {
            const {_data: {hours, minutes, seconds}} = time_out.durationPrev(time_in);
            if (hours > 0) {
                hrs = hours;
            }
            if (minutes > 0) {
                const mins = minutes;
                if (hrs) {
                    hrs += ":" + mins;
                } else {
                    hrs = "0:" + mins;
                }
            } else {
                if (hrs) {
                    hrs += ":00";
                } else {
                    hrs = "0:00";
                }
            }
            console.log('diff hrs', hrs)
        }
        return hrs || '--';
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderScreeningStatus">
@observer
class RenderScreeningStatus extends React.Component {
    render() {
        const {item} = this.props;
        const {has_screening} = item;
        return <i className={'fa fa-' + (has_screening ? 'check' : 'times')}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderAutomaticTD">
@observer
class RenderAutomaticTD extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }

    render() {
        const {isAutomatic} = this;
        const {type, name, item, item: {time_in, time_out}, n, onChange, values} = this.props;
        if (!isAutomatic) return null;
        console.log('RenderAutomaticTD', type, time_in, time_out)
        if (type === "In") {
            return <div className="td fixed-flex min-w-80 td-time-in td-RenderAutomaticTD">
                <ClearableInput name={name} type="checkbox" isClearable={false} idx={n} onChange={onChange}
                                values={values}/>
                <RenderTimeIn item={item}/>
            </div>;
        } else {
            return <div className="td fixed-flex min-w-80 td-time-out td-RenderAutomaticTD">
                <ClearableInput name={name} type="checkbox" isClearable={false} idx={n} onChange={onChange}
                                values={values}/>
                <RenderTimeOut item={item}/>
            </div>;
        }
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderNotAutomaticTD">
@observer
class RenderNotAutomaticTD extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }

    render() {
        const {isAutomatic} = this;
        const {type, name, item: {time_in, time_out}, n, onChange, values} = this.props;
        if (isAutomatic) return null;
        console.log('RenderNotAutomaticTD', type, time_in, time_out)
        if (type === "In") {
            return <div className="td fixed-flex min-w-130 td-time-in td-RenderNotAutomaticTD">
                <ClearableInput name={name} type="time" idx={n} isClearable={false} excludeSeconds onChange={onChange}
                                className="h-30 margin-t-5 margin-b-5 form-control"/>
            </div>;
        } else {
            return <div className="td fixed-flex min-w-130 td-time-out td-RenderNotAutomaticTD">
                <ClearableInput name={name} type="time" idx={n} isClearable={false} excludeSeconds onChange={onChange}
                                className="h-30 margin-t-5 margin-b-5 form-control"/>
            </div>;
        }
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderAutomaticTH">
@observer
class RenderAutomaticTH extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }

    render() {
        const {isAutomatic} = this;
        if (!isAutomatic) return null;
        return <React.Fragment>
            <div className="td fixed-flex min-w-80">Time In</div>
            <div className="td fixed-flex min-w-80">Time Out</div>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderNotAutomaticTH">
@observer
class RenderNotAutomaticTH extends React.Component {
    @computed get isAutomatic() {
        const {attendance_type} = this.props.state;
        return attendance_type === "Automatic";
    }

    render() {
        const {isAutomatic} = this;
        if (isAutomatic) return null;
        return <React.Fragment>
            <div className="td fixed-flex min-w-130">Time In</div>
            <div className="td fixed-flex min-w-130">Time Out</div>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderItem">
@observer
class RenderItem extends React.Component {

    render() {
        const {item, n, lists, state, onChange, onOpenScreening, onScreeningComplete} = this.props;
        let {
            employee, employee: {
                id, data: {
                    created_at, fname, lname, optional_info = {},
                    client,
                    project,
                    site,
                    client_id, project_id, site_id
                }
            },
            time_in, time_out, signature
        } = item;

        const name_time_in = "time_in" + n;
        const name_time_out = "time_out" + n;
        lists[name_time_in] = [
            {value: "In", text: "In", checked: !!time_in}
        ];
        lists[name_time_out] = [
            {value: "Out", text: "Out", checked: !!time_out}
        ];
        const options_time_in = lists[name_time_in];
        const options_time_out = lists[name_time_out];

        return <React.Fragment key={n}>
            <div className="td">{lname + ' ' + fname}</div>
            <RenderAutomaticTD state={state} type="In" name={name_time_in} item={item} n={n} onChange={onChange}
                               values={options_time_in}/>
            <RenderAutomaticTD state={state} type="Out" name={name_time_out} item={item} n={n} onChange={onChange}
                               values={options_time_out}/>
            <RenderNotAutomaticTD state={state} type="In" name={name_time_in} item={item} n={n} onChange={onChange}/>
            <RenderNotAutomaticTD state={state} type="Out" name={name_time_out} item={item} n={n} onChange={onChange}/>

            <div className="td fixed-flex min-w-100">
                <Button item={item} className="btn btn-primary padding-0 padding-l-5 padding-r-5"
                        onComplete={onScreeningComplete} onClick={onOpenScreening}>
                    <RenderScreeningStatus item={item}/> Screening
                </Button>
            </div>
            <div className="td fixed-flex min-w-120 padding-0">
                <ClearableInput name={'signature_' + n} type="signature" defaultValue={signature} idx={n}
                                className="w-full h-30 margin-t-5 margin-b-5 form-control" onChange={onChange}/>
            </div>
        </React.Fragment>;
    }
}

// </editor-fold>

@observer
class NewAttendanceTable extends React.Component {
    @observable
    state = {
        lists: {
            attendance_type: [
                {text: "Automatic", value: "Automatic", checked: false},
                {text: "Manual", value: "Manual", checked: false}
            ]
        },
        list: [],
        attendance_type: null,
        team: null
    };

    constructor(props) {
        super(props);

        this.onScreeningComplete = this.onScreeningComplete.bind(this);

        this.onChange = this.onChange.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.form = new Form();
        this.form.addChangeOne("attendance_type", this.onChangeAttendanceType.bind(this));
    }

    @computed get isAutomatic() {
        const {attendance_type} = this.state;
        return attendance_type === "Automatic";
    }

    set team(team) {
        this.state.list = team.data.list.map(employee => {
            return {
                employee,
                time_in: null,
                time_out: null,
                signature: null,
                has_screening: null,
                attendance_type: null
            };
        });
        this.state.team = team;
    }

    onChangeAttendanceType(el, val) {
        this.state.attendance_type = val;
        this.state.list.forEach(v => {
            v.attendance_type = val;
        });
    }

    onScreeningComplete(item, res) {
        item.has_screening = !!res;
    }

    onChange(val, input_name, el) {
        const {isAutomatic} = this;
        const {name, onChange} = this.props;
        const {idx} = el.props;
        const item = this.state.list[idx];
        if (input_name.startsWith('time_in')) {
            if (val) {
                const d = new Date();
                if (!isAutomatic) {
                    const times = val.split(":");
                    d.setHours(parseInt(times[0]));
                    d.setMinutes(parseInt(times[1]));
                }
                item.time_in = d;
            } else {
                item.time_in = null;
            }
        } else if (input_name.startsWith('time_out')) {
            if (val) {
                const d = new Date();
                if (!isAutomatic) {
                    const times = val.split(":");
                    d.setHours(parseInt(times[0]));
                    d.setMinutes(parseInt(times[1]));
                }
                item.time_out = d;
            } else {
                item.time_out = null;
            }
        } else if (input_name.startsWith('signature')) {
            item.signature = val;
        }

        onChange && onChange(toJS(this.state.list), name, this);
    }

    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <RenderAutomaticTH state={this.state}/>
            <RenderNotAutomaticTH state={this.state}/>
            <div className="td fixed-flex min-w-100">Screening</div>
            <div className="td fixed-flex min-w-130 padding-l-0 padding-r-0">Signature</div>
        </THead>;
    }

    renderItem(item, n, onClick) {
        return <RenderItem
            item={item}
            n={n}
            lists={this.state.lists}
            state={this.state}
            onChange={this.onChange}
            onOpenScreening={this.props.onOpenScreening}
            onScreeningComplete={this.onScreeningComplete}
        />;
    }

    render() {
        const {team} = this.state;
        if (!team) return null;
        const {
            data: {
                supervisor: {
                    data: {lname, fname}
                },
                name, list
            }
        } = team;
        return <React.Fragment>
            <div className="flex TeamDetials">
                <div>
                    <label>Team Name</label>{name}
                </div>
                <div>
                    <label>Supervisor</label>{lname + ' ' + fname}
                </div>
                <div>
                    <label>No. of Members</label>{list.length}
                </div>
            </div>
            <ClearableInput ref="attendance_type" name="attendance_type" type="radio" defaultValue="Automatic"
                            placeholder="Attendance Type" horizontal isClearable={false}
                            className="col-lg-12 margin-b-10 form-control" onChange={this.form.onChange}
                            values={this.state.lists.attendance_type}/>
            <SelectTable ref="selectAttendtanceTable"
                         replaceColsAll
                         name="list"
                         desc="Employees"
                         title="Attendtance List"
                         className="col-lg-12 no-padding h-auto SelectAttendtanceTable"
                         renderTHead={this.renderTHead}
                         renderItem={this.renderItem}
                         list={this.state.list}

            />
        </React.Fragment>;
    }
}

export default NewDialog;
