// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Avatar from "@mui/material/Avatar";
import Chip from "@material-ui/core/Chip";
import {ActionsButton, Clickable} from 'components/inputs';
import {TRow} from 'components/tables';
import default_ppe_type from "assets/images/default_ppe_type.jpeg";
import {Dates} from "utils/Dates";
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
                created_at,
                auto_reorder_trigger,
                approval_status,
                quantity,
                reason,
                ppe_type: {
                    profile_pic,
                    name,
                    unit,
                },
                employee,
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td">
                <Clickable
                    idx={idx}
                    onClick={onView}
                >
                    <Chip
                        avatar={<Avatar
                            alt={name}
                            src={profile_pic && profile_pic.dlUrls && profile_pic.dlUrls[0] || default_ppe_type}
                        />}
                        label={name}
                        sx={{cursor: "pointer"}}
                    />
                </Clickable>
            </div>
            <div className="td fixed-flex min-w-160">{unit}</div>
            <div className="td fixed-flex min-w-120">{quantity}</div>
            <div className="td">{employee && employee.full_name}</div>
            <div className="td">{reason}</div>
            <div className="td fixed-flex min-w-110">{auto_reorder_trigger ? "Automatic" : "Manual"}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-120">{approval_status}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
