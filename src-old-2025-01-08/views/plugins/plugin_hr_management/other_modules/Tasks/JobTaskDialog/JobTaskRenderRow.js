// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import Chip from "@material-ui/core/Chip";

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
                priority_level,
                estimated_duration,
                category_list,
                ppe_type_list,
                compliance_requirement_list_aggregate,
                employee_list_aggregate,
                job_position_list_aggregate,
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td">{name}</div>
            <div className="td">{desc}</div>
            <div className="td fixed-flex min-w-170">{priority_level}</div>
            <div className="td fixed-flex min-w-170">{estimated_duration}</div>
            <div className="td fixed-flex min-w-220">
                {category_list && category_list.map(({category}) => (<Chip
                    key={category.id}
                    label={category.name}
                    sx={{cursor: "pointer"}}
                />))}
            </div>
            <div className="td fixed-flex min-w-220">
                {ppe_type_list && ppe_type_list.map(({ppe_type}) => (<Chip
                    key={ppe_type.id}
                    label={ppe_type.name}
                    sx={{cursor: "pointer"}}
                />))}
            </div>
            <div className="td fixed-flex min-w-220">{compliance_requirement_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex min-w-120">{job_position_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex min-w-120">{employee_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
