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
        const {item, idx, view, onClick, onView, renderActionsCol} = this.props;
        console.log(item)
        const {
            id,
            data: {
                name,
                desc,
                job_task_list_aggregate,
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td">{name}</div>
            <div className="td">{desc}</div>
            <div className="td fixed-flex min-w-110">{job_task_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
