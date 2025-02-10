// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import Chip from "@material-ui/core/Chip";

import {ActionsButton, Clickable} from 'components/inputs';
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
                contact_person,
                email,
                phone,
                address,
                ppe_item_list_aggregate,
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
                        label={name}
                        size="medium"
                        sx={{cursor: "pointer", height: "50px !important"}}
                    />
                </Clickable>
            </div>
            <div className="td">{contact_person}</div>
            <div className="td">{email}</div>
            <div className="td">{phone}</div>
            <div className="td">{address}</div>
            <div className="td fixed-flex min-w-110">{ppe_item_list_aggregate.aggregate.count}</div>
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
