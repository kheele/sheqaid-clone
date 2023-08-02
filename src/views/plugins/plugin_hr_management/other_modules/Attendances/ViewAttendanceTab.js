import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {SelectTable, THead} from 'components/tables';

@observer
class ViewAttendanceTab extends React.Component {
    pageKey = "ViewAttendanceTab";

    @observable
    state = {
        list: []
    };
    
    constructor(props) {
        super(props);
        
        this.renderItem = this.renderItem.bind(this);
    }
    
    componentDidMount() {
        const {id} = this.props.item;
        const path = "plugin_sheq_assist/employees/attendance/list/";
        neonBinding.events.emit(path + "by_employee_id", id).then(res => {
            this.state.list = res;
            console.log(path, id, res)
        });
    }
    
    renderTHead() {
        return <THead>
            <div className="td">Time In</div>
            <div className="td">Time Out</div>
            <div className="td fixed-flex min-w-130 padding-l-0 padding-r-0">Signature</div>
        </THead>;
    }
	
    renderItem(item, n, onClick) {
        let {
            id,
            data: {
                date, date_split, 
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
        
        const {id: employee_id} = this.props.item;
        attendance_list = attendance_list.filter(({employee}) => employee.id === employee_id);
//        let { 
//            employee, employee: {
//                id, data: {
//                    created_at, fname, lname, optional_info = {}, 
//                    client, 
//                    project, 
//                    site, 
//                    client_id, project_id, site_id
//                }
//            },
//            time_in, time_out, signature
//        } = item;
        
	return null;/*<React.Fragment key={n}>
            <div className="td td-time-in td-RenderAutomaticTD">
                <h6 className="xs-shown font-size-13">Time In</h6>
                <span>{time_in ? Dates.formatTimeExcSec(time_in) : '--:--'}</span>
            </div>
            <div className="td td-time-out td-RenderAutomaticTD">
                <h6 className="xs-shown font-size-13">Time Out</h6>
                <span>{time_out ? Dates.formatTimeExcSec(time_out) : '--:--'}</span>
            </div>
            <div className="td fixed-flex min-w-120 padding-0">
                <h6 className="xs-shown font-size-13">Signature</h6>
                <ProfileField name={'signature_' + n} type="signature" value={signature} className="col-lg-12 w-full h-30 margin-t-5 margin-b-5"/>
            </div>
	</React.Fragment>*/;
    }

    render() {
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper h-full">
                <SelectTable ref="selectAttendtanceTable"
                    replaceColsAll 
                    name="list" 
                    desc="Employee Attendtance" 
                    title="Attendtance List" 
                    className="col-lg-12 no-padding h-auto SelectAttendtanceTable" 
                    renderTHead={this.renderTHead} 
                    renderItem={this.renderItem} 
                    list={this.state.list}
                />
            </div>
        </div>;
    }
}

export default ViewAttendanceTab;