import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import NavItem from 'components/navs/NavItem';
import {ClearableInput, DateRangeInput} from 'components/inputs';
import {THead} from 'components/tables';

@observer
class AClaimsTab extends React.Component {

    path;
    @observable
    state = {
        lists: {
            status: [
                'Open', 
                'Closed', 
                'Confirm Employment', 
                'No Data CompEasy', 
                'Submit - CF'
            ].map(label => {
                return {label, value: label};
            }),
            claim_status: [
                'Accepted', 
                'Adjudication Still Pending', 
                'Liability Accepted', 
                'Liability Repudiated', 
                'Not Employed', 
                'Old Claim - No Data On CompEasy',
                'Reject', 
                'Request Claim No',
                'Wait On Info'
            ].map(label => {
                return {label, value: label};
            }),
            injury_disease: ['Fatal', 'Injury'],
            injury_type: []
        }
    };

    constructor(props, style) {
        super(props);
        
        this.style = style;

        if(this.renderFilterNodeFirst) {
            this.renderFilterNodeFirst = this.renderFilterNodeFirst.bind(this);
        }
        if(this.renderFilterNodeLast) {
            this.renderFilterNodeLast = this.renderFilterNodeLast.bind(this);
        }
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        this.style.use();
    }

    componentWillUnmount() {
        this.style.unuse();
    }
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        const firstChildren = this.renderFilterNodeFirst && this.renderFilterNodeFirst(onChange);
        const lastChildren = this.renderFilterNodeLast && this.renderFilterNodeLast(onChange);
        //
        const marginB = lastChildren ? " margin-b-10" : "";
        return <div className="col-lg-12 controls -margin-b-45">
            {firstChildren}
            <ClearableInput name="id" type="text" placeholder="ID #" className="col-lg-4 col-xs-12 form-control margin-b-10" onChange={onChange}/>
            <ClearableInput name="mcr_ref_num" type="text" placeholder="MCR Ref #" className="col-lg-4 col-xs-12 form-control margin-b-10" onChange={onChange}/>
            <ClearableInput name="claim_number" type="text" placeholder="Claim #" className="col-lg-4 col-xs-12 form-control margin-b-10" onChange={onChange}/>

            <DateRangeInput name="accident_date_range" vertical className="col-lg-5 col-md-5 form-control margin-b-10" placeholder="Accident Date" onChange={onChange}>
            </DateRangeInput>
            <DateRangeInput name="resume_date_range" vertical className="col-lg-5 col-md-5 form-control margin-b-10" placeholder="Resume Date" onChange={onChange}>
            </DateRangeInput>
            {lastChildren}
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-100">ID #</div>
            <div className="td fixed-flex min-w-100">Ref #</div>
            <div className="td fixed-flex min-w-120">Claim #</div>
            <div className="td fixed-flex min-w-120">Accident Date</div>
            <div className="td fixed-flex min-w-120">Resume Date</div>
            <div className="td fixed-flex min-w-120">Status</div>
            <div className="td fixed-flex min-w-120">Claim Status</div>
            <div className="td">Employee Name</div>
            <div className="td fixed-flex min-w-120">Injury/Disease</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

}

export default AClaimsTab;
