// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ExpiryButtons, renderExpiryDateSpan} from 'utils/ComponentUtils';
import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import AssetNameCol from "../AssetNameCol";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ARenderRow">
@observer
class ARenderRow extends React.Component {

    constructor() {
        super();

        this.getRenderRowByEach = this.getRenderRowByEach.bind(this);
    }

    render() {
        const {item, idx, view, onClick, renderActionsCol, onView} = this.props;
        console.log('ARenderRow', view, item)
        if (view === 'Asset') {
            return <RenderRowByGroup {...this.props} listName={this.listName}/>;
        } else {
            return <RenderRowByEach {...this.props} getRenderRowByEach={this.getRenderRowByEach}/>;
        }
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByGroup">
@observer
class RenderRowByGroup extends React.Component {

    render() {
        const {item, idx, view, onClick, renderActionsCol, listName, onView} = this.props;
        console.log('RenderRowByGroup', view, item)
        if (view !== 'Asset') {
            return null;
        }

        let {
            id,
            data: {
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

                [listName]: list,
                [`${listName}_no_expiry_aggregate`]: list_no_expiry_aggregate,
                [`${listName}_expired_aggregate`]: list_expired_aggregate,
                [`${listName}_mon_expiry_aggregate`]: list_mon_expiry_aggregate,
                [`${listName}_2mon_expiry_aggregate`]: list_2mon_expiry_aggregate,
                [`${listName}_3mon_expiry_aggregate`]: list_3mon_expiry_aggregate,
                [`${listName}_4mon_expiry_aggregate`]: list_4mon_expiry_aggregate,
            },
        } = item;

        const latest = list.getFirstElement();

        return <TRow key={id} className="w-full tr-header">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td">
                <AssetNameCol
                    idx={idx}
                    onClick={onView}
                    item={item}
                />
            </div>
            <div className="td">{reg_num || 'N/A'}</div>
            <div className="td">{serial_num || 'N/A'}</div>
            <div className="td">{responsible_person && responsible_person.full_name || 'N/A'}</div>
            <div
                className="td">{responsible_person && responsible_person.job_position && responsible_person.job_position.name || 'N/A'}</div>
            <div className="td"></div>
            <div className="td fixed-flex min-w-105">{latest && renderExpiryDateSpan(latest.expiry)}</div>
            <div className="td fixed-flex flex grid-gap-5 min-w-240">
                <ExpiryButtons item={item} listName={listName}/>
            </div>
            {renderActionsCol && renderActionsCol(item, idx, onClick)}
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} isEmployee className="btn btn-primary pull-right min-w-40"
                               onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByEach">
@observer
class RenderRowByEach extends React.Component {

    render() {
        const {view, getRenderRowByEach} = this.props;
        console.log('RenderRowByEach')
        if (view === 'Asset') {
            return null;
        }

        return getRenderRowByEach();
    }
}

// </editor-fold>

export default ARenderRow;
