// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./AppointmentsTab.lazy.css";

import {renderLeftButtonsForExpiryOnly_firebase} from 'utils/ComponentUtils';
import {calculateRightPos, Dates} from 'utils/Utils';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewAppointmentDialog from './dialogs/NewAppointmentDialog';
import ProfileAppointmentDialog from './dialogs/ProfileAppointmentDialog';
import EditAppointmentDialog from './dialogs/EditAppointmentDialog';

// </editor-fold>

@observer
class AppointmentsTab extends React.Component {

    path;
    pageKey = "AppointmentsTab";
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            expiry_date: [{label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
	}
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.classNames += "LeftButtonsForExpiryOnlyPage";

        this.path = props.path + 'appointments/';

        this.onNewItem = this.onNewItem.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNewItem">
    onNewItem(item) {
        const {list} = this.refs.root;
        const existingItem = list.find(v => v.id === item.id);
        if(existingItem) {
            setTimeout(() => {
                extendObservable(existingItem.data, item.data);
                const idx = list.indexOf(existingItem);
                list.removeIf((item, _idx) => _idx === idx);
                list.insertAt(idx, item);
            }, 0);
        } else {
            list.pushFirst(item);
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onEdit">
    onEdit(e, el) {
        const {idx, btn} = el.props;
        const jqElem = $(btn.getDOMNode());
        const {left} = jqElem.offset();
        
        const item = this.refs.root.list[idx];
        let {id, data: {
                fname, lname, 
                optional_info, client, project, site, client_id, project_id, site_id,
                
                employee_job_appointment_list, sub_collection_keys: {
                    employee_job_appointment_list: {latest, id: ids}
                }
            }
        } = item;
        
        let list = Object.keys(employee_job_appointment_list).map(id => {
            return {id, expiry_date: employee_job_appointment_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        console.log('employees', list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        }))
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_job_appointment_list[id]};
        });
        
        const onClick = (e, el) => {
            const {idx} = el.props;
            const item = list[idx];
            const dialog = this.refs.root.getDialogByRef('editDialog');
            console.log('test', dialog)
            dialog && dialog.open(item).then(data => {
                extendObservable(item.data, data);
            });
        };
        
        const renderItem = (item, n) => {
            const {data: {created_at, employee, date, expiry_date, notes, doc}} = item;
            const comp = () => {
                return <p>Date: {Dates.formatDate(date) || 'N/A'}<br/>Expiry: {Dates.formatDate(expiry_date) || 'N/A'}</p>;
            };
            return <NavItem 
                onClick={onClick} 
                idx={n}
                title={comp()}
            />;
        };
        
        const offset = jqElem.offset();
        const style = {left: "auto", right: calculateRightPos(jqElem[0], false) + 10, top: offset.top, width: 'auto', minWidth: 200};
        popover.settings({
            style,
            contentNode: <div>
                <p className="padding-t-10 text-center">--- Select ---</p>
                <hr className="margin-t-0 margin-b-0"/>
                {list.map(renderItem)}
            </div>
        }).open();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const permissionKey = "Appointments";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Date..." className="form-control col-lg-5" onChange={onChange}/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.state.lists.expiry_date} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-200">Job Appointments</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        let {id, data: {
                fname, lname, 
                client, project, site, client_id, project_id, site_id,
                
                employee_job_appointment_list, sub_collection_keys: {
                    employee_job_appointment_list: {latest, id: ids}
                }
            }
        } = item;
        
        return <TRow key={id}>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td fixed-flex min-w-200">{ids.length}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Job Appointments"
            pageTitleSingular="job appointment"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={renderLeftButtonsForExpiryOnly_firebase.bind(this)}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <ProfileAppointmentDialog ref="profileDialog"/>
            <NewAppointmentDialog ref="newDialog"/>
            <EditAppointmentDialog ref="editDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}

export default AppointmentsTab;
