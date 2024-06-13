// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton, Button} from 'components/inputs';
import {TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="TableRow">
@observer
class TableRow extends React.Component {
    get isPending() {
        const {status} = this.props;
        return status === 'Pending';
    }

    get isCompleted() {
        const {status} = this.props;
        return status === 'Completed';
    }

    render() {
        const {isPending, isCompleted} = this;
        const {item, idx, onRenderActionCell, onSign, onClick} = this.props;
        const {
            id, data: {
                is_owning,
                slug,
                external_id,
                uuid,
                sent_at,
                opened_at,
                completed_at,
                status,
                doc_template: {
                    name,
                    doc_type,
                    preview_image_url,
                    doc,
                    module,
                    plugin,
                    employee_submission_list,
                    employee_submitter_list,
                },
                submission,
                employee_id,
            }
        } = item;

        const {is: {isEmployee}, loggedUser: {user, user: {data: {linked_employee_id}}}} = storage;

        const isLoggedUser = (isEmployee, employee_id, linked_employee_id, user_id) => {
            if (isEmployee) return employee_id === user_id;
            return employee_id === linked_employee_id;
        };

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-40">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Document Template</h6>
                {name}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Date Sent</h6>
                {Dates.formatDate(sent_at) || "N/A"}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Date Opened</h6>
                {Dates.formatDate(opened_at) || "N/A"}
            </div>
            {isCompleted && <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Date Completed</h6>
                {Dates.formatDate(completed_at) || "N/A"}
            </div>}
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Status</h6>
                {status}
            </div>
            {isPending && <div className="td fixed-flex min-w-80">
                <h6 className="xs-shown font-size-13">Action</h6>
                {
                    isLoggedUser(isEmployee, employee_id, linked_employee_id, user.id) && <Button
                        idx={idx}
                        className="btn btn-primary pull-right min-w-40 sign-btn" text="Sign"
                        onClick={onSign}
                    />
                }
            </div>}
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

export default TableRow;
