// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import {Dates} from '../../../../../utils/Utils';
import ADialogList from "../../../../ADialogList";
import NavItem from '../../../../../components/navs/NavItem';
import {ActionsButton, ClearableInput, DateRangeInput} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

// </editor-fold>

@observer
class AAttendanceByDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    title = "Attendance";
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.classNames = "AAttendanceByDialog";
        
        this.renderFilterNode = this.renderFilterNode.bind(this);
        
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onChangeByDate = this.onChangeByDate.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.renderYearItem = this.renderYearItem.bind(this);
        this.renderDay = this.renderDay.bind(this);
    }
    // </editor-fold>

    open(item) {
        const d = new Date();
        const selectedYear = d.getFullYear();
        const selectedMonth = Dates.getMonthsStr(d);
        const selectedDate = d.getDate();
        extendObservable(this.state, {teamList: [], attendanceList: [], item, selectedYear, selectedMonth, selectedDate});
        return super.open();
    }
    
    onSelectDay(day) {
        const {attendanceList} = this.state;
//        console.log(day, attendanceList.slice())
        const item = attendanceList.find(({id, data: {date, date_split, attendance_list}}) => day.equals(date));
        if(!item) {
            return infoDialog.open("No attendance available");
        }
        this.refs.profileDialog.extraProp('day', day).open(item);
    }
    
    onChangeByDate(evt, btn) {
        const {type, text} = btn.props;
        if(type === "Year") {
            const createList = () => {
                const list = [];
                const start = new Date().getFullYear();
                const end = start - 2000;
                for (var value = start; value >= 2000; value--) {
                    list.push(value);
                }
                return list;
            };
            
            const jqElem = $(btn.getDOMNode());
            const {left} = jqElem.offset();
            popover.settings({
                style: {left, top: 60, width: 'auto', minWidth: 100},
                isDialog: true,
                contentNode: <div>
                    <p className="padding-t-10 text-center">--- Select ---</p>
                    <hr className="margin-t-0 margin-b-0"/>
                    {createList().map(this.renderYearItem)}
                </div>
            }).open();
        } else {
            extendObservable(this.state, {
                selectedMonth: text, selectedDate: 1
            });
            this.onLoadAttendanceList();
        }
    }
    
    onSelectYear(e, elem) {
        const {title} = elem.props;
        extendObservable(this.state, {
            selectedYear: parseInt(title), selectedMonth: "Jan", selectedDate: 1
        });
        this.onLoadAttendanceList();
    }

    renderYearItem(item, n) {
        const {selectedYear} = this.state;
        const className = item === selectedYear ? "active" : "";
        return <NavItem key={n} idx={n} onClick={this.onSelectYear} title={item} className={className}/>;
    }
    
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Attendance";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="team" type="text" placeholder="Team" className="form-control" onChange={onChange}/>
            <ClearableInput name="supervisor" type="text" placeholder="Supervisor" className="form-control" onChange={onChange}/>
            <ClearableInput name="employee" type="text" placeholder="Team Member" className="form-control" onChange={onChange}/>
            <DateRangeInput name="date_range" className="col-lg-10 hor-center form-control" placeholder="" onChange={onChange}>
                <label className="min-w-100">Date From</label>
                <label className="min-w-100">Date To</label>
            </DateRangeInput>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-140">Date</div>
            <div className="td fixed-flex min-w-100">Day</div>
            <div className="td">Supervisor</div>
            <div className="td fixed-flex min-w-130">Team Members</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {
                created_at,
                date, 
                date_split, 
		day,
		attendance_list,
		attendance_list_keys,
		team,
                supervisor,
		supervisor_signature, 
		manager_signature,
                client, project, site, client_id, project_id, site_id
            }
        } = item;
        const {isSupervisor} = storage.is;
        const {data: {lname, fname}} = isSupervisor ? storage.loggedUser.user : supervisor;
	return <TRow key={id}>
            <div className="td fixed-flex min-w-140">{Dates.formatDate(date)}</div>
            <div className="td fixed-flex min-w-100">{day}</div>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td fixed-flex min-w-130">{attendance_list.length}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    // </editor-fold>

}

export default AAttendanceByDialog;
