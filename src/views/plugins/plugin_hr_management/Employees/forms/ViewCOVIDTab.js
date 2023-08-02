import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Row} from 'components/FormComponents';

import {
    EmployeePositiveCaseList,
    EmployeeReturnToWorkCaseList,
    EmployeeScreeningList,
    EmployeeVulnerabilityCaseList
} from 'views/plugins/plugin_extra/__A_COVID_Management/dialogs/EmployeeLists';

@observer
class ViewCOVIDTab extends React.Component {
    pageKey = "ViewCOVIDTab";

    @observable
    state = {
        screening_list: [],
        positive_approved_case_list: [],
        positive_unapproved_case_list: [],
        vulnerability_case_list: [],
        return_to_work_case_list: []
    };
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        const {id} = this.props.item;
        const path = "plugin_sheq_assist/COVID_Management/";
        neonBinding.events.emit(path + "screening/list/by_employee_id", id).then(res => {
            this.state.screening_list = res;
        });
        neonBinding.events.emit(path + "positive/approved/list/by_employee_id", id).then(res => {
            this.state.positive_approved_case_list = res;
        });
        neonBinding.events.emit(path + "positive/unapproved/list/by_employee_id", id).then(res => {
            this.state.positive_unapproved_case_list = res;
        });
        neonBinding.events.emit(path + "vulnerable/list/by_employee_id", id).then(res => {
            this.state.vulnerability_case_list = res;
        });
        neonBinding.events.emit(path + "return-to-work/list/by_employee_id", id).then(res => {
            this.state.return_to_work_case_list = res;
        });
    }
    
    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            idx
        } = this.props;
        
        const {screening_list, positive_approved_case_list, positive_unapproved_case_list, vulnerability_case_list, return_to_work_case_list} = this.state;
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row 
                        rendered idx={idx + ".1"} 
                        title={idx + ".1 Screening"} 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                        <EmployeeScreeningList list={screening_list}/>
                    </Row>
                    <Row 
                        rendered idx={idx + ".2"} 
                        title={idx + ".2 Positive Approved Case(s)"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <EmployeePositiveCaseList list={positive_approved_case_list}/>
                    </Row>
                    <Row 
                        rendered idx={idx + ".3"} 
                        title={idx + ".3 Positive Unapproved Case(s)"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <EmployeePositiveCaseList list={positive_unapproved_case_list}/>
                    </Row>
                    <Row 
                        rendered idx={idx + ".4"} 
                        title={idx + ".4 Vulnerability Case(s)"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <EmployeeVulnerabilityCaseList list={vulnerability_case_list}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".5"} 
                        title={idx + ".5 Return To Work Case(s)"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                    >
                        <EmployeeReturnToWorkCaseList list={return_to_work_case_list}/>
                    </Row>
                </div>
            </div>
        </div>;
    }
}

export default ViewCOVIDTab;