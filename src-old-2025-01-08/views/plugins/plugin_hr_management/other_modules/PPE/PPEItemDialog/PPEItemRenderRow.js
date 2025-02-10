// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

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
                profile_pic,
                serial_num,
                purchase_date,
                condition,
                ppe_type: {
                    name,
                    unit,
                },
                ppe_inventory: {
                    location
                },
                supplier: {
                    name: supplierName
                },
                employee_list: {
                    employee: {full_name}
                }
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td fixed-flex min-w-80">
                <Clickable idx={idx} onClick={onView}>
                    {RenderUtils.renderImage(profile_pic, null, '100%')}
                </Clickable>
            </div>
            <div className="td">{name}</div>
            <div className="td">{full_name}</div>
            <div className="td fixed-flex min-w-160">{serial_num}</div>
            <div className="td fixed-flex min-w-160">{location}</div>
            <div className="td">{supplierName}</div>
            <div className="td fixed-flex min-w-160">{condition}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
