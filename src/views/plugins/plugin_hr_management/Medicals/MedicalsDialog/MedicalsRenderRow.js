// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import ARenderRow from "../../AEmployeeDocDialog/ARenderRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="MedicalsRenderRow">
@observer
class RenderRow extends ARenderRow {
    listName = 'medical_list';

    getRenderRowByEach() {
        const {item, idx, view, onClick, renderActionsCol} = this.props;

        let {
            id,
            data: {
                created_at,
                date,
                annexture_3,
                fitness_option,
                restrictions,
                expiry_date,
                expiry_updated,
                annexture3_doc,
                doc,
                employee: {lname, fname},
            },
        } = item;

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {lname + ' ' + fname}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Restrictions</h6>
                {restrictions || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Fitness</h6>
                {fitness_option || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Annexture 3?</h6>
                {annexture_3 || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Expiry Date</h6>
                {renderExpiryDateSpan(expiry_date)}
            </div>
            {renderActionsCol && renderActionsCol(item, idx, onClick)}
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
