// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {Dates} from 'utils/Utils';
import {ActionsButton, Clickable} from 'components/inputs';
import {TRow} from 'components/tables';
import ARenderRow from "./ARenderRow";
import assetProfilePic from "assets/images/vehicle-image-loading.png";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends ARenderRow {
    listName = 'doc_list';

    getRenderRowByEach() {
        const {item, idx, view, onClick, renderActionsCol, onView, isExport} = this.props;

        let {
            id,
            data: {
                created_at,
                date,
                expiry,
                title,
                type,
                doc,
                asset: {
                    client, project, site,
                    status,
                    written_off,
                    profile_pic: profile_pic_list,
                    photo_list,
                    responsible_person,
                    asset_detail: {
                        owning_company,
                        name,
                        asset_type,
                        desc,
                        manufacturer,
                        model,
                        reg_num,
                        serial_num,
                        location,
                        toolkit,
                        condition,
                        barcode,
                        qr_code,
                        notes,
                    },
                },
            },
        } = item;

        let [profile_pic] = profile_pic_list || [];
        if (!profile_pic) {
            profile_pic = (photo_list || [])[0];
        }

        const content = <React.Fragment key={id}>
            <div className="td fixed-flex min-w-80">
                <Clickable idx={idx} viewByImage onClick={onView}>
                    {RenderUtils.renderImage(profile_pic && profile_pic.doc, null, '100%', assetProfilePic)}
                </Clickable>
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Asset Type</h6>
                {asset_type}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Asset</h6>
                {name || "N/A"}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Reg. No.</h6>
                {reg_num || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Serial No.</h6>
                {serial_num || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Document Title</h6>
                {title || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Document Type</h6>
                {type || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Date</h6>
                {Dates.formatDate(date) || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Expiry Date</h6>
                {renderExpiryDateSpan(expiry)}
            </div>
        </React.Fragment>;

        if(isExport) {
            return content;
        }

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            {content}
            {renderActionsCol && renderActionsCol(item, idx, onClick)}
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }

}
// </editor-fold>

export default RenderRow;
