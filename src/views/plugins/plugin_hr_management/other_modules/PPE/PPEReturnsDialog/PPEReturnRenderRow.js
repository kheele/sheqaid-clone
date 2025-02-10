// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ActionsButton, Clickable} from 'components/inputs';
import {TRow} from 'components/tables';
import default_ppe_type from "assets/images/default_ppe_type.jpeg";
import {Dates} from "../../../../../../utils/Dates";
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
                return_date,
                ppe_condition,
                ppe_item: {
                    profile_pic,
                    name,
                },
                employee,
                returner_signature,
                receiver_signature,
                doc,
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td fixed-flex min-w-80">
                <Clickable idx={idx} onClick={onView}>
                    {RenderUtils.renderImage(profile_pic, null, '100%', default_ppe_type)}
                </Clickable>
            </div>
            <div className="td">{name}</div>
            <div className="td">{employee.full_name}</div>
            <div className="td fixed-flex min-w-140">{ppe_condition}</div>
            <div className="td fixed-flex min-w-180">
                <Clickable idx={idx} onClick={onView}>
                    {RenderUtils.renderImage(doc, null, '100%')}
                </Clickable>
            </div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(return_date)}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
