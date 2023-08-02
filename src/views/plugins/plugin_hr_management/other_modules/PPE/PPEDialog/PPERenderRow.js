// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {

    render() {
        const {item, idx, view, onClick, renderActionsCol} = this.props;
        console.log(item)
        const {
            id,
            data: {
                profile_pic,
                name,
                unit,
                qty_received,
                qty_issued,
                qty_in_stock,
                team_list_aggregate,
                department_list_aggregate,
                job_position_list_aggregate
            }
        } = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td fixed-flex min-w-80">{RenderUtils.renderImage(profile_pic, '100%')}</div>
            <div className="td">{name}</div>
            <div className="td fixed-flex min-w-120">{unit}</div>
            <div className="td fixed-flex min-w-120">{qty_received}</div>
            <div className="td fixed-flex min-w-100">{qty_issued}</div>
            <div className="td fixed-flex min-w-120">{qty_in_stock}</div>
            <div className="td fixed-flex min-w-80">{team_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex min-w-110">{department_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex min-w-110">{job_position_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

}
// </editor-fold>

export default RenderRow;
