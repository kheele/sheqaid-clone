// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {Button} from 'components/inputs';
import {TRow} from 'components/tables';
import {Dates} from "utils/Dates";
import AssetNameCol from "../AssetNameCol";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {

    constructor(props) {
        super(props);

        this.setComputedStatusVal();
    }

    @computed get status() {
        const {status} = this.props;
        return status;
    }

    @computed get statusValFinal() {
        const {item} = this.props;
        const {data: {statusVal}} = item;

        if (!statusVal) {
            setImmediate(this.setComputedStatusVal);
            return 'Check Out';
        }

        return statusVal.get ? statusVal.get() : statusVal;
    }

    @computed get color() {
        const {item} = this.props;
        const {
            data: {status}
        } = item;

        let color;
        if (status === 'In Storage') {
            color = 'green';
        } else if (status === 'Checked Out') {
            color = 'yellow color-888';
        } else if (status === 'Loaned Out') {
            color = 'orange';
        } else if (status === 'Out For Repair') {
            color = 'blue';
        } else {
            color = 'grey';
        }

        return color;
    }

    componentDidMount() {
        this.setComputedStatusVal();
    }

    setComputedStatusVal() {
        const {item} = this.props;
        if (!('statusVal' in item.data)) {
            item.data.statusVal = computed(() => {
                const {status, register_list} = item.data;
                // console.log(item.id, 'status', status)
                if (status === 'In Storage') {
                    return 'Check Out';
                } else if (status === 'Checked Out') {
                    return 'Check In';
                } else if (status === 'Loaned Out') {
                    return 'Check In';
                } else if (status === 'Out For Repair') {
                    return 'Check In';
                }
                return 'Check Out';
            });
        }
    }

    render() {
        const {item, idx, onClick, onView, onChangeStatus, isRemoved, renderActionsCol} = this.props;

        const {
            id, data: {
                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                client, project, site,
                //1 done
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
                //2 done
                photo_list,
                profile_pic: profile_pic_list,
                //3 done
                responsible_person,
                // //4 done
                // doc_list,
                // //5 done
                // purchase_info,
                // //6 done
                // depreciation,
                // //7 done
                // monitoring_plan_list,
                // //8 done
                // maintenance_plan_list,
                // //9 done
                // calibration_record_list,
                // //10
                // inspection_template_list = [],
                // inspection_list = [],
                //
                written_off_date,
                written_off_store_keeper_signature,
                written_off_manager_signature,
                written_off_reason,
                written_off_comments,
            }
        } = item;

        const {statusValFinal, color} = this;

        // console.log('Assets', item)
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-50">{id}</div>
            <div className="td">
                <AssetNameCol
                    idx={idx}
                    onClick={onView}
                    item={item}
                />
            </div>
            <div className="td">{manufacturer || 'N/A'}</div>
            <div className="td">{location || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{reg_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-160">{serial_num || 'N/A'}</div>
            <div className="td fixed-flex min-w-80">{condition || 'N/A'}</div>
            {
                isRemoved && (<>
                    <div className="td">{written_off_reason}</div>
                    <div className="td">{written_off_comments}</div>
                    <div className="td fixed-flex min-w-120">{Dates.formatDate(written_off_date)}</div>
                </>)
            }
            {!isRemoved && <div className="td fixed-flex min-w-100">
                <Button className={`btn btn-primary cursor-default padding-v-3 bg-border-${color}`}>
                    {status || 'No Status'}
                </Button>
            </div>}
            <div className="td fixed-flex min-w-170 flex-center padding-l-0 padding-r-0">
                <Button idx={idx} action="Checked Out" className="btn btn-primary pull-right w-100 margin-r-5"
                        onClick={onChangeStatus}>{statusValFinal}</Button>
                <Button idx={idx} className="btn btn-primary pull-right w-40" onClick={onClick}>
                    <i className="fa fa-bars"/>
                </Button>
            </div>
        </TRow>;
    }
}

// </editor-fold>

export default RenderRow;
